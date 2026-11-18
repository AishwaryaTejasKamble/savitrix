import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
export function WorkspaceDialog({title,children,onClose,busy=false}:{title:string;children:ReactNode;onClose:()=>void;busy?:boolean}) {
 const ref=useRef<HTMLDialogElement>(null), heading=useId();
 useEffect(()=>{const dialog=ref.current;dialog?.showModal();return()=>dialog?.close();},[]);
 return <dialog ref={ref} aria-labelledby={heading} onCancel={event=>{event.preventDefault();if(!busy)onClose();}} className="m-auto w-[calc(100%_-_2rem)] max-w-2xl max-h-[90dvh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 text-slate-900 shadow-xl backdrop:bg-slate-950/60"><div className="flex items-start justify-between gap-4 mb-5"><h2 id={heading} className="text-xl font-bold">{title}</h2><button type="button" aria-label="Close dialog" disabled={busy} onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-40"><X className="w-5 h-5"/></button></div>{children}</dialog>;
}
