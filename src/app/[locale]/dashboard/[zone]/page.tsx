import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ZonePageBody } from "@/components/dashboard/zone-page-body";
import { zones, type ZoneKey } from "@/lib/modules";

export default async function ZonePage({
  params,
}: {
  params: Promise<{ locale: string; zone: string }>;
}) {
  const { locale, zone } = await params;
  setRequestLocale(locale);

  if (!zones.some((z) => z.key === zone)) notFound();

  return <ZonePageBody zone={zone as ZoneKey} />;
}
