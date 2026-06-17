import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**rls-scoped to the current user (reads/refreshes the session cookie), used in route handlers & rsc. */
export async function createServerSupabase() {
  const jar = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => jar.getAll(),
        setAll: (toSet) => {
          try {
            toSet.forEach(({ name, value, options }) => jar.set(name, value, options));
          } catch {
            // called from a server componen so middleware will refresh instead, safe to ignore.
          }
        },
      },
    },
  );
}

/**bypass RLS(service role). Use only server-side for: public gallery feed, /run/<slug> share page, prune & never expose to client. */
export function createServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
