import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ModulePageBody } from "@/components/dashboard/module-page-body";
import { serverModulAnsicht } from "@/components/db/server-module-views";
import { moduleByPath } from "@/lib/modules";

export default async function ModulePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; zone: string; module: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale, zone, module: slug } = await params;
  setRequestLocale(locale);

  const found = moduleByPath(zone, slug);
  if (!found) notFound();

  const suche = await searchParams;
  // Datenbankgestuetzte Module rendern serverseitig; alle uebrigen fallen auf
  // die Client-Demo-Ansicht zurueck (siehe serverModulAnsicht).
  const ansicht = serverModulAnsicht(found, {
    pfad: `/dashboard/${zone}/${slug}`,
    suche: {
      status: typeof suche.status === "string" ? suche.status : undefined,
      aufgabe: typeof suche.aufgabe === "string" ? suche.aufgabe : undefined,
    },
  });

  return <ModulePageBody module={found}>{ansicht}</ModulePageBody>;
}
