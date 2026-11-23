export type Values=Record<string,string>;
export type CustomisationState={global:Values;overrides:Record<string,Values>};
export const emptyCustomisation=():CustomisationState=>({global:{},overrides:{}});
const aliases:Record<string,string>={
 'grade':'Grade/Class','class':'Grade/Class','grade/class':'Grade/Class',
 'subject':'Subject','subject/topic':'Topic','topic/subject':'Topic','topic':'Topic','topic/unit':'Topic','topic/chapter':'Topic','chapter':'Topic',
 'language':'Language','languages':'Language','curriculum or board':'Curriculum or board',
 'school type':'School type','type of school':'School type','duration':'Duration','minutes':'Duration',
 'level':'Level','average level':'Level','beginner/average/advanced':'Level',
};
export const SHARED_FIELDS=['Grade/Class','Subject','Topic','Language','Curriculum or board','Duration','Level','School type'];
export function fieldKey(token:string):string {const name=token.replace(/^\[|\]$/g,'').trim().replace(/\s*\/\s*/g,'/').replace(/\s+/g,' ');return Object.hasOwn(aliases,name.toLowerCase())?aliases[name.toLowerCase()]:name.toLowerCase();}
export function resolveValues(tokens:string[],global:Values,override:Values):Values {
 return Object.fromEntries(tokens.map(token=>[token,Object.hasOwn(override,token)?override[token]:(Object.hasOwn(global,fieldKey(token))?global[fieldKey(token)]:'')]));
}
export function validateCustomisation(value:unknown):CustomisationState {
 if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Invalid customisation');
 const state=value as CustomisationState;
 const check=(map:unknown)=>{if(!map||typeof map!=='object'||Array.isArray(map)||Object.keys(map).length>200)throw Error('Too many custom fields');for(const [key,val] of Object.entries(map)){if(!key||key.length>200||['__proto__','constructor','prototype'].includes(key)||typeof val!=='string'||val.length>2000)throw Error('Use up to 2,000 characters per field');}};
 check(state.global);if(!state.overrides||typeof state.overrides!=='object'||Array.isArray(state.overrides)||Object.keys(state.overrides).length>300)throw Error('Too many prompt customisations');
 for(const [id,map] of Object.entries(state.overrides)){if(!id||id.length>100||['__proto__','constructor','prototype'].includes(id))throw Error('Invalid prompt');check(map);}
 const clean={global:state.global,overrides:state.overrides};if(new TextEncoder().encode(JSON.stringify(clean)).length>450000)throw Error('Customisation storage is full. Clear unused fields first.');return clean;
}
