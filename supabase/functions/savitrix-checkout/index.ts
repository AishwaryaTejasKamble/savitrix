import { createClient } from 'npm:@supabase/supabase-js@2.49.1';
import { capturedForOrder, validSignature, testCheckoutAllowed } from './security.ts';
const allowedOrigin='https://savitrix-jau5.vercel.app';
Deno.serve(async req=>{
 const origin=req.headers.get('origin')||'';
 const allowed=[allowedOrigin,Deno.env.get('CHECKOUT_PREVIEW_ORIGIN')].filter(Boolean);
 const headers={'Content-Type':'application/json','Access-Control-Allow-Origin':allowed.includes(origin)?origin:allowedOrigin,'Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info','Access-Control-Allow-Methods':'POST, OPTIONS','Vary':'Origin'};
 const respond=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers});
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return respond({error:'Method not allowed'},405);
 if(origin&&!allowed.includes(origin))return respond({error:'Origin not allowed'},403);
 try{
  const auth=req.headers.get('Authorization')||'';
  const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_ANON_KEY')!,{global:{headers:{Authorization:auth}},auth:{persistSession:false}});
  const {data,error}=await db.auth.getUser();if(error||!data.user)return respond({error:'Please sign in again.'},401);
  const key=Deno.env.get('RAZORPAY_KEY_ID'),secret=Deno.env.get('RAZORPAY_KEY_SECRET');
  if(!testCheckoutAllowed(Deno.env.get('CHECKOUT_ENABLED'),key,secret))return respond({error:'Payments are not enabled. No payment has been taken.'},503);
  if(Number(req.headers.get('content-length')||0)>4096)return respond({error:'Request too large'},413);
  const input=await req.json();
  const server=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}});
  const provider=async(path:string,body?:unknown)=>{
   const response=await fetch('https://api.razorpay.com/v1/'+path,{method:body?'POST':'GET',headers:{Authorization:'Basic '+btoa(key+':'+secret),'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
   if(!response.ok)throw new Error('Payment provider unavailable. Please retry later.');return response.json();
  };
  if(input.action==='create'){
   const {data:full,error:accessError}=await db.rpc('savitrix_has_full_access');if(accessError)throw accessError;if(full)return respond({error:'Your account already has full access.'},409);
   const {data:plan,error:planError}=await server.from('savitrix_payment_plans').select('*').eq('id',String(input.plan_id||'')).eq('enabled',true).eq('test_mode',true).single();
   if(planError||!plan?.amount_paise||!plan.duration_days)return respond({error:'This plan is not available for checkout yet.'},400);
   const receipt=crypto.randomUUID();
   const order=await provider('orders',{amount:plan.amount_paise,currency:'INR',receipt,partial_payment:false});
   if(!/^order_[a-zA-Z0-9]+$/.test(order.id)||order.amount!==plan.amount_paise||order.currency!=='INR')throw new Error('Invalid payment provider response.');
   const {error:insertError}=await server.from('savitrix_checkout_orders').insert({order_id:order.id,user_id:data.user.id,plan_id:plan.id,amount_paise:plan.amount_paise,duration_days:plan.duration_days});if(insertError)throw new Error('Checkout could not be saved. No payment has been requested.');
   return respond({order_id:order.id,key_id:key,amount_paise:plan.amount_paise,currency:'INR',duration_days:plan.duration_days,test_mode:true});
  }
  const orderId=String(input.order_id||'');if(!/^order_[a-zA-Z0-9]+$/.test(orderId))return respond({error:'Invalid order'},400);
  const {data:order,error:orderError}=await server.from('savitrix_checkout_orders').select('*').eq('order_id',orderId).eq('user_id',data.user.id).single();if(orderError||!order||!order.test_mode)return respond({error:'Order not found'},404);
  let payment;
  if(input.action==='verify'){
   const paymentId=String(input.payment_id||'');if(!/^pay_[a-zA-Z0-9]+$/.test(paymentId)||!await validSignature(orderId,paymentId,String(input.signature||''),secret!))return respond({error:'Payment verification failed. Access has not been changed.'},400);
   payment=await provider('payments/'+paymentId);
  }else if(input.action==='recheck'){
   const result=await provider('orders/'+orderId+'/payments');payment=(result.items||[]).find((p:Record<string,unknown>)=>capturedForOrder(p,order));
  }else return respond({error:'Unknown checkout action'},400);
  if(!payment||!capturedForOrder(payment,order))return respond({error:'No completed payment was found. Please wait and check again.'},409);
  const {data:expires,error:finalError}=await server.rpc('savitrix_finalize_test_payment',{verified_order_id:orderId,verified_payment_id:payment.id});if(finalError)throw new Error('Payment is awaiting access confirmation. Use Check payment status; do not pay again.');
  return respond({verified:true,test_mode:true,expires_at:expires});
 }catch{return respond({error:'Unable to complete checkout. No access was granted without payment verification.'},500);}
});
