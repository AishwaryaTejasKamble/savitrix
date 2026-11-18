import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
const source=await readFile(new URL('../src/utils/personalPrompts.ts',import.meta.url),'utf8');
const api=await import('data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes(source)).toString('base64'));
test('customisation replaces repeated fields and retains unfilled placeholders',()=>{
 const original='Plan [Topic] for [Grade/Class]. Revisit [Topic] in [Duration].';
 assert.deepEqual(api.extractPlaceholders(original),['[Topic]','[Grade/Class]','[Duration]']);
 assert.equal(api.applyPlaceholders(original,{'[Topic]':' Fractions ','[Grade/Class]':'Class 5','[Duration]':' '}),'Plan Fractions for Class 5. Revisit Fractions in [Duration].');
 assert.match(original,/\[Topic\]/);
});
test('saved copies preserve custom content and source identity while normalising whitespace',()=>{
 const input={title:' Maths lesson ',content:' Teach Class 5 fractions. ',source_prompt_id:'playbook-1'};
 assert.deepEqual(api.validateDraft(input),{title:'Maths lesson',content:'Teach Class 5 fractions.',source_prompt_id:'playbook-1'});
 assert.equal(input.title,' Maths lesson ');
});
test('invalid or excessive saved content is rejected before storage',()=>{
 for(const draft of [{title:' ',content:'x'},{title:'x',content:' '},{title:'x'.repeat(161),content:'x'},{title:'x',content:'x'.repeat(20001)}])assert.throws(()=>api.validateDraft({...draft,source_prompt_id:null}));
});
test('saved search covers title and content and keeps removed copies separate for restoration',()=>{
 const active={id:'a',title:'Maths lesson',content:'Teach fractions',removed_at:null};
 const removed={id:'b',title:'Science',content:'Plants',removed_at:'2026-11-18'};
 assert.deepEqual(api.filterSavedPrompts([active,removed],' FRACTIONS ',false),[active]);
 assert.deepEqual(api.filterSavedPrompts([active,removed],'',true),[removed]);
 assert.deepEqual(api.filterSavedPrompts([active,removed],'science',false),[]);
});
