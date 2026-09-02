import { defineRouting } from "next-intl/routing";

// Sprachen von Malina (Analyse Kapitel 7): Deutsch, Tuerkisch, Kasachisch, Russisch.
// Englisch (en) aus 1Cati entfaellt, Kasachisch (kk) kommt hinzu.
// Startsprache: Deutsch (interner Demo- und Freigabe-Kontext).
export const routing = defineRouting({
  locales: ["de", "tr", "kk", "ru"],
  defaultLocale: "de",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
