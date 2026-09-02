"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, UserCog } from "lucide-react";
import { roles, type Role } from "@/lib/rbac";

// Der Prototyp hat keine Auth. Stattdessen eine Demo-Personaumschaltung: die
// gewaehlte Rolle steuert (via RBAC) die sichtbare Navigation und einige
// Panels - so laesst sich die uebernommene RBAC-Engine vorfuehren.
// localStorage ist die Quelle der Wahrheit, damit kein setState-im-Effect noetig ist.
const STORAGE_KEY = "malina-persona";
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function readRole(): Role {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (roles as readonly string[]).includes(stored)) {
      return stored as Role;
    }
  } catch {
    // ignore
  }
  return "admin";
}

const PersonaContext = createContext<{
  role: Role;
  setRole: (role: Role) => void;
}>({ role: "admin", setRole: () => {} });

export function PersonaProvider({ children }: { children: ReactNode }) {
  const role = useSyncExternalStore(subscribe, readRole, () => "admin" as Role);

  const setRole = useCallback((next: Role) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
    listeners.forEach((listener) => listener());
  }, []);

  const value = useMemo(() => ({ role, setRole }), [role, setRole]);
  return (
    <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>
  );
}

export function usePersona() {
  return useContext(PersonaContext);
}

export function PersonaSwitcher({ className }: { className?: string }) {
  const { role, setRole } = usePersona();
  const t = useTranslations("roles");

  return (
    <label
      className={`relative inline-flex items-center ${className ?? ""}`}
      title={t("switcherHint")}
    >
      <UserCog className="pointer-events-none absolute left-2 h-3.5 w-3.5 text-muted-foreground" />
      <select
        value={role}
        onChange={(event) => setRole(event.target.value as Role)}
        aria-label={t("switcherHint")}
        className="h-9 w-[190px] appearance-none rounded-lg border border-border bg-card pl-7 pr-7 text-xs font-semibold text-foreground shadow-sm transition-colors hover:border-primary focus:border-primary focus:outline-none"
      >
        {roles.map((r) => (
          <option key={r} value={r}>
            {t(r)}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-1.5 h-3.5 w-3.5 text-muted-foreground" />
    </label>
  );
}
