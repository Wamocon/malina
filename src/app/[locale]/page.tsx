import { setRequestLocale } from "next-intl/server";
import { SiteNavbar } from "@/components/site/navbar";
import { SiteFooter } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import {
  ComplianceBlock,
  KpiPreview,
  LandingCta,
  Levers,
  ProofChain,
  ZonesOverview,
} from "@/components/site/landing";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SiteNavbar />
      <main id="main" className="pt-16">
        <Hero />
        <ZonesOverview />
        <ProofChain />
        <Levers />
        <KpiPreview />
        <ComplianceBlock />
        <LandingCta />
      </main>
      <SiteFooter />
    </>
  );
}
