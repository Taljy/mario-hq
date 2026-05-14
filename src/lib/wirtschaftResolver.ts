// wirtschaftResolver — statische Wirtschafts-Daten aus wirtschaft.json
// News-Items aus manuell gepflegter JSON · Trade-Setups-Platzhalter
// (Indizes wurden in Slice 4.5 entfernt · einziger Indizes-Ort ist die Watchlist-Sektion)

import data from '../data/wirtschaft.json';

export interface WirtschaftsNews {
  titel: string;
  quelle: string;
  url: string;
}

export interface Wirtschaft {
  news: WirtschaftsNews[];
  trade_setups_placeholder: string;
}

export function getWirtschaft(): Wirtschaft {
  return {
    news:                     data.news as WirtschaftsNews[],
    trade_setups_placeholder: data.trade_setups_placeholder,
  };
}
