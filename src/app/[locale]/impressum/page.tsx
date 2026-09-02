import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalShell } from "@/components/site/legal-shell";

export default async function ImpressumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal" });

  return (
    <LegalShell title={t("imprintTitle")}>
      <p>{t("prototypeDisclaimer")}</p>
      <h2>WAMOCON GmbH</h2>
      <p>
        Mergenthalerallee 79 - 81
        <br />
        65760 Eschborn, Deutschland
      </p>
      <p>
        <strong>Telefon:</strong> +49 6196 5838311
        <br />
        <strong>E-Mail:</strong> info@wamocon.com
      </p>
      <h2>{t("managingDirector")}</h2>
      <p>Dipl.-Ing. Waleri Moretz</p>
      <h2>{t("registration")}</h2>
      <p>
        Handelsregister: Eschborn HRB 123666
        <br />
        USt-IdNr.: DE344930486
      </p>
    </LegalShell>
  );
}
