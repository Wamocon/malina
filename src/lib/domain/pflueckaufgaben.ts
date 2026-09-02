// Pflueckaufgaben-Engine mit Fotobeleg. [UEBERNEHMEN] aus 1Cati Migration 6:
// service_orders + workforce_tasks + media_reports sind bereits eine
// "Aufgabe-mit-Fotobeleg-Maschine". Hier direkt als Pflueckaufgabe je Brigade
// und Reihenblock genutzt.

export type AufgabenStatus =
  | "offen"
  | "angenommen"
  | "in_arbeit"
  | "beleg_pruefung"
  | "abgeschlossen";

export interface MediaBeleg {
  id: string;
  art: "schale" | "reihenblock" | "steige";
  aufgenommen: string;
  hinweis: string;
  // Platzhalterbild zum Thema Himbeerplantage (Analyse Kapitel 8)
  bildUrl: string;
}

export interface Pflueckaufgabe {
  id: string;
  reihenblock: string;
  sorte: string;
  brigade: string;
  pflueckerAnzahl: number;
  status: AufgabenStatus;
  faelligkeit: string;
  zielmengeKg: number;
  istMengeKg: number;
  belege: MediaBeleg[];
  qualitaetsfaktor: number | null;
}

// Platzhalterbilder zum Thema Himbeerplantage (Analyse Kapitel 8) - lizenzfrei
// von Unsplash, werden 1:1 durch echtes Betriebsmaterial aus Kasachstan ersetzt.
const feld =
  "https://images.unsplash.com/photo-1571680322279-a226e6a4cc2a?auto=format&fit=crop&w=640&q=60";
const schale =
  "https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?auto=format&fit=crop&w=640&q=60";
const ernte =
  "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=640&q=60";

export const pflueckaufgaben: Pflueckaufgabe[] = [
  {
    id: "PA-2026-0912-01",
    reihenblock: "T-N-A-01",
    sorte: "Polka",
    brigade: "Brigade Nord",
    pflueckerAnzahl: 6,
    status: "beleg_pruefung",
    faelligkeit: "2026-09-02T11:00:00+06:00",
    zielmengeKg: 48,
    istMengeKg: 51.4,
    qualitaetsfaktor: 1.08,
    belege: [
      { id: "MB-01", art: "schale", aufgenommen: "2026-09-02T10:41:00+06:00", hinweis: "Verkaufsschale 125 g, geschlossene Fruchtdecke", bildUrl: schale },
      { id: "MB-02", art: "reihenblock", aufgenommen: "2026-09-02T09:12:00+06:00", hinweis: "Reihenblock vor Pfluecken, Tau abgetrocknet", bildUrl: feld },
    ],
  },
  {
    id: "PA-2026-0912-02",
    reihenblock: "T-O-A-01",
    sorte: "Polana",
    brigade: "Brigade Ost",
    pflueckerAnzahl: 4,
    status: "in_arbeit",
    faelligkeit: "2026-09-02T12:30:00+06:00",
    zielmengeKg: 30,
    istMengeKg: 17.9,
    qualitaetsfaktor: null,
    belege: [
      { id: "MB-03", art: "reihenblock", aufgenommen: "2026-09-02T08:55:00+06:00", hinweis: "Startbeleg Reihenblock", bildUrl: ernte },
    ],
  },
  {
    id: "PA-2026-0912-03",
    reihenblock: "K-A-01",
    sorte: "Polka",
    brigade: "Brigade Nachbarbetrieb",
    pflueckerAnzahl: 5,
    status: "angenommen",
    faelligkeit: "2026-09-02T14:00:00+06:00",
    zielmengeKg: 26,
    istMengeKg: 0,
    qualitaetsfaktor: null,
    belege: [],
  },
  {
    id: "PA-2026-0912-04",
    reihenblock: "T-N-A-03",
    sorte: "Polka",
    brigade: "Brigade Nord",
    pflueckerAnzahl: 6,
    status: "abgeschlossen",
    faelligkeit: "2026-09-01T11:00:00+06:00",
    zielmengeKg: 45,
    istMengeKg: 44.2,
    qualitaetsfaktor: 0.97,
    belege: [
      { id: "MB-04", art: "schale", aufgenommen: "2026-09-01T10:30:00+06:00", hinweis: "Schale mit leichtem Ueberreifeanteil", bildUrl: schale },
      { id: "MB-05", art: "steige", aufgenommen: "2026-09-01T10:48:00+06:00", hinweis: "Steige 2 kg, QR-Etikett lesbar", bildUrl: ernte },
    ],
  },
  {
    id: "PA-2026-0912-05",
    reihenblock: "T-O-A-02",
    sorte: "Polana",
    brigade: "Brigade Ost",
    pflueckerAnzahl: 4,
    status: "offen",
    faelligkeit: "2026-09-02T15:30:00+06:00",
    zielmengeKg: 28,
    istMengeKg: 0,
    qualitaetsfaktor: null,
    belege: [],
  },
];

export const aufgabenStatusMeta: Record<
  AufgabenStatus,
  { catiStatus: string; tone: "neutral" | "info" | "warning" | "success" }
> = {
  offen: { catiStatus: "draft", tone: "neutral" },
  angenommen: { catiStatus: "assigned", tone: "info" },
  in_arbeit: { catiStatus: "in_progress", tone: "info" },
  beleg_pruefung: { catiStatus: "waiting_approval", tone: "warning" },
  abgeschlossen: { catiStatus: "closed", tone: "success" },
};
