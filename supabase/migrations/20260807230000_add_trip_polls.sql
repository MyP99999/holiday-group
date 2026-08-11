create table if not exists public.trip_polls (
  trip_id uuid not null references public.trips(id) on delete cascade,
  id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (trip_id, id)
);

create index if not exists trip_polls_trip_id_idx on public.trip_polls (trip_id);
alter table public.trip_polls enable row level security;

drop policy if exists "Trip members can view trip_polls" on public.trip_polls;
create policy "Trip members can view trip_polls" on public.trip_polls
for select to authenticated using ((select private.is_trip_member(trip_id)));
drop policy if exists "Trip members can add trip_polls" on public.trip_polls;
create policy "Trip members can add trip_polls" on public.trip_polls
for insert to authenticated with check ((select private.is_trip_member(trip_id)));
drop policy if exists "Trip members can update trip_polls" on public.trip_polls;
create policy "Trip members can update trip_polls" on public.trip_polls
for update to authenticated using ((select private.is_trip_member(trip_id))) with check ((select private.is_trip_member(trip_id)));
drop policy if exists "Trip members can remove trip_polls" on public.trip_polls;
create policy "Trip members can remove trip_polls" on public.trip_polls
for delete to authenticated using ((select private.is_trip_member(trip_id)));

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
    'flights', coalesce((select jsonb_agg(payload order by created_at) from public.flights where trip_id = trip_row.id), '[]'::jsonb),
    'polls', coalesce((select jsonb_agg(payload order by created_at desc) from public.trip_polls where trip_id = trip_row.id), '[]'::jsonb),
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
      update public.trip_members set role = 'admin'
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

  delete from public.flights where trip_id = trip_row.id;
  for item in select value from jsonb_array_elements(coalesce(p_state -> 'flights', '[]'::jsonb)) loop
    insert into public.flights (trip_id, id, payload) values (trip_row.id, item ->> 'id', item);
  end loop;

  delete from public.trip_polls where trip_id = trip_row.id;
  for item in select value from jsonb_array_elements(coalesce(p_state -> 'polls', '[]'::jsonb)) loop
    insert into public.trip_polls (trip_id, id, payload) values (trip_row.id, item ->> 'id', item);
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

revoke all on function public.get_trip_state(text) from public, anon;
revoke all on function public.save_trip_state(text, jsonb) from public, anon;
grant execute on function public.get_trip_state(text) to authenticated;
grant execute on function public.save_trip_state(text, jsonb) to authenticated;
revoke all on public.trip_polls from anon;
grant select, insert, update, delete on public.trip_polls to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'trip_polls'
  ) then
    alter publication supabase_realtime add table public.trip_polls;
  end if;
end;
$$;
