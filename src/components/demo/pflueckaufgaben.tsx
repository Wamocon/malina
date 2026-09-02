"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Camera, Check } from "lucide-react";
import { Card, Section, StatusPill, type Tone } from "@/components/ui/kit";
import {
  aufgabenStatusMeta,
  pflueckaufgaben,
  type Pflueckaufgabe,
} from "@/lib/domain/pflueckaufgaben";

export function PflueckaufgabenDemo() {
  const t = useTranslations("pflueckaufgabenDemo");
  const st = useTranslations("aufgabenStatus");
  const [selected, setSelected] = useState<Pflueckaufgabe>(
    pflueckaufgaben.find((a) => a.belege.length > 0) ?? pflueckaufgaben[0],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <Section title={t("listTitle")} description={t("listLead")}>
        <div className="space-y-2">
          {pflueckaufgaben.map((task) => {
            const active = task.id === selected.id;
            const progress = Math.min(
              100,
              Math.round((task.istMengeKg / task.zielmengeKg) * 100),
            );
            return (
              <button
                key={task.id}
                type="button"
                onClick={() => setSelected(task)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  active
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {task.id}
                  </span>
                  <StatusPill
                    tone={aufgabenStatusMeta[task.status].tone as Tone}
                  >
                    {st(task.status)}
                  </StatusPill>
                </div>
                <p className="mt-1 text-sm font-semibold text-card-foreground">
                  {task.brigade} · {t("block")} {task.reihenblock} · {task.sorte}
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>
                    {task.istMengeKg} / {task.zielmengeKg} kg
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Camera className="h-3 w-3" />
                    {task.belege.length}
                  </span>
                  {task.qualitaetsfaktor ? (
                    <span>Q-Faktor {task.qualitaetsfaktor.toFixed(2)}</span>
                  ) : null}
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      <div className="space-y-3">
        <Card>
          <p className="text-sm font-black text-card-foreground">
            {t("proofTitle")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{t("proofLead")}</p>

          <div className="mt-4 space-y-3">
            {selected.belege.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                {t("noProof")}
              </p>
            ) : (
              selected.belege.map((beleg, index) => (
                <figure
                  key={beleg.id}
                  className="overflow-hidden rounded-xl border border-border bg-muted/30"
                >
                  <div className="relative h-40 w-full">
                    <Image
                      src={beleg.bildUrl}
                      alt={beleg.hinweis}
                      fill
                      sizes="(min-width: 1024px) 360px, 100vw"
                      priority={index === 0}
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="p-3">
                    <div className="flex items-center justify-between">
                      <StatusPill tone="info">{t(`art.${beleg.art}`)}</StatusPill>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(beleg.aufgenommen).toLocaleString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-foreground">
                      {beleg.hinweis}
                    </p>
                  </figcaption>
                </figure>
              ))
            )}
          </div>

          <button
            type="button"
            className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-border bg-card text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            <Camera className="h-4 w-4" />
            {t("addProof")}
          </button>
        </Card>

        {selected.status === "beleg_pruefung" ? (
          <Card className="border-warning/30 bg-warning/[0.06]">
            <p className="text-sm font-black text-warning">{t("reviewTitle")}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {t("reviewLead")}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-lg bg-primary text-sm font-bold text-primary-foreground"
              >
                <Check className="h-4 w-4" />
                {t("approve")}
              </button>
              <button
                type="button"
                className="inline-flex h-9 flex-1 items-center justify-center rounded-lg border border-border text-sm font-semibold text-foreground"
              >
                {t("rework")}
              </button>
            </div>
          </Card>
        ) : null}

        <Card className="bg-muted/30 text-xs leading-5 text-muted-foreground">
          {t("catiNote")}
        </Card>
      </div>
    </div>
  );
}
