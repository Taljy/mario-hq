// /api/aktien — Twelve-Data-Aktien-Stand · 6 US-Tech-Symbole · 6 Credits/Call
// Edge-Cache 20min frisch · 1h stale-while-revalidate
// Free-Tier-Limit ist hart (8 Credits/min) · darum Aktien und Forex auf zwei
// getrennte Endpoints gesplittet · 6 < 8 und 4 < 8 = jeder Call passt einzeln
// Bei Offline-Response (z.B. 429): no-store · kein Cache-Poisoning
// Datenquelle: src/data/aktien.ts (in 4.5b aus watchlist.json herausgelöst)

import type { APIRoute } from 'astro';
import { AKTIEN_DEFINITION } from '../../data/aktien';
import { getTwelveDataStand, type TwelveDataStand } from '../../lib/twelveDataFetcher';

export const prerender = false;

export const GET: APIRoute = async () => {
  const items = AKTIEN_DEFINITION.map((a) => ({ id: a.id, td_symbol: a.td_symbol }));

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
