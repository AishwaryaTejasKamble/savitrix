import {useEffect,useState} from 'react';
import {getAuthClient} from './authClient';
import {PROMPT_CATALOGUE} from '../data/promptCatalogue';
import type {PromptItem} from '../data/types';
export type LibraryPrompt=PromptItem&{locked:boolean;isFree:boolean};
export function usePromptAccess(){
 const [items,setItems]=useState<LibraryPrompt[]>([]),[fullAccess,setFull]=useState(false),[loading,setLoading]=useState(true),[error,setError]=useState(''),[revision,setRevision]=useState(0);
 useEffect(()=>{let active=true;setLoading(true);setError('');const load=async()=>{
  const db=getAuthClient();const [content,access]=await Promise.all([db.from('savitrix_prompt_content').select('id,prompt,problem,solution_method,is_free'),db.rpc('savitrix_has_full_access')]);
  if(content.error||access.error)throw new Error('Prompt access could not be checked. Please retry.');if(!active)return;
  const bodies=new Map((content.data||[]).map(row=>[row.id,row]));
  setItems(PROMPT_CATALOGUE.map(meta=>{const row=bodies.get(meta.id);return {...meta,prompt:row?.prompt||'',problem:row?.problem||undefined,solutionMethod:row?.solution_method||undefined,locked:!row,isFree:Boolean(row?.is_free)};}));setFull(Boolean(access.data));
 };void load().catch(()=>{if(active){setItems([]);setFull(false);setError('Your prompt library could not load. Check your connection and retry.');}}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[revision]);
 return {items,fullAccess,loading,error,reload:()=>setRevision(r=>r+1)};
}
