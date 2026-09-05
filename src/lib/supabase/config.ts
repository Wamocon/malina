// Der Prototyp laeuft in zwei Betriebsarten:
//
//   1. Demo-Modus  - ohne Supabase-Umgebung. Alle Ansichten zeigen die
//                    Mock-Daten aus src/lib/domain/, die Rollenumschaltung
//                    laeuft ueber localStorage. `npm run dev` genuegt.
//   2. DB-Modus    - mit gesetzter Supabase-Umgebung. Echte Anmeldung, echte
//                    Daten, RLS-gepruefte Schreibvorgaenge (Meilenstein B).
//
// Die Weiche haengt allein an den beiden oeffentlichen Variablen, damit sie
// server- wie clientseitig identisch beantwortet wird.

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url && anon && !url.includes("placeholder") && !anon.includes("placeholder"),
  );
}

// Quelle der angezeigten Daten - fuer den Hinweis-Badge in den Modulen.
export type Datenquelle = "db" | "demo";
