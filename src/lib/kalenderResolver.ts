// Kalender-Accessor — gibt die heutigen Termine und Wochenübersicht zurück
// Aktuell statischer Stub · Google-Calendar-Read-Only-Anbindung kommt Phase 2.6

import data from '../data/kalender.json';

export interface Termin {
  zeit: string;
  titel: string;
}

export interface Kalender {
  heute: Termin[];
  woche: string;
}

/** Gibt die heutigen Termine und die Wochen-Übersicht zurück. */
export function getKalenderHeute(): Kalender {
  return data as Kalender;
}
