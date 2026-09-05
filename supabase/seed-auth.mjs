// =============================================================================
// Malina - Demo-Benutzer anlegen (Meilenstein B)
// =============================================================================
// Ausfuehren:  npm run db:seed-auth
//              (bzw. node --env-file=.env.local supabase/seed-auth.mjs)
//
// Legt je Malina-Rolle genau einen Auth-Benutzer an. Das Profil entsteht ueber
// den Trigger public.handle_new_auth_user() aus der Migration
// 20260905120000_auth_und_schreibrechte.sql - Rolle und Name kommen aus den
// user_metadata.
//
// Idempotent: vorhandene Benutzer werden aktualisiert, nicht dupliziert.
// Reine Demo-Zugaenge fuer die lokale Instanz - kein Produktivgeheimnis.
// =============================================================================

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Fehlende Env-Variablen. Aufruf: node --env-file=.env.local supabase/seed-auth.mjs",
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

export const demoPasswort = "MalinaDemo2026!";

const demoBenutzer = [
  { email: "admin@malina.demo", role: "admin", full_name: "Aigerim Serikbaj" },
  { email: "leitung@malina.demo", role: "betriebsleitung", full_name: "Daniyar Omarov" },
  { email: "buchhaltung@malina.demo", role: "buchhaltung", full_name: "Saltanat Nurlan" },
  { email: "brigade@malina.demo", role: "brigade", full_name: "Ruslan Beisenov" },
  { email: "erzeuger@malina.demo", role: "erzeuger", full_name: "Rashid Baitulin" },
  { email: "kunde@malina.demo", role: "kunde", full_name: "Almaty Fresh Market" },
];

async function findeBenutzer(email) {
  // listUsers paginiert; bei sechs Demo-Konten reicht die erste Seite.
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (error) throw error;
  return data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
}

async function main() {
  let angelegt = 0;
  let aktualisiert = 0;

  for (const eintrag of demoBenutzer) {
    const vorhanden = await findeBenutzer(eintrag.email);

    if (vorhanden) {
      const { error } = await admin.auth.admin.updateUserById(vorhanden.id, {
        password: demoPasswort,
        email_confirm: true,
        user_metadata: { role: eintrag.role, full_name: eintrag.full_name },
      });
      if (error) throw error;

      // Der Trigger greift nur beim INSERT - beim Update das Profil nachziehen.
      const { error: profilFehler } = await admin
        .from("profiles")
        .update({
          role: eintrag.role,
          full_name: eintrag.full_name,
          email: eintrag.email,
        })
        .eq("auth_user_id", vorhanden.id);
      if (profilFehler) throw profilFehler;

      aktualisiert += 1;
      console.log(`AKTUALISIERT  ${eintrag.email.padEnd(26)} ${eintrag.role}`);
    } else {
      const { error } = await admin.auth.admin.createUser({
        email: eintrag.email,
        password: demoPasswort,
        email_confirm: true,
        user_metadata: { role: eintrag.role, full_name: eintrag.full_name },
      });
      if (error) throw error;
      angelegt += 1;
      console.log(`ANGELEGT      ${eintrag.email.padEnd(26)} ${eintrag.role}`);
    }
  }

  // Die Brigade-Rolle bekommt eine echte Brigadenzuordnung, damit die
  // Feld-Ansichten gefiltert werden koennen.
  const { data: brigade } = await admin
    .from("brigaden")
    .select("id")
    .order("name")
    .limit(1)
    .maybeSingle();

  if (brigade) {
    await admin
      .from("profiles")
      .update({ brigade_id: brigade.id })
      .eq("email", "brigade@malina.demo");
  }

  console.log(
    `\n${angelegt} Benutzer angelegt, ${aktualisiert} aktualisiert. Passwort fuer alle: ${demoPasswort}`,
  );
}

main().catch((error) => {
  console.error("Seed fehlgeschlagen:", error.message ?? error);
  process.exit(1);
});
