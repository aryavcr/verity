import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

/** Client-side: current user's id from the live session(throw if somehow absent) */
export async function getCurrentUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("No session");
  return data.user.id;
}

/** Client-side: is the current user anonymous? for deciding run-retention cap. */
export async function isAnonymousUser(): Promise<boolean> {
  const { data } = await supabase.auth.getUser();
  return Boolean(data.user?.is_anonymous);
}
