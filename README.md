# Malina

Interner Prototyp einer Betriebssteuerung für einen **Himbeerbetrieb im Umland Almaty**.
Malina überträgt das bestehende **1Çatı**-ERP-Ökosystem (Immobilienbranche) identisch,
nur mit anderem fachlichen Fokus, auf den Agrar-Kontext.

> **Status:** Meilenstein A - anschaubarer Prototyp mit Optik und Funktionsumfang.
> Keine Datenbank, keine Auth, keine echte Datenverarbeitung. Alle Werte sind Platzhalter.

## Tech Stack

- **Framework:** Next.js 16 (App Router, `src/app/`)
- **Sprache:** TypeScript (strict)
- **Styling:** Tailwind CSS v4, Design-Tokens in `src/app/globals.css` (Himbeer-Palette)
- **i18n:** next-intl v4 - Deutsch, Türkisch, Kasachisch, Russisch (`src/messages/`)
- **Locale-Routing:** `src/proxy.ts` (Next.js 16 Proxy), erzwungenes Locale-Präfix

## Quick Start

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) öffnen - leitet auf `/de` weiter.
Dashboard unter `/de/dashboard`. Demo-Rolle und Sprache oben rechts umschaltbar.

## Struktur

| Pfad | Inhalt |
|---|---|
| `src/app/[locale]/page.tsx` | Öffentliche Landingpage |
| `src/app/[locale]/dashboard/` | Dashboard-Shell + Zonen `feld`, `hof`, `buero`, `markt` |
| `src/lib/modules.ts` | Zonen- und Modul-Registry (Reifegrad, Klassifikation, 1Çatı-Quelle) |
| `src/lib/rbac.ts` | Sechs Kernrollen, übernommen aus 1Çatı |
| `src/lib/domain/` | Mock-Daten (Hierarchie, Reihenblöcke, Pflückaufgaben, KPIs) |
| `src/components/demo/` | Bedienbare Demo-Oberflächen der Hauptfunktionen |

## Scripts

| Command | Beschreibung |
|---|---|
| `npm run dev` | Dev-Server (Turbopack) |
| `npm run build` | Produktions-Build |
| `npm run typecheck` | TypeScript-Prüfung |
| `npm run lint` | ESLint |
| `npm run verify` | typecheck + lint + build |

## Dokumentation

- **[docs/manual/index.html](docs/manual/index.html)** - Produkthandbuch
- Technische Analyse: `WMC_TechnischeAnalyse_1Cati_Himbeerplantage.md` (extern)
