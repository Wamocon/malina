"use client";

import { useTranslations } from "next-intl";
import { Card, DataTable, Section, StatusPill } from "@/components/ui/kit";
import { betrieb, hierarchyStats } from "@/lib/domain/hierarchy";
import { reihenbloecke } from "@/lib/domain/reihenbloecke";

export function StandortDemo() {
  const t = useTranslations("standortDemo");
  const stats = hierarchyStats();

  return (
    <div className="space-y-6">
      <Section title={t("statsTitle")} description={t("statsLead")}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[
            ["plantagen", stats.plantagen],
            ["parzellen", stats.parzellen],
            ["reihengruppen", stats.reihengruppen],
            ["reihenbloecke", stats.reihenbloecke],
            ["flaeche", `${stats.flaecheHa.toFixed(1)} ha`],
          ].map(([key, value]) => (
            <Card key={key as string} className="p-4">
              <p className="text-2xl font-black text-foreground">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t(`level.${key}`)}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title={t("treeTitle")} description={t("treeLead")}>
        <div className="space-y-3">
          {betrieb.plantagen.map((plantage) => (
            <Card key={plantage.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-black text-card-foreground">
                    {plantage.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{plantage.ort}</p>
                </div>
                <StatusPill
                  tone={plantage.typ === "eigen" ? "success" : "info"}
                >
                  {t(`typ.${plantage.typ}`)}
                </StatusPill>
              </div>
              <div className="mt-3 space-y-2 border-l-2 border-border pl-3">
                {plantage.parzellen.map((parzelle) => (
                  <div key={parzelle.id}>
                    <p className="text-xs font-semibold text-foreground">
                      {parzelle.name} · {parzelle.flaecheHa} ha · {parzelle.sorte}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {parzelle.reihengruppen.map((rg) => (
                        <span
                          key={rg.id}
                          className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground"
                        >
                          {rg.name} · {rg.spalierrichtung} · {rg.reihenbloecke}{" "}
                          {t("blocksShort")}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Card className="bg-muted/30 text-xs leading-5 text-muted-foreground">
        {t("catiNote")}
      </Card>
    </div>
  );
}

export function PflanzenschutzDemo() {
  const t = useTranslations("pflanzenschutzDemo");
  const gesperrt = reihenbloecke.filter(
    (block) => block.status === "wartezeitgesperrt" && block.sperre,
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-destructive/25 bg-destructive/[0.06] p-4">
        <p className="text-sm font-black text-destructive">{t("ruleTitle")}</p>
        <p className="mt-1 text-sm leading-6 text-foreground">{t("ruleLead")}</p>
      </div>

      <Section title={t("activeTitle")} description={t("activeLead")}>
        <DataTable
          head={[
            t("col.block"),
            t("col.mittel"),
            t("col.behandelt"),
            t("col.wartezeit"),
            t("col.freigabe"),
            t("col.status"),
          ]}
        >
          {gesperrt.map((block) => (
            <tr key={block.id}>
              <td className="px-3 py-2.5 font-mono text-xs font-semibold">
                {block.id}
              </td>
              <td className="px-3 py-2.5 text-muted-foreground">
                {block.sperre!.mittel}
              </td>
              <td className="px-3 py-2.5 text-muted-foreground">
                {block.sperre!.behandeltAm}
              </td>
              <td className="px-3 py-2.5 text-muted-foreground">
                {block.sperre!.wartezeitTage} {t("days")}
              </td>
              <td className="px-3 py-2.5 font-semibold text-foreground">
                {block.sperre!.freigabeAm}
              </td>
              <td className="px-3 py-2.5">
                <StatusPill tone="danger">{t("locked")}</StatusPill>
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
