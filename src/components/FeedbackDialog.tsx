import { useState } from 'react';
import { getAuthClient } from '../utils/authClient';
import { validateFeedback, type FeedbackDraft } from '../utils/profileFeedback';
import { WorkspaceDialog } from './WorkspaceDialog';
export function FeedbackDialog({onClose,onSent}:{onClose:()=>void;onSent:()=>void}) {
 const [kind,setKind]=useState<FeedbackDraft['kind']>('suggestion'),[message,setMessage]=useState(''),[rating,setRating]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 return <WorkspaceDialog title="Send feedback" onClose={onClose} busy={busy}><form className="space-y-4" onSubmit={async e=>{e.preventDefault();if(busy)return;setBusy(true);setError('');try{const draft=validateFeedback({kind,message,rating:rating?Number(rating):null});const {error:sendError}=await getAuthClient().from('savitrix_feedback').insert(draft);if(sendError)throw new Error('Your feedback was not sent. Check your connection and try again.');onSent();onClose();}catch(e){setError(e instanceof Error?e.message:'Could not send feedback.');}finally{setBusy(false);}}}>
 <p className="text-sm text-slate-600">Your feedback and account identity will be visible to the Savitrix administrator. Please avoid personal student information.</p>
 <label className="block text-sm font-semibold">Feedback type<select autoFocus value={kind} onChange={e=>setKind(e.target.value as FeedbackDraft['kind'])} className="mt-1 block w-full rounded-lg border p-3 font-normal"><option value="suggestion">Suggestion</option><option value="problem">Report a problem</option><option value="other">Other feedback</option></select></label>
 <label className="block text-sm font-semibold">Your feedback<textarea required minLength={10} maxLength={3000} rows={5} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Tell us what worked, what went wrong, or what you would like to see next." className="mt-1 block w-full rounded-lg border p-3 font-normal"/></label><p className="text-xs text-slate-500">{message.length} / 3,000 characters</p>
 <label className="block text-sm font-semibold">Overall rating (optional)<select value={rating} onChange={e=>setRating(e.target.value)} className="mt-1 block w-full rounded-lg border p-3 font-normal"><option value="">No rating</option>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n} / 5</option>)}</select></label>
 {error&&<p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
 <div className="flex justify-end gap-3"><button type="button" disabled={busy} onClick={onClose} className="border rounded-lg px-4 py-2">Cancel</button><button disabled={busy} className="bg-indigo-700 text-white rounded-lg px-4 py-2 font-semibold disabled:opacity-40">{busy?'Sending…':'Send feedback'}</button></div>
 </form></WorkspaceDialog>;
}
