-- Hosted integration tests: all fixtures and changes roll back, and no mail is sent.
begin;
select set_config('savitrix.admin',(select user_id::text from public.savitrix_admins limit 1),true);
select set_config('savitrix.coordinator',(select user_id::text from public.savitrix_directory where user_id not in(select user_id from public.savitrix_admins) limit 1),true);
select set_config('savitrix.member',gen_random_uuid()::text,true);
select set_config('savitrix.outsider',gen_random_uuid()::text,true);
insert into auth.users(id,email,raw_user_meta_data,created_at) values(current_setting('savitrix.member')::uuid,'savitrix-fixture-member@example.invalid','{"fullName":"Fixture Teacher"}',now()),(current_setting('savitrix.outsider')::uuid,'savitrix-fixture-outsider@example.invalid','{"fullName":"Fixture Outsider"}',now());
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('savitrix.admin'),true);
insert into public.savitrix_institutes(name,coordinator_id) values('Fixture Institute',current_setting('savitrix.coordinator')::uuid);
select set_config('savitrix.institute',(select id::text from public.savitrix_institutes where name='Fixture Institute'),true);
insert into public.savitrix_announcements(title,message,published) values('Fixture draft','This must remain a draft.',false),('Fixture published','This update is visible.',true);
insert into public.savitrix_announcements(title,message,published,expires_at) values('Fixture expired','This update has expired.',true,now()-interval '1 day');
do $$begin if (public.savitrix_access_status()->>'kind')<>'admin' then raise exception 'Admin status incorrect';end if;end$$;
select set_config('request.jwt.claim.sub',current_setting('savitrix.coordinator'),true);
insert into public.savitrix_institute_members(institute_id,teacher_email) values(current_setting('savitrix.institute')::uuid,'  SAVITRIX-FIXTURE-MEMBER@example.invalid  ');
do $$begin
 if (select count(*) from public.savitrix_institute_members where institute_id=current_setting('savitrix.institute')::uuid)<>1 then raise exception 'Coordinator cannot manage roster';end if;
 if exists(select 1 from public.savitrix_directory where user_id=current_setting('savitrix.member')::uuid) then raise exception 'Coordinator gained directory access';end if;
 if exists(select 1 from public.savitrix_announcements where title in('Fixture draft','Fixture expired')) then raise exception 'Hidden announcement leaked';end if;
 if not exists(select 1 from public.savitrix_announcements where title='Fixture published') then raise exception 'Published announcement missing';end if;
 begin insert into public.savitrix_announcements(title,message,published) values('Fake update','Not allowed to publish',true);raise exception 'Teacher could publish';exception when insufficient_privilege then null;end;
 update public.savitrix_institutes set full_access=true where id=current_setting('savitrix.institute')::uuid;
 if found then raise exception 'Coordinator approved own access';end if;
end$$;
select set_config('request.jwt.claim.sub',current_setting('savitrix.member'),true);
do $$begin
 if public.savitrix_has_full_access() or (select count(*) from public.savitrix_prompt_content)<>8 then raise exception 'Unapproved institute unlocked content';end if;
 if not exists(select 1 from public.savitrix_institutes where id=current_setting('savitrix.institute')::uuid) then raise exception 'Teacher cannot see institute';end if;
 begin insert into public.savitrix_institute_members(institute_id,teacher_email) values(current_setting('savitrix.institute')::uuid,'savitrix-fixture-outsider@example.invalid');raise exception 'Teacher could add members';exception when insufficient_privilege then null;end;
end$$;
select set_config('request.jwt.claim.sub',current_setting('savitrix.admin'),true);
update public.savitrix_institutes set full_access=true,expires_at=now()+interval '30 days' where id=current_setting('savitrix.institute')::uuid;
select set_config('request.jwt.claim.sub',current_setting('savitrix.member'),true);
do $$begin
 if not public.savitrix_has_full_access() or (select count(*) from public.savitrix_prompt_content)<>241 then raise exception 'Institute access did not unlock';end if;
 if (public.savitrix_access_status()->>'kind')<>'institute' or (public.savitrix_access_status()->>'institute_name')<>'Fixture Institute' then raise exception 'Institute status incorrect';end if;
end$$;
select set_config('request.jwt.claim.sub',current_setting('savitrix.outsider'),true);
do $$begin
 if exists(select 1 from public.savitrix_institutes where id=current_setting('savitrix.institute')::uuid) or exists(select 1 from public.savitrix_institute_members where institute_id=current_setting('savitrix.institute')::uuid) then raise exception 'Institute leaked to outsider';end if;
 if public.savitrix_has_full_access() then raise exception 'Outsider unlocked';end if;
 begin insert into public.savitrix_institute_members(institute_id,teacher_email) values(current_setting('savitrix.institute')::uuid,'savitrix-fixture-outsider@example.invalid');raise exception 'Self-enrolment allowed';exception when insufficient_privilege then null;end;
end$$;
select set_config('request.jwt.claim.sub',current_setting('savitrix.admin'),true);
update public.savitrix_institutes set expires_at=now()-interval '1 day' where id=current_setting('savitrix.institute')::uuid;
select set_config('request.jwt.claim.sub',current_setting('savitrix.member'),true);
do $$begin if public.savitrix_has_full_access() or (select count(*) from public.savitrix_prompt_content)<>8 then raise exception 'Expired institute retained access';end if;end$$;
select set_config('request.jwt.claim.sub',current_setting('savitrix.coordinator'),true);
delete from public.savitrix_institute_members where institute_id=current_setting('savitrix.institute')::uuid and user_id=current_setting('savitrix.member')::uuid;
select set_config('request.jwt.claim.sub',current_setting('savitrix.member'),true);
do $$begin if exists(select 1 from public.savitrix_institutes where id=current_setting('savitrix.institute')::uuid) then raise exception 'Removed teacher sees institute';end if;end$$;
set local role anon;
do $$begin if has_table_privilege('anon','public.savitrix_announcements','SELECT') or has_function_privilege('anon','public.savitrix_access_status()','EXECUTE') then raise exception 'Anonymous access exposed';end if;end$$;
rollback;
select 'Passed: institute approval, coordinator roster, private directory, outsider denial, expiry, removal, status and announcement visibility' as result;
