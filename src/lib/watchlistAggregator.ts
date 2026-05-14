// watchlistAggregator — Kombiniert CoinGecko + Twelve Data Watchlist-Daten
// watchlist.json → Items nach Anbieter aufteilen → Promise.allSettled → Maps mergen
// Promise.allSettled: ein Provider-Ausfall blockiert den anderen nicht
// Gibt angereicherte Gruppen zurück (Preis + Delta pro Item)

import watchlistData from '../data/watchlist.json';
import { getKryptoStandFuerIds } from './coingeckoFetcher';
import { getTwelveDataStand } from './twelveDataFetcher';

// ─── Typen ────────────────────────────────────────────────────────────────────

export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  anbieter: 'coingecko' | 'twelvedata';
  td_symbol?: string;
}

export interface WatchlistGruppe {
  id: string;
  label: string;
  items: WatchlistItem[];
}

export interface WatchlistItemEnriched extends WatchlistItem {
  preis_usd: number | null;
  delta_24h_prozent: number | null;
  ist_live: boolean;
  sparkline_7d?: number[];  // nur Crypto · nur wenn coingecko live
  fehler?: string;
}

export interface WatchlistGruppeEnriched {
  id: string;
  label: string;
  items: WatchlistItemEnriched[];
}

export interface WatchlistErgebnis {
  gruppen: WatchlistGruppeEnriched[];
  fetch_zeit: string;
  ist_live: boolean;  // true wenn mindestens ein Item live
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function fetchZeitJetzt(): string {
  return (
    new Date().toLocaleTimeString('de-CH', {
      hour:     '2-digit',
      minute:   '2-digit',
      timeZone: 'Europe/Zurich',
    }) + ' CEST'
  );
}

// ─── Aggregator ───────────────────────────────────────────────────────────────

export async function getWatchlist(): Promise<WatchlistErgebnis> {
  const fetch_zeit = fetchZeitJetzt();
  const gruppen = watchlistData.gruppen as WatchlistGruppe[];

  // Items nach Anbieter aufteilen
  const allItems = gruppen.flatMap((g) => g.items);
  const cgIds    = allItems.filter((i) => i.anbieter === 'coingecko').map((i) => i.id);
  const tdItems  = allItems
    .filter((i): i is WatchlistItem & { td_symbol: string } =>
      i.anbieter === 'twelvedata' && typeof i.td_symbol === 'string' && i.td_symbol.length > 0,
    )
    .map((i) => ({ id: i.id, td_symbol: i.td_symbol }));

  // Beide Provider parallel · allSettled = kein Provider blockiert den anderen
  const [cgResult, tdResult] = await Promise.allSettled([
    getKryptoStandFuerIds(cgIds),
    getTwelveDataStand(tdItems),
  ]);

  const cgMap = cgResult.status === 'fulfilled' ? cgResult.value : new Map();
  const tdMap = tdResult.status === 'fulfilled' ? tdResult.value : new Map();

  let anyLive = false;

  // Gruppen mit angereicherten Items zusammenbauen
  const gruppenEnriched: WatchlistGruppeEnriched[] = gruppen.map((gruppe) => ({
    id:    gruppe.id,
    label: gruppe.label,
    items: gruppe.items.map((item): WatchlistItemEnriched => {
      if (item.anbieter === 'coingecko') {
        const stand = cgMap.get(item.id);
        if (stand) {
          anyLive = true;
          return {
            ...item,
            preis_usd:         stand.preis_usd,
            delta_24h_prozent: stand.delta_24h_prozent,
            ist_live:          true,
            sparkline_7d:      stand.sparkline_7d,
          };
        }
        return {
          ...item,
          preis_usd:         null,
          delta_24h_prozent: null,
          ist_live:          false,
          fehler:
            cgResult.status === 'rejected'
              ? 'CoinGecko API Fehler'
              : 'ID nicht in API-Response',
        };
      }

      // Twelve Data
      const stand = tdMap.get(item.id);
      if (stand) {
        if (stand.ist_live) anyLive = true;
        return {
          ...item,
          preis_usd:         stand.ist_live ? stand.preis_usd         : null,
          delta_24h_prozent: stand.ist_live ? stand.delta_24h_prozent : null,
          ist_live:          stand.ist_live,
          fehler:            stand.fehler,
        };
      }
      return {
        ...item,
        preis_usd:         null,
        delta_24h_prozent: null,
        ist_live:          false,
        fehler:
          tdResult.status === 'rejected'
            ? 'Twelve Data API Fehler'
            : 'Symbol nicht in Ergebnis',
      };
    }),
  }));

  return {
    gruppen:   gruppenEnriched,
    fetch_zeit,
    ist_live:  anyLive,
  };
}
