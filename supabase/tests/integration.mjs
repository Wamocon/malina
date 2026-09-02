// =============================================================================
// Malina - Supabase Integrationstest (lokal)
// =============================================================================
// Ausfuehren:  node --env-file=.env.local supabase/tests/integration.mjs
//
// Prueft gegen die laufende lokale Supabase-Instanz:
//   1. Round-Trip (INSERT + SELECT + Assert + Cleanup) auf einer Kerntabelle
//   2. RLS: anon darf Katalogdaten lesen, sensible Finanzdaten nicht
//   3. Trigger: Pflanzenschutz-Behandlung sperrt den Reihenblock (wartezeitgesperrt)
// =============================================================================

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey || !serviceKey) {
  console.error("Fehlende Env-Variablen. Aufruf: node --env-file=.env.local supabase/tests/integration.mjs");
  process.exit(1);
}

const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
const anon = createClient(url, anonKey, { auth: { persistSession: false } });

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` - ${detail}` : ""}`);
  if (!ok) failures += 1;
}

// --- 1. Round-Trip -----------------------------------------------------------
{
  const titel = `__it_${Date.now()}`;
  const { data: inserted, error: insErr } = await admin
    .from("schulungsvideos")
    .insert({ titel, thema: "Test", dauer_sekunden: 1, sprachen: ["de"] })
    .select()
    .single();
  check("Round-Trip INSERT", !insErr && inserted?.titel === titel, insErr?.message);

  const { data: read, error: readErr } = await admin
    .from("schulungsvideos")
    .select("id, titel")
    .eq("titel", titel)
    .single();
  check("Round-Trip SELECT stimmt ueberein", !readErr && read?.titel === titel, readErr?.message);

  if (inserted?.id) {
    const { error: delErr } = await admin.from("schulungsvideos").delete().eq("id", inserted.id);
    check("Round-Trip CLEANUP", !delErr, delErr?.message);
  }
}

// --- 2. RLS ----------------------------------------------------------------
{
  const { data: sorten, error: sErr } = await anon.from("sorten").select("id").limit(5);
  check("RLS: anon liest Katalog (sorten)", !sErr && (sorten?.length ?? 0) > 0, sErr?.message);

  const { data: ledger, error: lErr } = await anon
    .from("finance_ledger_entries")
    .select("id")
    .limit(5);
  // RLS liefert bei fehlender Policy leere Menge (kein Fehler).
  check(
    "RLS: anon sieht keine Finanzdaten",
    !lErr && (ledger?.length ?? 0) === 0,
    lErr?.message ?? `sichtbare Zeilen: ${ledger?.length}`,
  );
}

// --- 3. Trigger: Behandlung sperrt Reihenblock ----------------------------
{
  // Einen aktuell nicht gesperrten Block waehlen.
  const { data: block } = await admin
    .from("reihenbloecke")
    .select("id, code, status")
    .neq("status", "wartezeitgesperrt")
    .limit(1)
    .single();

  const { data: mittel } = await admin.from("psm_mittel").select("id").limit(1).single();

  const { data: behandlung, error: bErr } = await admin
    .from("pflanzenschutz_behandlungen")
    .insert({
      reihenblock_id: block.id,
      psm_mittel_id: mittel.id,
      behandelt_am: "2026-09-02",
      wartezeit_tage: 3,
    })
    .select()
    .single();
  check("Trigger: Behandlung angelegt", !bErr && !!behandlung?.freigabe_am, bErr?.message);

  const { data: afterBlock } = await admin
    .from("reihenbloecke")
    .select("status")
    .eq("id", block.id)
    .single();
  check(
    "Trigger: Reihenblock ist jetzt wartezeitgesperrt",
    afterBlock?.status === "wartezeitgesperrt",
    `Status: ${afterBlock?.status}`,
  );

  // Cleanup: Testbehandlung entfernen, Ursprungsstatus wiederherstellen.
  if (behandlung?.id) {
    await admin.from("pflanzenschutz_behandlungen").delete().eq("id", behandlung.id);
    await admin.from("reihenbloecke").update({ status: block.status }).eq("id", block.id);
  }
}

console.log("");
if (failures > 0) {
  console.error(`${failures} Test(s) fehlgeschlagen.`);
  process.exit(1);
}
console.log("Alle Integrationstests gruen.");
