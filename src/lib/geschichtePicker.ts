// Deterministische Tages-Auswahl aus geschichte.json
// Pattern analog zu zitatePicker.ts — gleiche Logik, anderer Daten-Key

import data from '../data/geschichte.json';

export interface Geschichte {
  jahr: number;
  text: string;
}

/** Gibt den Tages-Eintrag aus der Geschichte zurück — deterministisch via dayOfYear modulo.
 *  Echter Tages-Match (was geschah am 13. Mai?) kommt mit Cowork in Phase 5. */
export function getTagesgeschichte(datum: Date = new Date()): Geschichte {
  const start = new Date(datum.getFullYear(), 0, 0);
  const diff = datum.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86_400_000);
  return data.geschichte[dayOfYear % data.geschichte.length] as Geschichte;
}
