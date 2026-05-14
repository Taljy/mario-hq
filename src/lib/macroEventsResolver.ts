// macroEventsResolver — liest macro-events.json, filtert auf nächste 14 Tage ab
// heute, sortiert chronologisch (Datum + Uhrzeit-Sortierung über Datum stabil).
// Mario pflegt die JSON manuell (~monatlich). Resolver filtert vergangene Events
// und Events > 14 Tage in der Zukunft automatisch raus.

import data from '../data/macro-events.json';

export type MacroKategorie = 'inflation' | 'central-bank' | 'employment' | 'gdp' | 'geopolitik';
export type MacroImpact    = 'kritisch' | 'hoch' | 'mittel';

export interface MacroEvent {
  datum:     string;
  name:      string;
  kategorie: MacroKategorie;
  impact:    MacroImpact;
  uhrzeit:   string;
}

// Astro/Vite typt JSON-Imports oft als unknown · expliziter Cast auf den
// Roh-Typ ist transparenter als als-any
interface MacroEventsFile {
  events: MacroEvent[];
}

function tageBis(zielDatum: string, heute: Date): number {
  const ziel = new Date(zielDatum + 'T00:00:00');
  const today = new Date(heute.toISOString().slice(0, 10) + 'T00:00:00');
  return Math.floor((ziel.getTime() - today.getTime()) / 86_400_000);
}

export function getMacroEvents(jetzt: Date = new Date()): MacroEvent[] {
  const datei = data as MacroEventsFile;
  return datei.events
    .filter((e) => {
      const t = tageBis(e.datum, jetzt);
      return t >= 0 && t <= 14;
    })
    .sort((a, b) => {
      if (a.datum !== b.datum) return a.datum.localeCompare(b.datum);
      return a.uhrzeit.localeCompare(b.uhrzeit);
    });
}

// getNaechsteWichtigeEvents — Macro-Vorausschau für Cover-MacroCard (Slice 5.3)
// "Wichtig" = impact 'kritisch' oder 'hoch' · 'mittel' wird übersprungen
// Liefert bis zu `anzahl` Events ab heute, chronologisch · weniger wenn weniger
// im aktuellen 14-Tage-Fenster verfügbar sind (defensive Pflicht — bei nicht-
// gepflegter JSON oder dünnem Fenster zeigt die Card 2/1/0 Events, ist kein Bug)
export function getNaechsteWichtigeEvents(anzahl = 3, jetzt: Date = new Date()): MacroEvent[] {
  return getMacroEvents(jetzt)
    .filter((e) => e.impact === 'kritisch' || e.impact === 'hoch')
    .slice(0, anzahl);
}
