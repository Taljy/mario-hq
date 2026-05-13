// newsResolver — liefert News-Kategorien für /news-Detail-Page
// getNewsHeute() bleibt für Cover-Kompatibilität (index.astro)

import data from '../data/news.json';
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
  return data as News;
}

export function getNewsKategorien(): NewsKategorie[] {
  return vollData.kategorien as NewsKategorie[];
}
