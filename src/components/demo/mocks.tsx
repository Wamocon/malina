"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { QrCode, Send, ThermometerSnowflake } from "lucide-react";
import { Card, Section, StatusPill } from "@/components/ui/kit";
import { ModulePlaceholder } from "@/components/dashboard/module-meta";
import type { ModuleDef } from "@/lib/modules";

// Kuehlketten-Uhr: im Prototyp ein statischer Ableseblock. Analyse: harte
// 60-Minuten-Grenze zwischen Pfluecken und Vorkuehlung, Zieltemperatur 0-1 C.
export function KuehlketteMock({ module }: { module: ModuleDef }) {
  const t = useTranslations("kuehlketteMock");
  const chargen = [
    { id: "CH-0902-14", block: "T-N-A-01", minuten: 41, temp: "3,8 °C" },
    { id: "CH-0902-15", block: "T-O-A-01", minuten: 58, temp: "6,1 °C" },
    { id: "CH-0902-12", block: "T-N-A-03", minuten: 72, temp: "8,4 °C" },
  ];

  return (
    <div className="space-y-6">
      <Section title={t("clockTitle")} description={t("clockLead")}>
        <div className="grid gap-3 sm:grid-cols-3">
          {chargen.map((charge) => {
            const tone =
              charge.minuten <= 45
                ? "success"
                : charge.minuten <= 60
                  ? "warning"
                  : "danger";
            const pct = Math.min(100, Math.round((charge.minuten / 60) * 100));
            return (
              <Card key={charge.id}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {charge.id}
                  </span>
                  <StatusPill tone={tone}>
                    {charge.minuten} / 60 min
                  </StatusPill>
                </div>
                <p className="mt-2 text-3xl font-black text-foreground">
                  {charge.temp}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("block")} {charge.block}
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${
                      tone === "danger"
                        ? "bg-destructive"
                        : tone === "warning"
                          ? "bg-warning"
                          : "bg-success"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </Card>
            );
          })}
        </div>
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <ThermometerSnowflake className="h-4 w-4" />
          {t("hint")}
        </p>
      </Section>
      <ModulePlaceholder module={module} />
    </div>
  );
}

// QR-Steigenkennung: Scan-Intake bleibt aus 1Cati (Migration 28), Zielobjekt
// wechselt von QR-pro-Zone zu QR-pro-Steige.
export function QrSteigenMock({ module }: { module: ModuleDef }) {
  const t = useTranslations("qrSteigenMock");
  const [scans, setScans] = useState<string[]>([
    "STG-2026-000481",
    "STG-2026-000480",
  ]);

  return (
    <div className="space-y-6">
      <Section title={t("scanTitle")} description={t("scanLead")}>
        <div className="grid gap-4 sm:grid-cols-[220px_1fr]">
          <div className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40">
            <QrCode className="h-24 w-24 text-muted-foreground/50" />
          </div>
          <div>
            <button
              type="button"
              onClick={() =>
                setScans((prev) => [
                  `STG-2026-${String(482 + prev.length).padStart(6, "0")}`,
                  ...prev,
                ])
              }
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground"
            >
              <QrCode className="h-4 w-4" />
              {t("simulateScan")}
            </button>
            <ul className="mt-3 space-y-1.5">
              {scans.map((scan) => (
                <li
                  key={scan}
                  className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-sm"
                >
                  <span className="font-mono text-xs font-semibold">{scan}</span>
                  <StatusPill tone="success">{t("registered")}</StatusPill>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
      <ModulePlaceholder module={module} />
    </div>
  );
}

// Retrieval-only-KI-Chat: Architektur aus 1Cati [UEBERNEHMEN], im Prototyp nur
// ein Platzhalter-Chatfenster ohne befuellte Wissensbasis.
export function KiAssistentMock({ module }: { module: ModuleDef }) {
  const t = useTranslations("kiAssistentMock");
  const [input, setInput] = useState("");
  const seed = useMemo(
    () => [
      { role: "user" as const, text: t("demoQuestion") },
      { role: "bot" as const, text: t("demoAnswer") },
    ],
    [t],
  );
  const [messages, setMessages] = useState(seed);

  return (
    <div className="space-y-6">
      <Section title={t("chatTitle")} description={t("chatLead")}>
        <Card className="p-0">
          <div className="max-h-80 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "user" ? "flex justify-end" : "flex justify-start"
                }
              >
                <p
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!input.trim()) return;
              setMessages((prev) => [
                ...prev,
                { role: "user", text: input.trim() },
                { role: "bot", text: t("stubAnswer") },
              ]);
              setInput("");
            }}
            className="flex gap-2 border-t border-border p-3"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t("inputPlaceholder")}
              className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"
              aria-label={t("send")}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </Card>
      </Section>
      <ModulePlaceholder module={module} />
    </div>
  );
}
