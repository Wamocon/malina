import { setRequestLocale } from "next-intl/server";
import { SiteNavbar } from "@/components/site/navbar";
import { SiteFooter } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import { FarmReality } from "@/components/site/farm-reality";
import { ExistingAssets } from "@/components/site/existing-assets";
import { QualityStandard } from "@/components/site/quality-standard";
import {
  BerryReality,
  ComplianceBlock,
  KpiPreview,
  LandingCta,
  Levers,
  PriceSpread,
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
        <FarmReality />
        <BerryReality />
        <PriceSpread />
        <QualityStandard />
        <ExistingAssets />
        <ProofChain />
        <Levers />
        <ZonesOverview />
        <KpiPreview />
        <ComplianceBlock />
        <LandingCta />
      </main>
      <SiteFooter />
    </>
  );
}
