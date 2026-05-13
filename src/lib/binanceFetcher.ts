// binanceFetcher — Binance Futures Public API · kein Auth
// Funding Rates · Open Interest · Long/Short Ratio für BTC, ETH, SOL
// 12 parallele Calls · AbortSignal.timeout 5s · Fallback auf leere Arrays
// Läuft server-side in /wirtschaft (SSR · prerender = false)

const COINS = ['BTC', 'ETH', 'SOL'] as const;
type Coin = (typeof COINS)[number];

export interface FundingRate {
  symbol: Coin;
  rate_prozent: number;  // schon umgerechnet: raw * 100
  ist_extreme: boolean;  // |rate_prozent| > 0.1
  history_24h: number[]; // leer — Binance hat keinen History-Endpoint für Funding
}

export interface OpenInterest {
  symbol: Coin;
  value: number;         // Anzahl Kontrakte (BTC/ETH/SOL)
  history_24h: number[]; // sumOpenInterest der letzten 24h (stündlich)
}

export interface LongShortRatio {
  symbol: Coin;
  ratio: number;         // z.B. 0.91 = 0.91x mehr Longs als Shorts
  ist_extreme: boolean;  // ratio > 2.0 oder < 0.5
  history_24h: number[]; // longShortRatio der letzten 24 × 5-Min-Schnitte
}

export interface BinanceErgebnis {
  funding:       FundingRate[];
  open_interest: OpenInterest[];
  long_short:    LongShortRatio[];
  ist_live:      boolean;
  fetch_zeit:    string;
  fehler?:       string;
}

const BASE_FUTURES = 'https://fapi.binance.com';

function fetchZeit(): string {
  return (
    new Date().toLocaleTimeString('de-CH', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Zurich',
    }) + ' CEST'
  );
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} · ${url}`);
  return res.json() as Promise<T>;
}

// --- Funding Rate (ein Call pro Coin) ---
interface BinancePremiumIndex {
  symbol:          string;
  lastFundingRate: string; // Raw-Dezimalzahl als String, z.B. "0.00001335"
}

async function fetchFunding(coin: Coin): Promise<FundingRate> {
  const data = await fetchJson<BinancePremiumIndex>(
    `${BASE_FUTURES}/fapi/v1/premiumIndex?symbol=${coin}USDT`
  );
  const rate_prozent = parseFloat(data.lastFundingRate) * 100;
  return {
    symbol:      coin,
    rate_prozent,
    ist_extreme: Math.abs(rate_prozent) > 0.1,
    history_24h: [],
  };
}

// --- Open Interest aktuell ---
interface BinanceOI {
  symbol:       string;
  openInterest: string; // Float als String
}

// --- Open Interest History (24h stündlich) ---
interface BinanceOIHist {
  symbol:          string;
  sumOpenInterest: string; // Float als String · Feld aus Verifikation
}

async function fetchOpenInterest(coin: Coin): Promise<OpenInterest> {
  const [current, history] = await Promise.all([
    fetchJson<BinanceOI>(
      `${BASE_FUTURES}/fapi/v1/openInterest?symbol=${coin}USDT`
    ),
    fetchJson<BinanceOIHist[]>(
      `${BASE_FUTURES}/futures/data/openInterestHist?symbol=${coin}USDT&period=1h&limit=24`
    ),
  ]);

  return {
    symbol:      coin,
    value:       parseFloat(current.openInterest),
    history_24h: history.map((h) => parseFloat(h.sumOpenInterest)),
  };
}

// --- Long/Short Ratio (24 × 5-Min-Schnitte) ---
interface BinanceLSRatio {
  symbol:         string;
  longShortRatio: string; // Float als String · aus Verifikation
}

async function fetchLongShort(coin: Coin): Promise<LongShortRatio> {
  const data = await fetchJson<BinanceLSRatio[]>(
    `${BASE_FUTURES}/futures/data/topLongShortAccountRatio?symbol=${coin}USDT&period=5m&limit=24`
  );

  const latest = data[data.length - 1];
  const ratio  = parseFloat(latest?.longShortRatio ?? '1');

  return {
    symbol:      coin,
    ratio,
    ist_extreme: ratio > 2.0 || ratio < 0.5,
    history_24h: data.map((d) => parseFloat(d.longShortRatio)),
  };
}

// --- Haupt-Export ---
export async function getBinanceMetrics(): Promise<BinanceErgebnis> {
  const fetch_zeit = fetchZeit();

  try {
    // 12 parallele Calls für BTC/ETH/SOL
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
