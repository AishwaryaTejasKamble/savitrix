-- Only immutable catalogue metadata, never original or customised prompt text.
create table public.savitrix_prompt_catalogue (
 id text primary key, title text not null, category text not null
);
alter table public.savitrix_prompt_catalogue enable row level security;
revoke all on public.savitrix_prompt_catalogue from public,anon,authenticated;
grant select on public.savitrix_prompt_catalogue to authenticated;
create policy catalogue_read on public.savitrix_prompt_catalogue for select to authenticated using(true);
create table public.savitrix_feedback (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null default auth.uid() references public.savitrix_directory(user_id) on delete cascade,
 kind text not null check(kind in ('suggestion','problem','other')),
 message text not null check(char_length(btrim(message)) between 10 and 3000),
 rating integer check(rating between 1 and 5),
 status text not null default 'new' check(status in ('new','reviewing','resolved')),
 created_at timestamptz not null default now()
);
create index feedback_owner on public.savitrix_feedback(user_id);
create index feedback_date on public.savitrix_feedback(created_at desc);
alter table public.savitrix_feedback enable row level security;
revoke all on public.savitrix_feedback from public,anon,authenticated;
grant select on public.savitrix_feedback to authenticated;
grant insert(kind,message,rating) on public.savitrix_feedback to authenticated;
grant update(status) on public.savitrix_feedback to authenticated;
create policy feedback_submit on public.savitrix_feedback for insert to authenticated with check(user_id=(select auth.uid()) and status='new');
create policy feedback_read on public.savitrix_feedback for select to authenticated using(user_id=(select auth.uid()) or exists(select 1 from public.savitrix_admins where user_id=(select auth.uid())));
create policy feedback_admin_status on public.savitrix_feedback for update to authenticated using(exists(select 1 from public.savitrix_admins where user_id=(select auth.uid()))) with check(exists(select 1 from public.savitrix_admins where user_id=(select auth.uid())));
create table public.savitrix_usage_events (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 prompt_id text not null references public.savitrix_prompt_catalogue(id),
 action text not null check(action in ('copy','open_chatgpt','open_claude','open_gemini','customise','save','favourite')),
 created_at timestamptz not null default now()
);
create index usage_date_prompt on public.savitrix_usage_events(created_at desc,prompt_id);
create index usage_owner on public.savitrix_usage_events(user_id);
alter table public.savitrix_usage_events enable row level security;
revoke all on public.savitrix_usage_events from public,anon,authenticated;
-- Column grants prevent backdating, fabricated owner IDs and editing history.
grant insert(prompt_id,action) on public.savitrix_usage_events to authenticated;
grant select on public.savitrix_usage_events to authenticated;
create policy usage_insert on public.savitrix_usage_events for insert to authenticated with check(user_id=(select auth.uid()));
create policy usage_admin_read on public.savitrix_usage_events for select to authenticated using(exists(select 1 from public.savitrix_admins where user_id=(select auth.uid())));
create function public.savitrix_usage_summary(period_days integer default 30) returns jsonb language plpgsql security invoker set search_path='' as $$
declare result jsonb; begin
 if not exists(select 1 from public.savitrix_admins where user_id=auth.uid()) then raise exception 'Admin access required' using errcode='42501';end if;
 if period_days not in (7,30,90) then raise exception 'Choose 7, 30 or 90 days';end if;
 with events as (select * from public.savitrix_usage_events where created_at>=now()-make_interval(days=>period_days)),
 actions as(select action,count(*) as count from events group by action),
 prompts as(select e.prompt_id,c.title,c.category,count(*) as count from events e join public.savitrix_prompt_catalogue c on c.id=e.prompt_id group by e.prompt_id,c.title,c.category order by count desc,e.prompt_id limit 10),
 categories as(select c.category,count(*) as count from events e join public.savitrix_prompt_catalogue c on c.id=e.prompt_id group by c.category order by count desc,c.category)
 select jsonb_build_object('total_actions',(select count(*) from events),'active_teachers',(select count(distinct user_id) from events),'actions',coalesce((select jsonb_agg(to_jsonb(a) order by a.count desc,a.action) from actions a),'[]'::jsonb),'top_prompts',coalesce((select jsonb_agg(to_jsonb(p) order by p.count desc,p.prompt_id) from prompts p),'[]'::jsonb),'categories',coalesce((select jsonb_agg(to_jsonb(c) order by c.count desc,c.category) from categories c),'[]'::jsonb)) into result;
 return result;
end $$;
revoke all on function public.savitrix_usage_summary(integer) from public,anon,authenticated;
grant execute on function public.savitrix_usage_summary(integer) to authenticated;
