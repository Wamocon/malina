"use client";

import { useTranslations } from "next-intl";
import { Bell, Search } from "lucide-react";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { PersonaSwitcher } from "@/components/dashboard/persona";

export function DashboardTopbar() {
  const t = useTranslations("dashboard");

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 pl-16 backdrop-blur-xl md:px-6 md:pl-6">
      <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground sm:flex">
        <Search className="h-4 w-4 shrink-0" />
        <span className="truncate">{t("searchPlaceholder")}</span>
      </div>
      <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
        <PersonaSwitcher className="hidden lg:inline-flex" />
        <LocaleSwitcher compact />
        <ThemeToggle />
        <button
          type="button"
          aria-label={t("notifications")}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
      </div>
    </header>
  );
}
