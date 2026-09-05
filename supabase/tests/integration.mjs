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

// --- 4. Auth: Anmeldung und Profilrolle ------------------------------------
// Voraussetzung: `npm run db:seed-auth` hat die sechs Demo-Konten angelegt.
async function anmelden(email) {
  const client = createClient(url, anonKey, { auth: { persistSession: false } });
  const { error } = await client.auth.signInWithPassword({
    email,
    password: "MalinaDemo2026!",
  });
  if (error) return { client: null, fehler: error.message };
  return { client, fehler: null };
}

const { client: leitung, fehler: leitungFehler } = await anmelden("leitung@malina.demo");
const { client: brigade, fehler: brigadeFehler } = await anmelden("brigade@malina.demo");

check("Auth: Betriebsleitung meldet sich an", !!leitung, leitungFehler ?? "");
check("Auth: Brigade meldet sich an", !!brigade, brigadeFehler ?? "");

if (leitung && brigade) {
  const {
    data: { user: leitungUser },
  } = await leitung.auth.getUser();
  const { data: profil } = await leitung
    .from("profiles")
    .select("full_name, role")
    .eq("auth_user_id", leitungUser.id)
    .maybeSingle();
  check(
    "Auth: Profil traegt die Rolle betriebsleitung",
    profil?.role === "betriebsleitung",
    `Rolle: ${profil?.role}`,
  );

  // --- 5. RLS-Schreibrechte je Rolle ---------------------------------------
  const { data: block } = await admin
    .from("reihenbloecke")
    .select("id, code, status")
    .neq("status", "wartezeitgesperrt")
    .limit(1)
    .single();

  const { data: brigadeUpdate, error: brigadeUpdateFehler } = await brigade
    .from("reihenbloecke")
    .update({ status: "ruhend" })
    .eq("id", block.id)
    .select("id");
  check(
    "RLS: Brigade darf den Reihenblockstatus nicht aendern",
    !brigadeUpdateFehler && (brigadeUpdate?.length ?? 0) === 0,
    brigadeUpdateFehler?.message ?? `geaenderte Zeilen: ${brigadeUpdate?.length}`,
  );

  const zielStatus = block.status === "erntereif" ? "bepflanzt" : "erntereif";
  const { data: leitungUpdate, error: leitungUpdateFehler } = await leitung
    .from("reihenbloecke")
    .update({ status: zielStatus })
    .eq("id", block.id)
    .select("id, status");
  check(
    "RLS: Betriebsleitung darf den Reihenblockstatus aendern",
    !leitungUpdateFehler && leitungUpdate?.[0]?.status === zielStatus,
    leitungUpdateFehler?.message ?? "",
  );
  await admin.from("reihenbloecke").update({ status: block.status }).eq("id", block.id);

  const { data: mittel } = await admin
    .from("psm_mittel")
    .select("id, wartezeit_tage")
    .limit(1)
    .single();

  const { error: brigadeBehandlungFehler } = await brigade
    .from("pflanzenschutz_behandlungen")
    .insert({
      reihenblock_id: block.id,
      psm_mittel_id: mittel.id,
      behandelt_am: new Date().toISOString().slice(0, 10),
      wartezeit_tage: mittel.wartezeit_tage,
    });
  check(
    "RLS: Brigade darf keine Behandlung erfassen",
    brigadeBehandlungFehler?.code === "42501",
    brigadeBehandlungFehler?.code ?? "kein Fehler",
  );

  // --- 6. Sperrlogik in der Datenbank --------------------------------------
  const { data: behandlung, error: behandlungFehler } = await leitung
    .from("pflanzenschutz_behandlungen")
    .insert({
      reihenblock_id: block.id,
      psm_mittel_id: mittel.id,
      behandelt_am: new Date().toISOString().slice(0, 10),
      wartezeit_tage: mittel.wartezeit_tage,
    })
    .select("id, freigabe_am")
    .single();
  check(
    "Sperre: Betriebsleitung erfasst eine Behandlung",
    !behandlungFehler && !!behandlung?.freigabe_am,
    behandlungFehler?.message ?? "",
  );

  const { error: entsperrFehler } = await leitung
    .from("reihenbloecke")
    .update({ status: "erntereif" })
    .eq("id", block.id)
    .select("id");
  check(
    "Sperre: vorzeitiger Statuswechsel wird abgelehnt",
    entsperrFehler?.code === "23514",
    entsperrFehler?.code ?? "kein Fehler",
  );

  const { error: aufgabeFehler } = await leitung.from("pflueckaufgaben").insert({
    code: `__it_${Date.now()}`,
    reihenblock_id: block.id,
    zielmenge_kg: 10,
  });
  check(
    "Sperre: keine Pflueckaufgabe auf gesperrtem Reihenblock",
    aufgabeFehler?.code === "23514",
    aufgabeFehler?.code ?? "kein Fehler",
  );

  const { error: rpcFehler } = await leitung.rpc("reihenblock_freigeben", {
    p_block: block.id,
    p_status: "erntereif",
  });
  check(
    "Sperre: Freigabe vor Ablauf der Wartezeit wird abgelehnt",
    rpcFehler?.code === "23514",
    rpcFehler?.code ?? "kein Fehler",
  );

  // Wartezeit rueckdatieren, damit die regulaere Freigabe pruefbar wird.
  await admin
    .from("pflanzenschutz_behandlungen")
    .update({ behandelt_am: "2026-01-01" })
    .eq("id", behandlung.id);

  const { error: freigabeFehler } = await leitung.rpc("reihenblock_freigeben", {
    p_block: block.id,
    p_status: "erntereif",
  });
  const { data: nachFreigabe } = await admin
    .from("reihenbloecke")
    .select("status")
    .eq("id", block.id)
    .single();
  check(
    "Sperre: Freigabe nach Ablauf der Wartezeit setzt den Status zurueck",
    !freigabeFehler && nachFreigabe?.status === "erntereif",
    freigabeFehler?.message ?? `Status: ${nachFreigabe?.status}`,
  );

  // Cleanup: Testbehandlung entfernen, Ursprungsstatus wiederherstellen.
  await admin.from("pflanzenschutz_behandlungen").delete().eq("id", behandlung.id);
  await admin.from("reihenbloecke").update({ status: block.status }).eq("id", block.id);
  await admin.from("audit_events").delete().eq("ressource_id", block.id);
}

console.log("");
if (failures > 0) {
  console.error(`${failures} Test(s) fehlgeschlagen.`);
  process.exit(1);
}
console.log("Alle Integrationstests gruen.");
