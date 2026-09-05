import { setRequestLocale } from "next-intl/server";
import { DashboardHome } from "@/components/dashboard/home";
import { ladeKpis } from "@/lib/data/kpis";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Die Baseline-Kennzahlen kommen aus public.kpi_baseline (Meilenstein B).
  const { kpis, quelle } = await ladeKpis();

  return <DashboardHome kpis={kpis} quelle={quelle} />;
}
