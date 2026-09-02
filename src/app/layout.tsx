import type { ReactNode } from "react";

// Die eigentliche <html>/<body>-Struktur liegt in `app/[locale]/layout.tsx`
// (next-intl App-Router-Setup mit erzwungenem Locale-Praefix). Dieses Root-
// Layout reicht die Kinder nur durch, wird aber von Next.js verlangt, sobald
// eine `not-found.tsx` auf Root-Ebene existiert.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
