// Deterministische Tages-Auswahl aus zitate.json
// Gleiches Datum → gleiches Zitat — reproduzierbar für Archiv und Konsistenz

import zitateData from '../data/zitate.json';

export interface Zitat {
  text: string;
  autor: string | null;
}

/** Gibt das Tages-Zitat zurück — deterministisch via dayOfYear modulo Anzahl Zitate.
 *  Kein Zufall: bei wiederholtem Aufruf am selben Tag immer identisch. */
export function getTageszitat(datum: Date = new Date()): Zitat {
  const start = new Date(datum.getFullYear(), 0, 0);
  const diff = datum.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86_400_000);
  return zitateData.zitate[dayOfYear % zitateData.zitate.length] as Zitat;
}
