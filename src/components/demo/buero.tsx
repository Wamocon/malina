"use client";

import { useTranslations } from "next-intl";
import { Check, Minus } from "lucide-react";
import { Card, DataTable, Section, StatusPill } from "@/components/ui/kit";
import { hasPermission, roleDefinitions, type Resource } from "@/lib/rbac";
import { dokumente, pfluecker, brigaden, integrationen } from "@/lib/domain/betrieb-data";

export function RollenDemo() {
  const t = useTranslations("rollenDemo");
  const roleT = useTranslations("roles");
  const resT = useTranslations("resourceLabels");
  const shown: Resource[] = [
    "dashboard",
    "reihenbloecke",
    "pflueckaufgaben",
    "pflanzenschutz",
    "kuehlkette",
    "lohn",
    "finanzen",
    "dokumente",
    "compliance",
    "b2b_portal",
  ];

  return (
    <div className="space-y-6">
      <Section title={t("rolesTitle")} description={t("rolesLead")}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {roleDefinitions.map((role) => (
            <Card key={role.key}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-black text-card-foreground">
                  {roleT(role.key)}
                </p>
                <StatusPill tone="neutral">1Çatı: {role.catiRole}</StatusPill>
              </div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {roleT(`descriptions.${role.key}`)}
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                {t("scope")}: {role.scope} · Level {role.level}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title={t("matrixTitle")} description={t("matrixLead")}>
        <DataTable head={[t("resource"), ...roleDefinitions.map((r) => roleT(r.key))]}>
          {shown.map((resource) => (
            <tr key={resource}>
              <td className="px-3 py-2.5 font-semibold text-foreground">
                {resT(resource)}
              </td>
              {roleDefinitions.map((role) => (
                <td key={role.key} className="px-3 py-2.5">
                  {hasPermission(role.key, resource, "view") ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Minus className="h-4 w-4 text-muted-foreground/40" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </DataTable>
        <p className="text-xs text-muted-foreground">{t("matrixNote")}</p>
      </Section>

      <Card className="bg-muted/30 text-xs leading-5 text-muted-foreground">
        {t("note")}
      </Card>
    </div>
  );
}

export function FinanzenDemo() {
  const t = useTranslations("finanzenDemo");
  const rows = [
    { block: "T-N-A-01", sorte: "Polka", erntetag: "2026-08-30", erloes: "108 780 ₸", kosten: "41 200 ₸", db: "67 580 ₸" },
    { block: "T-N-A-03", sorte: "Polka", erntetag: "2026-08-29", erloes: "92 820 ₸", kosten: "38 900 ₸", db: "53 920 ₸" },
    { block: "T-O-A-01", sorte: "Polana", erntetag: "2026-08-31", erloes: "61 500 ₸", kosten: "27 300 ₸", db: "34 200 ₸" },
    { block: "K-A-01", sorte: "Polka (Zukauf)", erntetag: "2026-08-30", erloes: "54 600 ₸", kosten: "44 100 ₸", db: "10 500 ₸" },
  ];

  return (
    <div className="space-y-6">
      <Section title={t("dbTitle")} description={t("dbLead")}>
        <DataTable
          head={[
            t("col.block"),
            t("col.sorte"),
            t("col.erntetag"),
            t("col.erloes"),
            t("col.kosten"),
            t("col.db"),
          ]}
        >
          {rows.map((row) => (
            <tr key={row.block}>
              <td className="px-3 py-2.5 font-mono text-xs font-semibold">{row.block}</td>
              <td className="px-3 py-2.5 text-muted-foreground">{row.sorte}</td>
              <td className="px-3 py-2.5 text-muted-foreground">{row.erntetag}</td>
              <td className="px-3 py-2.5 text-muted-foreground">{row.erloes}</td>
              <td className="px-3 py-2.5 text-muted-foreground">{row.kosten}</td>
              <td className="px-3 py-2.5 font-semibold text-success">{row.db}</td>
            </tr>
          ))}
        </DataTable>
      </Section>
      <Card className="bg-muted/30 text-xs leading-5 text-muted-foreground">
        {t("note")}
      </Card>
    </div>
  );
}

export function PersonalDemo() {
  const t = useTranslations("personalDemo");
  return (
    <div className="space-y-6">
      <Section title={t("brigadenTitle")} description={t("brigadenLead")}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {brigaden.map((b) => (
            <Card key={b.id} className="p-4">
              <p className="text-sm font-black text-card-foreground">{b.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("foreman")}: {b.vorarbeiter}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {b.staerke} {t("people")} · {b.plantage}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title={t("pflueckerTitle")} description={t("pflueckerLead")}>
        <DataTable
          head={[t("col.name"), t("col.brigade"), t("col.ausweis"), t("col.esutd"), t("col.leistung"), t("col.qfaktor")]}
        >
          {pfluecker.map((p) => (
            <tr key={p.id}>
              <td className="px-3 py-2.5 font-semibold text-foreground">{p.name}</td>
              <td className="px-3 py-2.5 text-muted-foreground">{p.brigade}</td>
              <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">{p.ausweis}</td>
              <td className="px-3 py-2.5">
                <StatusPill tone={p.esutd === "erfasst" ? "success" : "warning"}>
                  {t(`esutd.${p.esutd}`)}
                </StatusPill>
              </td>
              <td className="px-3 py-2.5 text-muted-foreground">{p.schnitt7dKg} kg / 7 {t("days")}</td>
              <td className="px-3 py-2.5 font-semibold text-foreground">{p.qualitaetsfaktor.toFixed(2)}</td>
            </tr>
          ))}
        </DataTable>
      </Section>
      <Card className="bg-muted/30 text-xs leading-5 text-muted-foreground">{t("note")}</Card>
    </div>
  );
}

export function DokumenteDemo() {
  const t = useTranslations("dokumenteDemo");
  const tone = { gueltig: "success", prueflauf: "warning", abgelaufen: "danger" } as const;
  return (
    <div className="space-y-6">
      <Section title={t("listTitle")} description={t("listLead")}>
        <DataTable head={[t("col.name"), t("col.kategorie"), t("col.bezug"), t("col.stand"), t("col.status")]}>
          {dokumente.map((doc) => (
            <tr key={doc.id}>
              <td className="px-3 py-2.5 font-semibold text-foreground">{doc.name}</td>
              <td className="px-3 py-2.5 text-muted-foreground">{doc.kategorie}</td>
              <td className="px-3 py-2.5 text-muted-foreground">{doc.bezug}</td>
              <td className="px-3 py-2.5 text-muted-foreground">{doc.stand}</td>
              <td className="px-3 py-2.5">
                <StatusPill tone={tone[doc.status]}>{t(`status.${doc.status}`)}</StatusPill>
              </td>
            </tr>
          ))}
        </DataTable>
      </Section>
      <Card className="bg-muted/30 text-xs leading-5 text-muted-foreground">{t("note")}</Card>
    </div>
  );
}

export function ComplianceDemo() {
  const t = useTranslations("complianceDemo");
  const items = [
    { key: "consent", tone: "success" as const },
    { key: "retention", tone: "success" as const },
    { key: "audit", tone: "success" as const },
    { key: "residency", tone: "warning" as const },
    { key: "ai", tone: "warning" as const },
  ];
  return (
    <div className="space-y-6">
      <Section title={t("cockpitTitle")} description={t("cockpitLead")}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.key}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-card-foreground">{t(`items.${item.key}.title`)}</p>
                <StatusPill tone={item.tone}>{t(`items.${item.key}.state`)}</StatusPill>
              </div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{t(`items.${item.key}.text`)}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title={t("integrationTitle")} description={t("integrationLead")}>
        <DataTable head={[t("col.name"), t("col.system"), t("col.status"), t("col.queue")]}>
          {integrationen.map((int) => (
            <tr key={int.id}>
              <td className="px-3 py-2.5 font-semibold text-foreground">{int.name}</td>
              <td className="px-3 py-2.5 text-muted-foreground">{int.system}</td>
              <td className="px-3 py-2.5">
                <StatusPill tone={int.status === "verbunden" ? "success" : int.status === "sandbox" ? "warning" : "neutral"}>
                  {t(`intStatus.${int.status}`)}
                </StatusPill>
              </td>
              <td className="px-3 py-2.5 text-muted-foreground">{int.wartend}</td>
            </tr>
          ))}
        </DataTable>
      </Section>
      <Card className="bg-muted/30 text-xs leading-5 text-muted-foreground">{t("note")}</Card>
    </div>
  );
}
