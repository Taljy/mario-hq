// fotoSpotPicker — Tages-Foto-Empfehlung anhand Wetter + Tageszeit
// Algorithmus: Regen → kein Spot · Nebelmeer → Lägern · Goldene Stunde → Architektur · Fallback → nähester

import data from '../data/foto-spots.json';
import type { WetterHeute } from './openMeteoFetcher';

export interface FotoSpot {
  name: string;
  lat: number;
  lng: number;
  tags: string[];
  beste_bedingung: string;
  fahrzeit_minuten: number;
  hinweis: string;
}

export interface FotoEmpfehlung {
  tages_spot: FotoSpot | null;
  alle_spots: FotoSpot[];
  begruendung: string;
}

export function getFotoEmpfehlung(
  wetter: WetterHeute,
  zeitpunkt: Date = new Date()
): FotoEmpfehlung {
  const spots = data.spots as FotoSpot[];
  const stunde = zeitpunkt.getHours();

  const istRegen = wetter.wmo_code >= 51 && wetter.wmo_code <= 99;
  const istKlar  = wetter.wmo_code <= 1;
  const istNebel = wetter.wmo_code === 45 || wetter.wmo_code === 48;

  if (istRegen) {
    return {
      tages_spot: null,
      alle_spots: spots,
      begruendung: 'Heute drinnen — Regen oder Gewitter erwartet.',
    };
  }

  // Frühmorgens + Nebel → Nebelmeer-Spot (Lägern)
  if (istNebel && stunde < 9) {
    const match = spots.find((s) => s.beste_bedingung.includes('nebelmeer'));
    if (match) {
      return {
        tages_spot: match,
        alle_spots: spots,
        begruendung: 'Nebel am Morgen · Chance auf Nebelmeer auf der Lägern.',
      };
    }
  }

  // Klar + Nachmittag/Abend (ab 16) → Goldene-Stunde-Match
  if (istKlar && stunde >= 16) {
    const match = spots.find((s) => s.beste_bedingung.includes('goldene-stunde'));
    if (match) {
      return {
        tages_spot: match,
        alle_spots: spots,
        begruendung: 'Klarer Abend · goldene Stunde ideal für Architektur-Spots.',
      };
    }
  }

  // Fallback: kürzeste Fahrzeit
  const naehester = [...spots].sort(
    (a, b) => a.fahrzeit_minuten - b.fahrzeit_minuten
  )[0];
  return {
    tages_spot: naehester,
    alle_spots: spots,
    begruendung: 'Kein klarer Bedingungs-Match · nähester Spot empfohlen.',
  };
}
