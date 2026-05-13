// openMeteoFetcher — Live-Wetter via Open-Meteo · kein Auth · CC-BY 4.0
// Standort: Baden AG (47.4762, 8.3056) · Timezone: Europe/Zurich
// Fetch server-side in /wetter (SSR · prerender = false)
// Fallback auf wetter-fallback.json bei Fehler

import fallback from '../data/wetter-fallback.json';

export interface WetterHeute {
  temperatur: number;
  min: number;
  max: number;
  wmo_code: number;
  bedingung: string;
  wind_kmh: number;
  wind_richtung: string;
  niederschlag_mm: number;
  sonnenaufgang: string;
  sonnenuntergang: string;
}

export interface WetterTag {
  datum: string;
  wochentag_kurz: string;
  min: number;
  max: number;
  wmo_code: number;
}

export interface WetterErgebnis {
  ort: string;
  heute: WetterHeute;
  woche: WetterTag[];
  ist_live: boolean;
  fetch_zeit: string;
  fehler?: string;
}

function fetchZeitJetzt(): string {
  return (
    new Date().toLocaleTimeString('de-CH', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Zurich',
    }) + ' CEST'
  );
}

function bedingungFor(code: number): string {
  if (code === 0) return 'Klarer Himmel';
  if (code === 1) return 'Vorwiegend klar';
  if (code === 2) return 'Mix Sonne · Wolken';
  if (code === 3) return 'Bedeckt';
  if (code === 45 || code === 48) return 'Nebel';
  if (code >= 51 && code <= 55) return 'Nieselregen';
  if (code >= 61 && code <= 65) return 'Regen';
  if (code >= 71 && code <= 77) return 'Schneefall';
  if (code >= 80 && code <= 82) return 'Regenschauer';
  if (code === 85 || code === 86) return 'Schneeschauer';
  if (code >= 95 && code <= 99) return 'Gewitter';
  return 'Wechselhaft';
}

function windRichtungFor(deg: number): string {
  const r = ((deg % 360) + 360) % 360;
  if (r < 22.5)  return 'N';
  if (r < 67.5)  return 'NE';
  if (r < 112.5) return 'E';
  if (r < 157.5) return 'SE';
  if (r < 202.5) return 'S';
  if (r < 247.5) return 'SW';
  if (r < 292.5) return 'W';
  if (r < 337.5) return 'NW';
  return 'N';
}

function wochentagKurz(datum: string): string {
  // Noon UTC bleibt immer derselbe Kalendertag in Europe/Zurich
  const d = new Date(datum + 'T12:00:00Z');
  return d
    .toLocaleDateString('de-CH', { weekday: 'short', timeZone: 'Europe/Zurich' })
    .replace('.', '');
}

function zeitVon(iso: string): string {
  // "2026-05-13T06:01" → "06:01"
  return iso.slice(11, 16);
}

export async function getWetterErgebnis(): Promise<WetterErgebnis> {
  const fetch_zeit = fetchZeitJetzt();
  const ORT = 'Baden AG';

  try {
    const url =
      'https://api.open-meteo.com/v1/forecast' +
      '?latitude=47.4762&longitude=8.3056' +
      '&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,precipitation' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset' +
      '&timezone=Europe%2FZurich' +
      '&forecast_days=8';

    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = (await response.json()) as {
      current: {
        temperature_2m: number;
        weather_code: number;
        wind_speed_10m: number;
        wind_direction_10m: number;
        precipitation: number;
      };
      daily: {
        time:               string[];
        weather_code:       number[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        sunrise:            string[];
        sunset:             string[];
      };
    };

    const c = data.current;
    const d = data.daily;

    const heute: WetterHeute = {
      temperatur:       Math.round(c.temperature_2m),
      min:              Math.round(d.temperature_2m_min[0]),
      max:              Math.round(d.temperature_2m_max[0]),
      wmo_code:         c.weather_code,
      bedingung:        bedingungFor(c.weather_code),
      wind_kmh:         Math.round(c.wind_speed_10m),
      wind_richtung:    windRichtungFor(c.wind_direction_10m),
      niederschlag_mm:  c.precipitation,
      sonnenaufgang:    zeitVon(d.sunrise[0]),
      sonnenuntergang:  zeitVon(d.sunset[0]),
    };

    // Indices 1–7: morgen bis 7 Tage voraus
    const woche: WetterTag[] = d.time.slice(1, 8).map((datum, i) => ({
      datum,
      wochentag_kurz: wochentagKurz(datum),
      min:   Math.round(d.temperature_2m_min[i + 1]),
      max:   Math.round(d.temperature_2m_max[i + 1]),
      wmo_code: d.weather_code[i + 1],
    }));

    return { ort: ORT, heute, woche, ist_live: true, fetch_zeit };
  } catch (err) {
    const fehler = err instanceof Error ? err.message : 'Unbekannter Fehler';
    return {
      ort:      ORT,
      heute:    fallback.heute as WetterHeute,
      woche:    fallback.woche as WetterTag[],
      ist_live: false,
      fetch_zeit,
      fehler,
    };
  }
}
