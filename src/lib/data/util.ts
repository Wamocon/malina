// PostgREST liefert eingebettete 1:n-Beziehungen als Array, 1:1-Beziehungen je
// nach Constraint als Objekt. Dieser Helfer normalisiert beides auf "ein
// Datensatz oder null", damit die Views nicht zwei Faelle behandeln muessen.
export function einsAus<T>(wert: T | T[] | null | undefined): T | null {
  if (Array.isArray(wert)) return wert[0] ?? null;
  return wert ?? null;
}

// Datumsangaben aus der Datenbank kommen als ISO-String (YYYY-MM-DD).
export function heuteIso(): string {
  return new Date().toISOString().slice(0, 10);
}
