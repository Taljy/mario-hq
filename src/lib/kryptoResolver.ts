// kryptoResolver — liefert statischen BTC-Stub für Cover-MVP
// Live-CoinGecko-Anbindung kommt späterer Slice (Phase 4/5)

import data from '../data/krypto.json';

export interface BTC {
  preis_usd: number;
  delta_24h_prozent: number;
  fear_greed: number;
  fear_greed_label: string;
  stand: string;
}

export function getBTCHeute(): BTC {
  return data.btc as BTC;
}
