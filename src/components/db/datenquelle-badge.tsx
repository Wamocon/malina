import { getTranslations } from "next-intl/server";
import { Database, FlaskConical, PlugZap } from "lucide-react";
import { StatusPill } from "@/components/ui/kit";
import type { Datenquelle } from "@/lib/supabase/config";

// Zeigt an, woher die Ansicht ihre Daten hat. Drei Zustaende, weil zwei zu
// wenig waeren: ein Lesefehler darf nicht wie der gewollte Demo-Modus
// aussehen, sonst zeigt die Oberflaeche im Ausfall still Beispieldaten.
const darstellung = {
  db: { tone: "success", icon: Database, label: "db", hinweis: "dbHint" },
  demo: { tone: "warning", icon: FlaskConical, label: "demo", hinweis: "demoHint" },
  fehler: { tone: "danger", icon: PlugZap, label: "fehler", hinweis: "fehlerHint" },
} as const;

export async function DatenquelleBadge({ quelle }: { quelle: Datenquelle }) {
  const t = await getTranslations("dashboard.dataSource");
  const { tone, icon: Symbol, label, hinweis } = darstellung[quelle];

  return (
    <StatusPill tone={tone} title={t(hinweis)}>
      <Symbol className="h-3 w-3" />
      {t(label)}
    </StatusPill>
  );
}
