// Schematische Himbeere und Verkaufsschale für die Qualitätsreferenz -
// übernommen aus dem parallelen Projekt "Digitalisierung-Himbeerenbetrieb".
//
// Warum Zeichnung und nicht Foto:
//
// 1. Ein Foto zeigt eine Beere. Die Zeichnung zeigt das Merkmal. Auf einem
//    Foto von Grauschimmel sieht man auch Licht, Hintergrund, Schärfentiefe
//    und die Nachbarbeere - alles, was ablenkt. Hier ist nur das übrig, was
//    die Entscheidung trägt.
// 2. Größe. Die Referenz wird im Feld aufgerufen, oft am Rand des Netzes. Ein
//    brauchbares Beerenfoto liegt bei 200 bis 500 KB, dieses SVG bei rund
//    vier. Sieben Merkmale als Foto wären ein Ladebalken, den niemand
//    abwartet.
// 3. Sprache. Beschriftungen kommen von außen und damit aus der
//    Übersetzungsdatei. Ein Foto mit eingebranntem Text bräuchte fünf
//    Fassungen.
//
// Fachliche Grundlage der Merkmale ist die UNECE-Norm FFV-32 für Himbeeren
// (Mindesteigenschaften und Klassen). Welche Abweichung der Betrieb in welche
// Stufe einordnet, legt der Agronom fest.

export type BeerenVariante =
  | "ok"
  | "colour"
  | "shape"
  | "receptacle"
  | "bruise"
  | "mould"
  | "moisture";

// Die Steinfrüchtchen. Eine Himbeere ist keine Beere im botanischen Sinn,
// sondern eine Sammelsteinfrucht: viele kleine Früchtchen um einen hohlen
// Kern. Von oben nach unten zulaufend, weil sie so am Strauch hängt.
const DRUPLETTEN: ReadonlyArray<readonly [number, number, number]> = [
  [33, 44, 15], [60, 40, 15], [87, 44, 15],
  [37, 66, 15], [60, 62, 15], [83, 66, 15],
  [46, 87, 14], [74, 87, 14],
  [60, 105, 13],
];

const FARBE = {
  reif: "#b11742",
  reifHell: "#d43a63",
  unreif: "#e88ea3",
  unreifHell: "#f2b3c1",
  ueberreif: "#6d1030",
  ueberreifHell: "#8f1c42",
  schimmel: "#9e9e9e",
  bluetenboden: "#f2e4cf",
  druckstelle: "#5a0a24",
} as const;

function toene(v: BeerenVariante): readonly [string, string] {
  if (v === "colour") return [FARBE.unreif, FARBE.unreifHell];
  if (v === "bruise") return [FARBE.ueberreif, FARBE.ueberreifHell];
  return [FARBE.reif, FARBE.reifHell];
}

