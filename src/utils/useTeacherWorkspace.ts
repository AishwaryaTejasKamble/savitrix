import { useEffect, useRef, useState } from 'react';
import { getAuthClient } from './authClient';
import { validateDraft, type PromptDraft, type SavedPrompt } from './personalPrompts';

export function useTeacherWorkspace() {
 const [favourites,setFavourites]=useState<Set<string>>(new Set());
 const [saved,setSaved]=useState<SavedPrompt[]>([]);
 const [loading,setLoading]=useState(true), [error,setError]=useState(''), [guideOpen,setGuideOpen]=useState(false);
 const [revision,setRevision]=useState(0), [busy,setBusy]=useState(false), [favouriteBusy,setFavouriteBusy]=useState<Set<string>>(new Set());
 const owner=useRef(''), alive=useRef(true), favouriteLocks=useRef(new Set<string>()), mutationLock=useRef(false);
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;owner.current='';};},[]);
 useEffect(()=>{
  let cancelled=false; setLoading(true);setError('');
  const load=async()=>{
   const db=getAuthClient(); const {data,error:authError}=await db.auth.getUser();
   if(authError||!data.user) throw new Error('Please sign in again to load your personal workspace.');
   const id=data.user.id;
   const allRows=async(table:string)=>{const rows: any[]=[];let offset=0;while(true){const result=await db.from(table).select('*').eq('user_id',id).order(table==='savitrix_favourites'?'prompt_id':'id').range(offset,offset+499);if(result.error)throw result.error;rows.push(...(result.data||[]));if(!result.data||result.data.length<500)return rows;offset+=500;}};
   const [fav,records,prefs]=await Promise.all([allRows('savitrix_favourites'),allRows('savitrix_saved_prompts'),db.from('savitrix_teacher_preferences').select('guide_completed_at').eq('user_id',id).maybeSingle()]);
   if(prefs.error)throw prefs.error;
   if(cancelled)return;
   owner.current=id; setFavourites(new Set(fav.map(r=>r.prompt_id)));setSaved((records as SavedPrompt[]).sort((a,b)=>b.created_at.localeCompare(a.created_at)));
   if(!prefs.data?.guide_completed_at)setGuideOpen(true);
  };
  void load().catch(()=>{if(!cancelled)setError('Your personal workspace could not sync. Check your connection and retry.');}).finally(()=>{if(!cancelled)setLoading(false);});
  return()=>{cancelled=true;};
 },[revision]);
 const requireOwner=()=>{if(!owner.current||loading||error)throw new Error('Wait for your workspace to sync, or retry loading it.');return owner.current;};
 const toggleFavourite=async(promptId:string)=>{
  const id=requireOwner();if(favouriteLocks.current.has(promptId))return;
  favouriteLocks.current.add(promptId);setFavouriteBusy(new Set(favouriteLocks.current));
  try {
   const db=getAuthClient();const removing=favourites.has(promptId);
   const result=removing ? await db.from('savitrix_favourites').delete().eq('user_id',id).eq('prompt_id',promptId) : await db.from('savitrix_favourites').upsert({user_id:id,prompt_id:promptId},{onConflict:'user_id,prompt_id',ignoreDuplicates:true});
   if(result.error)throw new Error('Could not update your favourites. Please try again.');
   if(alive.current)setFavourites(previous=>{const next=new Set(previous);if(removing)next.delete(promptId);else next.add(promptId);return next;});
  } finally {favouriteLocks.current.delete(promptId);if(alive.current)setFavouriteBusy(new Set(favouriteLocks.current));}
 };
 const savePrompt=async(draft:PromptDraft)=>{
  const id=requireOwner();if(mutationLock.current)throw new Error('Please wait for your current save to finish.');
  const valid=validateDraft(draft);mutationLock.current=true;setBusy(true);
  try {
   const db=getAuthClient();const payload={title:valid.title,content:valid.content,source_prompt_id:valid.source_prompt_id};
   const result=draft.id?await db.from('savitrix_saved_prompts').update(payload).eq('user_id',id).eq('id',draft.id).select().single():await db.from('savitrix_saved_prompts').insert({...payload,user_id:id}).select().single();
   if(result.error)throw new Error('Your prompt was not saved. Check your connection and try again.');
   if(alive.current)setSaved(previous=>[result.data as SavedPrompt,...previous.filter(r=>r.id!==result.data.id)]);
  } finally {mutationLock.current=false;if(alive.current)setBusy(false);}
 };
 const archivePrompt=async(record:SavedPrompt,restore=false)=>{
  const id=requireOwner();if(mutationLock.current)throw new Error('Please wait for the current change to finish.');mutationLock.current=true;setBusy(true);
  try {
   const result=await getAuthClient().from('savitrix_saved_prompts').update({removed_at:restore?null:new Date().toISOString()}).eq('user_id',id).eq('id',record.id).select().single();
   if(result.error)throw new Error('Could not update this saved prompt. Please try again.');
   if(alive.current)setSaved(previous=>previous.map(r=>r.id===record.id?result.data as SavedPrompt:r));
  } finally {mutationLock.current=false;if(alive.current)setBusy(false);}
 };
 const completeGuide=async()=>{
  const id=requireOwner();const {error:saveError}=await getAuthClient().from('savitrix_teacher_preferences').upsert({user_id:id,guide_completed_at:new Date().toISOString()});
  if(saveError)throw new Error('Could not save your guide preference. Please try again.');
  if(alive.current)setGuideOpen(false);
 };
 return {favourites,saved,loading,error,busy,favouriteBusy,guideOpen,setGuideOpen,toggleFavourite,savePrompt,archivePrompt,completeGuide,reload:()=>setRevision(r=>r+1)};
}
