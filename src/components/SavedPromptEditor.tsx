import { useState } from 'react';
import { validateDraft, type PromptDraft } from '../utils/personalPrompts';
import { WorkspaceDialog } from './WorkspaceDialog';
export function SavedPromptEditor({draft,onSave,onClose}:{draft:PromptDraft;onSave:(draft:PromptDraft)=>Promise<void>;onClose:()=>void}) {
 const [title,setTitle]=useState(draft.title),[content,setContent]=useState(draft.content),[busy,setBusy]=useState(false),[error,setError]=useState('');
 return <WorkspaceDialog title={draft.id?'Edit saved prompt':'Save my prompt'} onClose={onClose} busy={busy}><form onSubmit={async event=>{event.preventDefault();if(busy)return;setError('');setBusy(true);try{await onSave(validateDraft({...draft,title,content}));onClose();}catch(e){setError(e instanceof Error?e.message:'Could not save your prompt.');}finally{setBusy(false);}}} className="space-y-4">
 <p className="text-sm text-slate-600">This is your private copy. Name it so you can find it in My saved prompts. The library original stays unchanged.</p>
 <label className="block text-sm font-semibold">Title<input autoFocus required maxLength={160} value={title} onChange={e=>setTitle(e.target.value)} className="block w-full border border-slate-300 rounded-lg p-3 mt-1 font-normal"/></label>
 <label className="block text-sm font-semibold">Your prompt<textarea required maxLength={20000} rows={10} value={content} onChange={e=>setContent(e.target.value)} className="block w-full border border-slate-300 rounded-lg p-3 mt-1 font-mono text-sm font-normal"/></label>
 <p className="text-xs text-slate-500">{content.length.toLocaleString()} / 20,000 characters · Avoid personal student information.</p>
 {error&&<p role="alert" className="rounded-lg bg-red-50 text-red-800 p-3 text-sm">{error}</p>}
 <div className="flex justify-end gap-3"><button type="button" disabled={busy} onClick={onClose} className="border rounded-lg px-4 py-2 text-sm disabled:opacity-50">Cancel</button><button type="submit" disabled={busy} className="rounded-lg bg-indigo-700 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50">{busy?'Saving…':'Save prompt'}</button></div>
 </form></WorkspaceDialog>;
}
