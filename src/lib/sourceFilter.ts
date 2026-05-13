import data from '../data/sources.json';

export interface Source {
  modul: string;
  name: string;
  url: string | null;
  lizenz: string;
  use: string;
}

export function getSourcesFor(modul: string): Source[] {
  return (data.sources as Source[]).filter((s) => s.modul === modul);
}

export function getAllSources(): Source[] {
  return data.sources as Source[];
}
