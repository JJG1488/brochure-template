import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabaseAdmin: SupabaseClient<any, any, any> | null = null;

/**
 * Check if we're in a build environment without runtime env vars
 * Prevents errors during Next.js static generation
 */
export function isBuildTime(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !supabaseUrl || supabaseUrl === "";
}

/**
 * Get the Supabase admin client (uses service role for full access)
 * Returns untyped client since we don't have generated database types
 * CACHED - Use createFreshAdminClient() when stale data is a concern
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSupabaseAdmin(): SupabaseClient<any, any, any> | null {
  // During build time, return null to avoid errors
  if (isBuildTime()) {
    return null;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error("[Supabase] CRITICAL: Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
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
 * Create a fresh admin client (no caching)
 * Use when stale data is a problem - settings, portfolio items, testimonials
 *
 * This bypasses Supabase PostgREST caching by:
 * 1. Creating a new client instance (no singleton)
 * 2. Setting cache: 'no-store' on fetch requests
 * 3. Adding Cache-Control headers to prevent HTTP caching
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createFreshAdminClient(): SupabaseClient<any, any, any> | null {
  if (isBuildTime()) {
    return null;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error("[Supabase] CRITICAL: Missing Supabase credentials for fresh admin client.");
    return null;
  }

  // Force no caching at fetch level to bypass Supabase PostgREST caching
  return createSupabaseClient(url, serviceKey, {
    auth: { persistSession: false },
    global: {
      fetch: (fetchUrl, options = {}) => {
        // Properly merge headers - options.headers can be Headers object or plain object
        const existingHeaders = options.headers instanceof Headers
          ? Object.fromEntries(options.headers.entries())
          : (options.headers || {});

        return fetch(fetchUrl, {
          ...options,
          cache: 'no-store',
          headers: {
            ...existingHeaders,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          },
        });
      },
    },
  });
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
