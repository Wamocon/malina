# Malina

Interner Prototyp einer Betriebssteuerung für einen **Himbeerbetrieb im Umland Almaty**.
Malina überträgt das bestehende **1Çatı**-ERP-Ökosystem (Immobilienbranche) identisch,
nur mit anderem fachlichen Fokus, auf den Agrar-Kontext.

> **Status:** Meilenstein B - Grundgerüst mit echten Hauptfunktionen.
> Anmeldung, Rollenrechte (Row Level Security), Standortverwaltung, Reihenblock-Sperre,
> Pflückaufgabe mit Fotobeleg und Dokumentenablage laufen gegen die Datenbank.
> Die Unterfunktionen bleiben planmäßig sichtbare Menüpunkte mit Status
> "In Entwicklung". Alle Kennzahlenwerte sind weiterhin Platzhalter.

## Tech Stack

- **Framework:** Next.js 16 (App Router, `src/app/`)
- **Sprache:** TypeScript (strict)
- **Styling:** Tailwind CSS v4, Design-Tokens in `src/app/globals.css` (Himbeer-Palette)
- **i18n:** next-intl v4 - Deutsch, Englisch, Türkisch, Kasachisch, Russisch (`src/messages/`)
- **Locale-Routing und Session:** `src/proxy.ts` (Next.js 16 Proxy)
- **Datenbank:** Supabase (PostgreSQL, RLS, Auth, Storage) - lokal über die Supabase CLI

## Zwei Betriebsarten

| Modus | Voraussetzung | Verhalten |
|---|---|---|
| **Demo** | keine Supabase-Variablen in `.env.local` | Alle Ansichten zeigen die Beispieldaten aus `src/lib/domain/`, die Rolle ist frei umschaltbar, keine Anmeldung |
| **Datenbank** | `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` gesetzt | Echte Anmeldung, echte Daten, Schreibvorgänge unter RLS |

Jede angebundene Ansicht zeigt oben rechts, aus welcher Quelle sie liest
("Live-Daten" oder "Beispieldaten").

## Quick Start

### Ohne Datenbank (reine Demo)

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) öffnen - leitet auf `/de` weiter.

### Mit Datenbank

```bash
npm install
supabase start          # lokale Supabase-Instanz (Docker)
npm run db:reset        # Migrationen + Seed + Demo-Benutzer
npm run dev
```

Anmeldung unter `/de/login`. Die sechs Demo-Konten werden von `npm run db:seed-auth`
angelegt - je Rolle eines, Passwort für alle `MalinaDemo2026!`:

| Rolle | Konto |
|---|---|
| Administration | `admin@malina.demo` |
| Betriebsleitung | `leitung@malina.demo` |
| Buchhaltung | `buchhaltung@malina.demo` |
| Brigade / Feld | `brigade@malina.demo` |
| Erzeuger | `erzeuger@malina.demo` |
| Kunde | `kunde@malina.demo` |

## Struktur

| Pfad | Inhalt |
|---|---|
| `src/app/[locale]/page.tsx` | Öffentliche Landingpage |
| `src/app/[locale]/login/` | Anmeldung und Server Actions für An-/Abmeldung |
| `src/app/[locale]/dashboard/` | Dashboard-Shell + Zonen `feld`, `hof`, `buero`, `markt` |
| `src/lib/modules.ts` | Zonen- und Modul-Registry (Reifegrad, Klassifikation) |
| `src/lib/rbac.ts` | Sechs Kernrollen und Rechtematrix |
| `src/lib/auth.ts` | Session, Profil und Berechtigungsprüfung für Server Actions |
| `src/lib/data/` | Datenbankabfragen mit Rückfall auf die Beispieldaten |
| `src/lib/actions/` | Server Actions (Schreibvorgänge, jeweils RBAC- und RLS-geprüft) |
| `src/lib/domain/` | Beispieldaten (Hierarchie, Reihenblöcke, Pflückaufgaben, KPIs) |
| `src/components/db/` | Datenbankgestützte Modulansichten (Meilenstein B) |
| `src/components/demo/` | Demo-Oberflächen der noch nicht angebundenen Module |
| `supabase/migrations/` | Schema, RLS-Policies, Trigger, Storage-Buckets |

## Regeln, die in der Datenbank liegen

Nicht im UI, sondern als Trigger bzw. Funktion - sie greifen auch bei direktem API-Zugriff:

- **Wartezeitsperre:** Eine neue Pflanzenschutzbehandlung sperrt den Reihenblock
  (`lock_reihenblock_on_behandlung`); ein vorzeitiger Statuswechsel wird abgewiesen
  (`reihenblock_sperre_pruefen`); die reguläre Freigabe läuft über
  `reihenblock_freigeben()`.
- **Kein Pflücken auf gesperrtem Block:** `pflueckaufgabe_sperre_pruefen`.
- **Append-only:** Finanzjournal und Audit-Protokoll lassen sich weder ändern
  noch löschen (`block_ledger_mutation`).

## Scripts

| Command | Beschreibung |
|---|---|
| `npm run dev` | Dev-Server (Turbopack) |
| `npm run build` | Produktions-Build |
| `npm run typecheck` | TypeScript-Prüfung |
| `npm run lint` | ESLint |
| `npm run verify` | typecheck + lint + build |
| `npm run db:reset` | Datenbank zurücksetzen: Migrationen, Seed, Demo-Benutzer |
| `npm run db:seed-auth` | Nur die sechs Demo-Benutzer anlegen bzw. auffrischen |
| `npm run db:types` | TypeScript-Typen aus dem lokalen Schema erzeugen |
| `npm run db:test` | Integrationstests: Round-Trip, RLS je Rolle, Sperrlogik |

## Dokumentation

- **[docs/manual/index.html](docs/manual/index.html)** - Produkthandbuch
- Technische Analyse: `WMC_TechnischeAnalyse_1Cati_Himbeerplantage.md` (extern)
