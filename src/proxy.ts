import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

// Next.js 16: `src/proxy.ts` ersetzt das veraltete `middleware.ts`.
// Uebernimmt die Locale-Weiterleitung von next-intl (localePrefix: "always"),
// analog zu 1Cati `apps/web/proxy.ts` - nur ohne Supabase-Session, da der
// Prototyp keine Auth hat.
const handleI18nRouting = createMiddleware(routing);

export function proxy(request: NextRequest) {
  return handleI18nRouting(request);
}

export const config = {
  // Alles ausser API-Routen, Next-Internals und Dateien mit Endung.
  matcher: ["/", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
