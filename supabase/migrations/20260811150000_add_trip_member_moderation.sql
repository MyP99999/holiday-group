create table if not exists public.trip_bans (
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  member_id text not null,
  member_name text not null,
  banned_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (trip_id, user_id)
);

create index if not exists trip_bans_member_id_idx on public.trip_bans (trip_id, member_id);

alter table public.trip_bans enable row level security;
revoke all on public.trip_bans from public, anon, authenticated;

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
  if exists (
    select 1 from public.trip_bans
    where trip_id = trip_row.id and user_id = (select auth.uid())
  ) then raise exception 'TRIP_BANNED'; end if;

  return jsonb_build_object(
    'tripId', trip_row.id,
    'code', trip_row.code,
    'tripName', trip_row.name,
    'availablePeople', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', id,
        'name', name,
        'role', role,
        'color', color,
        'photoUrl', avatar_url,
        'isClaimed', (user_id is not null or claimed_at is not null)
      ) order by added_at)
      from public.trip_members
      where trip_id = trip_row.id
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
  if exists (
    select 1 from public.trip_bans
    where trip_id = trip_row.id and user_id = (select auth.uid())
  ) then raise exception 'TRIP_BANNED'; end if;

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
  if exists (
    select 1 from public.trip_bans
    where trip_id = trip_row.id and user_id = (select auth.uid())
  ) then raise exception 'TRIP_BANNED'; end if;
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

create or replace function public.moderate_trip_member(p_code text, p_member_id text, p_action text)
returns boolean
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  trip_row public.trips;
  member_row public.trip_members;
  clean_action text := lower(trim(coalesce(p_action, '')));
  affected_rows integer;
begin
  if (select auth.uid()) is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into trip_row from public.trips where code = upper(trim(p_code)) for update;
  if trip_row.id is null or not private.is_trip_admin(trip_row.id) then raise exception 'ROOM_NOT_FOUND_OR_FORBIDDEN'; end if;
  if clean_action not in ('kick', 'ban', 'unban') then raise exception 'INVALID_MODERATION_ACTION'; end if;

  select * into member_row
  from public.trip_members
  where trip_id = trip_row.id and id = p_member_id
  for update;
  if member_row.id is null then raise exception 'MEMBER_NOT_FOUND'; end if;

  if clean_action = 'unban' then
    delete from public.trip_bans where trip_id = trip_row.id and member_id = member_row.id;
    get diagnostics affected_rows = row_count;
    if affected_rows = 0 then raise exception 'BAN_NOT_FOUND'; end if;
    update public.trips set updated_at = now() where id = trip_row.id;
    return true;
  end if;

  if member_row.user_id is null or member_row.claimed_at is null then raise exception 'MEMBER_NOT_CLAIMED'; end if;
  if member_row.user_id = (select auth.uid()) then raise exception 'CANNOT_MODERATE_SELF'; end if;

  if clean_action = 'ban' then
    insert into public.trip_bans (trip_id, user_id, member_id, member_name, banned_by)
    values (trip_row.id, member_row.user_id, member_row.id, member_row.name, (select auth.uid()))
    on conflict (trip_id, user_id) do update set
      member_id = excluded.member_id,
      member_name = excluded.member_name,
      banned_by = excluded.banned_by,
      created_at = now();
  end if;

  update public.trip_members set
    user_id = null,
    avatar_url = null,
    joined_at = null,
    claimed_at = null,
    account_holder = null,
    iban = null,
    payment_methods = '[]'::jsonb,
    payment_note = null
  where trip_id = trip_row.id and id = member_row.id;

  update public.trips set updated_at = now() where id = trip_row.id;
  return true;
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
      'id', m.id, 'name', m.name, 'role', m.role, 'color', m.color, 'photoUrl', m.avatar_url,
      'accountHolder', coalesce(m.account_holder, ''), 'iban', coalesce(m.iban, ''),
      'paymentMethods', coalesce(m.payment_methods, '[]'::jsonb), 'paymentNote', coalesce(m.payment_note, ''),
      'addedAt', m.added_at, 'joinedAt', m.joined_at, 'claimedAt', m.claimed_at,
      'isBanned', (m.user_id is null and exists (
        select 1 from public.trip_bans b where b.trip_id = m.trip_id and b.member_id = m.id
      )),
      'bannedAt', (select max(b.created_at) from public.trip_bans b where b.trip_id = m.trip_id and b.member_id = m.id)
    ) order by m.added_at) from public.trip_members m where m.trip_id = trip_row.id), '[]'::jsonb),
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

revoke all on function public.preview_trip(text) from public, anon;
grant execute on function public.preview_trip(text) to authenticated;
revoke all on function public.join_trip(text, text) from public, anon;
grant execute on function public.join_trip(text, text) to authenticated;
revoke all on function public.claim_trip_member(text, text) from public, anon;
grant execute on function public.claim_trip_member(text, text) to authenticated;
revoke all on function public.moderate_trip_member(text, text, text) from public, anon;
grant execute on function public.moderate_trip_member(text, text, text) to authenticated;
revoke all on function public.get_trip_state(text) from public, anon;
grant execute on function public.get_trip_state(text) to authenticated;
