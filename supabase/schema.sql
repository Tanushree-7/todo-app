-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query)
-- to create the table this app needs.

create table if not exists todos (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

-- Optional but recommended: enable Row Level Security.
-- The app talks to Supabase using the service role key from a server-side
-- API route, which bypasses RLS, so this table stays private from the
-- browser's anon key even with RLS on and no policies defined.
alter table todos enable row level security;