export function Beere({
  variante = "ok",
  groesse = 120,
  titel,
}: {
  variante?: BeerenVariante;
  groesse?: number;
  /** Wird als zugängliche Bezeichnung gesetzt. Ohne sie ist das SVG dekorativ. */
  titel?: string;
}) {
  const [grund, glanz] = toene(variante);
  const id = `b-${variante}`;

  // Bei "shape" fehlen zwei Steinfrüchtchen und eines sitzt versetzt: die
  // Beere zerfällt. Das ist der häufigste Grund für zweite Wahl und der
  // einzige, den man am Strauch schon sehen kann.
  const fehlend = variante === "shape" ? new Set([2, 5]) : new Set<number>();

  return (
    <svg
      viewBox="0 0 120 140"
      width={groesse}
      height={(groesse / 120) * 140}
      role={titel ? "img" : "presentation"}
      aria-label={titel}
      aria-hidden={titel ? undefined : true}
    >
      <defs>
        <radialGradient id={`${id}-g`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0%" stopColor={glanz} />
          <stop offset="100%" stopColor={grund} />
        </radialGradient>
      </defs>

      {DRUPLETTEN.map(([x, y, r], i) =>
        fehlend.has(i) ? null : (
          <circle
            key={i}
            cx={variante === "shape" && i === 7 ? x + 9 : x}
            cy={variante === "shape" && i === 7 ? y + 6 : y}
            r={r}
            fill={`url(#${id}-g)`}
            stroke={grund}
            strokeWidth="1.5"
          />
        ),
      )}

      {/* Der hohle Kern. Eine erntereife Himbeere löst sich vom Blütenboden
          und bleibt hohl zurück - der zuverlässigste Reifenachweis, den ein
          Mensch ohne Gerät prüfen kann. */}
      {variante !== "receptacle" && (
        <ellipse cx="60" cy="40" rx="16" ry="7" fill="#101010" opacity="0.55" />
      )}

      {/* Steckt der Blütenboden noch in der Beere, wurde sie mit Kraft gelöst
          statt abgenommen: unreif, verliert beim Transport Saft. */}
      {variante === "receptacle" && (
        <>
          <ellipse cx="60" cy="40" rx="16" ry="7" fill={FARBE.bluetenboden} />
          <path
            d="M49 38 L60 21 L71 38 Z"
            fill={FARBE.bluetenboden}
            stroke="#c9b696"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </>
      )}

      {variante === "bruise" && (
        <>
          <ellipse cx="74" cy="82" rx="20" ry="15" fill={FARBE.druckstelle} opacity="0.85" />
          <path d="M74 96 q3 10 -1 18 q-4 -8 -1 -18 Z" fill={FARBE.druckstelle} />
        </>
      )}

      {variante === "mould" && (
        <g opacity="0.92">
          <circle cx="46" cy="87" r="17" fill={FARBE.schimmel} />
          <circle cx="60" cy="76" r="12" fill={FARBE.schimmel} opacity="0.8" />
          {[[36, 74], [46, 68], [56, 72], [40, 100], [54, 98]].map(([x, y], i) => (
            <line
              key={i}
              x1={x} y1={y} x2={x + (i % 2 ? 5 : -5)} y2={y - 9}
              stroke={FARBE.schimmel} strokeWidth="2" strokeLinecap="round"
            />
          ))}
        </g>
      )}

      {variante === "moisture" && (
        <g fill="#7ec8f0" opacity="0.75">
          <path d="M40 58 q4 8 0 12 q-4 -4 0 -12 Z" />
          <path d="M78 72 q4 8 0 12 q-4 -4 0 -12 Z" />
          <path d="M58 94 q4 8 0 12 q-4 -4 0 -12 Z" />
        </g>
      )}
    </svg>
  );
}

// Schematische Verkaufsschale im Querschnitt. Der Querschnitt und nicht die
// Draufsicht, weil das teuerste Problem eine Höhe ist: Himbeeren tragen kein
// Eigengewicht. Wird über den Rand gefüllt, drückt der Deckel, und die
// untere Lage ist bei der Ankunft im Laden Saft. Von oben betrachtet sieht
// genau diese Schale am besten aus - der Fehler ist nur von der Seite zu
// sehen.
export type SchalenVariante = "ok" | "overfilled" | "loose";

const LAGEN: Record<SchalenVariante, ReadonlyArray<readonly [number, number]>> = {
  ok: [[62, 76], [90, 74], [118, 76], [146, 74]],
  overfilled: [
    [62, 78], [90, 78], [118, 78], [146, 78],
    [76, 50], [104, 48], [132, 50],
    [90, 26], [118, 26],
  ],
  loose: [[68, 78], [116, 76], [150, 78]],
};

export function Schale({
  variante = "ok",
  groesse = 200,
  titel,
}: {
  variante?: SchalenVariante;
  groesse?: number;
  titel?: string;
}) {
  const beeren = LAGEN[variante];
  const id = `s-${variante}`;
  const gequetscht = (y: number) => variante === "overfilled" && y > 70;

  return (
    <svg
      viewBox="0 0 208 120"
      width={groesse}
      height={(groesse / 208) * 120}
      role={titel ? "img" : "presentation"}
      aria-label={titel}
      aria-hidden={titel ? undefined : true}
    >
      <defs>
        <radialGradient id={`${id}-g`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#d43a63" />
          <stop offset="100%" stopColor="#b11742" />
        </radialGradient>
      </defs>

      <line
        x1="16" y1="44" x2="192" y2="44"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.5"
        strokeDasharray="5 5"
      />

      {beeren.map(([x, y], i) => (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx={gequetscht(y) ? 16 : 14}
          ry={gequetscht(y) ? 11 : 14}
          fill={gequetscht(y) ? "#5a0a24" : `url(#${id}-g)`}
          stroke={gequetscht(y) ? "#5a0a24" : "#b11742"}
          strokeWidth="1.5"
        />
      ))}

      <path
        d="M34 44 L54 100 L154 100 L174 44"
        fill="rgba(255,255,255,0.14)"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M28 44 L180 44" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" />

      {variante === "overfilled" && (
        <path d="M28 14 L180 14" stroke="#f40e0e" strokeWidth="3" strokeLinecap="round" />
      )}
    </svg>
  );
}
