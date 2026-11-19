import {useEffect,useState} from 'react';
import {getAuthClient} from './authClient';
import {PROMPT_CATALOGUE} from '../data/promptCatalogue';
import type {AccessDetails} from '../components/AccessStatus';
import type {PromptItem} from '../data/types';
export type LibraryPrompt=PromptItem&{locked:boolean;isFree:boolean};
export function usePromptAccess(){
 const [status,setStatus]=useState<AccessDetails|null>(null);
 const [items,setItems]=useState<LibraryPrompt[]>([]),[fullAccess,setFull]=useState(false),[loading,setLoading]=useState(true),[error,setError]=useState(''),[revision,setRevision]=useState(0);
 useEffect(()=>{let active=true;setLoading(true);setError('');const load=async()=>{
  const db=getAuthClient();const [content,access]=await Promise.all([db.from('savitrix_prompt_content').select('id,prompt,problem,solution_method,is_free'),db.rpc('savitrix_access_status')]);
  if(content.error||access.error)throw new Error('Prompt access could not be checked. Please retry.');if(!active)return;
  const bodies=new Map((content.data||[]).map(row=>[row.id,row]));
  setItems(PROMPT_CATALOGUE.map(meta=>{const row=bodies.get(meta.id);return {...meta,prompt:row?.prompt||'',problem:row?.problem||undefined,solutionMethod:row?.solution_method||undefined,locked:!row,isFree:Boolean(row?.is_free)};}));setFull(Boolean(access.data?.full_access));setStatus(access.data as AccessDetails);
 };void load().catch(()=>{if(active){setItems([]);setFull(false);setStatus(null);setError('Your prompt library could not load. Check your connection and retry.');}}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[revision]);
 useEffect(()=>{const refresh=()=>{if(document.visibilityState==='visible')setRevision(r=>r+1);};const timer=window.setInterval(refresh,60000);window.addEventListener('focus',refresh);document.addEventListener('visibilitychange',refresh);return()=>{window.clearInterval(timer);window.removeEventListener('focus',refresh);document.removeEventListener('visibilitychange',refresh);};},[]);
 return {status,items,fullAccess,loading,error,reload:()=>setRevision(r=>r+1)};
}
