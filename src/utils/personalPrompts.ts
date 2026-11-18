export interface SavedPrompt {
 id: string; user_id: string; source_prompt_id: string | null; title: string; content: string;
 created_at: string; updated_at: string; removed_at: string | null;
}
export interface PromptDraft { title: string; content: string; source_prompt_id: string | null; id?: string; }
export function validateDraft(draft: PromptDraft): PromptDraft {
 const title=draft.title.trim(), content=draft.content.trim();
 if (!title || title.length>160) throw new Error('Enter a title of 1–160 characters.');
 if (!content || content.length>20000) throw new Error('Enter a prompt of 1–20,000 characters.');
 return {...draft,title,content};
}
export function filterSavedPrompts(rows: SavedPrompt[], query: string, removed: boolean): SavedPrompt[] {
 const q=query.trim().toLocaleLowerCase();
 return rows.filter(row=>Boolean(row.removed_at)===removed && (!q || `${row.title} ${row.content}`.toLocaleLowerCase().includes(q)));
}
export function extractPlaceholders(text: string): string[] { return [...new Set(text.match(/\[[^\]]+\]/g)||[])]; }
export function applyPlaceholders(text: string, values: Record<string,string>): string {
 return text.replace(/\[[^\]]+\]/g,match=>values[match]?.trim()||match);
}
