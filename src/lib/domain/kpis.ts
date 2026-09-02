// Die 14 Baseline-Kennzahlen aus der WAMOCON-Marktanalyse (Kapitel 4.10). Sie
// werden am 01.10.2026 gemeinsam mit dem Kunden als Ausgangswert unterschrieben.
// Im Prototyp Platzhalterwerte - die echte Berechnung folgt mit den Erntedaten
// der ersten vollstaendig gemessenen Saison.

export type KpiTrend = "up" | "down" | "flat";

export interface Kpi {
  key: string;
  zone: "feld" | "hof" | "buero" | "markt";
  wert: string;
  ziel: string;
  trend: KpiTrend;
  // positive Richtung: ist ein steigender Wert gut ("up") oder schlecht ("down")?
  gutRichtung: "up" | "down";
  platzhalter: true;
}

export const kpis: Kpi[] = [
  { key: "verlustquote", zone: "hof", wert: "8,4 %", ziel: "< 6 %", trend: "down", gutRichtung: "down", platzhalter: true },
  { key: "vermarktungsfaehig", zone: "hof", wert: "82 %", ziel: "> 90 %", trend: "up", gutRichtung: "up", platzhalter: true },
  { key: "zeitBisVorkuehlung", zone: "hof", wert: "47 min", ziel: "< 60 min", trend: "flat", gutRichtung: "down", platzhalter: true },
  { key: "zeitBisKunde", zone: "hof", wert: "19 h", ziel: "< 24 h", trend: "down", gutRichtung: "down", platzhalter: true },
  { key: "pflueckleistung", zone: "feld", wert: "6,1 kg/h", ziel: "> 7 kg/h", trend: "up", gutRichtung: "up", platzhalter: true },
  { key: "pflueckStreuung", zone: "feld", wert: "2,3×", ziel: "< 1,8×", trend: "down", gutRichtung: "down", platzhalter: true },
  { key: "pflueckintervall", zone: "feld", wert: "84 %", ziel: "> 95 %", trend: "up", gutRichtung: "up", platzhalter: true },
  { key: "behandlungenWartezeit", zone: "feld", wert: "96 %", ziel: "100 %", trend: "up", gutRichtung: "up", platzhalter: true },
  { key: "reklamationsquote", zone: "markt", wert: "3,2 %", ziel: "< 2 %", trend: "down", gutRichtung: "down", platzhalter: true },
  { key: "liefertreue", zone: "markt", wert: "91 %", ziel: "> 97 %", trend: "up", gutRichtung: "up", platzhalter: true },
  { key: "belegteVerkaeufe", zone: "buero", wert: "71 %", ziel: "100 %", trend: "up", gutRichtung: "up", platzhalter: true },
  { key: "deckungsbeitrag", zone: "buero", wert: "640 ₸/kg", ziel: "> 700 ₸/kg", trend: "up", gutRichtung: "up", platzhalter: true },
  { key: "esutdAbdeckung", zone: "buero", wert: "64 %", ziel: "100 %", trend: "up", gutRichtung: "up", platzhalter: true },
  { key: "websiteAnfragen", zone: "markt", wert: "12 / Monat", ziel: "Ausgangswert", trend: "up", gutRichtung: "up", platzhalter: true },
];
