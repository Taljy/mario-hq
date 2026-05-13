// Wetter-Accessor — gibt die heutigen Wetterdaten zurück
// Aktuell statischer Stub · Live-MeteoSwiss-Anbindung kommt Phase 2.4
// Pattern konsistent mit anderen Resolvern für spätere Datum-gestützte Auswahl

import data from '../data/wetter.json';

export interface Wetter {
  datum: string;
  ort: string;
  temperatur: number;
  min: number;
  bedingung: string;
  wind: string;
  goldene_stunde: string;
  blaue_stunde: string;
  foto_hinweis: string;
}

/** Gibt die heutigen Wetterdaten zurück. */
export function getWetterHeute(): Wetter {
  return data as Wetter;
}
