-- Applied using Supabase apply_migration as admin_broker_workspaces.
-- Initial administrator is provisioned separately after human account selection.
create schema if not exists app_private;
revoke all on schema app_private from public, anon;
grant usage on schema app_private to authenticated;

create table public.staff_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','broker')),
  active boolean not null default true,
  can_accept_orders boolean not null default true,
  can_update_orders boolean not null default true,
  can_add_notes boolean not null default true,
  granted_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.staff_access enable row level security;

create function app_private.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.staff_access where user_id=(select auth.uid()) and role='admin' and active);
$$;
create function app_private.broker_permission(permission text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.staff_access where user_id=(select auth.uid()) and role='broker' and active
    and case permission when 'read' then true when 'accept' then can_accept_orders
      when 'update' then can_update_orders when 'notes' then can_add_notes else false end);
$$;
revoke all on function app_private.is_admin() from public,anon;
revoke all on function app_private.broker_permission(text) from public,anon;
grant execute on function app_private.is_admin(),app_private.broker_permission(text) to authenticated;

create policy staff_read on public.staff_access for select to authenticated
using (user_id=(select auth.uid()) or (select app_private.is_admin()));
create policy staff_grant on public.staff_access for insert to authenticated
with check ((select app_private.is_admin()) and role='broker' and granted_by=(select auth.uid()));
create policy staff_change on public.staff_access for update to authenticated
using ((select app_private.is_admin()) and role='broker')
with check ((select app_private.is_admin()) and role='broker' and granted_by=(select auth.uid()));
revoke all on public.staff_access from anon,authenticated;
grant select,insert,update on public.staff_access to authenticated;
create index staff_access_granted_by_idx on public.staff_access(granted_by);

create table public.broker_orders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id),
  contact_email text,
  domain_name text not null check (length(domain_name)<=253 and domain_name ~ '^[a-z0-9]([a-z0-9.-]*[a-z0-9])?\.[a-z]{2,63}$'),
  service_type text not null check (service_type in ('sale','acquisition')),
  budget numeric(14,2) check (budget>=0),
  brief text not null check (length(brief) between 5 and 3000),
  broker_id uuid references public.staff_access(user_id),
  status text not null default 'pending' check (status in ('pending','assigned','accepted','in_progress','completed','declined','cancelled')),
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status='pending' and broker_id is null) or (status in ('cancelled') ) or (status in ('assigned','accepted','in_progress','completed','declined') and broker_id is not null))
);
create index broker_orders_owner_idx on public.broker_orders(owner_id,created_at desc);
create index broker_orders_broker_idx on public.broker_orders(broker_id,created_at desc);
create index broker_orders_status_idx on public.broker_orders(status,created_at desc);
alter table public.broker_orders enable row level security;
create policy orders_read on public.broker_orders for select to authenticated
using ((select app_private.is_admin()) or owner_id=(select auth.uid()) or (broker_id=(select auth.uid()) and (select app_private.broker_permission('read'))));
create policy orders_create on public.broker_orders for insert to authenticated
with check (((select app_private.is_admin()) or owner_id=(select auth.uid())) and status='pending' and broker_id is null);
create policy orders_update on public.broker_orders for update to authenticated
using ((select app_private.is_admin()) or (broker_id=(select auth.uid()) and (select app_private.broker_permission('read'))))
with check ((select app_private.is_admin()) or (broker_id=(select auth.uid()) and (select app_private.broker_permission('read'))));
revoke all on public.broker_orders from anon,authenticated;
grant select,insert,update on public.broker_orders to authenticated;

