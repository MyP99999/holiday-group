create extension if not exists pgcrypto;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z0-9]{6}$'),
  name text not null,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trip_members (
  id text primary key default ('person-' || gen_random_uuid()::text),
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  role text not null default 'member' check (role in ('admin', 'member')),
  color text not null default '#6E8D79',
  avatar_url text,
  added_at timestamptz not null default now(),
  joined_at timestamptz,
  claimed_at timestamptz,
  unique (trip_id, user_id)
);

create unique index if not exists trip_members_trip_name_unique
  on public.trip_members (trip_id, lower(name));
create index if not exists trip_members_user_id_idx on public.trip_members (user_id);
create index if not exists trip_members_trip_id_idx on public.trip_members (trip_id);

create table if not exists public.expenses (
  trip_id uuid not null references public.trips(id) on delete cascade,
  id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (trip_id, id)
);

create table if not exists public.accommodations (
  trip_id uuid not null references public.trips(id) on delete cascade,
  id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (trip_id, id)
);

create table if not exists public.vehicles (
  trip_id uuid not null references public.trips(id) on delete cascade,
  id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (trip_id, id)
);

create table if not exists public.trip_comments (
  trip_id uuid not null references public.trips(id) on delete cascade,
  id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (trip_id, id)
);

create table if not exists public.chat_messages (
  trip_id uuid not null references public.trips(id) on delete cascade,
  id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (trip_id, id)
);

create table if not exists public.payment_routes (
  trip_id uuid not null references public.trips(id) on delete cascade,
  route_key text not null,
  via_member_id text,
  updated_at timestamptz not null default now(),
  primary key (trip_id, route_key)
);

create table if not exists public.settlement_payments (
  trip_id uuid not null references public.trips(id) on delete cascade,
  id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (trip_id, id)
);

