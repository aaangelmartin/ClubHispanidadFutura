import "server-only";
import { createClient } from "@supabase/supabase-js";

// Cliente de servidor con service role. Solo se usa en Server Components y Server Actions.
// Nunca importar desde un componente "use client".
export function db() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  return createClient(url, key, { auth: { persistSession: false } });
}
