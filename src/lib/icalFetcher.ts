// icalFetcher — liest Google Calendar iCal via KALENDER_ICAL_URL (server-only ENV)
// Recurrence-Expansion via ical.js · Zeitfenster: Heute + 7 Tage · Europe/Zurich
// Fallback auf kalender-fallback.json wenn ENV fehlt oder Fetch schlägt fehl

import ICAL from 'ical.js';
import fallbackData from '../data/kalender-fallback.json';

export interface KalenderTermin {
  zeit: string | null;
  titel: string;
  ganztag: boolean;
}

export interface KalenderTag {
  datum: string;
  wochentag: string;
  termine: KalenderTermin[];
}

export interface KalenderErgebnis {
  tage: KalenderTag[];
  ist_live: boolean;
}

const WOCHENTAGE = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

function datumISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function zeitVon(dtstart: ICAL.Time): string {
  const jsDate = dtstart.toJSDate();
  const h = String(jsDate.getHours()).padStart(2, '0');
  const min = String(jsDate.getMinutes()).padStart(2, '0');
  return `${h}:${min}`;
}

function wochentagVon(datum: string): string {
  // T12:00:00Z für timezone-unabhängige Wochentag-Berechnung
  const d = new Date(`${datum}T12:00:00Z`);
  return new Intl.DateTimeFormat('de-CH', {
    weekday: 'short',
    timeZone: 'Europe/Zurich',
  }).format(d).replace('.', '');
}

function fallbackErgebnis(): KalenderErgebnis {
  return { tage: fallbackData.tage as KalenderTag[], ist_live: false };
}

function parseIcal(icsText: string, heute: Date): KalenderTag[] {
  const jcal = ICAL.parse(icsText);
  const comp = new ICAL.Component(jcal);
  const vevents = comp.getAllSubcomponents('vevent');

  const fensterStart = new Date(heute);
  fensterStart.setHours(0, 0, 0, 0);
  const fensterEnd = new Date(fensterStart);
  fensterEnd.setDate(fensterEnd.getDate() + 8);

  const tageMap = new Map<string, KalenderTermin[]>();

  for (const vevent of vevents) {
    const event = new ICAL.Event(vevent);

    if (event.isRecurring()) {
      const iter = event.iterator();
      let next: ICAL.Time | null;
      // Max 50 Occurrences pro Event scannen
      for (let i = 0; i < 50; i++) {
        next = iter.next();
        if (!next) break;
        const jsDate = next.toJSDate();
        if (jsDate >= fensterEnd) break;
        if (jsDate >= fensterStart) {
          addTermin(tageMap, event, next);
        }
      }
    } else {
      const dtstart = event.startDate;
      if (!dtstart) continue;
      const jsDate = dtstart.toJSDate();
      if (jsDate >= fensterStart && jsDate < fensterEnd) {
        addTermin(tageMap, event, dtstart);
      }
    }
  }

  const tage: KalenderTag[] = [];
  const sorted = [...tageMap.entries()].sort(([a], [b]) => a.localeCompare(b));
  for (const [datum, termine] of sorted) {
    termine.sort((a, b) => {
      if (a.ganztag && !b.ganztag) return -1;
      if (!a.ganztag && b.ganztag) return 1;
      return (a.zeit ?? '').localeCompare(b.zeit ?? '');
    });
    tage.push({ datum, wochentag: wochentagVon(datum), termine });
  }
  return tage;
}

function addTermin(
  map: Map<string, KalenderTermin[]>,
  event: ICAL.Event,
  dtstart: ICAL.Time,
): void {
  const ganztag = dtstart.isDate;
  const jsDate = dtstart.toJSDate();
  const datum = datumISO(jsDate);
  const termin: KalenderTermin = {
    zeit: ganztag ? null : zeitVon(dtstart),
    titel: event.summary ?? '(kein Titel)',
    ganztag,
  };
  if (!map.has(datum)) map.set(datum, []);
  map.get(datum)!.push(termin);
}

export async function getKalenderTermine(): Promise<KalenderErgebnis> {
  const url = import.meta.env.KALENDER_ICAL_URL as string | undefined;
  if (!url || url.includes('DEINE_GEHEIME_ID')) {
    return fallbackErgebnis();
  }

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return fallbackErgebnis();
    const icsText = await res.text();
    const heute = new Date();
    const tage = parseIcal(icsText, heute);
    return { tage, ist_live: true };
  } catch {
    return fallbackErgebnis();
  }
}
