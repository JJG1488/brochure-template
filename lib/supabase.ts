import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabaseAdmin: SupabaseClient<any, any, any> | null = null;

/**
 * Get the Supabase admin client (uses service role for full access)
 * Returns untyped client since we don't have generated database types
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSupabaseAdmin(): SupabaseClient<any, any, any> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error("Missing Supabase credentials");
    return null;
  }

  if (!supabaseAdmin) {
    supabaseAdmin = createSupabaseClient(url, serviceKey, {
      auth: { persistSession: false },
    });
  }

  return supabaseAdmin;
}

/**
 * Get the store ID from environment
 */
export function getStoreId(): string | null {
  return process.env.NEXT_PUBLIC_STORE_ID || null;
}

/**
 * Create a public Supabase client (anon key, for client-side)
 * Returns untyped client since we don't have generated database types
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createClient(): SupabaseClient<any, any, any> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createSupabaseClient(url, anonKey);
}
