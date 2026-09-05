"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";

// Echtes Rundgangsmaterial aus der Plantage statt eines Stockfotos oder einer
// gezeichneten Animation - übernommen aus dem parallelen Projekt
// "Digitalisierung-Himbeerenbetrieb", das dafür bereits vor Ort gedreht hat.
// Bewusst ohne die dortige mehraktige Notations-Choreografie (die ist an
// exakt vermessene Bildkoordinaten dieses einen Schnitts gebunden) - hier
// läuft das Material als ruhige Endlosschleife im Hintergrund, mit denselben
// zwei Schutzmechanismen wie dort: reduzierte Bewegung und langsame
// Verbindung zeigen stattdessen nur das Standbild.

function verbindungErlaubtVideo(): boolean {
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  const c = nav.connection;
  if (!c) return true;
  if (c.saveData) return false;
  return c.effectiveType !== "slow-2g" && c.effectiveType !== "2g" && c.effectiveType !== "3g";
}

// window/navigator existieren beim serverseitigen Rendern nicht - die
// Entscheidung faellt deshalb ueber useSyncExternalStore statt useState im
// Effekt (Muster wie ThemeScript in theme-toggle.tsx): der Server-Snapshot
// ist immer "kein Video", der Client-Snapshot wird einmal nach der Hydrierung
// ermittelt. Kein Abonnement noetig, die Bedingungen aendern sich innerhalb
// eines Seitenaufrufs nicht.
const neverSubscribe = () => () => {};
const serverSnapshot = () => false;
const clientSnapshot = () =>
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches && verbindungErlaubtVideo();

export function HeroVideo({ className }: { className?: string }) {
  const zeigeVideo = useSyncExternalStore(neverSubscribe, clientSnapshot, serverSnapshot);

  // Kein eigenes "relative" hier: der Aufrufer bestimmt die Positionierung
  // (typischerweise "absolute inset-0" innerhalb einer Bühne mit eigenem
  // position-Kontext). Ein zusaetzliches "relative" auf demselben Element
  // widerspraeche dem und lieferte je nach Tailwind-Regelreihenfolge eine
  // Hoehe von 0 - das Bild und Video haetten dann nichts zum Ausfuellen.
  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <Image
        src="/hero-standbild.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {zeigeVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-standbild.webp"
        >
          <source src="/hero-himbeere.mp4" type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
