export async function validSignature(orderId:string,paymentId:string,signature:string,secret:string):Promise<boolean>{
 if(!/^[0-9a-f]{64}$/i.test(signature))return false;
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['verify']);
 const bytes=new Uint8Array(signature.match(/../g)!.map(part=>parseInt(part,16)));
 return crypto.subtle.verify('HMAC',key,bytes,new TextEncoder().encode(`${orderId}|${paymentId}`));
}
export function capturedForOrder(payment:{order_id?:string;amount?:number;currency?:string;status?:string;amount_refunded?:number},order:{order_id:string;amount_paise:number}):boolean {
 return payment.order_id===order.order_id&&payment.amount===order.amount_paise&&payment.currency==='INR'&&payment.status==='captured'&&(payment.amount_refunded||0)===0;
}
export function testCheckoutAllowed(enabled:string|undefined,key:string|undefined,secret:string|undefined):boolean {
 return enabled==='true'&&Boolean(secret)&&Boolean(key?.startsWith('rzp_test_'));
}
