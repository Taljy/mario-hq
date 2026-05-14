// coingeckoFetcher — Live-Krypto-Daten via CoinGecko Free API · kein Auth
// Fetch läuft server-side in /wirtschaft (SSR · prerender = false)
// Fallback auf wirtschaft.json-Werte wenn API nicht erreichbar
// getBTCHistory(): 7-Tage-Stundenwerte für Sparkline (168 Punkte) · Fallback []

import fallbackData from '../data/wirtschaft.json';

export interface KryptoStand {
  symbol: string;
  name: string;
  preis_usd: number;
  delta_24h_prozent: number;
  sparkline_7d?: number[];  // 7-Tage-Kurve · nur wenn sparkline=true angefordert
}

export interface KryptoErgebnis {
  coins: KryptoStand[];
  ist_live: boolean;
  fetch_zeit: string;
  fehler?: string;
}

const COINS = ['bitcoin', 'ethereum', 'solana', 'ripple', 'sui'];

const SYMBOLS: Record<string, string> = {
  bitcoin:  'BTC',
  ethereum: 'ETH',
  solana:   'SOL',
  ripple:   'XRP',
  sui:      'SUI',
};

function fetchZeitJetzt(): string {
  return (
    new Date().toLocaleTimeString('de-CH', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Zurich',
    }) + ' CEST'
  );
}

export async function getKryptoStand(): Promise<KryptoErgebnis> {
  const fetch_zeit = fetchZeitJetzt();

  try {
    const url =
      `https://api.coingecko.com/api/v3/coins/markets` +
      `?vs_currency=usd&ids=${COINS.join(',')}&order=market_cap_desc&sparkline=false`;

    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = (await response.json()) as Array<{
      id: string;
      name: string;
      current_price: number;
      price_change_percentage_24h: number;
    }>;

    const coins: KryptoStand[] = COINS.map((id) => {
      const match = data.find((d) => d.id === id);
      if (!match) throw new Error(`Kein Eintrag für ${id}`);
      return {
        symbol:             SYMBOLS[id],
        name:               match.name,
        preis_usd:          match.current_price,
        delta_24h_prozent:  match.price_change_percentage_24h,
      };
    });

    return { coins, ist_live: true, fetch_zeit };
  } catch (err) {
    const fb = fallbackData.krypto_fallback;
    const coins: KryptoStand[] = [
      { symbol: 'BTC', name: 'Bitcoin',  preis_usd: fb.btc.preis_usd, delta_24h_prozent: fb.btc.delta_24h_prozent },
      { symbol: 'ETH', name: 'Ethereum', preis_usd: fb.eth.preis_usd, delta_24h_prozent: fb.eth.delta_24h_prozent },
      { symbol: 'SOL', name: 'Solana',   preis_usd: fb.sol.preis_usd, delta_24h_prozent: fb.sol.delta_24h_prozent },
      { symbol: 'XRP', name: 'Ripple',   preis_usd: fb.xrp.preis_usd, delta_24h_prozent: fb.xrp.delta_24h_prozent },
      { symbol: 'SUI', name: 'Sui',      preis_usd: fb.sui.preis_usd, delta_24h_prozent: fb.sui.delta_24h_prozent },
    ];
    const fehler = err instanceof Error ? err.message : 'Unbekannter Fehler';
    return { coins, ist_live: false, fetch_zeit, fehler };
  }
}

// getKryptoStandFuerIds — Flexible Bulk-Abfrage für watchlistAggregator
// Gibt Map<id, KryptoStand> zurück · Fallback: leere Map (Caller markiert als ist_live: false)
export async function getKryptoStandFuerIds(ids: string[]): Promise<Map<string, KryptoStand>> {
  if (ids.length === 0) return new Map();

  try {
    const url =
      `https://api.coingecko.com/api/v3/coins/markets` +
      `?vs_currency=usd&ids=${ids.join(',')}&order=market_cap_desc&sparkline=true`;

    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = (await response.json()) as Array<{
      id: string;
      name: string;
      symbol: string;
      current_price: number;
      price_change_percentage_24h: number;
      sparkline_in_7d?: { price: number[] };
    }>;

    const map = new Map<string, KryptoStand>();
    for (const coin of data) {
      map.set(coin.id, {
        symbol:            coin.symbol.toUpperCase(),
        name:              coin.name,
        preis_usd:         coin.current_price,
        delta_24h_prozent: coin.price_change_percentage_24h,
        sparkline_7d:      coin.sparkline_in_7d?.price,
      });
    }
    return map;
  } catch {
    // Kein throw — Aggregator markiert fehlende IDs als ist_live: false
    return new Map();
  }
}

// getBTCHistory — BTC-Kursverlauf 7 Tage stündlich für Sparkline
// Endpoint liefert ~168 [timestamp, price]-Paare · nur Preise extrahieren
// Fallback: leeres Array [] · Sparkline rendert dann nicht
export async function getBTCHistory(): Promise<number[]> {
  try {
    const url =
      'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart' +
      '?vs_currency=usd&days=7&interval=hourly';

    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = (await response.json()) as {
      prices: Array<[number, number]>;
    };

    // Nur Preise · Timestamps werden für Sparkline nicht benötigt
    return data.prices.map(([_, price]) => price);
  } catch {
    // Kein throw — Sparkline zeigt nichts bei leerem Array
    return [];
  }
}
