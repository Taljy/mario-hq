// fearGreedFetcher — Crypto Fear & Greed Index via alternative.me
// API: https://api.alternative.me/fng/?limit=1 · gratis, kein Key, kein hartes Limit
// Cache-Strategie: 1h Module-Cache (Wert ändert sich täglich, stabil über Stunden)
// Caching ist Spec-konform · pro Vercel-Serverless-Instanz · bei kalten Instanzen
// kurz frischer Fetch nötig, danach 1h gecached
// Defensive: bei Fehler graceful Fallback, gleiche Linie wie defiLlamaFetcher

export interface FearGreedStand {
  wert:       number;   // 0-100
  label:      string;   // "Extreme Fear" · "Fear" · "Neutral" · "Greed" · "Extreme Greed"
  ist_live:   boolean;
  fetch_zeit: string;
  fehler?:    string;
}

const FALLBACK: FearGreedStand = {
  wert:       0,
  label:      '—',
  ist_live:   false,
  fetch_zeit: '',
};

const CACHE_TTL_MS = 60 * 60 * 1000;  // 1h

// Module-scope Cache · pro Serverless-Instanz · lebt so lange wie die Instanz warm ist
let cache: { wert: FearGreedStand; expires: number } | undefined;

function fetchZeit(): string {
  return (
    new Date().toLocaleTimeString('de-CH', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Zurich',
    }) + ' CEST'
  );
}

// API-Response (nur die benötigten Felder)
interface FngResponse {
  data?: Array<{
    value?:                string;
    value_classification?: string;
  }>;
}

export async function getFearGreed(): Promise<FearGreedStand> {
  const jetzt = Date.now();

  // Cache-Hit
  if (cache && cache.expires > jetzt) {
    return cache.wert;
  }

  const fetch_zeit = fetchZeit();

  try {
    const res = await fetch('https://api.alternative.me/fng/?limit=1', {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = (await res.json()) as FngResponse;
    const entry = json.data?.[0];
    if (!entry || !entry.value) throw new Error('Keine Daten in Response');

    const wert = parseInt(entry.value, 10);
    if (!Number.isFinite(wert)) throw new Error(`Wert nicht numerisch: ${entry.value}`);

    const stand: FearGreedStand = {
      wert,
      label:    entry.value_classification ?? '—',
      ist_live: true,
      fetch_zeit,
    };

    cache = { wert: stand, expires: jetzt + CACHE_TTL_MS };
    return stand;
  } catch (err) {
    const fehler = err instanceof Error ? err.message : 'Unbekannter Fehler';
    // Fehler NICHT cachen · nächster Hit versucht es nochmal
    return { ...FALLBACK, fetch_zeit, fehler };
  }
}
