"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";

export interface AnmeldeStatus {
  fehler: "ungueltig" | "unbekannt" | "eingabe" | null;
}

function sicheresLocale(wert: FormDataEntryValue | null): string {
  const kandidat = String(wert ?? "");
  return (routing.locales as readonly string[]).includes(kandidat)
    ? kandidat
    : routing.defaultLocale;
}

// Nur interne Pfade als Rueckkehrziel zulassen (kein Open Redirect).
// "//fremd.example" und "/\fremd.example" sind protokollrelative Adressen und
// fuehren aus der Anwendung heraus - beide Zeichen an zweiter Stelle sperren.
function sicheresZiel(wert: FormDataEntryValue | null, locale: string): string {
  const kandidat = String(wert ?? "");
  const intern =
    kandidat.startsWith("/") &&
    kandidat[1] !== "/" &&
    kandidat[1] !== "\\" &&
    !kandidat.includes("\\");
  return intern ? kandidat : `/${locale}/dashboard`;
}

export async function anmelden(
  _status: AnmeldeStatus,
  formData: FormData,
): Promise<AnmeldeStatus> {
  const email = String(formData.get("email") ?? "").trim();
  const passwort = String(formData.get("passwort") ?? "");
  const locale = sicheresLocale(formData.get("locale"));
  const ziel = sicheresZiel(formData.get("weiter"), locale);

  if (!email || !passwort) {
    return { fehler: "eingabe" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: passwort,
  });

  if (error) {
    // Kein Unterschied zwischen "Nutzer unbekannt" und "Passwort falsch".
    return { fehler: error.status === 400 ? "ungueltig" : "unbekannt" };
  }

  // redirect() wirft intern - deshalb ausserhalb jedes try/catch.
  redirect(ziel);
}

export async function abmelden(formData: FormData): Promise<void> {
  const locale = sicheresLocale(formData.get("locale"));
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(`/${locale}/login`);
}
