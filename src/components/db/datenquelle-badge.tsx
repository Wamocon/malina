import { getTranslations } from "next-intl/server";
import { Database, FlaskConical } from "lucide-react";
import { StatusPill } from "@/components/ui/kit";
import type { Datenquelle } from "@/lib/supabase/config";

// Zeigt an, ob eine Ansicht echte Datenbankdaten oder die eingebauten
// Beispieldaten darstellt. Wichtig fuer die Vorfuehrung: niemand soll raten
// muessen, was gerade angebunden ist.
export async function DatenquelleBadge({ quelle }: { quelle: Datenquelle }) {
  const t = await getTranslations("dashboard.dataSource");
  const live = quelle === "db";

  return (
    <StatusPill tone={live ? "success" : "warning"} title={t(live ? "dbHint" : "demoHint")}>
      {live ? (
        <Database className="h-3 w-3" />
      ) : (
        <FlaskConical className="h-3 w-3" />
      )}
      {t(live ? "db" : "demo")}
    </StatusPill>
  );
}
