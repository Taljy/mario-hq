// /api/forex — Twelve-Data-Forex-Stand · 4 Paare · 4 Credits/Call
// Edge-Cache 22min frisch (Versatz zu Aktien-Endpoint · 20min) · 1h SWR
// TTL-Versatz sorgt dafür, dass die zwei Background-Refreshes nach dem Initial-
// Sync auseinanderdriften statt dauerhaft in dieselbe Minute zu fallen
// Free-Tier-Limit ist hart (8 Credits/min) · 4 Credits einzeln passen
// Bei Offline-Response (z.B. 429): no-store · kein Cache-Poisoning
// Datenquelle: src/data/forex.ts (in 4.5b aus watchlist.json herausgelöst)

import type { APIRoute } from 'astro';
import { FOREX_DEFINITION } from '../../data/forex';
import { getTwelveDataStand, type TwelveDataStand } from '../../lib/twelveDataFetcher';

export const prerender = false;

export const GET: APIRoute = async () => {
  const items = FOREX_DEFINITION.map((f) => ({ id: f.id, td_symbol: f.td_symbol }));

  const standMap = await getTwelveDataStand(items);
  const standArr: TwelveDataStand[] = [...standMap.values()];
  const anyLive  = standArr.some((s) => s.ist_live);

  return new Response(JSON.stringify(standArr), {
    status: 200,
    headers: {
      'Content-Type':  'application/json',
      'Cache-Control': anyLive
        ? 'public, s-maxage=1320, stale-while-revalidate=3600'
        : 'no-store',
    },
  });
};
