import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, type Datenquelle } from "@/lib/supabase/config";
import { dokumente as demoDokumente } from "@/lib/domain/betrieb-data";
import { einsAus } from "@/lib/data/util";

// Dokumentenverwaltung (Meilenstein B): Spritzprotokolle, ESUTD-Nachweise,
// Vertraege, Foerderdossiers und Zertifikate - jeweils mit Bezug auf
// Reihenblock oder Charge, damit der Rueckstandsnachweis je Charge auf
// Knopfdruck bereitsteht.

export type DokumentKategorie =
  | "spritzmittelprotokoll"
  | "esutd_nachweis"
  | "liefervertrag"
  | "foerderdossier"
  | "zertifikat"
  | "sonstiges";

export type DokumentStatus = "gueltig" | "prueflauf" | "abgelaufen";

export interface DokumentZeile {
  id: string;
  name: string;
  kategorie: DokumentKategorie;
  bezug: string;
  stand: string | null;
  status: DokumentStatus;
  /** Signierte URL, falls eine Datei hinterlegt ist. */
  dateiUrl: string | null;
}

export interface DokumentListe {
  quelle: Datenquelle;
  dokumente: DokumentZeile[];
}

const SIGNATUR_SEKUNDEN = 60 * 60;

// Die Beispieldaten fuehren die Kategorie als freien Text - fuer die
// Demo-Ansicht auf den Enum-Wert abbilden.
const kategorieAusText: Record<string, DokumentKategorie> = {
  Spritzmittelprotokoll: "spritzmittelprotokoll",
  "ESUTD-Nachweis": "esutd_nachweis",
  Liefervertrag: "liefervertrag",
  Foerderdossier: "foerderdossier",
  Zertifikat: "zertifikat",
};

function demoListe(quelle: DokumentListe["quelle"] = "demo"): DokumentListe {
  return {
    quelle,
    dokumente: demoDokumente.map((doc) => ({
      id: doc.id,
      name: doc.name,
      kategorie: kategorieAusText[doc.kategorie] ?? "sonstiges",
      bezug: doc.bezug,
      stand: doc.stand,
      status: doc.status,
      dateiUrl: null,
    })),
  };
}

export async function ladeDokumente(): Promise<DokumentListe> {
  if (!isSupabaseConfigured()) return demoListe();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dokumente")
    .select(
      `id, name, kategorie, bezug, stand, status, storage_path,
       reihenbloecke ( code ),
       chargen ( code )`,
    )
    .order("stand", { ascending: false, nullsFirst: false })
    .order("name");

  if (error || !data) return demoListe("fehler");

  const pfade = data
    .map((doc) => doc.storage_path)
    .filter((pfad): pfad is string => Boolean(pfad));

  const signiert = new Map<string, string>();
  if (pfade.length > 0) {
    const { data: urls } = await supabase.storage
      .from("dokumente")
      .createSignedUrls(pfade, SIGNATUR_SEKUNDEN);
    for (const eintrag of urls ?? []) {
      if (eintrag.path && eintrag.signedUrl) signiert.set(eintrag.path, eintrag.signedUrl);
    }
  }

  return {
    quelle: "db",
    dokumente: data.map((doc) => {
      const block = einsAus(doc.reihenbloecke);
      const charge = einsAus(doc.chargen);
      return {
        id: doc.id,
        name: doc.name,
        kategorie: doc.kategorie,
        bezug: doc.bezug ?? block?.code ?? charge?.code ?? "",
        stand: doc.stand,
        status: doc.status,
        dateiUrl: doc.storage_path ? (signiert.get(doc.storage_path) ?? null) : null,
      };
    }),
  };
}
