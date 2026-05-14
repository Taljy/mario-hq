// twelveDataFetcher — Aktien · Forex · Rohstoffe via Twelve Data API
// Free Tier: Aktien US ✅ · Forex ✅ · Indizes ❌ · BRENT ❌ · WTI ⚠️ (suspekter Preis)
// Key fehlt → früher Return · alle Items ist_live: false
// Plan-Fehler pro Symbol → ist_live: false · fehler gesetzt
// Fetch läuft server-side (SSR) · API-Key nie im Client-Bundle

interface TwelveDataItem {
  id: string;
  td_symbol: string;
}

export interface TwelveDataStand {
  id: string;
  preis_usd: number;
  delta_24h_prozent: number;
  ist_live: boolean;
  fehler?: string;
}

interface TwelveDataQuote {
  symbol?: string;
  close?: string;
  percent_change?: string;
  status?: string;
  message?: string;
  code?: number;
}

export async function getTwelveDataStand(
  items: TwelveDataItem[],
): Promise<Map<string, TwelveDataStand>> {
  const result = new Map<string, TwelveDataStand>();

  if (items.length === 0) return result;

  // Key-Abwesenheit: früher Return · alle Items als Fallback markieren
  const apiKey = import.meta.env.TWELVE_DATA_API_KEY as string | undefined;
  if (!apiKey) {
    for (const item of items) {
      result.set(item.id, {
        id:                  item.id,
        preis_usd:           0,
        delta_24h_prozent:   0,
        ist_live:            false,
        fehler:              'TWELVE_DATA_API_KEY nicht gesetzt',
      });
    }
    return result;
  }

  try {
    // Alle Symbole in einem Request · Twelve Data Rate Limit: 8 req/min Free
    const symbolStr = items.map((i) => i.td_symbol).join(',');
    const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbolStr)}&apikey=${apiKey}`;

    const response = await fetch(url, {
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const raw = await response.json();

    // Single vs. Multi-Symbol-Response unterscheiden:
    // 1 Symbol → { close: "...", percent_change: "...", ... }
    // N Symbole → { "AAPL": { close: "...", ... }, "EUR/USD": { ... } }
    const quotes: Record<string, TwelveDataQuote> =
      items.length === 1
        ? { [items[0].td_symbol]: raw as TwelveDataQuote }
        : (raw as Record<string, TwelveDataQuote>);

    for (const item of items) {
      const q = quotes[item.td_symbol];

      if (!q || q.status === 'error' || !q.close) {
        // Plan nicht enthalten oder Symbol unbekannt
        result.set(item.id, {
          id:                item.id,
          preis_usd:         0,
          delta_24h_prozent: 0,
          ist_live:          false,
          fehler:            q?.message ?? 'Keine Daten (Free Tier?)',
        });
      } else {
        result.set(item.id, {
          id:                item.id,
          preis_usd:         parseFloat(q.close),
          delta_24h_prozent: parseFloat(q.percent_change ?? '0'),
          ist_live:          true,
        });
      }
    }
  } catch (err) {
    // Netzwerk-/Timeout-Fehler: alle Items als Fallback
    const fehler = err instanceof Error ? err.message : 'Unbekannter Fehler';
    for (const item of items) {
      if (!result.has(item.id)) {
        result.set(item.id, {
          id:                item.id,
          preis_usd:         0,
          delta_24h_prozent: 0,
          ist_live:          false,
          fehler,
        });
      }
    }
  }

  return result;
}
