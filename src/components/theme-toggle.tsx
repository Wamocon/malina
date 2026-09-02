"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

// Kein next-themes - der Prototyp haelt es schlank: eine Klasse `.dark` auf
// <html>, in localStorage gespiegelt. Der Anti-Flash-Setter (themeInitScript
// unten) wird im Locale-Layout ueber `next/script` mit strategy
// "beforeInteractive" eingebunden und laeuft vor der Hydration.
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function isDark() {
  return (
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("common");
  const dark = useSyncExternalStore(
    subscribe,
    isDark,
    () => false,
  );

  function toggle() {
    const next = !isDark();
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("malina-theme", next ? "dark" : "light");
    } catch {
      // localStorage nicht verfuegbar - Auswahl gilt nur fuer diese Sitzung
    }
    listeners.forEach((listener) => listener());
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? t("themeLight") : t("themeDark")}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted",
        className,
      )}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export const themeInitScript = `(function(){try{var t=localStorage.getItem('malina-theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&m)){document.documentElement.classList.add('dark');}}catch(e){}})();`;
