// bybitFetcher — Bybit V5 Public API · kein Auth
// Funding Rates · Open Interest · Long/Short Ratio für BTC, ETH, SOL
// Ersetzt Binance (Slice 5.1) wegen Vercel-IP-Block gegen api.binance.com
// 9 parallele Calls · AbortSignal.timeout 5s · Fallback auf strukturell leere Arrays
// Läuft server-side in /wirtschaft (SSR · prerender = false)
//
// Periodizität pro Endpoint (1:1 zu Binance-Vorläufer):
// - Funding:  limit=1 Einzelwert (Card hat keine Sparkline)
// - OI:       intervalTime=1h, limit=24 → 24h-Fenster
// - L/S:      period=5min, limit=24    → 2h-Fenster
// Bybit liefert Histories neueste-zuerst → [...list].reverse() für chronologische Reihenfolge

const COINS = ['BTC', 'ETH', 'SOL'] as const;
type Coin = (typeof COINS)[number];

export interface FundingRate {
  symbol: Coin;
  rate_prozent: number;  // schon umgerechnet: raw * 100
  ist_extreme: boolean;  // |rate_prozent| > 0.1
  history_24h: number[]; // leer — keine History-Anzeige
}

export interface OpenInterest {
  symbol: Coin;
  value: number;         // Anzahl Kontrakte (BTC/ETH/SOL)
  history_24h: number[]; // 24 × stündliche openInterest-Werte, chronologisch
}

export interface LongShortRatio {
  symbol: Coin;
  ratio: number;         // buyRatio / sellRatio · >1 = mehr Longs als Shorts
  ist_extreme: boolean;  // ratio > 2.0 oder < 0.5
  history_24h: number[]; // 24 × 5-Min-Schnitte, chronologisch
}

export interface BybitErgebnis {
  funding:       FundingRate[];
  open_interest: OpenInterest[];
  long_short:    LongShortRatio[];
  ist_live:      boolean;
  fetch_zeit:    string;
  fehler?:       string;
}

const BASE = 'https://api.bybit.com';

function fetchZeit(): string {
  return (
    new Date().toLocaleTimeString('de-CH', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Zurich',
    }) + ' CEST'
  );
}

// Bybit V5 wrapping: { retCode, retMsg, result: { ... }, ... }
interface BybitEnvelope<T> {
  retCode: number;
  retMsg:  string;
  result:  T;
}

async function fetchBybit<T>(url: string): Promise<T> {
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} · ${url}`);
  const json = (await res.json()) as BybitEnvelope<T>;
  if (json.retCode !== 0) throw new Error(`Bybit retCode ${json.retCode}: ${json.retMsg}`);
  return json.result;
}

// --- Funding Rate (limit=1 → letzter settled Wert) ---
interface BybitFundingResult {
  category: string;
  list: Array<{ symbol: string; fundingRate: string; fundingRateTimestamp: string }>;
}

async function fetchFunding(coin: Coin): Promise<FundingRate> {
  const data = await fetchBybit<BybitFundingResult>(
    `${BASE}/v5/market/funding/history?category=linear&symbol=${coin}USDT&limit=1`
  );
  const raw  = data.list[0]?.fundingRate ?? '0';
  const rate_prozent = parseFloat(raw) * 100;
  return {
    symbol:      coin,
    rate_prozent,
    ist_extreme: Math.abs(rate_prozent) > 0.1,
    history_24h: [],
  };
}

// --- Open Interest (24 × 1h, current = jüngster Wert) ---
interface BybitOIResult {
  symbol:   string;
  category: string;
  list: Array<{ openInterest: string; timestamp: string }>;
}

async function fetchOpenInterest(coin: Coin): Promise<OpenInterest> {
  const data = await fetchBybit<BybitOIResult>(
    `${BASE}/v5/market/open-interest?category=linear&symbol=${coin}USDT&intervalTime=1h&limit=24`
  );
  // Bybit liefert neueste zuerst → chronologisch reversen für Sparkline (alt→neu)
  const chronologisch = [...data.list].reverse();
  const werte = chronologisch.map((h) => parseFloat(h.openInterest));
  // Current = jüngster Wert (letzter nach Reverse)
  const value = werte[werte.length - 1] ?? 0;
  return {
    symbol:      coin,
    value,
    history_24h: werte,
  };
}

// --- Long/Short Ratio (24 × 5min) ---
interface BybitLSResult {
  list: Array<{ symbol: string; buyRatio: string; sellRatio: string; timestamp: string }>;
}

async function fetchLongShort(coin: Coin): Promise<LongShortRatio> {
  const data = await fetchBybit<BybitLSResult>(
    `${BASE}/v5/market/account-ratio?category=linear&symbol=${coin}USDT&period=5min&limit=24`
  );
  // Bybit liefert neueste zuerst → reversen
  const chronologisch = [...data.list].reverse();
  const werte = chronologisch.map((d) => {
    const buy  = parseFloat(d.buyRatio);
    const sell = parseFloat(d.sellRatio);
    return sell > 0 ? buy / sell : 1;
  });
  const ratio = werte[werte.length - 1] ?? 1;
  return {
    symbol:      coin,
    ratio,
    ist_extreme: ratio > 2.0 || ratio < 0.5,
    history_24h: werte,
  };
}

// --- Haupt-Export ---
export async function getBybitMetrics(): Promise<BybitErgebnis> {
  const fetch_zeit = fetchZeit();

  try {
    // 9 parallele Calls für BTC/ETH/SOL · alles auf api.bybit.com
    const [
      fundingBTC, fundingETH, fundingSOL,
      oiBTC,      oiETH,      oiSOL,
      lsBTC,      lsETH,      lsSOL,
    ] = await Promise.all([
      fetchFunding('BTC'), fetchFunding('ETH'), fetchFunding('SOL'),
      fetchOpenInterest('BTC'), fetchOpenInterest('ETH'), fetchOpenInterest('SOL'),
      fetchLongShort('BTC'), fetchLongShort('ETH'), fetchLongShort('SOL'),
    ]);

    return {
      funding:       [fundingBTC, fundingETH, fundingSOL],
      open_interest: [oiBTC, oiETH, oiSOL],
      long_short:    [lsBTC, lsETH, lsSOL],
      ist_live:      true,
      fetch_zeit,
    };
  } catch (err) {
    const fehler = err instanceof Error ? err.message : 'Unbekannter Fehler';
    // Fallback: strukturell korrekte leere Daten
    const fallbackFunding:  FundingRate[]    = COINS.map((s) => ({ symbol: s, rate_prozent: 0, ist_extreme: false, history_24h: [] }));
    const fallbackOI:       OpenInterest[]   = COINS.map((s) => ({ symbol: s, value: 0, history_24h: [] }));
    const fallbackLS:       LongShortRatio[] = COINS.map((s) => ({ symbol: s, ratio: 1, ist_extreme: false, history_24h: [] }));
    return {
      funding:       fallbackFunding,
      open_interest: fallbackOI,
      long_short:    fallbackLS,
      ist_live:      false,
      fetch_zeit,
      fehler,
    };
  }
}
