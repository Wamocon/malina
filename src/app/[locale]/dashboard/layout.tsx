import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import { PersonaProvider } from "@/components/dashboard/persona";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PersonaProvider>
      <div className="dashboard-shell flex min-h-svh w-full">
        <DashboardSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopbar />
          <main id="main" className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </PersonaProvider>
  );
}
