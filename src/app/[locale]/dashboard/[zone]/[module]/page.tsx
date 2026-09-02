import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ModulePageBody } from "@/components/dashboard/module-page-body";
import { moduleByPath } from "@/lib/modules";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ locale: string; zone: string; module: string }>;
}) {
  const { locale, zone, module: slug } = await params;
  setRequestLocale(locale);

  const found = moduleByPath(zone, slug);
  if (!found) notFound();

  return <ModulePageBody module={found} />;
}
