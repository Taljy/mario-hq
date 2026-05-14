// /api/aktien — Twelve-Data-Aktien-Stand · 6 US-Tech-Symbole · 6 Credits/Call
// Edge-Cache 20min frisch · 1h stale-while-revalidate
// Free-Tier-Limit ist hart (8 Credits/min) · darum Aktien und Forex auf zwei
// getrennte Endpoints gesplittet · 6 < 8 und 4 < 8 = jeder Call passt einzeln
// Bei Offline-Response (z.B. 429): no-store · kein Cache-Poisoning

import type { APIRoute } from 'astro';
import watchlistData from '../../data/watchlist.json';
import type { WatchlistItem } from '../../lib/watchlistAggregator';
import { getTwelveDataStand, type TwelveDataStand } from '../../lib/twelveDataFetcher';

export const prerender = false;

interface WatchlistFile {
  gruppen: Array<{ id: string; label: string; items: WatchlistItem[] }>;
}

export const GET: APIRoute = async () => {
  const daten = watchlistData as WatchlistFile;
  const gruppe = daten.gruppen.find((g) => g.id === 'aktien-us');

  const items = (gruppe?.items ?? [])
    .filter((i): i is WatchlistItem & { td_symbol: string } =>
      i.anbieter === 'twelvedata' && typeof i.td_symbol === 'string' && i.td_symbol.length > 0,
    )
    .map((i) => ({ id: i.id, td_symbol: i.td_symbol }));

  const standMap = await getTwelveDataStand(items);
  const standArr: TwelveDataStand[] = [...standMap.values()];
  const anyLive  = standArr.some((s) => s.ist_live);

  return new Response(JSON.stringify(standArr), {
    status: 200,
    headers: {
      'Content-Type':  'application/json',
      'Cache-Control': anyLive
        ? 'public, s-maxage=1200, stale-while-revalidate=3600'
        : 'no-store',
    },
  });
};
