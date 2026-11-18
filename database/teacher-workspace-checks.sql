-- Uses existing accounts; test writes are always rolled back.
begin;
select set_config('savitrix.test_a',(select id::text from auth.users order by id limit 1),true);
select set_config('savitrix.test_b',(select id::text from auth.users order by id offset 1 limit 1),true);
select set_config('savitrix.test_saved',gen_random_uuid()::text,true);
select set_config('savitrix.test_favourite',gen_random_uuid()::text,true);
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('savitrix.test_a'),true);
insert into public.savitrix_favourites(prompt_id) values(current_setting('savitrix.test_favourite'));
insert into public.savitrix_saved_prompts(id,title,content,source_prompt_id) values(current_setting('savitrix.test_saved')::uuid,'Class 5 fractions','Teach fractions in 30 minutes','playbook-1');
insert into public.savitrix_teacher_preferences(user_id,guide_completed_at) values(auth.uid(),now()) on conflict(user_id) do update set guide_completed_at=excluded.guide_completed_at;
do $$ begin
 if not exists(select 1 from public.savitrix_saved_prompts where id=current_setting('savitrix.test_saved')::uuid) then raise exception 'Owner cannot load saved copy'; end if;
 begin
  insert into public.savitrix_favourites(prompt_id) values(current_setting('savitrix.test_favourite'));
  raise exception 'Duplicate favourite allowed';
 exception when unique_violation then null; end;
 begin
  update public.savitrix_saved_prompts set user_id=current_setting('savitrix.test_b')::uuid where id=current_setting('savitrix.test_saved')::uuid;
  raise exception 'Owner can transfer private copy';
 exception when insufficient_privilege then null; end;
end $$;
update public.savitrix_saved_prompts set title='Updated',removed_at=now() where id=current_setting('savitrix.test_saved')::uuid;
do $$ begin if not exists(select 1 from public.savitrix_saved_prompts where id=current_setting('savitrix.test_saved')::uuid and title='Updated' and removed_at is not null) then raise exception 'Edit/archive failed';end if;end $$;
update public.savitrix_saved_prompts set removed_at=null where id=current_setting('savitrix.test_saved')::uuid;
select set_config('request.jwt.claim.sub',current_setting('savitrix.test_b'),true);
do $$ declare affected int; begin
 if exists(select 1 from public.savitrix_saved_prompts where id=current_setting('savitrix.test_saved')::uuid) or exists(select 1 from public.savitrix_favourites where prompt_id=current_setting('savitrix.test_favourite')) or exists(select 1 from public.savitrix_teacher_preferences where user_id=current_setting('savitrix.test_a')::uuid) then raise exception 'Other account can read private data';end if;
 update public.savitrix_saved_prompts set title='Not allowed' where id=current_setting('savitrix.test_saved')::uuid;
 get diagnostics affected=row_count; if affected<>0 then raise exception 'Other account can edit saved copy';end if;
 delete from public.savitrix_favourites where prompt_id=current_setting('savitrix.test_favourite');
 get diagnostics affected=row_count; if affected<>0 then raise exception 'Other account can remove favourite';end if;
 begin
  insert into public.savitrix_saved_prompts(user_id,title,content) values(current_setting('savitrix.test_a')::uuid,'Not allowed','Not allowed');
  raise exception 'Cross-account insert allowed';
 exception when insufficient_privilege then null;end;
 if has_table_privilege('anon','public.savitrix_saved_prompts','SELECT') or has_table_privilege('anon','public.savitrix_favourites','SELECT') or has_table_privilege('anon','public.savitrix_teacher_preferences','SELECT') then raise exception 'Anonymous can read personal data';end if;
 if has_table_privilege('authenticated','public.savitrix_saved_prompts','DELETE') then raise exception 'Saved copies can be hard deleted';end if;
end $$;
select set_config('request.jwt.claim.sub',current_setting('savitrix.test_a'),true);
do $$ begin if not exists(select 1 from public.savitrix_saved_prompts where id=current_setting('savitrix.test_saved')::uuid and removed_at is null and title='Updated') then raise exception 'Restore/persistence failed';end if;end $$;
delete from public.savitrix_favourites where prompt_id=current_setting('savitrix.test_favourite');
rollback;
select 'Personal workspace isolation, editing, restoration and persistence checks passed' as result;
