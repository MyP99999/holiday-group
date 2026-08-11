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

revoke all on function public.preview_trip(text) from public, anon;
grant execute on function public.preview_trip(text) to authenticated;
