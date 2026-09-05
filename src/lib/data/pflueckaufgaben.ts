import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, type Datenquelle } from "@/lib/supabase/config";
import {
  pflueckaufgaben as demoAufgaben,
  type AufgabenStatus,
} from "@/lib/domain/pflueckaufgaben";
import { einsAus } from "@/lib/data/util";

// Pflueckaufgaben mit Fotobeleg aus der Datenbank (Meilenstein B).
// Die Bilddateien liegen im privaten Storage-Bucket "belege" und werden hier
// serverseitig in kurzlebige signierte URLs uebersetzt.

const SIGNATUR_SEKUNDEN = 60 * 60;

export interface BelegAnsicht {
  id: string;
  art: "schale" | "reihenblock" | "steige";
  aufgenommen: string;
  hinweis: string;
  /** Signierte URL oder Platzhalterbild, wenn kein Upload hinterlegt ist. */
  bildUrl: string;
  /** true, wenn eine echte Datei im Bucket liegt. */
  hochgeladen: boolean;
}

export interface AufgabeAnsicht {
  id: string;
  code: string;
  reihenblock: string;
  reihenblockId: string;
  sorte: string;
  brigade: string;
  pflueckerAnzahl: number;
  status: AufgabenStatus;
  faelligkeit: string | null;
  zielmengeKg: number;
  istMengeKg: number;
  qualitaetsfaktor: number | null;
  belege: BelegAnsicht[];
}

export interface AufgabenListe {
  quelle: Datenquelle;
  aufgaben: AufgabeAnsicht[];
}

// Platzhalterbilder je Belegart - greifen, solange kein Foto hochgeladen wurde.
// Bewusst eigene Grafiken statt Stockfotos: sie sind als Platzhalter erkennbar,
// treffen die Fachsprache und funktionieren ohne Netzzugriff.
const platzhalter: Record<BelegAnsicht["art"], string> = {
  schale: "/belege/schale.svg",
  reihenblock: "/belege/reihenblock.svg",
  steige: "/belege/steige.svg",
};

function demoListe(quelle: AufgabenListe["quelle"] = "demo"): AufgabenListe {
  return {
    quelle,
    aufgaben: demoAufgaben.map((aufgabe) => ({
      id: aufgabe.id,
      code: aufgabe.id,
      reihenblock: aufgabe.reihenblock,
      reihenblockId: aufgabe.reihenblock,
      sorte: aufgabe.sorte,
      brigade: aufgabe.brigade,
      pflueckerAnzahl: aufgabe.pflueckerAnzahl,
      status: aufgabe.status,
      faelligkeit: aufgabe.faelligkeit,
      zielmengeKg: aufgabe.zielmengeKg,
      istMengeKg: aufgabe.istMengeKg,
      qualitaetsfaktor: aufgabe.qualitaetsfaktor,
      belege: aufgabe.belege.map((beleg) => ({
        id: beleg.id,
        art: beleg.art,
        aufgenommen: beleg.aufgenommen,
        hinweis: beleg.hinweis,
        bildUrl: beleg.bildUrl,
        hochgeladen: false,
      })),
    })),
  };
}

export async function ladePflueckaufgaben(): Promise<AufgabenListe> {
  if (!isSupabaseConfigured()) return demoListe();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pflueckaufgaben")
    .select(
      `id, code, status, faelligkeit, zielmenge_kg, ist_menge_kg,
       pfluecker_anzahl, qualitaetsfaktor,
       reihenbloecke ( id, code ),
       sorten ( name ),
       brigaden ( name ),
       media_belege ( id, art, aufgenommen_am, hinweis, storage_path )`,
    )
    .order("code");

  if (error || !data) return demoListe("fehler");

  // Alle Belege mit Datei in einem Rutsch signieren.
  const pfade = data
    .flatMap((aufgabe) => aufgabe.media_belege ?? [])
    .map((beleg) => beleg.storage_path)
    .filter((pfad): pfad is string => Boolean(pfad));

  const signiert = new Map<string, string>();
  if (pfade.length > 0) {
    const { data: urls } = await supabase.storage
      .from("belege")
      .createSignedUrls(pfade, SIGNATUR_SEKUNDEN);
    for (const eintrag of urls ?? []) {
      if (eintrag.path && eintrag.signedUrl) {
        signiert.set(eintrag.path, eintrag.signedUrl);
      }
    }
  }

  const aufgaben: AufgabeAnsicht[] = data.map((aufgabe) => {
    const block = einsAus(aufgabe.reihenbloecke);
    return {
      id: aufgabe.id,
      code: aufgabe.code,
      reihenblock: block?.code ?? "",
      reihenblockId: block?.id ?? "",
      sorte: einsAus(aufgabe.sorten)?.name ?? "",
      brigade: einsAus(aufgabe.brigaden)?.name ?? "",
      pflueckerAnzahl: aufgabe.pfluecker_anzahl,
      status: aufgabe.status,
      faelligkeit: aufgabe.faelligkeit,
      zielmengeKg: Number(aufgabe.zielmenge_kg),
      istMengeKg: Number(aufgabe.ist_menge_kg),
      qualitaetsfaktor:
        aufgabe.qualitaetsfaktor === null ? null : Number(aufgabe.qualitaetsfaktor),
      belege: (aufgabe.media_belege ?? [])
        .map((beleg) => {
          const url = beleg.storage_path ? signiert.get(beleg.storage_path) : null;
          return {
            id: beleg.id,
            art: beleg.art,
            aufgenommen: beleg.aufgenommen_am,
            hinweis: beleg.hinweis ?? "",
            bildUrl: url ?? platzhalter[beleg.art],
            hochgeladen: Boolean(url),
          };
        })
        .sort((a, b) => (a.aufgenommen > b.aufgenommen ? -1 : 1)),
    };
  });

  return { quelle: "db", aufgaben };
}

export interface BrigadeOption {
  id: string;
  name: string;
}

export async function ladeBrigaden(): Promise<BrigadeOption[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("brigaden").select("id, name").order("name");
  return data ?? [];
}
