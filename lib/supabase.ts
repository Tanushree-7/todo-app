import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-side only client. Uses the service role key so API routes
// can read/write the todos table directly (bypasses Row Level Security).
// NEVER import this file from a "use client" component — the service
// role key must stay on the server.
//
// The client is created lazily (on first use inside a request) rather
// than at module load time, so `next build` succeeds even before env
// vars are configured (e.g. the very first Vercel deploy before you've
// added them). Requests will fail clearly if they're still missing.

let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase env vars. Make sure NEXT_PUBLIC_SUPABASE_URL and " +
        "SUPABASE_SERVICE_ROLE_KEY are set (see .env.example)."
    );
  }

  cached = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
  return cached;
}
