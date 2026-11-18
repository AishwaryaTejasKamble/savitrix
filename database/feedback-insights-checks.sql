begin;
select set_config('savitrix.admin',(select user_id::text from public.savitrix_admins limit 1),true);
select set_config('savitrix.teacher',(select id::text from auth.users where id not in(select user_id from public.savitrix_admins) limit 1),true);
select set_config('savitrix.prompt',(select id from public.savitrix_prompt_catalogue order by id limit 1),true);
select set_config('savitrix.usage_before',(select count(*)::text from public.savitrix_usage_events where created_at>=now()-interval '30 days'),true);
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('savitrix.teacher'),true);
with added as(insert into public.savitrix_feedback(kind,message,rating) values('suggestion','Test feedback for access checks',4) returning id)
select set_config('savitrix.feedback',(select id::text from added),true);
insert into public.savitrix_usage_events(prompt_id,action) values(current_setting('savitrix.prompt'),'copy');
do $$ declare affected int; begin
 if not exists(select 1 from public.savitrix_feedback where id=current_setting('savitrix.feedback')::uuid) then raise exception 'Teacher cannot see own feedback';end if;
 if exists(select 1 from public.savitrix_usage_events) then raise exception 'Teacher can read analytics history';end if;
 update public.savitrix_feedback set status='resolved' where id=current_setting('savitrix.feedback')::uuid;
 get diagnostics affected=row_count;if affected<>0 then raise exception 'Teacher can change review status';end if;
 begin perform public.savitrix_usage_summary(30);raise exception 'Teacher can query admin summary';exception when insufficient_privilege then null;end;
 begin insert into public.savitrix_feedback(kind,message,status) values('other','Not allowed to pre-resolve','resolved');raise exception 'Teacher can set insert status';exception when insufficient_privilege then null;end;
 begin insert into public.savitrix_usage_events(prompt_id,action,user_id) values(current_setting('savitrix.prompt'),'copy',current_setting('savitrix.admin')::uuid);raise exception 'Teacher can impersonate analytics owner';exception when insufficient_privilege then null;end;
end $$;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',true);
do $$ begin if exists(select 1 from public.savitrix_feedback) then raise exception 'Other teacher can read feedback';end if;end $$;
select set_config('request.jwt.claim.sub',current_setting('savitrix.admin'),true);
do $$ declare report jsonb; begin
 if not exists(select 1 from public.savitrix_feedback where id=current_setting('savitrix.feedback')::uuid) then raise exception 'Admin cannot see teacher feedback';end if;
 report=public.savitrix_usage_summary(30);
 if (report->>'total_actions')::integer<>current_setting('savitrix.usage_before')::integer+1 then raise exception 'Usage totals incorrect';end if;
 if jsonb_array_length(report->'top_prompts')<1 then raise exception 'Top prompts missing';end if;
 if has_table_privilege('anon','public.savitrix_feedback','SELECT') or has_table_privilege('anon','public.savitrix_usage_events','SELECT') or has_function_privilege('anon','public.savitrix_usage_summary(integer)','EXECUTE') then raise exception 'Anonymous access granted';end if;
end $$;
update public.savitrix_feedback set status='reviewing' where id=current_setting('savitrix.feedback')::uuid;
do $$ begin if not exists(select 1 from public.savitrix_feedback where id=current_setting('savitrix.feedback')::uuid and status='reviewing') then raise exception 'Admin status update failed';end if;end $$;
rollback;
select 'Feedback permissions, admin review, analytics isolation and aggregate checks passed' as result;
