// Event-Resolver — liefert das aktive Event für ein Datum oder null
// Bei mehreren Events am gleichen Tag: erstes Match. Verfeinerung später bei Bedarf.
// Datum-Vergleich via toISOString() in UTC — für 06:30-CEST-Builds stabil

import data from '../data/events.json';

export interface Event {
  datum: string;
  uhrzeit: string;
  titel: string;
  beschreibung: string;
  prioritaet: 'hoch' | 'mittel' | 'niedrig';
}

/** Gibt das aktive Event für ein Datum zurück, oder null wenn keines vorhanden. */
export function getAktivenEvent(datum: Date = new Date()): Event | null {
  const heute = datum.toISOString().slice(0, 10); // YYYY-MM-DD
  const match = data.events.find((e) => e.datum === heute);
  return match ? (match as Event) : null;
}
