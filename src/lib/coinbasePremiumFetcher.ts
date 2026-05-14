// coinbasePremiumFetcher — BTC Coinbase Premium vs Vergleichs-Spot (Bybit)
// Eigenlogik: (Coinbase - Vergleich) / Vergleich * 100
// Positiv = US-Demand stark · Negativ = US-Demand schwach
// Läuft server-side in /wirtschaft · kein Auth nötig
// Slice 5.1: Binance-Spot durch Bybit-Spot ersetzt (Vercel-IP-Block bei Binance).
// Feldname vergleichs_preis bewusst generisch — kein Interface-Rename beim nächsten Anbieter-Wechsel.

export interface CoinbasePremium {
  vergleichs_preis: number;  // Spot-Preis vom Vergleichs-Anbieter (aktuell Bybit)
  coinbase_preis:   number;
  premium_prozent:  number;  // (cb - vergleich) / vergleich * 100
  interpretation:   'positiv-strong' | 'positiv-neutral' | 'neutral' | 'negativ-neutral' | 'negativ-strong';
  ist_live:         boolean;
  fetch_zeit:       string;
  fehler?:          string;
}

const FALLBACK: CoinbasePremium = {
  vergleichs_preis: 0,
  coinbase_preis:   0,
  premium_prozent:  0,
  interpretation:   'neutral',
  ist_live:         false,
  fetch_zeit:       '',
};

function fetchZeit(): string {
  return (
    new Date().toLocaleTimeString('de-CH', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Zurich',
    }) + ' CEST'
  );
}

function interpretiere(p: number): CoinbasePremium['interpretation'] {
  if (p >  0.2)  return 'positiv-strong';
  if (p >  0.05) return 'positiv-neutral';
  if (p < -0.2)  return 'negativ-strong';
  if (p < -0.05) return 'negativ-neutral';
  return 'neutral';
}

function interpretierungsText(i: CoinbasePremium['interpretation']): string {
  switch (i) {
    case 'positiv-strong':  return 'US-Demand stark';
    case 'positiv-neutral': return 'US-Demand leicht erhöht';
    case 'negativ-neutral': return 'US-Demand leicht schwach';
    case 'negativ-strong':  return 'US-Demand schwach';
    default:                return 'Neutral';
  }
}

export { interpretierungsText };

export async function getCoinbasePremium(): Promise<CoinbasePremium> {
  const fetch_zeit = fetchZeit();

  try {
    // Parallel: Bybit Spot + Coinbase Exchange Rates
    const [bybitRes, coinbaseRes] = await Promise.all([
      fetch('https://api.bybit.com/v5/market/tickers?category=spot&symbol=BTCUSDT', {
        signal: AbortSignal.timeout(5000),
      }),
      fetch('https://api.coinbase.com/v2/exchange-rates?currency=BTC', {
        signal: AbortSignal.timeout(5000),
      }),
    ]);

    if (!bybitRes.ok)    throw new Error(`Bybit HTTP ${bybitRes.status}`);
    if (!coinbaseRes.ok) throw new Error(`Coinbase HTTP ${coinbaseRes.status}`);

    const bybitData    = (await bybitRes.json())    as { retCode: number; retMsg: string; result: { list: Array<{ lastPrice: string }> } };
    const coinbaseData = (await coinbaseRes.json()) as { data: { rates: Record<string, string> } };

    if (bybitData.retCode !== 0) {
      throw new Error(`Bybit retCode ${bybitData.retCode}: ${bybitData.retMsg}`);
    }

    // lastPrice ist String — parseFloat zwingend
    const vergleichs_preis = parseFloat(bybitData.result.list[0]?.lastPrice ?? 'NaN');
    const coinbase_preis   = parseFloat(coinbaseData.data.rates['USD']);

    if (isNaN(vergleichs_preis) || isNaN(coinbase_preis)) {
      throw new Error('Ungültige Preis-Daten von API');
    }

    const premium_prozent = (coinbase_preis - vergleichs_preis) / vergleichs_preis * 100;
    const interpretation  = interpretiere(premium_prozent);

    return { vergleichs_preis, coinbase_preis, premium_prozent, interpretation, ist_live: true, fetch_zeit };
  } catch (err) {
    const fehler = err instanceof Error ? err.message : 'Unbekannter Fehler';
    return { ...FALLBACK, fetch_zeit, fehler };
  }
}
