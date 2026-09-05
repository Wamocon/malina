import { getTranslations } from "next-intl/server";
import { Download } from "lucide-react";
import { Card, DataTable, Section, StatusPill, type Tone } from "@/components/ui/kit";
import { DatenquelleBadge } from "@/components/db/datenquelle-badge";
import { DokumentFormular } from "@/components/db/dokumente-formular";
import { ladeDokumente, type DokumentStatus } from "@/lib/data/dokumente";
import { getSessionProfile } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";

const statusTon: Record<DokumentStatus, Tone> = {
  gueltig: "success",
  prueflauf: "warning",
  abgelaufen: "danger",
};

// Dokumentenverwaltung aus der Datenbank (Meilenstein B). Dateien liegen im
// privaten Bucket "dokumente" und werden ueber kurzlebige signierte Links
// ausgeliefert - kein oeffentlicher Direktzugriff.
export async function DokumenteAnsicht() {
  const [liste, profil, t] = await Promise.all([
    ladeDokumente(),
    getSessionProfile(),
    getTranslations("dokumenteDemo"),
  ]);
  const k = await getTranslations("dokumentKategorie");
  const v = await getTranslations("dokumenteVerwaltung");

  const live = liste.quelle === "db";
  const darfAnlegen = live && hasPermission(profil?.role, "dokumente", "create");

  return (
    <div className="space-y-6">
      <Section
        title={t("listTitle")}
        description={t("listLead")}
        action={<DatenquelleBadge quelle={liste.quelle} />}
      >
        <DataTable
          head={[
            t("col.name"),
            t("col.kategorie"),
            t("col.bezug"),
            t("col.stand"),
            t("col.status"),
            v("col.datei"),
          ]}
        >
          {liste.dokumente.map((doc) => (
            <tr key={doc.id}>
              <td className="px-3 py-2.5 font-semibold text-foreground">{doc.name}</td>
              <td className="px-3 py-2.5 text-muted-foreground">
                {k(doc.kategorie)}
              </td>
              <td className="px-3 py-2.5 text-muted-foreground">{doc.bezug}</td>
              <td className="px-3 py-2.5 text-muted-foreground">{doc.stand ?? "-"}</td>
              <td className="px-3 py-2.5">
                <StatusPill tone={statusTon[doc.status]}>
                  {t(`status.${doc.status}`)}
                </StatusPill>
              </td>
              <td className="px-3 py-2.5">
                {doc.dateiUrl ? (
                  <a
                    href={doc.dateiUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <Download className="h-3.5 w-3.5" />
                    {v("oeffnen")}
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">{v("keineDatei")}</span>
                )}
              </td>
            </tr>
          ))}
        </DataTable>
      </Section>

      {darfAnlegen ? <DokumentFormular /> : null}

      <Card className="bg-muted/30 text-xs leading-5 text-muted-foreground">
        {t("note")}
      </Card>
    </div>
  );
}
