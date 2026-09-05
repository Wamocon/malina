"use client";

import { useTranslations } from "next-intl";
import { Clock, Database } from "lucide-react";
import type { Klassifikation, ModuleDef } from "@/lib/modules";
import { StatusPill, type Tone } from "@/components/ui/kit";
import { cn } from "@/lib/utils";

const klassTone: Record<Klassifikation, Tone> = {
  uebernehmen: "success",
  anpassen: "info",
  "neu-bauen": "warning",
};

export function KlassifikationBadge({ value }: { value: Klassifikation }) {
  const t = useTranslations("klassifikation");
  return <StatusPill tone={klassTone[value]}>{t(value)}</StatusPill>;
}

export function ReifegradBadge({ value }: { value: ModuleDef["reifegrad"] }) {
  const t = useTranslations("reifegrad");
  if (value === "angebunden") {
    return (
      <StatusPill tone="success" className="gap-1">
        <Database className="h-3 w-3" />
        {t("angebunden")}
      </StatusPill>
    );
  }
  if (value === "demo") {
    return <StatusPill tone="info">{t("demo")}</StatusPill>;
  }
  return (
    <StatusPill tone="warning" className="gap-1">
      <Clock className="h-3 w-3" />
      {t("in-entwicklung")}
    </StatusPill>
  );
}

// Platzhalterseite fuer Unterfunktionen: sichtbarer Menuepunkt mit Status
// "in Entwicklung", jedoch ohne vollstaendige Logik dahinter (Analyse Kapitel 9).
export function ModulePlaceholder({
  module,
  className,
}: {
  module: ModuleDef;
  className?: string;
}) {
  const t = useTranslations("modules");
  const meta = useTranslations("moduleMeta");

  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-warning/40 bg-warning/[0.06] p-6",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-warning" />
        <p className="text-xs font-black uppercase tracking-wide text-warning">
          {meta("inDevelopmentTitle")}
        </p>
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground">
        {t(`${module.key}.summary`)}
      </p>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {meta("plannedScope")}
          </dt>
          <dd className="mt-1 text-sm text-foreground">{t(`${module.key}.todo`)}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {meta("classification")}
          </dt>
          <dd className="mt-1">
            <KlassifikationBadge value={module.klassifikation} />
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {meta("milestone")}
          </dt>
          <dd className="mt-1 text-sm text-foreground">{meta("milestoneB")}</dd>
        </div>
      </dl>
    </div>
  );
}
