const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export type SupabaseEnv = {
  url: string;
  anonKey: string;
};

/** Returns Supabase config when both public env vars are set; otherwise null. */
export function getSupabaseEnv(): SupabaseEnv | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }

  return {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
  };
}

/** Same as getSupabaseEnv but throws with a setup hint when vars are missing. */
export function requireSupabaseEnv(): SupabaseEnv {
  const env = getSupabaseEnv();

  if (!env) {
    throw new Error(
      "Missing Supabase environment variables. Copy .env.example to .env.local and add your project credentials.",
    );
  }

  return env;
}

/** Names of missing Supabase env vars (for health checks and diagnostics). */
export function getMissingSupabaseEnvVars(): string[] {
  const missing: string[] = [];

  if (!SUPABASE_URL) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!SUPABASE_ANON_KEY) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return missing;
}
