"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Lock } from "lucide-react";
import { Card, DataTable, Section, StatusPill, type Tone } from "@/components/ui/kit";
import {
  reihenbloecke,
  statusCounts,
  statusMeta,
  type ReihenblockStatus,
} from "@/lib/domain/reihenbloecke";

const order: ReihenblockStatus[] = [
  "erntereif",
  "bepflanzt",
  "rueckschnitt",
  "ruhend",
  "wartezeitgesperrt",
];

export function ReihenbloeckeDemo() {
  const t = useTranslations("reihenbloeckeDemo");
  const s = useTranslations("reihenblockStatus");
  const counts = statusCounts();
  const [filter, setFilter] = useState<ReihenblockStatus | "alle">("alle");

  const rows =
    filter === "alle"
      ? reihenbloecke
      : reihenbloecke.filter((block) => block.status === filter);

  return (
    <div className="space-y-6">
      <Section title={t("distributionTitle")} description={t("distributionLead")}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {order.map((status) => {
            const meta = statusMeta[status];
            const active = filter === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(active ? "alle" : status)}
                className={`rounded-xl border p-3 text-left transition ${
                  active
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <p className="text-2xl font-black text-foreground">
                  {counts[status]}
                </p>
                <p className="mt-1 text-xs font-semibold text-card-foreground">
                  {s(status)}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {t("catiStatus")}: {meta.catiStatus}
                </p>
              </button>
            );
          })}
        </div>
      </Section>

      <div className="rounded-xl border border-destructive/25 bg-destructive/[0.06] p-4">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-destructive" />
          <p className="text-sm font-black text-destructive">{t("lockTitle")}</p>
        </div>
        <p className="mt-1 text-sm leading-6 text-foreground">{t("lockLead")}</p>
      </div>

      <Section
        title={t("tableTitle")}
        description={
          filter === "alle" ? t("tableLeadAll") : t("tableLeadFiltered")
        }
      >
        <DataTable
          head={[
            t("col.id"),
            t("col.parzelle"),
            t("col.sorte"),
            t("col.status"),
            t("col.letzteErnte"),
            t("col.sperre"),
          ]}
        >
          {rows.map((block) => (
            <tr key={block.id}>
              <td className="px-3 py-2.5 font-mono text-xs font-semibold text-foreground">
                {block.id}
              </td>
              <td className="px-3 py-2.5 text-muted-foreground">
                {block.parzelle} - {block.reihengruppe}
              </td>
              <td className="px-3 py-2.5 text-muted-foreground">{block.sorte}</td>
              <td className="px-3 py-2.5">
                <StatusPill tone={statusMeta[block.status].tone as Tone}>
                  {s(block.status)}
                </StatusPill>
              </td>
              <td className="px-3 py-2.5 text-muted-foreground">
                {block.letzteErnte ?? "-"}
              </td>
              <td className="px-3 py-2.5 text-xs text-muted-foreground">
                {block.sperre ? (
                  <span>
                    <span className="font-semibold text-destructive">
                      {t("freeAt")} {block.sperre.freigabeAm}
                    </span>
                    <br />
                    {block.sperre.mittel} · {block.sperre.wartezeitTage} {t("days")}
                  </span>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </DataTable>
      </Section>

      <Card className="bg-muted/30 text-xs leading-5 text-muted-foreground">
        {t("catiNote")}
      </Card>
    </div>
  );
}
