import Image from "next/image";
import { useTranslations } from "next-intl";

// Echte Aufnahmen von der Plantage statt eines Bildarchivs - übernommen aus
// dem parallelen Projekt "Digitalisierung-Himbeerenbetrieb", das dafür bereits
// vor Ort fotografiert hat. Das dritte Bild der Reihe zeigt bewusst einen
// Mangel (Kühlraum bei +16 °C statt nahe 0 °C): ein Auftritt, der nur das
// Gelungene zeigt, liest sich für einen Einkäufer als Werbung; einer, der den
// offenen Punkt selbst benennt, als Bestandsaufnahme.
export function FarmReality() {
  const t = useTranslations("farmReality");

  const fotos = [
    { bild: "polka-frucht", key: "photo1", offen: false },
    { bild: "ernte-steigen", key: "photo2", offen: false },
    { bild: "ernte-lager", key: "photo3", offen: true },
  ] as const;

  return (
    <section className="border-b border-border py-16 md:py-24">
      <div className="container">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">
          {t("eyebrow")}
        </p>
        <h2 className="mt-2 max-w-2xl text-3xl font-black text-foreground md:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          {t("lead")}
        </p>

        {/* Breites Band zuerst: zeigt die Groesse der Anlage, die in einer
            Spalte verlorenginge. */}
        <figure className="mt-10 overflow-hidden rounded-2xl border border-border">
          <div className="relative aspect-1280/548 w-full">
            <Image
              src="/betrieb/anlage-weit.webp"
              alt={t("bandCaption")}
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              loading="lazy"
              className="object-cover"
            />
          </div>
          <figcaption className="bg-card px-4 py-2.5 text-xs text-muted-foreground">
            {t("bandCaption")}
          </figcaption>
        </figure>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {fotos.map(({ bild, key, offen }) => (
            <figure
              key={bild}
              className={`overflow-hidden rounded-2xl border ${
                offen ? "border-warning/40" : "border-border"
              }`}
            >
              <div className="relative aspect-4/5 w-full">
                <Image
                  src={`/betrieb/${bild}.webp`}
                  alt={t(`${key}Title`)}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  loading="lazy"
                  className="object-cover"
                />
              </div>
              <figcaption className="bg-card p-4">
                <p className="text-sm font-bold text-card-foreground">
                  {t(`${key}Title`)}
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {t(`${key}Text`)}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
