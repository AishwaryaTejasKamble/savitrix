import { getAuthClient } from './authClient';
export type UsageAction = 'copy'|'open_chatgpt'|'open_claude'|'open_gemini'|'customise'|'save'|'favourite';
// Best-effort action counts. Never send prompt content, field values or external AI responses.
export function recordPromptAction(promptId:string|null|undefined,action:UsageAction):void {
 if(!promptId)return;
 try {void getAuthClient().from('savitrix_usage_events').insert({prompt_id:promptId,action}).then(()=>{},()=>{});}catch{/* Analytics must not block a classroom action. */}
}
export function providerAction(name:string):UsageAction {
 return name.startsWith('ChatGPT')?'open_chatgpt':name.startsWith('Claude')?'open_claude':'open_gemini';
}
