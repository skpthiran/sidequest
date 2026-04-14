-- Create invites table
create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  pod_id uuid not null references public.pods(id) on delete cascade,
  inviter_id uuid not null references public.users(id) on delete cascade,
  email text null,
  token uuid not null unique default gen_random_uuid(),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'expired')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '7 days'
);

-- Index for fast token lookup
create index if not exists invites_token_idx on public.invites(token);

-- RLS
alter table public.invites enable row level security;

-- Anyone can read an invite by token (for the public invite page)
create policy "Public can read invites by token"
on public.invites for select
to public
using (true);

-- Authenticated users can create invites for their own pod
create policy "Pod members can create invites"
on public.invites for insert
to authenticated
with check (
  inviter_id = auth.uid() and
  exists (
    select 1 from public.pod_members
    where pod_members.pod_id = invites.pod_id
    and pod_members.user_id = auth.uid()
  )
);

-- Authenticated users can update invite status (to accept)
create policy "Authenticated users can accept invites"
on public.invites for update
to authenticated
using (true);
