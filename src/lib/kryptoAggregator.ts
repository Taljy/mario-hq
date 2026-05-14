// kryptoAggregator — Krypto-Watchlist aus watchlist.json + CoinGecko-Daten
// Liest watchlist.json (nur Krypto seit 4.5b), zieht Preise via getKryptoStandFuerIds,
// gibt angereicherte Gruppen zurück. Aktien + Forex laufen über eigene Endpoints
// /api/aktien + /api/forex und werden hier NICHT mehr behandelt (Refactor in 4.5c).
// CoinGecko-Fetcher ist intern defensiv (gibt im Fehlerfall leere Map zurück) —
// daher kein Promise.allSettled / kein try/catch nötig.

import watchlistData from '../data/watchlist.json';
import { getKryptoStandFuerIds } from './coingeckoFetcher';

// ─── Typen ────────────────────────────────────────────────────────────────────

// Roh-Items aus watchlist.json · modul-intern, nicht exportiert
interface RohItem {
  id:       string;
  symbol:   string;
  name:     string;
  anbieter: 'coingecko';
}

interface RohGruppe {
  id:    string;
  label: string;
  items: RohItem[];
}

// Angereicherte Items (mit API-Daten) · KryptoItemEnriched intern, Gruppe + Ergebnis exportiert
interface KryptoItemEnriched {
  id:                string;
  symbol:            string;
  name:              string;
  preis_usd:         number | null;
  delta_24h_prozent: number | null;
  ist_live:          boolean;
  sparkline_7d?:     number[];
  fehler?:           string;
}

export interface KryptoGruppeEnriched {
  id:    string;
  label: string;
  items: KryptoItemEnriched[];
}

export interface KryptoWatchlistErgebnis {
  gruppen:    KryptoGruppeEnriched[];
  fetch_zeit: string;
  ist_live:   boolean;  // true wenn mindestens ein Item live
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

export async function getKryptoWatchlist(): Promise<KryptoWatchlistErgebnis> {
  const fetch_zeit = fetchZeitJetzt();
  const gruppen    = watchlistData.gruppen as RohGruppe[];

  const allItems = gruppen.flatMap((g) => g.items);
  const ids      = allItems.map((i) => i.id);

  // Direct-await: getKryptoStandFuerIds ist intern defensiv und kann nicht rejecten
  const cgMap = await getKryptoStandFuerIds(ids);

  let anyLive = false;

  const gruppenEnriched: KryptoGruppeEnriched[] = gruppen.map((gruppe) => ({
    id:    gruppe.id,
    label: gruppe.label,
    items: gruppe.items.map((item): KryptoItemEnriched => {
      const stand = cgMap.get(item.id);
      if (stand) {
        anyLive = true;
        return {
          id:                item.id,
          symbol:            item.symbol,
          name:              item.name,
          preis_usd:         stand.preis_usd,
          delta_24h_prozent: stand.delta_24h_prozent,
          ist_live:          true,
          sparkline_7d:      stand.sparkline_7d,
        };
      }
      return {
        id:                item.id,
        symbol:            item.symbol,
        name:              item.name,
        preis_usd:         null,
        delta_24h_prozent: null,
        ist_live:          false,
        fehler:            'ID nicht in API-Response',
      };
    }),
  }));

  return {
    gruppen:    gruppenEnriched,
    fetch_zeit,
    ist_live:   anyLive,
  };
}