create table public.order_notes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.broker_orders(id),
  author_id uuid not null references auth.users(id),
  body text not null check (length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index order_notes_order_idx on public.order_notes(order_id,created_at);
create index order_notes_author_idx on public.order_notes(author_id);
alter table public.order_notes enable row level security;
create policy notes_read on public.order_notes for select to authenticated
using ((select app_private.is_admin()) or ((select app_private.broker_permission('read')) and exists(select 1 from public.broker_orders o where o.id=order_id and o.broker_id=(select auth.uid()))));
create policy notes_create on public.order_notes for insert to authenticated
with check (author_id=(select auth.uid()) and ((select app_private.is_admin()) or ((select app_private.broker_permission('notes')) and exists(select 1 from public.broker_orders o where o.id=order_id and o.broker_id=(select auth.uid()) and o.status not in ('completed','cancelled','declined')))));
revoke all on public.order_notes from anon,authenticated;
grant select,insert on public.order_notes to authenticated;

create table public.admin_audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_id text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index admin_audit_actor_idx on public.admin_audit_log(actor_id);
alter table public.admin_audit_log enable row level security;
create policy audit_read on public.admin_audit_log for select to authenticated using ((select app_private.is_admin()));
revoke all on public.admin_audit_log from anon,authenticated;
grant select on public.admin_audit_log to authenticated;

-- Privileged trigger implementations are private, not exposed RPCs.
create function app_private.validate_order() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if TG_OP='INSERT' then
    new.version:=1; new.created_at:=now(); new.updated_at:=now();
    select email into new.contact_email from auth.users where id=new.owner_id;
    if new.status<>'pending' or new.broker_id is not null then raise exception 'New orders must be pending'; end if;
    return new;
  end if;
  if not app_private.is_admin() then
    if old.broker_id is distinct from auth.uid() or not app_private.broker_permission('read') then raise exception 'Broker access denied' using errcode='42501'; end if;
    if (to_jsonb(new)-array['status','version','updated_at']) is distinct from (to_jsonb(old)-array['status','version','updated_at']) then raise exception 'Brokers cannot modify order details or assignment' using errcode='42501'; end if;
    if old.status='assigned' and new.status in ('accepted','declined') then
      if not app_private.broker_permission('accept') then raise exception 'Accept permission required' using errcode='42501'; end if;
    elsif (old.status='accepted' and new.status='in_progress') or (old.status='in_progress' and new.status='completed') then
      if not app_private.broker_permission('update') then raise exception 'Update permission required' using errcode='42501'; end if;
    else raise exception 'Invalid broker status transition'; end if;
  else
    if new.id<>old.id or new.owner_id<>old.owner_id or new.created_at<>old.created_at then raise exception 'Order identity cannot be changed'; end if;
    if old.status in ('completed','cancelled') then raise exception 'Closed orders cannot be changed'; end if;
    if new.broker_id is distinct from old.broker_id and new.status not in ('assigned','pending') then raise exception 'Reassignment must reset order status'; end if;
  end if;
  if new.status='assigned' then
    perform 1 from public.staff_access where user_id=new.broker_id and role='broker' and active and can_accept_orders for share;
    if not found then raise exception 'Select an active broker with accept permission'; end if;
  end if;
  new.version:=old.version+1; new.updated_at:=now();
  return new;
end;
$$;
create trigger validate_broker_order before insert or update on public.broker_orders for each row execute function app_private.validate_order();

create function app_private.audit_change() returns trigger
language plpgsql security definer set search_path = '' as $$
declare entity text; payload jsonb;
begin
  if TG_TABLE_NAME='staff_access' then
    new.updated_at:=now();
    if TG_OP='UPDATE' then new.created_at:=old.created_at; end if;
    entity:=new.user_id::text;
    payload:=jsonb_build_object('role',new.role,'active',new.active,'can_accept_orders',new.can_accept_orders,'can_update_orders',new.can_update_orders,'can_add_notes',new.can_add_notes);
  elsif TG_TABLE_NAME='broker_orders' then
    entity:=new.id::text; payload:=jsonb_build_object('status',new.status,'broker_id',new.broker_id,'version',new.version);
  elsif TG_TABLE_NAME='order_notes' then
    entity:=new.order_id::text; payload:=jsonb_build_object('note_id',new.id);
  else
    entity:=new.id::text; payload:='{}'::jsonb;
  end if;
  insert into public.admin_audit_log(actor_id,action,entity_id,details) values(auth.uid(),TG_TABLE_NAME||'.'||lower(TG_OP),entity,payload);
  return new;
end;
$$;
create trigger audit_staff before insert or update on public.staff_access for each row execute function app_private.audit_change();
create trigger audit_orders after insert or update on public.broker_orders for each row execute function app_private.audit_change();
create trigger audit_notes after insert on public.order_notes for each row execute function app_private.audit_change();
create trigger audit_domains after update on public.domains for each row execute function app_private.audit_change();
create trigger audit_profiles after update on public.profiles for each row execute function app_private.audit_change();
revoke all on function app_private.validate_order(),app_private.audit_change() from public,anon,authenticated;

create policy admin_profiles_read on public.profiles for select to authenticated using ((select app_private.is_admin()));
create policy admin_profiles_update on public.profiles for update to authenticated using ((select app_private.is_admin())) with check ((select app_private.is_admin()));
create policy admin_domains_read on public.domains for select to authenticated using ((select app_private.is_admin()));
create policy admin_domains_update on public.domains for update to authenticated using ((select app_private.is_admin())) with check ((select app_private.is_admin()));
create policy admin_analysis_read on public.domain_analysis for select to authenticated using ((select app_private.is_admin()));
create index if not exists domains_user_id_idx on public.domains(user_id);
create index if not exists domain_analysis_domain_created_idx on public.domain_analysis(domain_id,created_at desc);
