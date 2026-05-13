// coinbasePremiumFetcher — BTC Coinbase Premium vs Binance
// Eigenlogik: (Coinbase - Binance) / Binance * 100
// Positiv = US-Demand stark · Negativ = US-Demand schwach
// Läuft server-side in /wirtschaft · kein Auth nötig

export interface CoinbasePremium {
  binance_preis:    number;
  coinbase_preis:   number;
  premium_prozent:  number; // (cb - bn) / bn * 100
  interpretation:   'positiv-strong' | 'positiv-neutral' | 'neutral' | 'negativ-neutral' | 'negativ-strong';
  ist_live:         boolean;
  fetch_zeit:       string;
  fehler?:          string;
}

const FALLBACK: CoinbasePremium = {
  binance_preis:   0,
  coinbase_preis:  0,
  premium_prozent: 0,
  interpretation:  'neutral',
  ist_live:        false,
  fetch_zeit:      '',
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
    // Parallel: Binance Spot + Coinbase Exchange Rates
    const [binanceRes, coinbaseRes] = await Promise.all([
      fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT', {
        signal: AbortSignal.timeout(5000),
      }),
      fetch('https://api.coinbase.com/v2/exchange-rates?currency=BTC', {
        signal: AbortSignal.timeout(5000),
      }),
    ]);

    if (!binanceRes.ok)  throw new Error(`Binance HTTP ${binanceRes.status}`);
    if (!coinbaseRes.ok) throw new Error(`Coinbase HTTP ${coinbaseRes.status}`);

    const binanceData  = (await binanceRes.json())  as { price: string };
    const coinbaseData = (await coinbaseRes.json())  as { data: { rates: Record<string, string> } };

    // Beide Felder sind Strings — parseFloat zwingend
    const binance_preis  = parseFloat(binanceData.price);
    const coinbase_preis = parseFloat(coinbaseData.data.rates['USD']);

    if (isNaN(binance_preis) || isNaN(coinbase_preis)) {
      throw new Error('Ungültige Preis-Daten von API');
    }

    const premium_prozent = (coinbase_preis - binance_preis) / binance_preis * 100;
    const interpretation  = interpretiere(premium_prozent);

    return { binance_preis, coinbase_preis, premium_prozent, interpretation, ist_live: true, fetch_zeit };
  } catch (err) {
    const fehler = err instanceof Error ? err.message : 'Unbekannter Fehler';
    return { ...FALLBACK, fetch_zeit, fehler };
  }
}
