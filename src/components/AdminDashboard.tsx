import { useEffect, useState } from 'react';
import { AdminUsageInsights } from './AdminUsageInsights';
import { AdminTeamAccess } from './AdminTeamAccess';
import { AdminFeedback } from './AdminFeedback';
import { getAuthClient } from '../utils/authClient';

type Row = { user_id: string; email: string; full_name: string; school_or_subject: string; registered_at: string; confirmed_at: string | null; last_sign_in_at: string | null; savitrix_activity: {last_seen_at:string}[] | {last_seen_at:string} | null };
const date = (value: string | null) => value ? new Date(value).toLocaleString() : 'Not recorded';
export function AdminDashboard({onBack}: {onBack:()=>void}) {
 const [tab,setTab]=useState<'accounts'|'usage'|'feedback'|'access'>('accounts');
 const [rows,setRows]=useState<Row[]>([]), [search,setSearch]=useState(''), [query,setQuery]=useState(''), [page,setPage]=useState(0);
 const [total,setTotal]=useState(0), [counts,setCounts]=useState([0,0,0]), [loading,setLoading]=useState(true), [error,setError]=useState(''), [refresh,setRefresh]=useState(0);
 useEffect(()=>{let active=true; setLoading(true); setError(''); const db=getAuthClient();
 const since=new Date(Date.now()-7*86400000).toISOString();
 const load=async()=>{
  let list=db.from('savitrix_directory').select('*, savitrix_activity(last_seen_at)',{count:'exact'}).order('registered_at',{ascending:false}).order('user_id').range(page*50,page*50+49);
  if(query) list=list.ilike('email',`%${query}%`);
  const [users,all,verified,recent]=await Promise.all([list,db.from('savitrix_directory').select('user_id',{count:'exact',head:true}),db.from('savitrix_directory').select('user_id',{count:'exact',head:true}).not('confirmed_at','is',null),db.from('savitrix_activity').select('user_id',{count:'exact',head:true}).gte('last_seen_at',since)]);
  if(!active)return;
  const failed=[users,all,verified,recent].find(r=>r.error); if(failed?.error) throw failed.error;
  setRows((users.data||[]) as Row[]);setTotal(users.count||0);setCounts([all.count||0,verified.count||0,recent.count||0]);
 };load().catch(()=>{if(active){setRows([]);setError('Unable to load the dashboard. Check your connection and admin access, then retry.');}}).finally(()=>{if(active)setLoading(false);}); return()=>{active=false;};
 },[page,query,refresh]);
 return <main className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-8"><div className="max-w-7xl mx-auto space-y-6">
 <header className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-indigo-700 font-semibold">SAVITRIX · ADMIN</p><h1 className="text-3xl font-bold">Admin dashboard</h1><p className="text-slate-600 mt-2">Teacher accounts, feedback and usage insights</p></div><button className="rounded-lg border px-4 py-2 bg-white" onClick={onBack}>Back to library</button></header>
 <nav aria-label="Admin sections" className="flex flex-wrap gap-2">{([['accounts','Teacher accounts'],['usage','Usage insights'],['feedback','Feedback'],['access','Team access']] as const).map(([key,label])=><button key={key} aria-current={tab===key?'page':undefined} onClick={()=>setTab(key)} className={`rounded-lg border px-4 py-2.5 text-sm font-semibold ${tab===key?'bg-indigo-700 border-indigo-700 text-white':'bg-white border-slate-300 text-slate-700'}`}>{label}</button>)}</nav>
 {tab==='access'?<AdminTeamAccess/>:tab==='usage'?<AdminUsageInsights/>:tab==='feedback'?<AdminFeedback/>:<>
 <div className="grid sm:grid-cols-3 gap-4">{['Registered users','Verified emails','Active in last 7 days'].map((label,i)=><div key={label} className="bg-white border rounded-xl p-5"><p className="text-slate-500">{label}</p><p className="text-3xl font-bold mt-2">{loading?'…':counts[i]}</p></div>)}</div>
 <p className="text-sm text-slate-600">Activity records signed-in visits from this update onward, refreshed at most every five minutes while the app is visible. It does not identify anonymous visitors or measure time spent. Dates use your device’s timezone.</p>
 <form className="flex flex-wrap gap-3" onSubmit={e=>{e.preventDefault();setPage(0);setQuery(search.trim().replace(/[%_]/g,''));}}><label className="sr-only" htmlFor="admin-email-search">Search by email</label><input id="admin-email-search" className="border rounded-lg p-3 bg-white flex-1" placeholder="Search by email" maxLength={200} value={search} onChange={e=>setSearch(e.target.value)}/><button className="bg-indigo-700 text-white rounded-lg px-5">Search</button><button type="button" className="border rounded-lg px-4" onClick={()=>setRefresh(v=>v+1)}>Refresh</button></form>
 {error && <p role="alert" className="bg-red-50 text-red-800 p-4 rounded-lg">{error}</p>}
 <div className="overflow-x-auto bg-white border rounded-xl"><table className="w-full text-sm text-left"><caption className="sr-only">Registered teacher accounts</caption><thead className="bg-slate-100"><tr>{['Teacher / institute','Email','Registered','Verified','Latest sign-in','Last app activity'].map(t=><th key={t} className="p-4 whitespace-nowrap">{t}</th>)}</tr></thead><tbody>{!loading&&rows.map(r=>{const activity=Array.isArray(r.savitrix_activity)?r.savitrix_activity[0]:r.savitrix_activity;return <tr key={r.user_id} className="border-t"><td className="p-4"><p className="font-semibold">{r.full_name}</p><p className="text-slate-500">{r.school_or_subject}</p></td><td className="p-4">{r.email}</td><td className="p-4">{date(r.registered_at)}</td><td className="p-4">{r.confirmed_at?'Verified':'Pending'}</td><td className="p-4">{date(r.last_sign_in_at)}</td><td className="p-4">{date(activity?.last_seen_at||null)}</td></tr>})}{(loading||!rows.length)&&<tr><td colSpan={6} className="p-8 text-center" role="status">{loading?'Loading accounts…':error?'Accounts unavailable':'No matching accounts'}</td></tr>}</tbody></table></div>
 <div className="flex items-center justify-between gap-4"><p>{total} matching accounts · Page {page+1}</p><div className="flex gap-3"><button className="border rounded-lg px-4 py-2 disabled:opacity-40" disabled={page===0||loading} onClick={()=>setPage(p=>p-1)}>Previous</button><button className="border rounded-lg px-4 py-2 disabled:opacity-40" disabled={(page+1)*50>=total||loading} onClick={()=>setPage(p=>p+1)}>Next</button></div></div>
 </>}
 </div></main>;
}
