import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, ShieldCheck, Timer } from "lucide-react";
import { Link } from "@/i18n/navigation";

const HERO_IMG =
  "https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&w=1600&q=70";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-[#20060f] text-white">
      {/* Platzhalterbild Himbeerplantage - wird laut Analyse Kapitel 8 spaeter
          1:1 durch echtes Betriebsmaterial aus Kasachstan ersetzt. */}
      <Image
        src={HERO_IMG}
        alt={t("imageAlt")}
        fill
        sizes="100vw"
        priority
        className="object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,3,9,0.92)_0%,rgba(20,3,9,0.7)_45%,rgba(20,3,9,0.35)_100%)]" />

      <div className="container relative z-10 flex min-h-[calc(100svh-4rem)] flex-col justify-center py-16">
        <div className="mb-5 inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-white/80">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {t("badge")}
        </div>
        <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
          {t("headline")}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
          {t("subheadline")}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-black text-[#20060f] shadow-xl transition hover:-translate-y-0.5 hover:bg-white/90"
          >
            {t("ctaPrimary")}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#zonen"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
          >
            {t("ctaSecondary")}
          </a>
        </div>

        <dl className="mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
          {[
            { icon: Timer, k: "stat1Value", v: "stat1Label" },
            { icon: ShieldCheck, k: "stat2Value", v: "stat2Label" },
            { icon: ArrowRight, k: "stat3Value", v: "stat3Label" },
          ].map(({ icon: I, k, v }) => (
            <div
              key={k}
              className="rounded-2xl border border-white/15 bg-white/[0.06] p-4 backdrop-blur-xl"
            >
              <I className="mb-2 h-4 w-4 text-primary" />
              <dt className="text-lg font-black text-white">{t(k)}</dt>
              <dd className="mt-0.5 text-xs leading-relaxed text-white/70">
                {t(v)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
