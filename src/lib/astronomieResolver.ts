// astronomieResolver — Mondphase via SunCalc + kuratierte 2026-Events aus JSON
// Bemerkenswert-Logik: Meteor aktiv (kein Mond-Problem) · Planeten-Nähe · Vollmond-Nähe
// Baden AG Koordinaten: 47.4762, 8.3056

import SunCalc from 'suncalc';
import data from '../data/astronomie-2026.json';

const LAT = 47.4762;
const LNG = 8.3056;

export interface MeteorSchauer {
  name: string;
  peak: string;
  fenster: { start: string; ende: string };
  rate_pro_stunde: number;
  mond_problem: boolean;
  hinweis: string;
}

export interface PlanetenEvent {
  datum: string;
  ereignis: string;
  sternbild: string;
  sichtbarkeit: string;
  hinweis: string;
}

export interface Vollmond {
  datum: string;
  name: string;
}

export interface Mondphase {
  beleuchtung_prozent: number;
  phase_name: string;
  ist_zunehmend: boolean;       // SunCalc-Phase < 0.5 = waxing (zunehmend, rechte Seite beleuchtet)
  aufgang: string | null;
  untergang: string | null;
}

export interface AstronomieHighlights {
  meteor_aktiv: MeteorSchauer | null;
  planeten_naehe: PlanetenEvent | null;
  vollmond_naehe: Vollmond | null;
  mondphase_heute: Mondphase;
  ist_bemerkenswert: boolean;
}

export interface StundenHeute {
  // Goldene Stunde · Start = SunCalc goldenHour (≈45 min vor Sonnenuntergang) · Ende = sunset
  goldene_stunde: { start: string; ende: string };
  // Blaue Stunde · Start = sunset · Ende = SunCalc nauticalDusk (Sonne 12° unter Horizont)
  // Erweiterte fotografische Definition (Mario-Entscheidung in 5.2b · Card als
  // Inspirations-Werkzeug, nicht Timing-Anker) · PHASE-5-COVER-SYNC-SPEC.md §4.2
  blaue_stunde: { start: string; ende: string };
}

function dateInRange(datum: Date, start: string, ende: string): boolean {
  const d = datum.toISOString().slice(0, 10);
  return d >= start && d <= ende;
}

function daysBetween(a: Date, b: string): number {
  const aD = new Date(a.toISOString().slice(0, 10));
  const bD = new Date(b);
  return Math.abs(Math.floor((aD.getTime() - bD.getTime()) / 86_400_000));
}

function getPhaseName(beleuchtung: number, isWaxing: boolean): string {
  if (beleuchtung < 0.03) return 'Neumond';
  if (beleuchtung > 0.97) return 'Vollmond';
  if (beleuchtung < 0.50) return isWaxing ? 'Zunehmende Sichel' : 'Abnehmende Sichel';
  return isWaxing ? 'Zunehmender Mond' : 'Abnehmender Mond';
}

function formatZeit(d: Date | undefined): string | null {
  if (!d) return null;
  return d.toLocaleTimeString('de-CH', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Zurich',
  });
}

// getStundenHeute — Goldene + Blaue Stunde via SunCalc · lokale Berechnung, keine API
// Standort: LAT/LNG-Konstanten oben (Baden AG · 47.4762, 8.3056)
// Definition (siehe PHASE-5-COVER-SYNC-SPEC.md §4.2 · Mario-Entscheidung in 5.2b):
//   goldene_stunde: SunCalc.goldenHour → sunset (≈ 45 min)
//   blaue_stunde:   SunCalc.sunset → nauticalDusk (≈ 82 min, Sonne 12° unter Horizont)
export function getStundenHeute(datum: Date = new Date()): StundenHeute {
  const t = SunCalc.getTimes(datum, LAT, LNG);
  return {
    goldene_stunde: {
      start: formatZeit(t.goldenHour)   ?? '—',
      ende:  formatZeit(t.sunset)       ?? '—',
    },
    blaue_stunde: {
      start: formatZeit(t.sunset)       ?? '—',
      ende:  formatZeit(t.nauticalDusk) ?? '—',
    },
  };
}

export function getAstronomieHeute(datum: Date = new Date()): AstronomieHighlights {
  // Meteor-Schauer: liegt Datum im aktiven Fenster?
  const meteorAktiv = (data.meteor_schauer as MeteorSchauer[]).find(
    (m) => dateInRange(datum, m.fenster.start, m.fenster.ende)
  ) ?? null;

  // Planeten-Event in nächsten 7 Tagen?
  const planetenNaehe = (data.planeten_events as PlanetenEvent[]).find(
    (p) => daysBetween(datum, p.datum) <= 7
  ) ?? null;

  // Vollmond in nächsten 3 Tagen?
  const vollmondNaehe = (data.vollmonde as Vollmond[]).find(
    (v) => daysBetween(datum, v.datum) <= 3
  ) ?? null;

  // Mondphase via SunCalc
  const moonIllum = SunCalc.getMoonIllumination(datum);
  const moonTimes = SunCalc.getMoonTimes(datum, LAT, LNG);
  const isWaxing = moonIllum.phase < 0.5;

  const mondphaseHeute: Mondphase = {
    beleuchtung_prozent: Math.round(moonIllum.fraction * 100),
    phase_name: getPhaseName(moonIllum.fraction, isWaxing),
    ist_zunehmend: isWaxing,
    aufgang: formatZeit(moonTimes.rise),
    untergang: formatZeit(moonTimes.set),
  };

  const istBemerkenswert =
    (meteorAktiv !== null && !meteorAktiv.mond_problem) ||
    planetenNaehe !== null ||
    vollmondNaehe !== null;

  return {
    meteor_aktiv: meteorAktiv,
    planeten_naehe: planetenNaehe,
    vollmond_naehe: vollmondNaehe,
    mondphase_heute: mondphaseHeute,
    ist_bemerkenswert: istBemerkenswert,
  };
}
