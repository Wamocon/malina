import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// Next.js 16: `src/proxy.ts` ersetzt das veraltete `middleware.ts`.
// Zwei Aufgaben, in dieser Reihenfolge:
//   1. Locale-Weiterleitung von next-intl (localePrefix: "always")
//   2. Supabase-Session auffrischen und /dashboard schuetzen (Meilenstein B)
// Ohne Supabase-Umgebung entfaellt Schritt 2 - der Demo-Modus bleibt ohne
// Datenbank startbar.
const handleI18nRouting = createMiddleware(routing);

const localePrefix = routing.locales.join("|");
const dashboardPfad = new RegExp(`^/(?:${localePrefix})/dashboard(?:/|$)`);
const loginPfad = new RegExp(`^/(?:${localePrefix})/login(?:/|$)`);

function localeAus(pfad: string): string {
  const kandidat = pfad.split("/")[1];
  return (routing.locales as readonly string[]).includes(kandidat)
    ? kandidat
    : routing.defaultLocale;
}

// Beim Umleiten die von Supabase aufgefrischten Cookies mitnehmen, sonst geht
// das erneuerte Token verloren.
function weiterleiten(ziel: URL, quelle: NextResponse): NextResponse {
  const redirect = NextResponse.redirect(ziel);
  for (const cookie of quelle.cookies.getAll()) {
    redirect.cookies.set(cookie);
  }
  return redirect;
}

export async function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);
  if (!isSupabaseConfigured()) return response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pfad = request.nextUrl.pathname;
  const locale = localeAus(pfad);

  if (!user && dashboardPfad.test(pfad)) {
    const ziel = new URL(`/${locale}/login`, request.url);
    ziel.searchParams.set("weiter", pfad);
    return weiterleiten(ziel, response);
  }

  if (user && loginPfad.test(pfad)) {
    return weiterleiten(new URL(`/${locale}/dashboard`, request.url), response);
  }

  return response;
}

export const config = {
  // Alles ausser API-Routen, Next-Internals und Dateien mit Endung.
  matcher: ["/", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
