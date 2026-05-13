// Ausgabe-Counter und Datums-Hilfsfunktionen für Mario's HQ
// Start-Datum: 30. April 2026 — Marios bewusst gesetzter Anker

export const AUSGABE_START = new Date(2026, 3, 30); // Monat 0-indexiert → April = 3

/** Gibt die Ausgabe-Nummer für ein Datum zurück (1-basiert). */
export function getAusgabe(datum: Date = new Date()): number {
  const diff = datum.getTime() - AUSGABE_START.getTime();
  return Math.floor(diff / 86_400_000) + 1;
}

/** Gibt die formatierte Ausgabe-Nummer zurück — z.B. "#0014". */
export function getAusgabeFormatiert(datum: Date = new Date()): string {
  return `#${String(getAusgabe(datum)).padStart(4, '0')}`;
}

/** Gibt die ISO-8601-Kalenderwoche zurück — Woche beginnt Montag,
 *  Woche 1 enthält den ersten Donnerstag des Jahres. */
export function getKW(datum: Date = new Date()): number {
  const d = new Date(Date.UTC(datum.getFullYear(), datum.getMonth(), datum.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

/** Gibt den deutschen Wochentag zurück — z.B. "Mittwoch". */
export function getWochentag(datum: Date = new Date()): string {
  const tage = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch',
                'Donnerstag', 'Freitag', 'Samstag'];
  return tage[datum.getDay()];
}

/** Gibt den deutschen Monatsnamen zurück — z.B. "Mai". */
export function getMonatsname(datum: Date = new Date()): string {
  const monate = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  return monate[datum.getMonth()];
}
