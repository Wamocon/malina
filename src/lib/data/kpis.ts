import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, type Datenquelle } from "@/lib/supabase/config";
import { kpis as demoKpis, type Kpi } from "@/lib/domain/kpis";

// Die 14 Baseline-Kennzahlen stehen als eigene Tabelle in der Datenbank
// (public.kpi_baseline) - sie werden am 01.10.2026 mit dem Kunden
// unterschrieben. Die Werte bleiben laut Analyse bis zur ersten gemessenen
// Saison Platzhalter; die Kacheln lesen sie aber schon aus der Datenbank,
// damit spaeter nur noch die Berechnung dahinter ausgetauscht wird.

export interface KpiListe {
  quelle: Datenquelle;
  kpis: Kpi[];
}

export async function ladeKpis(): Promise<KpiListe> {
  if (!isSupabaseConfigured()) return { quelle: "demo", kpis: demoKpis };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("kpi_baseline")
    .select("key, zone, baseline_wert, ziel, gut_richtung");

  if (error || !data || data.length === 0) {
    return { quelle: "demo", kpis: demoKpis };
  }

  const ausDb = new Map(data.map((zeile) => [zeile.key, zeile]));

  // Reihenfolge und Trendpfeil kommen weiter aus der Fachdefinition, Werte und
  // Ziele aus der Datenbank.
  const kpis = demoKpis.map((kpi) => {
    const zeile = ausDb.get(kpi.key);
    if (!zeile) return kpi;
    return {
      ...kpi,
      zone: (zeile.zone as Kpi["zone"]) ?? kpi.zone,
      wert: zeile.baseline_wert ?? kpi.wert,
      ziel: zeile.ziel ?? kpi.ziel,
      gutRichtung: (zeile.gut_richtung as Kpi["gutRichtung"]) ?? kpi.gutRichtung,
    };
  });

  return { quelle: "db", kpis };
}
