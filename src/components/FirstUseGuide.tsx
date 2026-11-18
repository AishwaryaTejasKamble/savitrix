import { useState } from 'react';
import { WorkspaceDialog } from './WorkspaceDialog';
export function FirstUseGuide({onComplete}:{onComplete:()=>Promise<void>}) {
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 const finish=async()=>{if(busy)return;setBusy(true);setError('');try{await onComplete();}catch(e){setError(e instanceof Error?e.message:'Please try again.');}finally{setBusy(false);}};
 return <WorkspaceDialog title="Your first classroom prompt" onClose={()=>void finish()} busy={busy}>
 <p className="text-sm text-slate-600 mb-5">Three quick steps to get started with Savitrix.</p>
 <ol className="space-y-5 text-sm"><li><h3 className="font-bold text-indigo-800">1. Find a prompt</h3><p className="mt-1 text-slate-700">Search for a topic or choose a category, such as Lesson Planning or Worksheets.</p></li><li><h3 className="font-bold text-indigo-800">2. Make it yours</h3><p className="mt-1 text-slate-700">Click <strong>Customize prompt</strong> and fill the bracketed fields. For example: [Grade/Class] → Class 5, [Topic] → Fractions, [Duration] → 30 minutes. Preview the updated text before using it.</p></li><li><h3 className="font-bold text-indigo-800">3. Open your preferred AI tool</h3><p className="mt-1 text-slate-700">Choose <strong>Open ChatGPT</strong>, <strong>Claude</strong>, or <strong>Gemini</strong>. The tool opens in a new tab; sign in there if asked. If the text does not appear, use <strong>Copy prompt</strong> and paste it into the tool.</p></li></ol>
 <div className="my-5 rounded-xl bg-indigo-50 p-4 text-sm text-indigo-950"><strong>Keep what works:</strong> use the star to add the original prompt to Favourites. Use <strong>Save my prompt</strong> to name and save your customised version. Both sync with your account.</div>
 <p className="text-xs text-slate-600">AI tools use their own accounts and usage limits. Review generated material before using it in class. Avoid saving or sending personal student information.</p>
 {error&&<p role="alert" className="text-red-700 text-sm mt-3">{error}</p>}
 <button type="button" disabled={busy} onClick={()=>void finish()} className="mt-6 rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-50">{busy?'Saving…':'Got it — explore prompts'}</button>
 </WorkspaceDialog>;
}
