"use client";

import { useActionState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  parzelleAnlegen,
  plantageAnlegen,
  reihenblockAnlegen,
  reihengruppeAnlegen,
} from "@/lib/actions/standort";
import { leer } from "@/lib/actions/status";
import {
  AktionsMeldung,
  Auswahl,
  Feld,
  FormularKarte,
  SubmitKnopf,
} from "@/components/db/formular-kit";

export interface AuswahlOption {
  wert: string;
  text: string;
}

// Vier Formulare fuer die vier Ebenen unter dem Betrieb. Jedes schickt den
// aktuellen Pfad mit, damit die Server Action die Seite gezielt neu laden kann.
function PfadFeld() {
  const pfad = usePathname();
  return <input type="hidden" name="pfad" value={pfad} />;
}

export function PlantageFormular({ betriebId }: { betriebId: string }) {
  const [status, action] = useActionState(plantageAnlegen, leer);
  const t = useTranslations("standortVerwaltung");

  return (
    <FormularKarte titel={t("plantage.titel")} beschreibung={t("plantage.lead")}>
      <form action={action} className="space-y-2.5">
        <PfadFeld />
        <input type="hidden" name="betrieb_id" value={betriebId} />
        <Feld label={t("feld.name")} name="name" required placeholder="Plantage Talgar" />
        <Feld label={t("feld.ort")} name="ort" placeholder="Talgar, Gebiet Almaty" />
        <Auswahl
          label={t("feld.typ")}
          name="typ"
          options={[
            { wert: "eigen", text: t("typ.eigen") },
            { wert: "nachbarbetrieb", text: t("typ.nachbarbetrieb") },
          ]}
        />
        <SubmitKnopf />
        <AktionsMeldung status={status} />
      </form>
    </FormularKarte>
  );
}

export function ParzelleFormular({
  plantagen,
  sorten,
}: {
  plantagen: AuswahlOption[];
  sorten: AuswahlOption[];
}) {
  const [status, action] = useActionState(parzelleAnlegen, leer);
  const t = useTranslations("standortVerwaltung");

  return (
    <FormularKarte titel={t("parzelle.titel")} beschreibung={t("parzelle.lead")}>
      <form action={action} className="space-y-2.5">
        <PfadFeld />
        <Auswahl
          label={t("feld.plantage")}
          name="plantage_id"
          options={plantagen}
          required
        />
        <Feld label={t("feld.name")} name="name" required placeholder="Parzelle West" />
        <Feld
          label={t("feld.flaeche")}
          name="flaeche_ha"
          inputMode="decimal"
          placeholder="2,5"
        />
        <Auswahl
          label={t("feld.sorte")}
          name="sorte_id"
          options={[{ wert: "", text: t("feld.ohneSorte") }, ...sorten]}
        />
        <SubmitKnopf />
        <AktionsMeldung status={status} />
      </form>
    </FormularKarte>
  );
}

export function ReihengruppeFormular({
  parzellen,
}: {
  parzellen: AuswahlOption[];
}) {
  const [status, action] = useActionState(reihengruppeAnlegen, leer);
  const t = useTranslations("standortVerwaltung");

  return (
    <FormularKarte
      titel={t("reihengruppe.titel")}
      beschreibung={t("reihengruppe.lead")}
    >
      <form action={action} className="space-y-2.5">
        <PfadFeld />
        <Auswahl
          label={t("feld.parzelle")}
          name="feldparzelle_id"
          options={parzellen}
          required
        />
        <Feld
          label={t("feld.name")}
          name="name"
          required
          placeholder="Reihengruppe C"
        />
        <Auswahl
          label={t("feld.spalier")}
          name="spalierrichtung"
          options={[
            { wert: "n_s", text: "N-S" },
            { wert: "o_w", text: "O-W" },
          ]}
        />
        <SubmitKnopf />
        <AktionsMeldung status={status} />
      </form>
    </FormularKarte>
  );
}

export function ReihenblockFormular({
  gruppen,
  sorten,
}: {
  gruppen: AuswahlOption[];
  sorten: AuswahlOption[];
}) {
  const [status, action] = useActionState(reihenblockAnlegen, leer);
  const t = useTranslations("standortVerwaltung");

  return (
    <FormularKarte
      titel={t("reihenblock.titel")}
      beschreibung={t("reihenblock.lead")}
    >
      <form action={action} className="space-y-2.5">
        <PfadFeld />
        <Auswahl
          label={t("feld.reihengruppe")}
          name="reihengruppe_id"
          options={gruppen}
          required
        />
        <Feld label={t("feld.code")} name="code" required placeholder="T-N-A-09" />
        <Feld
          label={t("feld.laenge")}
          name="laenge_m"
          inputMode="decimal"
          placeholder="42"
        />
        <Auswahl
          label={t("feld.sorte")}
          name="sorte_id"
          options={[{ wert: "", text: t("feld.ohneSorte") }, ...sorten]}
        />
        <SubmitKnopf />
        <AktionsMeldung status={status} />
      </form>
    </FormularKarte>
  );
}
