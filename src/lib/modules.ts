import type { Resource } from "./rbac";

// Zielarchitektur aus dem Pitch-Dossier: die vier Zonen Feld, Hof, Buero, Markt.
export type ZoneKey = "feld" | "hof" | "buero" | "markt";

// Klassifikation je Baustein aus Analyse Kapitel 5.
export type Klassifikation = "uebernehmen" | "anpassen" | "neu-bauen";

// Reifegrad im Prototyp:
//  - "demo": Hauptfunktion, im Prototyp als bedienbare Mock-Oberflaeche gebaut
//  - "in-entwicklung": Unterfunktion, sichtbarer Menuepunkt mit Status-Badge
export type Reifegrad = "demo" | "in-entwicklung";

export interface ModuleDef {
  key: string;
  zone: ZoneKey;
  slug: string;
  icon: string;
  resource: Resource;
  klassifikation: Klassifikation;
  reifegrad: Reifegrad;
  catiQuelle: string;
}

export interface ZoneDef {
  key: ZoneKey;
  slug: string;
  icon: string;
  accent: string;
}

export const zones: ZoneDef[] = [
  { key: "feld", slug: "feld", icon: "sprout", accent: "var(--accent)" },
  { key: "hof", slug: "hof", icon: "snowflake", accent: "var(--chart-5)" },
  { key: "buero", slug: "buero", icon: "briefcase", accent: "var(--primary)" },
  { key: "markt", slug: "markt", icon: "store", accent: "var(--warning)" },
];

