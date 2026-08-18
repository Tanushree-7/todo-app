# To-Do App

A simple to-do list built with Next.js (App Router), TypeScript, and
Tailwind CSS, backed by a Supabase Postgres database.

## Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- Supabase (Postgres) — data storage, accessed via Next.js API routes

## 1. Set up the database (Supabase)

1. Create a free project at https://supabase.com.
2. In the project, open **SQL Editor -> New query**, paste the contents of
   `supabase/schema.sql`, and run it. This creates the `todos` table.
3. Go to **Project Settings -> API** and copy:
   - **Project URL**
   - **anon public** key
   - **service_role** key (keep this secret)

## 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the three values from step 1:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## 3. Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## 4. Deploy to Vercel

1. Push this project to a GitHub repo.
2. Go to https://vercel.com/new and import the repo (Next.js is
   auto-detected, no build config needed).
3. Before deploying (or after, under **Project Settings -> Environment
   Variables**), add the same 3 variables from `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy. Vercel builds and hosts the app; the API routes under
   `app/api/todos` talk to Supabase on the server side.

If you add or change env vars after the first deploy, redeploy (or use
**Deployments -> ... -> Redeploy**) so the new values take effect.

## Project structure

```
app/
  api/todos/route.ts        GET (list) / POST (create)
  api/todos/[id]/route.ts   PATCH (update) / DELETE
  components/TodoApp.tsx    UI (client component)
  page.tsx                  Renders TodoApp
lib/supabase.ts             Server-side Supabase client (service role key)
supabase/schema.sql         SQL to create the todos table
```
