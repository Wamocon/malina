import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalShell } from "@/components/site/legal-shell";

export default async function DatenschutzPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal" });

  return (
    <LegalShell title={t("privacyTitle")}>
      <p>{t("prototypeDisclaimer")}</p>
      <h2>{t("controller")}</h2>
      <p>
        WAMOCON GmbH
        <br />
        Mergenthalerallee 79 - 81, 65760 Eschborn
        <br />
        info@wamocon.com
      </p>
      <h2>{t("privacyScopeTitle")}</h2>
      <p>{t("privacyScopeText")}</p>
      <h2>{t("residencyTitle")}</h2>
      <p>{t("residencyText")}</p>
    </LegalShell>
  );
}
