import type { ReactNode } from "react";
import { SiteNavbar } from "@/components/site/navbar";
import { SiteFooter } from "@/components/site/footer";

export function LegalShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteNavbar />
      <main id="main" className="container pt-28 pb-20">
        <article className="prose-legal mx-auto max-w-2xl">
          <h1 className="text-3xl font-black text-foreground">{title}</h1>
          <div className="mt-6 space-y-4 text-sm leading-6 text-muted-foreground [&_h2]:mt-8 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-foreground [&_strong]:text-foreground">
            {children}
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
