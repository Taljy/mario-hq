// defiLlamaFetcher — Stablecoin Supply via DeFiLlama Public API
// Verifikation (13.5.2026): Top-Level Key = "peggedAssets" (nicht "stablecoins")
// Felder: circulating.peggedUSD · circulatingPrevDay.peggedUSD · circulatingPrevWeek.peggedUSD
// USDT ~189.7 Mrd · USDC ~77.0 Mrd · Total ~266.7 Mrd (Stand 13.5.2026)

export interface StablecoinSupply {
  usdt_supply:       number; // USD-Wert
  usdc_supply:       number;
  total:             number;
  delta_24h_prozent: number;
  delta_7d_prozent:  number;
  ist_live:          boolean;
  fetch_zeit:        string;
  fehler?:           string;
}

const FALLBACK: StablecoinSupply = {
  usdt_supply:       0,
  usdc_supply:       0,
  total:             0,
  delta_24h_prozent: 0,
  delta_7d_prozent:  0,
  ist_live:          false,
  fetch_zeit:        '',
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

// DeFiLlama Stablecoin-Asset (nur die benötigten Felder)
interface PeggedAsset {
  symbol:               string;
  circulating:          { peggedUSD?: number };
  circulatingPrevDay:   { peggedUSD?: number };
  circulatingPrevWeek:  { peggedUSD?: number };
}

export async function getStablecoinSupply(): Promise<StablecoinSupply> {
  const fetch_zeit = fetchZeit();

  try {
    const res = await fetch(
      'https://stablecoins.llama.fi/stablecoins?includePrices=false',
      { signal: AbortSignal.timeout(8000) } // DeFiLlama kann etwas langsamer sein
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = (await res.json()) as { peggedAssets: PeggedAsset[] };

    // Filter: nur USDT und USDC
    const assets = data.peggedAssets.filter(
      (a) => a.symbol === 'USDT' || a.symbol === 'USDC'
    );

    if (assets.length === 0) throw new Error('USDT/USDC nicht in Response gefunden');

    const usdt = assets.find((a) => a.symbol === 'USDT');
    const usdc = assets.find((a) => a.symbol === 'USDC');

    const usdt_supply = usdt?.circulating?.peggedUSD ?? 0;
    const usdc_supply = usdc?.circulating?.peggedUSD ?? 0;
    const total       = usdt_supply + usdc_supply;

    // Delta-Berechnung: Summe aktuell vs Summe PrevDay/PrevWeek
    const prevDay  = (usdt?.circulatingPrevDay?.peggedUSD  ?? usdt_supply)
                   + (usdc?.circulatingPrevDay?.peggedUSD  ?? usdc_supply);
    const prevWeek = (usdt?.circulatingPrevWeek?.peggedUSD ?? usdt_supply)
                   + (usdc?.circulatingPrevWeek?.peggedUSD ?? usdc_supply);

    const delta_24h_prozent = prevDay  > 0 ? (total - prevDay)  / prevDay  * 100 : 0;
    const delta_7d_prozent  = prevWeek > 0 ? (total - prevWeek) / prevWeek * 100 : 0;

    return {
      usdt_supply,
      usdc_supply,
      total,
      delta_24h_prozent,
      delta_7d_prozent,
      ist_live: true,
      fetch_zeit,
    };
  } catch (err) {
    const fehler = err instanceof Error ? err.message : 'Unbekannter Fehler';
    return { ...FALLBACK, fetch_zeit, fehler };
  }
}
