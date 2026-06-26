import { createBrowserClient } from "@supabase/ssr";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True once real Supabase credentials are present in the environment. */
export const hasSupabaseEnv = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Browser-side Supabase client (persistent session lives in cookies). */
export function createClient() {
  return createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
}
