// newsResolver — News-Quellen für Cover + /news-Detail-Page
// getNewsHeute() für Cover-NewsCard (Slice 5.3: aus news-voll.cover_headlines)
// getNewsKategorien() für /news Detail-Page (4 Kategorien × N Items)
// Beide aus EINER Datei (news-voll.json) seit Slice 5.3 · Single-Source

import vollData from '../data/news-voll.json';

export interface News {
  headlines: string[];
}

export interface NewsItem {
  titel: string;
  quelle: string;
  url: string;
}

export interface NewsKategorie {
  id: string;
  name: string;
  items: NewsItem[];
}

export function getNewsHeute(): News {
  return { headlines: vollData.cover_headlines as string[] };
}

export function getNewsKategorien(): NewsKategorie[] {
  return vollData.kategorien as NewsKategorie[];
}
