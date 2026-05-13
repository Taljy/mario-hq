// wirtschaftResolver — statische Wirtschafts-Daten aus wirtschaft.json
// Indizes + News werden von Cowork ab Phase 5 täglich befüllt

import data from '../data/wirtschaft.json';

export interface Index {
  name: string;
  wert: number;
  delta_prozent: number;
}

export interface WirtschaftsNews {
  titel: string;
  quelle: string;
  url: string;
}

export interface Wirtschaft {
  indizes: Index[];
  news: WirtschaftsNews[];
  trade_setups_placeholder: string;
}

export function getWirtschaft(): Wirtschaft {
  return {
    indizes:                  data.indizes as Index[],
    news:                     data.news as WirtschaftsNews[],
    trade_setups_placeholder: data.trade_setups_placeholder,
  };
}
