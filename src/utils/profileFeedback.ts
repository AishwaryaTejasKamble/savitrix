export interface ProfileDraft {fullName:string;schoolOrSubject:string;}
export interface FeedbackDraft {kind:'suggestion'|'problem'|'other';message:string;rating:number|null;}
export function validateProfile(draft:ProfileDraft):ProfileDraft {
 const fullName=draft.fullName.trim(),schoolOrSubject=draft.schoolOrSubject.trim();
 if(!fullName||fullName.length>100)throw new Error('Enter a name of 1–100 characters.');
 if(schoolOrSubject.length>200)throw new Error('Keep school or subject within 200 characters.');
 return {fullName,schoolOrSubject};
}
export function validateFeedback(draft:FeedbackDraft):FeedbackDraft {
 const message=draft.message.trim();
 if(!['suggestion','problem','other'].includes(draft.kind))throw new Error('Choose a feedback type.');
 if(message.length<10||message.length>3000)throw new Error('Write feedback of 10–3,000 characters.');
 if(draft.rating!==null&&(!Number.isInteger(draft.rating)||draft.rating<1||draft.rating>5))throw new Error('Choose a rating from 1 to 5, or leave it blank.');
 return {...draft,message};
}
