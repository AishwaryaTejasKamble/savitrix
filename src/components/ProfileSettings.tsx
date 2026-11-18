import { useState } from 'react';
import type { TeacherUser } from '../data/types';
import { getAuthClient } from '../utils/authClient';
import { validateProfile } from '../utils/profileFeedback';
import { WorkspaceDialog } from './WorkspaceDialog';
export function ProfileSettings({user,onClose,onSaved}:{user:TeacherUser;onClose:()=>void;onSaved:()=>void}) {
 const [fullName,setName]=useState(user.fullName),[schoolOrSubject,setSchool]=useState(user.schoolOrSubject||''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 return <WorkspaceDialog title="Profile settings" onClose={onClose} busy={busy}><form className="space-y-4" onSubmit={async e=>{e.preventDefault();if(busy)return;setBusy(true);setError('');try{const draft=validateProfile({fullName,schoolOrSubject});const result=await getAuthClient().auth.updateUser({data:draft});if(result.error)throw new Error('Your profile was not saved. Check your connection and try again.');onSaved();onClose();}catch(e){setError(e instanceof Error?e.message:'Could not update your profile.');}finally{setBusy(false);}}}>
 <label className="block text-sm font-semibold">Display name<input autoFocus required maxLength={100} autoComplete="name" value={fullName} onChange={e=>setName(e.target.value)} className="mt-1 block w-full rounded-lg border p-3 font-normal"/></label>
 <label className="block text-sm font-semibold">School / subject<input maxLength={200} value={schoolOrSubject} onChange={e=>setSchool(e.target.value)} placeholder="For example: Greenfield School · Mathematics" className="mt-1 block w-full rounded-lg border p-3 font-normal"/></label>
 <div className="rounded-lg bg-slate-50 p-3 text-sm"><p className="font-semibold">Account email</p><p className="break-words mt-1 text-slate-600">{user.email}</p><p className="mt-2 text-xs text-slate-500">These settings update your display name and school/subject.</p></div>
 {error&&<p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
 <div className="flex justify-end gap-3"><button type="button" disabled={busy} onClick={onClose} className="border rounded-lg px-4 py-2">Cancel</button><button disabled={busy} className="bg-indigo-700 text-white rounded-lg px-4 py-2 font-semibold disabled:opacity-40">{busy?'Saving…':'Save profile'}</button></div>
 </form></WorkspaceDialog>;
}
