// 14 Baseline-KPIs. Werden laut Analyse Kapitel 3 am 01.10.2026 mit dem Kunden
// als Baseline unterschrieben. Im Prototyp Platzhalterwerte - "echte Berechnung
// folgt mit den Erntedaten" (Analyse Kapitel 9).

export type KpiTrend = "up" | "down" | "flat";

export interface Kpi {
  key: string;
  zone: "feld" | "hof" | "buero" | "markt";
  wert: string;
  ziel: string;
  trend: KpiTrend;
  // positive Richtung: steigt der Wert = gut ("up") oder schlecht ("down")?
  gutRichtung: "up" | "down";
  platzhalter: true;
}

export const kpis: Kpi[] = [
  { key: "verlustquote", zone: "hof", wert: "8,4 %", ziel: "< 6 %", trend: "down", gutRichtung: "down", platzhalter: true },
  { key: "vermarktungsfaehig", zone: "hof", wert: "82 %", ziel: "> 90 %", trend: "up", gutRichtung: "up", platzhalter: true },
  { key: "zeitBisKuehlung", zone: "hof", wert: "47 min", ziel: "< 60 min", trend: "flat", gutRichtung: "down", platzhalter: true },
  { key: "kuehlketteEinhaltung", zone: "hof", wert: "76 %", ziel: "> 95 %", trend: "up", gutRichtung: "up", platzhalter: true },
  { key: "pflueckleistung", zone: "feld", wert: "6,1 kg/h", ziel: "> 7 kg/h", trend: "up", gutRichtung: "up", platzhalter: true },
  { key: "erntemenge", zone: "feld", wert: "1 240 kg", ziel: "Saisonkurve", trend: "up", gutRichtung: "up", platzhalter: true },
  { key: "wartezeitVerstoesse", zone: "feld", wert: "0", ziel: "0", trend: "flat", gutRichtung: "down", platzhalter: true },
  { key: "herbstanteil", zone: "feld", wert: "58 %", ziel: "> 60 %", trend: "up", gutRichtung: "up", platzhalter: true },
  { key: "liefertreue", zone: "markt", wert: "91 %", ziel: "> 97 %", trend: "up", gutRichtung: "up", platzhalter: true },
  { key: "reklamationsquote", zone: "markt", wert: "3,2 %", ziel: "< 2 %", trend: "down", gutRichtung: "down", platzhalter: true },
  { key: "durchschnittspreis", zone: "markt", wert: "1 950 ₸/kg", ziel: "1 800 ₸/kg", trend: "up", gutRichtung: "up", platzhalter: true },
  { key: "deckungsbeitrag", zone: "buero", wert: "640 ₸/kg", ziel: "> 700 ₸/kg", trend: "up", gutRichtung: "up", platzhalter: true },
  { key: "esutdAbdeckung", zone: "buero", wert: "64 %", ziel: "100 %", trend: "up", gutRichtung: "up", platzhalter: true },
  { key: "brigadenAuslastung", zone: "buero", wert: "88 %", ziel: "85 - 95 %", trend: "flat", gutRichtung: "up", platzhalter: true },
];
