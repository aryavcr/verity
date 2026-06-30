import { createServerSupabase } from "./supabase-server";
import { encrypt, decrypt } from "@/lib/security/byok-crypto";

const PROVIDERS = [
  "openai",
  "anthropic",
  "google",
  "groq",
  "openrouter",
] as const;
export type Provider = (typeof PROVIDERS)[number];
export function isProvider(v: string): v is Provider {
  return (PROVIDERS as readonly string[]).includes(v);
}

/** Presence + masked last-4 for every provider, never returns plaintext. */
export async function getKeyPresence() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const out = Object.fromEntries(
    PROVIDERS.map((p) => [p, { present: false, last4: null }]),
  ) as Record<Provider, { present: boolean; last4: string | null }>;
  if (!user) return out;
  const { data } = await supabase
    .from("user_api_keys")
    .select("provider, last4")
    .eq("user_id", user.id);
  for (const row of data ?? []) {
    if (isProvider(row.provider))
      out[row.provider] = { present: true, last4: row.last4 };
  }
  return out;
}

export async function saveKey(provider: Provider, plaintext: string) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No session");
  const ciphertext = encrypt(plaintext);
  const last4 = plaintext.slice(-4);
  const { error } = await supabase
    .from("user_api_keys")
    .upsert(
      {
        user_id: user.id,
        provider,
        ciphertext,
        last4,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,provider" },
    );
  if (error) throw error;
}

export async function deleteKey(provider: Provider) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from("user_api_keys")
    .delete()
    .eq("user_id", user.id)
    .eq("provider", provider);
}

/** this is for server only: decrypt one provider's key for the current request & returns undefined if not set. */
export async function getDecryptedKey(
  provider: string,
): Promise<string | undefined> {
  if (!isProvider(provider)) return undefined;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return undefined;
  const { data } = await supabase
    .from("user_api_keys")
    .select("ciphertext")
    .eq("user_id", user.id)
    .eq("provider", provider)
    .maybeSingle();
  if (!data?.ciphertext) return undefined;
  try {
    return decrypt(data.ciphertext);
  } catch {
    return undefined;
  }
}
