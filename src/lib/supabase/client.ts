import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

// Browser-Client (anon key). Fallback-URL statt `?? ''`, damit ein fehlender
// Env-Wert nicht schon beim Modul-Load `supabaseUrl is required` wirft und alle
// SSR-Routen crasht (siehe .github/copilot-instructions.md Regel 11).
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key",
  );
}