create index if not exists expenses_trip_id_idx on public.expenses (trip_id);
create index if not exists accommodations_trip_id_idx on public.accommodations (trip_id);
create index if not exists vehicles_trip_id_idx on public.vehicles (trip_id);
create index if not exists trip_comments_trip_id_idx on public.trip_comments (trip_id);
create index if not exists chat_messages_trip_id_idx on public.chat_messages (trip_id);
create index if not exists settlement_payments_trip_id_idx on public.settlement_payments (trip_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
drop trigger if exists trips_set_updated_at on public.trips;
create trigger trips_set_updated_at before update on public.trips
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(coalesce(new.email, ''), '@', 1), 'Member'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update set
    display_name = excluded.display_name,
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert or update of raw_user_meta_data on auth.users
for each row execute function public.handle_new_user();

insert into public.profiles (id, display_name, avatar_url)
select
  id,
  coalesce(raw_user_meta_data ->> 'full_name', raw_user_meta_data ->> 'name', split_part(coalesce(email, ''), '@', 1), 'Member'),
  raw_user_meta_data ->> 'avatar_url'
from auth.users
on conflict (id) do nothing;

create or replace function private.is_trip_member(p_trip_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.trip_members
    where trip_id = p_trip_id and user_id = (select auth.uid())
  );
$$;

create or replace function private.is_trip_admin(p_trip_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.trip_members
    where trip_id = p_trip_id and user_id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function private.is_trip_member(uuid) from public;
revoke all on function private.is_trip_admin(uuid) from public;
revoke all on function private.is_trip_member(uuid) from anon;
revoke all on function private.is_trip_admin(uuid) from anon;
grant execute on function private.is_trip_member(uuid) to authenticated;
grant execute on function private.is_trip_admin(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.trip_members enable row level security;
alter table public.expenses enable row level security;
alter table public.accommodations enable row level security;
alter table public.vehicles enable row level security;
alter table public.trip_comments enable row level security;
alter table public.chat_messages enable row level security;
alter table public.payment_routes enable row level security;
alter table public.settlement_payments enable row level security;

drop policy if exists "Profiles are visible to their owner" on public.profiles;
create policy "Profiles are visible to their owner" on public.profiles
for select to authenticated using (id = (select auth.uid()));
drop policy if exists "Profiles are editable by their owner" on public.profiles;
create policy "Profiles are editable by their owner" on public.profiles
for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

drop policy if exists "Trip members can view trips" on public.trips;
create policy "Trip members can view trips" on public.trips
for select to authenticated using ((select private.is_trip_member(id)));
drop policy if exists "Trip admins can update trips" on public.trips;
create policy "Trip admins can update trips" on public.trips
for update to authenticated using ((select private.is_trip_admin(id))) with check ((select private.is_trip_admin(id)));
drop policy if exists "Trip admins can delete trips" on public.trips;
create policy "Trip admins can delete trips" on public.trips
for delete to authenticated using ((select private.is_trip_admin(id)));

drop policy if exists "Trip members can view members" on public.trip_members;
create policy "Trip members can view members" on public.trip_members
for select to authenticated using ((select private.is_trip_member(trip_id)));
drop policy if exists "Trip admins can add members" on public.trip_members;
create policy "Trip admins can add members" on public.trip_members
for insert to authenticated with check ((select private.is_trip_admin(trip_id)));
drop policy if exists "Trip admins can update members" on public.trip_members;
create policy "Trip admins can update members" on public.trip_members
for update to authenticated using ((select private.is_trip_admin(trip_id))) with check ((select private.is_trip_admin(trip_id)));
drop policy if exists "Trip admins can remove members" on public.trip_members;
create policy "Trip admins can remove members" on public.trip_members
for delete to authenticated using ((select private.is_trip_admin(trip_id)));

do $$
declare
  table_name text;
begin
  foreach table_name in array array['expenses', 'accommodations', 'vehicles', 'trip_comments', 'chat_messages', 'payment_routes', 'settlement_payments']
  loop
    execute format('drop policy if exists "Trip members can view %1$s" on public.%1$I', table_name);
    execute format('create policy "Trip members can view %1$s" on public.%1$I for select to authenticated using ((select private.is_trip_member(trip_id)))', table_name);
    execute format('drop policy if exists "Trip members can add %1$s" on public.%1$I', table_name);
    execute format('create policy "Trip members can add %1$s" on public.%1$I for insert to authenticated with check ((select private.is_trip_member(trip_id)))', table_name);
    execute format('drop policy if exists "Trip members can update %1$s" on public.%1$I', table_name);
    execute format('create policy "Trip members can update %1$s" on public.%1$I for update to authenticated using ((select private.is_trip_member(trip_id))) with check ((select private.is_trip_member(trip_id)))', table_name);
    execute format('drop policy if exists "Trip members can remove %1$s" on public.%1$I', table_name);
    execute format('create policy "Trip members can remove %1$s" on public.%1$I for delete to authenticated using ((select private.is_trip_member(trip_id)))', table_name);
  end loop;
end;
$$;

create or replace function private.new_trip_code()
returns text
language plpgsql
volatile
security definer
set search_path = public, pg_temp
as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i integer;
begin
  for i in 1..6 loop
    result := result || substr(alphabet, 1 + floor(random() * length(alphabet))::integer, 1);
  end loop;
  return result;
end;
$$;

create or replace function private.next_member_color(p_trip_id uuid)
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select (array[
    '#C95B43', '#3C7A6B', '#4F6FAE', '#9B5F8F', '#B77932',
    '#567C8D', '#7A6AAE', '#A05C55', '#5E8060', '#947044'
  ])[1 + ((select count(*)::integer from public.trip_members where trip_id = p_trip_id) % 10)];
$$;

revoke all on function private.new_trip_code() from public;
revoke all on function private.next_member_color(uuid) from public;
revoke all on function private.new_trip_code() from anon, authenticated;
revoke all on function private.next_member_color(uuid) from anon, authenticated;

create or replace function public.create_trip(p_name text, p_creator_name text default null)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  trip_row public.trips;
  member_row public.trip_members;
  candidate_code text;
  display_name text;
  attempt integer;
begin
  if (select auth.uid()) is null then raise exception 'AUTH_REQUIRED'; end if;
  display_name := coalesce(nullif(trim(p_creator_name), ''), (select profiles.display_name from public.profiles where id = (select auth.uid())), 'Trip owner');

  for attempt in 1..20 loop
    candidate_code := private.new_trip_code();
    exit when not exists (select 1 from public.trips where code = candidate_code);
  end loop;

  insert into public.trips (code, name, created_by)
  values (candidate_code, coalesce(nullif(trim(p_name), ''), 'New shared trip'), (select auth.uid()))
  returning * into trip_row;

  insert into public.trip_members (trip_id, user_id, name, role, color, avatar_url, joined_at, claimed_at)
  values (
    trip_row.id, (select auth.uid()), display_name, 'admin', '#C95B43',
    (select avatar_url from public.profiles where id = (select auth.uid())), now(), now()
  )
  returning * into member_row;

  return jsonb_build_object('tripId', trip_row.id, 'code', trip_row.code, 'memberId', member_row.id, 'name', trip_row.name);
end;
$$;

create or replace function public.list_my_trips()
returns table (trip_id uuid, code text, name text, member_id text, member_role text, updated_at timestamptz)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select t.id, t.code, t.name, m.id, m.role, t.updated_at
  from public.trip_members m
  join public.trips t on t.id = m.trip_id
  where m.user_id = (select auth.uid())
  order by t.updated_at desc;
$$;

create or replace function public.preview_trip(p_code text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  trip_row public.trips;
begin
  if (select auth.uid()) is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into trip_row from public.trips where code = upper(trim(p_code));
  if trip_row.id is null then return null; end if;

  return jsonb_build_object(
    'tripId', trip_row.id,
    'code', trip_row.code,
    'tripName', trip_row.name,
    'availablePeople', coalesce((
      select jsonb_agg(jsonb_build_object('id', id, 'name', name, 'role', role, 'color', color, 'photoUrl', avatar_url) order by added_at)
      from public.trip_members
      where trip_id = trip_row.id and user_id is null and claimed_at is null
    ), '[]'::jsonb)
  );
end;
$$;

create or replace function public.join_trip(p_code text, p_name text)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  trip_row public.trips;
  member_row public.trip_members;
  clean_name text := nullif(trim(p_name), '');
begin
  if (select auth.uid()) is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into trip_row from public.trips where code = upper(trim(p_code)) for update;
  if trip_row.id is null then raise exception 'ROOM_NOT_FOUND'; end if;

  select * into member_row from public.trip_members
  where trip_id = trip_row.id and user_id = (select auth.uid());
  if member_row.id is not null then
    return jsonb_build_object('tripId', trip_row.id, 'code', trip_row.code, 'memberId', member_row.id, 'name', trip_row.name);
  end if;

  if clean_name is null then
    clean_name := coalesce((select display_name from public.profiles where id = (select auth.uid())), 'Member');
  end if;

  select * into member_row from public.trip_members
  where trip_id = trip_row.id and lower(name) = lower(clean_name)
  for update;

  if member_row.id is not null and (member_row.user_id is not null or member_row.claimed_at is not null) then
    raise exception 'PERSON_ALREADY_CLAIMED';
  elsif member_row.id is not null then
    update public.trip_members set
      user_id = (select auth.uid()),
      avatar_url = coalesce(avatar_url, (select avatar_url from public.profiles where id = (select auth.uid()))),
      joined_at = now(),
      claimed_at = now()
    where id = member_row.id returning * into member_row;
  else
    insert into public.trip_members (trip_id, user_id, name, role, color, avatar_url, joined_at, claimed_at)
    values (
      trip_row.id, (select auth.uid()), clean_name, 'member', private.next_member_color(trip_row.id),
      (select avatar_url from public.profiles where id = (select auth.uid())), now(), now()
    )
    returning * into member_row;
  end if;

  update public.trips set updated_at = now() where id = trip_row.id;
  return jsonb_build_object('tripId', trip_row.id, 'code', trip_row.code, 'memberId', member_row.id, 'name', trip_row.name);
end;
$$;

create or replace function public.claim_trip_member(p_code text, p_member_id text)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  trip_row public.trips;
  member_row public.trip_members;
begin
  if (select auth.uid()) is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into trip_row from public.trips where code = upper(trim(p_code)) for update;
  if trip_row.id is null then raise exception 'ROOM_NOT_FOUND'; end if;
  if exists (select 1 from public.trip_members where trip_id = trip_row.id and user_id = (select auth.uid())) then raise exception 'ALREADY_IN_TRIP'; end if;

  select * into member_row from public.trip_members
  where trip_id = trip_row.id and id = p_member_id for update;
  if member_row.id is null then raise exception 'PERSON_NOT_FOUND'; end if;
  if member_row.user_id is not null or member_row.claimed_at is not null then raise exception 'PERSON_ALREADY_CLAIMED'; end if;

  update public.trip_members set
    user_id = (select auth.uid()),
    avatar_url = coalesce(avatar_url, (select avatar_url from public.profiles where id = (select auth.uid()))),
    joined_at = now(),
    claimed_at = now()
  where id = member_row.id returning * into member_row;
  update public.trips set updated_at = now() where id = trip_row.id;
  return jsonb_build_object('tripId', trip_row.id, 'code', trip_row.code, 'memberId', member_row.id, 'name', trip_row.name);
end;
$$;

create or replace function public.get_trip_state(p_code text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, private, pg_temp
as $$
declare
  trip_row public.trips;
  current_member_id text;
begin
  select * into trip_row from public.trips where code = upper(trim(p_code));
  if trip_row.id is null or not private.is_trip_member(trip_row.id) then raise exception 'ROOM_NOT_FOUND_OR_FORBIDDEN'; end if;
  select id into current_member_id from public.trip_members where trip_id = trip_row.id and user_id = (select auth.uid());

  return jsonb_build_object(
    'tripId', trip_row.id,
    'roomCode', trip_row.code,
    'tripName', trip_row.name,
    'currentMemberId', current_member_id,
    'people', coalesce((select jsonb_agg(jsonb_build_object(
      'id', id, 'name', name, 'role', role, 'color', color, 'photoUrl', avatar_url,
      'addedAt', added_at, 'joinedAt', joined_at, 'claimedAt', claimed_at
    ) order by added_at) from public.trip_members where trip_id = trip_row.id), '[]'::jsonb),
    'expenses', coalesce((select jsonb_agg(payload order by created_at) from public.expenses where trip_id = trip_row.id), '[]'::jsonb),
    'accommodations', coalesce((select jsonb_agg(payload order by created_at) from public.accommodations where trip_id = trip_row.id), '[]'::jsonb),
    'vehicles', coalesce((select jsonb_agg(payload order by created_at) from public.vehicles where trip_id = trip_row.id), '[]'::jsonb),
    'comments', coalesce((select jsonb_agg(payload order by created_at) from public.trip_comments where trip_id = trip_row.id), '[]'::jsonb),
    'chatMessages', coalesce((select jsonb_agg(payload order by created_at) from public.chat_messages where trip_id = trip_row.id), '[]'::jsonb),
    'paymentRoutes', coalesce((select jsonb_object_agg(route_key, coalesce(via_member_id, '')) from public.payment_routes where trip_id = trip_row.id), '{}'::jsonb),
    'settlementPayments', coalesce((select jsonb_agg(payload order by created_at) from public.settlement_payments where trip_id = trip_row.id), '[]'::jsonb)
  );
end;
$$;

create or replace function public.save_trip_state(p_code text, p_state jsonb)
returns boolean
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  trip_row public.trips;
  item jsonb;
  route record;
  caller_is_admin boolean;
begin
  select * into trip_row from public.trips where code = upper(trim(p_code)) for update;
  if trip_row.id is null or not private.is_trip_member(trip_row.id) then raise exception 'ROOM_NOT_FOUND_OR_FORBIDDEN'; end if;
  caller_is_admin := private.is_trip_admin(trip_row.id);

  if caller_is_admin and nullif(trim(p_state ->> 'tripName'), '') is not null then
    update public.trips set name = trim(p_state ->> 'tripName') where id = trip_row.id;
  else
    update public.trips set updated_at = now() where id = trip_row.id;
  end if;

  if caller_is_admin and jsonb_typeof(p_state -> 'people') = 'array' then
    for item in select value from jsonb_array_elements(p_state -> 'people') loop
      insert into public.trip_members (id, trip_id, name, role, color, avatar_url, added_at)
      values (
        item ->> 'id', trip_row.id, coalesce(nullif(trim(item ->> 'name'), ''), 'Member'),
        case when item ->> 'role' = 'admin' then 'admin' else 'member' end,
        coalesce(nullif(item ->> 'color', ''), '#6E8D79'), nullif(item ->> 'photoUrl', ''),
        coalesce(nullif(item ->> 'addedAt', '')::timestamptz, now())
      )
      on conflict (id) do update set
        name = excluded.name,
        role = excluded.role,
        color = excluded.color,
        avatar_url = excluded.avatar_url
      where public.trip_members.trip_id = trip_row.id;
    end loop;

    delete from public.trip_members member
    where member.trip_id = trip_row.id
      and member.user_id is distinct from (select auth.uid())
      and not exists (
        select 1 from jsonb_array_elements(p_state -> 'people') person
        where person ->> 'id' = member.id
      );

    if not exists (select 1 from public.trip_members where trip_id = trip_row.id and role = 'admin') then
      update public.trip_members
      set role = 'admin'
      where trip_id = trip_row.id and user_id = (select auth.uid());
    end if;
  end if;

  delete from public.expenses where trip_id = trip_row.id;
  for item in select value from jsonb_array_elements(coalesce(p_state -> 'expenses', '[]'::jsonb)) loop
    insert into public.expenses (trip_id, id, payload) values (trip_row.id, item ->> 'id', item);
  end loop;

  delete from public.accommodations where trip_id = trip_row.id;
  for item in select value from jsonb_array_elements(coalesce(p_state -> 'accommodations', '[]'::jsonb)) loop
    insert into public.accommodations (trip_id, id, payload) values (trip_row.id, item ->> 'id', item);
  end loop;

  delete from public.vehicles where trip_id = trip_row.id;
  for item in select value from jsonb_array_elements(coalesce(p_state -> 'vehicles', '[]'::jsonb)) loop
    insert into public.vehicles (trip_id, id, payload) values (trip_row.id, item ->> 'id', item);
  end loop;

  delete from public.trip_comments where trip_id = trip_row.id;
  for item in select value from jsonb_array_elements(coalesce(p_state -> 'comments', '[]'::jsonb)) loop
    insert into public.trip_comments (trip_id, id, payload) values (trip_row.id, item ->> 'id', item);
  end loop;

  delete from public.chat_messages where trip_id = trip_row.id;
  for item in select value from jsonb_array_elements(coalesce(p_state -> 'chatMessages', '[]'::jsonb)) loop
    insert into public.chat_messages (trip_id, id, payload) values (trip_row.id, item ->> 'id', item);
  end loop;

  delete from public.payment_routes where trip_id = trip_row.id;
  for route in select key, value from jsonb_each_text(coalesce(p_state -> 'paymentRoutes', '{}'::jsonb)) loop
    insert into public.payment_routes (trip_id, route_key, via_member_id) values (trip_row.id, route.key, nullif(route.value, ''));
  end loop;

  delete from public.settlement_payments where trip_id = trip_row.id;
  for item in select value from jsonb_array_elements(coalesce(p_state -> 'settlementPayments', '[]'::jsonb)) loop
    insert into public.settlement_payments (trip_id, id, payload) values (trip_row.id, item ->> 'id', item);
  end loop;

  return true;
end;
$$;

revoke all on function public.create_trip(text, text) from public;
revoke all on function public.list_my_trips() from public;
revoke all on function public.preview_trip(text) from public;
revoke all on function public.join_trip(text, text) from public;
revoke all on function public.claim_trip_member(text, text) from public;
revoke all on function public.get_trip_state(text) from public;
revoke all on function public.save_trip_state(text, jsonb) from public;
revoke all on function public.create_trip(text, text) from anon;
revoke all on function public.list_my_trips() from anon;
revoke all on function public.preview_trip(text) from anon;
revoke all on function public.join_trip(text, text) from anon;
revoke all on function public.claim_trip_member(text, text) from anon;
revoke all on function public.get_trip_state(text) from anon;
revoke all on function public.save_trip_state(text, jsonb) from anon;
grant execute on function public.create_trip(text, text) to authenticated;
grant execute on function public.list_my_trips() to authenticated;
grant execute on function public.preview_trip(text) to authenticated;
grant execute on function public.join_trip(text, text) to authenticated;
grant execute on function public.claim_trip_member(text, text) to authenticated;
grant execute on function public.get_trip_state(text) to authenticated;
grant execute on function public.save_trip_state(text, jsonb) to authenticated;

grant usage on schema public to authenticated;
revoke all on public.profiles, public.trips, public.trip_members,
  public.expenses, public.accommodations, public.vehicles, public.trip_comments,
  public.chat_messages, public.payment_routes, public.settlement_payments from anon;
grant select, insert, update, delete on public.profiles, public.trips, public.trip_members,
  public.expenses, public.accommodations, public.vehicles, public.trip_comments,
  public.chat_messages, public.payment_routes, public.settlement_payments to authenticated;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

drop policy if exists "Avatar images are publicly readable" on storage.objects;
create policy "Avatar images are publicly readable" on storage.objects
for select to public using (bucket_id = 'avatars');
drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar" on storage.objects
for insert to authenticated with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar" on storage.objects
for update to authenticated using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "Users can delete their own avatar" on storage.objects;
create policy "Users can delete their own avatar" on storage.objects
for delete to authenticated using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

do $$
declare
  table_name text;
begin
  foreach table_name in array array['trips', 'trip_members', 'expenses', 'accommodations', 'vehicles', 'trip_comments', 'chat_messages', 'payment_routes', 'settlement_payments']
  loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = table_name
    ) then
      execute format('alter publication supabase_realtime add table public.%I', table_name);
    end if;
  end loop;
end;
$$;