export const modules: ModuleDef[] = [
  // ---------------------------------------------------------------- Zone Feld
  {
    key: "standort",
    zone: "feld",
    slug: "standort",
    icon: "map",
    resource: "standort",
    klassifikation: "anpassen",
    reifegrad: "demo",
    catiQuelle: "Migration 2, site-management-data.ts",
  },
  {
    key: "reihenbloecke",
    zone: "feld",
    slug: "reihenbloecke",
    icon: "grid-3x3",
    resource: "reihenbloecke",
    klassifikation: "anpassen",
    reifegrad: "demo",
    catiQuelle: "units-Zustandsautomat (occupied/vacant/blocked ...)",
  },
  {
    key: "pflueckaufgaben",
    zone: "feld",
    slug: "pflueckaufgaben",
    icon: "clipboard-check",
    resource: "pflueckaufgaben",
    klassifikation: "uebernehmen",
    reifegrad: "demo",
    catiQuelle: "Migration 6, workforce_tasks, media_reports",
  },
  {
    key: "pflanzenschutz",
    zone: "feld",
    slug: "pflanzenschutz",
    icon: "shield-alert",
    resource: "pflanzenschutz",
    klassifikation: "anpassen",
    reifegrad: "demo",
    catiQuelle: "payment-restriction-control.tsx (Sperre bis Bedingung erfuellt)",
  },
  {
    key: "rotationsplan",
    zone: "feld",
    slug: "rotationsplan",
    icon: "calendar-sync",
    resource: "rotationsplan",
    klassifikation: "neu-bauen",
    reifegrad: "in-entwicklung",
    catiQuelle: "ohne Vorbild - ics-calendar.ts nur fuer Export",
  },
  {
    key: "wetter",
    zone: "feld",
    slug: "wetter",
    icon: "cloud-sun",
    resource: "rotationsplan",
    klassifikation: "neu-bauen",
    reifegrad: "in-entwicklung",
    catiQuelle: "ohne Vorbild - einfache Wetter-API in Phase 1",
  },

  // ----------------------------------------------------------------- Zone Hof
  {
    key: "kuehlkette",
    zone: "hof",
    slug: "kuehlkette",
    icon: "thermometer-snowflake",
    resource: "kuehlkette",
    klassifikation: "neu-bauen",
    reifegrad: "in-entwicklung",
    catiQuelle: "ohne Vorbild - hoechste fachliche Prioritaet (60-Minuten-KPI)",
  },
  {
    key: "logistik",
    zone: "hof",
    slug: "logistik",
    icon: "truck",
    resource: "logistik",
    klassifikation: "anpassen",
    reifegrad: "in-entwicklung",
    catiQuelle: "booking-lifecycle-repository.ts, move-handover-repository.ts",
  },
  {
    key: "qr_steigen",
    zone: "hof",
    slug: "qr-steigen",
    icon: "qr-code",
    resource: "qr_steigen",
    klassifikation: "anpassen",
    reifegrad: "in-entwicklung",
    catiQuelle: "Migration 28, public-report-form.tsx, Paket qrcode",
  },
  {
    key: "esf",
    zone: "hof",
    slug: "lieferschein-esf",
    icon: "file-check-2",
    resource: "integrationen",
    klassifikation: "neu-bauen",
    reifegrad: "in-entwicklung",
    catiQuelle: "integration_outbox als Bruecke (kein Eigenbau)",
  },

  // --------------------------------------------------------------- Zone Buero
  {
    key: "rollen",
    zone: "buero",
    slug: "rollen",
    icon: "shield-check",
    resource: "rollen",
    klassifikation: "uebernehmen",
    reifegrad: "demo",
    catiQuelle: "lib/rbac.ts (6 Kernrollen, Guardianship entfernt)",
  },
  {
    key: "finanzen",
    zone: "buero",
    slug: "finanzen",
    icon: "coins",
    resource: "finanzen",
    klassifikation: "anpassen",
    reifegrad: "demo",
    catiQuelle: "finance_ledger_entries, accountant-finance-repository.ts",
  },
  {
    key: "personal",
    zone: "buero",
    slug: "personal",
    icon: "users",
    resource: "personal",
    klassifikation: "anpassen",
    reifegrad: "demo",
    catiQuelle: "StaffMember, workforce_tasks",
  },
  {
    key: "lohn",
    zone: "buero",
    slug: "lohn",
    icon: "calculator",
    resource: "lohn",
    klassifikation: "neu-bauen",
    reifegrad: "in-entwicklung",
    catiQuelle: "ohne Vorbild - Grundlohn + Menge + Qualitaetsfaktor",
  },
  {
    key: "dokumente",
    zone: "buero",
    slug: "dokumente",
    icon: "folder-lock",
    resource: "dokumente",
    klassifikation: "uebernehmen",
    reifegrad: "demo",
    catiQuelle: "document-storage.ts, Migration 9",
  },
  {
    key: "compliance",
    zone: "buero",
    slug: "compliance",
    icon: "scale",
    resource: "compliance",
    klassifikation: "anpassen",
    reifegrad: "demo",
    catiQuelle: "compliance-repository.ts, compliance-live-cockpit.tsx",
  },
  {
    key: "integrationen",
    zone: "buero",
    slug: "integrationen",
    icon: "plug",
    resource: "integrationen",
    klassifikation: "neu-bauen",
    reifegrad: "in-entwicklung",
    catiQuelle: "integration_outbox (ESF, ESUTD, gosagro.kz, qoldau.kz)",
  },
  {
    key: "foerdermittel",
    zone: "buero",
    slug: "foerdermittel",
    icon: "landmark",
    resource: "foerdermittel",
    klassifikation: "anpassen",
    reifegrad: "in-entwicklung",
    catiQuelle: "document-storage.ts, reporting-repository.ts (Container-Muster)",
  },

  // --------------------------------------------------------------- Zone Markt
  {
    key: "sortenkatalog",
    zone: "markt",
    slug: "sortenkatalog",
    icon: "book-open",
    resource: "sortenkatalog",
    klassifikation: "anpassen",
    reifegrad: "demo",
    catiQuelle: "listings -> Sorten-/Kontingentkatalog",
  },
  {
    key: "b2b_portal",
    zone: "markt",
    slug: "b2b-portal",
    icon: "handshake",
    resource: "b2b_portal",
    klassifikation: "anpassen",
    reifegrad: "in-entwicklung",
    catiQuelle: "reservations, listings, Finanzmodule (Buchungsmuster)",
  },
  {
    key: "preislisten",
    zone: "markt",
    slug: "preislisten",
    icon: "tag",
    resource: "b2b_portal",
    klassifikation: "anpassen",
    reifegrad: "in-entwicklung",
    catiQuelle: "reservations / Finanzmodule",
  },
  {
    key: "ki_assistent",
    zone: "markt",
    slug: "ki-assistent",
    icon: "sparkles",
    resource: "ki_assistent",
    klassifikation: "uebernehmen",
    reifegrad: "in-entwicklung",
    catiQuelle: "public-ai-chat.ts, ai-retrieval.ts, ai-guardrails.ts",
  },
  {
    key: "aggregator",
    zone: "markt",
    slug: "aggregator",
    icon: "network",
    resource: "aggregator",
    klassifikation: "anpassen",
    reifegrad: "in-entwicklung",
    catiQuelle: "vendor-invoice-repository.ts, vendors-Tabelle",
  },
  {
    key: "schulungen",
    zone: "markt",
    slug: "schulungen",
    icon: "graduation-cap",
    resource: "schulungen",
    klassifikation: "uebernehmen",
    reifegrad: "demo",
    catiQuelle: "video-library.ts, video-library-player.tsx",
  },
];

export function modulesForZone(zone: ZoneKey): ModuleDef[] {
  return modules.filter((module) => module.zone === zone);
}

export function moduleByPath(zone: string, slug: string): ModuleDef | undefined {
  return modules.find((module) => module.zone === zone && module.slug === slug);
}

export function moduleHref(module: ModuleDef): string {
  return `/dashboard/${module.zone}/${module.slug}`;
}
