// newsResolver — liefert statischen News-Stub für Cover-MVP
// RSS-Aggregator kommt Phase 2.5

import data from '../data/news.json';

export interface News {
  headlines: string[];
}

export function getNewsHeute(): News {
  return data as News;
}
