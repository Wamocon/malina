"use client";

import type { ComponentType } from "react";
import type { ModuleDef } from "@/lib/modules";
import { ModulePlaceholder } from "@/components/dashboard/module-meta";
import { ReihenbloeckeDemo } from "@/components/demo/reihenbloecke";
import { PflueckaufgabenDemo } from "@/components/demo/pflueckaufgaben";
import { StandortDemo, PflanzenschutzDemo } from "@/components/demo/feld-extra";
import {
  ComplianceDemo,
  DokumenteDemo,
  FinanzenDemo,
  PersonalDemo,
  RollenDemo,
} from "@/components/demo/buero";
import { SchulungenDemo, SortenkatalogDemo } from "@/components/demo/markt";
import {
  KiAssistentMock,
  KuehlketteMock,
  QrSteigenMock,
} from "@/components/demo/mocks";

type ModuleView = ComponentType<{ module: ModuleDef }>;

const plain = (Cmp: ComponentType): ModuleView =>
  function Wrapped() {
    return <Cmp />;
  };

const registry: Record<string, ModuleView> = {
  standort: plain(StandortDemo),
  reihenbloecke: plain(ReihenbloeckeDemo),
  pflueckaufgaben: plain(PflueckaufgabenDemo),
  pflanzenschutz: plain(PflanzenschutzDemo),
  rollen: plain(RollenDemo),
  finanzen: plain(FinanzenDemo),
  personal: plain(PersonalDemo),
  dokumente: plain(DokumenteDemo),
  compliance: plain(ComplianceDemo),
  sortenkatalog: plain(SortenkatalogDemo),
  schulungen: plain(SchulungenDemo),
  kuehlkette: KuehlketteMock,
  qr_steigen: QrSteigenMock,
  ki_assistent: KiAssistentMock,
};

export function ModuleView({ module }: { module: ModuleDef }) {
  const Cmp = registry[module.key];
  if (Cmp) return <Cmp module={module} />;
  return <ModulePlaceholder module={module} />;
}
