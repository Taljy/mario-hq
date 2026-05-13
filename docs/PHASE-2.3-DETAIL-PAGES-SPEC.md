---
type: phasenspezifikation
projekt: mario-hq
phase: 2.3
erstellt: 26-05-13
aktualisiert: 26-05-13
status: Alle 5 Slices abgeschlossen · 13.5.2026
referenz: Strategie-Chat 13.5.2026 (claude.ai Web)
ersetzt: Sub-Phasen 2.3 · 2.4 · 2.5 · 2.6 aus _pendenzen.md
---

# Phase 2.3 · Detail-Pages Slim

> **Für Claude Code in einer neuen Session:** Dieses File ist self-contained. Alle Architektur-Entscheidungen aus dem Strategie-Chat sind hier festgehalten. SKILL.md, _projekt.md und _pendenzen.md gelten parallel. Phase-2.2-Spec (`docs/PHASE-2.2-COVER-SPEC.md`) ist Pattern-Vorbild für Card-Shells, Resolver-Patterns, Slice-Disziplin.

---

## 1 · Übersicht und Konsolidierung

**Was sich geändert hat:** Die ursprünglich geplanten vier Sub-Phasen 2.3 (/wirtschaft) · 2.4 (/wetter) · 2.5 (/news) · 2.6 (/kalender) werden zu **einer konsolidierten Phase 2.3 · Detail-Pages Slim** mit 5 Slices.

**Begründung:** Volle Vertiefung pro Hauptmodul (Charts, Live-APIs, Trade-Setups, Astronomie-Tiefe) verschiebt sich logisch nach Phase 4 (Charts) und Phase 5 (Cowork-Automation). Aktuell ohne diese Foundations wäre Vertiefung nur Mockup-Arbeit. Stattdessen: alle vier Detail-Pages bekommen erstmal ein **Slim-Layout im Pattern der Cover-Cards**. Mario erlebt das HQ als komplettes Ganzes statt als Cover-Fragment mit toten Klicks.

**Site-First-Tiefe-Later** ist das Leitprinzip dieser Phase.

**Was bleibt:** Die Detail-Pages-URLs aus Phase 2.1 (`/wirtschaft` · `/wetter` · `/news` · `/kalender`) bleiben unverändert. Nur die Platzhalter-Inhalte werden durch echte (statische) Inhalte ersetzt.

---

## 2 · Architektur-Modell

Phase 2.3 folgt dem **Hybrid-Modell** aus Phase 2.2 (Modell C):

- **Statisch · täglich generiert von Cowork (ab Phase 5):** Geschichte, Zitate, News-Texte, Foto-Hinweise, Astronomie-Inhalte
- **Live · bei Page-Load via API:** BTC und Top-Altcoins via CoinGecko · Wetter aktuell via Open-Meteo · Kalender via iCal-Feed
- **Statische JSON-Stubs für MVP:** Bis Cowork läuft, sind alle Daten in `src/data/`-Files hartcodiert
- **Quellen-Transparenz:** Zentrales `src/data/sources.json` mit allen Datenherkünften pro Modul

**MVP-Pragmatik:** Detail-Pages bekommen Pattern-Klone der Cover-Cards. Charts kommen mit Phase 4 (ECharts). Cowork-Automation kommt mit Phase 5. Trade-Setups mit Phase 6.

---

## 3 · Modul-Entscheidungen im Überblick

| Modul | Datenquelle | Strategie für 2.3 |
|---|---|---|
| **Krypto** | CoinGecko-API (gratis, kein Auth) | Live · BTC + ETH + SOL + XRP + SUI |
| **Indizes** | Statische JSON-Stubs | Cowork füllt ab Phase 5 (SMI · DAX · S&P · Nasdaq) |
| **Wirtschafts-News** | Statisch · Cowork-kuratiert ab Phase 5 | 3–5 Schlagzeilen mit Link |
| **Trade-Setups** | Placeholder-Sektion | Echter Inhalt Phase 6+ |
| **Wetter** | Open-Meteo (gratis, kein Auth, präzise CH) | Live-Anbindung bereits in 2.3 |
| **Wetter-Symbole** | 8 monolinige SVGs sumi-e | WMO-Code-Mapping in `wetter-symbole.json` |
| **Foto-Spots** | Statisches JSON | 4 Aargau-Spots · Algorithmus „Wetter + Goldene Stunde → Empfehlung" |
| **Astronomie** | SunCalc-Library lokal + hartcodierte 2026-Events | Mondphase, Sonne via Lib · Meteore/Konjunktionen kuratiert |
| **News (regional/global)** | Statisch · Cowork-kuratiert ab Phase 5 | 4 Kategorien (Tech · Foto · Architektur · Politik) |
| **Kalender** | iCal-Geheim-URL aus Google Calendar | Server-side Fetch + `ical.js` Parse · Read-Only |
| **Quellen-Transparenz** | `src/data/sources.json` | Schema: modul · name · url · lizenz |

**Bewusst NICHT in Phase 2.3:**
- Charts (kommen Phase 4 mit ECharts)
- Bitvavo-Portfolio-Anzeige (Phase 6+, falls überhaupt)
- OAuth-Anbindung Google Calendar (Phase 8 Voll-Kalender-Modul · iCal als Wegwerf-Code-Brücke jetzt OK)
- Auto-RSS-Aggregation für News (manuelle Kuration via Cowork ab Phase 5)

---

## 4 · Datenarchitektur

### 4.1 src/data/sources.json

Zentrales File mit allen Datenherkünften, das jede Detail-Page referenziert für Transparenz-Stempel im Footer-Bereich.

**Schema:**

```json
{
  "sources": [
    {
      "modul": "wirtschaft",
      "name": "CoinGecko",
      "url": "https://www.coingecko.com",
      "lizenz": "Free API · Public Data",
      "use": "BTC und Altcoin-Kurse"
    }
  ]
}
```

**Initialinhalt:** Einträge für CoinGecko · Open-Meteo · Google Calendar (iCal) · SunCalc · plus Cowork als generischer Eintrag für die kuratierten Inhalte.

### 4.2 src/data/wirtschaft.json

Stub für /wirtschaft. Live-Daten (BTC etc.) werden zur Build- oder Laufzeit über CoinGecko ergänzt.

```json
{
  "indizes": [
    { "name": "SMI", "wert": 11420, "delta_prozent": 0.3 },
    { "name": "DAX", "wert": 17880, "delta_prozent": 0.0 },
    { "name": "S&P 500", "wert": 5180, "delta_prozent": -0.1 },
    { "name": "Nasdaq", "wert": 16240, "delta_prozent": 0.2 }
  ],
  "news": [
    { "titel": "Schweizer AI-Act tritt in Kraft", "quelle": "NZZ", "url": "#" },
    { "titel": "Tesla senkt EU-Preise", "quelle": "Handelszeitung", "url": "#" },
    { "titel": "SNB-Sitzung Mitte Mai erwartet Zinsschritt", "quelle": "Bloomberg", "url": "#" }
  ],
  "trade_setups_placeholder": "Trade-Setups mit konkreten Entry/SL/TP-Vorschlägen kommen mit Phase 6+."
}
```

### 4.3 src/data/wetter-symbole.json

Mapping WMO-Weather-Code (Open-Meteo) → Symbol-Name + Beschreibung.

**Symbol-Set (8 SVGs):**

| Symbol | WMO-Codes | Beschreibung |
|---|---|---|
| `sonne` | 0 | Klar |
| `sonne-wolken` | 1, 2 | Vorwiegend klar bis bewölkt |
| `wolken` | 3 | Bedeckt |
| `nebel` | 45, 48 | Nebel |
| `regen` | 51, 53, 55, 61, 63, 65, 80, 81, 82 | Niesel bis Schauer |
| `schnee` | 71, 73, 75, 77, 85, 86 | Schneefall |
| `gewitter` | 95, 96, 99 | Gewitter |
| `sturm` | (extra: bei Wind > 50 km/h) | Sturm-Overlay |

**Stil:** Monolinig, Stroke 1.5px, kein Fill (ausser zur Überdeckung), `var(--fg)`-Strokes für Dark-Mode-Auto-Anpassung. Alle 8 SVGs in `src/components/wetter-symbole/` als einzelne `.astro`-Komponenten.

### 4.4 src/data/foto-spots.json

4 Aargau-Spots mit Algorithmus-Kriterien.

**Schema:**

```json
{
  "spots": [
    {
      "name": "Wasserturm Baden",
      "lat": 47.4762,
      "lng": 8.3056,
      "tags": ["architektur", "stadt", "nah"],
      "beste_bedingung": "blaue-stunde · klar",
      "fahrzeit_minuten": 5,
      "hinweis": "Architektur-Detail bei blauer Stunde · Reflexionen im Limmatkanal"
    },
    {
      "name": "Kloster Wettingen",
      "lat": 47.4604,
      "lng": 8.3331,
      "tags": ["architektur", "historisch", "innenhof"],
      "beste_bedingung": "goldene-stunde · sonne-wolken",
      "fahrzeit_minuten": 10,
      "hinweis": "Klosterhof zur goldenen Stunde · warme Sandstein-Töne"
    },
    {
      "name": "Geissberg",
      "lat": 47.5167,
      "lng": 8.2333,
      "tags": ["landschaft", "weitsicht", "wandern"],
      "beste_bedingung": "klar · weitsicht",
      "fahrzeit_minuten": 15,
      "hinweis": "Aussichtspunkt mit Blick übers Mittelland · Alpen-Panorama bei Föhn"
    },
    {
      "name": "Lägern",
      "lat": 47.4833,
      "lng": 8.3667,
      "tags": ["landschaft", "grat", "wandern"],
      "beste_bedingung": "nebelmeer · sonnenaufgang",
      "fahrzeit_minuten": 20,
      "hinweis": "Gratwanderung mit Nebelmeer-Chance · Sonnenaufgang im Herbst beste Zeit"
    }
  ]
}
```

**Algorithmus für Tages-Empfehlung:** Match `beste_bedingung` gegen aktuelle Wetter-Bedingung + Tageszeit. Wenn kein Match: zeige Top-Spot nach Fahrzeit. Implementation als `src/lib/fotoSpotPicker.ts`.

### 4.5 src/data/astronomie-2026.json

Hartcodierte Highlights für 2026. Keine API · Inhalte aus astronomischen Jahresvorschau-Quellen kuratiert.

**Schema:**

```json
{
  "meteor_schauer": [
    { "name": "Lyriden", "peak": "2026-04-22", "fenster": "2026-04-16/2026-04-25", "rate": 18, "mond_problem": false },
    { "name": "Perseiden", "peak": "2026-08-12", "fenster": "2026-07-17/2026-08-24", "rate": 100, "mond_problem": false },
    { "name": "Geminiden", "peak": "2026-12-14", "fenster": "2026-12-04/2026-12-17", "rate": 120, "mond_problem": true }
  ],
  "planeten_events": [
    { "datum": "2026-06-30", "ereignis": "Venus · Mars · Konjunktion in Krebs", "sichtbar": "abends Westen" }
  ],
  "vollmonde": [
    { "datum": "2026-05-31", "name": "Blumenmond" },
    { "datum": "2026-06-30", "name": "Erdbeermond" }
  ]
}
```

**Mondphase + Sonnenauf/-untergang:** Live-Berechnung via SunCalc-Library (`npm install suncalc`, server-side im Astro-Frontmatter).

### 4.6 src/data/news-voll.json

4 Kategorien · 3–5 Headlines pro Kategorie.

**Schema:**

```json
{
  "kategorien": [
    {
      "name": "Tech",
      "items": [
        { "titel": "OpenAI veröffentlicht GPT-Successor", "quelle": "Hacker News", "url": "#" }
      ]
    },
    { "name": "Foto", "items": [...] },
    { "name": "Architektur", "items": [...] },
    { "name": "Politik", "items": [...] }
  ]
}
```

**News-Quellen pro Kategorie (für Cowork-Prompt ab Phase 5):**

- Tech: Hacker News · Heise · The Verge
- Foto: PetaPixel · DPReview
- Architektur: Hochparterre.ch (Schweiz-Fokus) · Dezeen · Detail
- Politik: NZZ · Tagi · Watson

### 4.7 Kalender · iCal-Anbindung

**Quelle:** Google-Calendar-Geheim-URL (Format `https://calendar.google.com/calendar/ical/...basic.ics`).

**URL als Environment-Variable** in Vercel: `KALENDER_ICAL_URL`. Lokal in `.env` (gitignored). **NIEMALS** im Repo hartcodieren.

**Implementation:**
- Astro-Page `/kalender.astro` mit `export const prerender = false` (SSR statt SSG, weil bei jedem Request frische Daten)
- Server-side Fetch via `fetch(import.meta.env.KALENDER_ICAL_URL)`
- Parse via `ical.js` (`npm install ical.js`)
- Auf Heute + kommende 7 Tage filtern
- Render als Termine-Liste

**Fallback:** Wenn ENV-Var fehlt oder Fetch fehlschlägt → Demo-Daten aus `src/data/kalender-fallback.json` zeigen plus diskreten Hinweis „Live-Sync nicht verfügbar".

**Sicherheits-Hinweis:** Die iCal-URL ist „geheim aber öffentlich erreichbar". Wer sie hat, sieht den Kalender. Niemals committen, niemals im Frontend-JS exponieren — server-side only.

---

## 5 · Komponenten-Liste

| Komponente | Status | Slice |
|---|---|---|
| `src/layouts/DetailPage.astro` (gemeinsames Detail-Layout) | Neu | 2.3.1 |
| `src/data/sources.json` | Neu | 2.3.1 |
| `src/components/SourceStempel.astro` (Quellen-Footer pro Page) | Neu | 2.3.1 |
| `src/data/wirtschaft.json` | Neu | 2.3.2 |
| `src/lib/coingeckoFetcher.ts` (Live-Krypto) | Neu | 2.3.2 |
| `src/components/wirtschaft/KryptoHero.astro` | Neu | 2.3.2 |
| `src/components/wirtschaft/IndizesGrid.astro` | Neu | 2.3.2 |
| `src/components/wirtschaft/WirtschaftsNews.astro` | Neu | 2.3.2 |
| `src/components/wirtschaft/TradeSetupsPlaceholder.astro` | Neu | 2.3.2 |
| `src/pages/wirtschaft.astro` (Platzhalter ersetzen) | Modifiziert | 2.3.2 |
| `src/components/wetter-symbole/*.astro` (8 Symbole) | Neu | 2.3.3 |
| `src/data/wetter-symbole.json` | Neu | 2.3.3 |
| `src/data/foto-spots.json` | Neu | 2.3.3 |
| `src/lib/openMeteoFetcher.ts` (Live-Wetter) | Neu | 2.3.3 |
| `src/lib/fotoSpotPicker.ts` (Empfehlungs-Algorithmus) | Neu | 2.3.3 |
| `src/components/wetter/WetterDetail.astro` | Neu | 2.3.3 |
| `src/components/wetter/FotoSpots.astro` | Neu | 2.3.3 |
| `src/pages/wetter.astro` (Platzhalter ersetzen) | Modifiziert | 2.3.3 |
| `src/data/news-voll.json` | Neu | 2.3.4 |
| `src/components/news/KategorieBlock.astro` | Neu | 2.3.4 |
| `src/pages/news.astro` (Platzhalter ersetzen) | Modifiziert | 2.3.4 |
| `src/data/kalender-fallback.json` | Neu | 2.3.4 |
| `src/lib/icalFetcher.ts` (iCal-Parse mit Fallback) | Neu | 2.3.4 |
| `src/components/kalender/TerminListe.astro` | Neu | 2.3.4 |
| `src/pages/kalender.astro` (SSR, Platzhalter ersetzen) | Modifiziert | 2.3.4 |
| `src/data/astronomie-2026.json` | Neu | 2.3.5 |
| `src/lib/astronomieResolver.ts` (SunCalc + JSON-Combine) | Neu | 2.3.5 |
| `src/components/wetter/AstronomieSektion.astro` | Neu | 2.3.5 |

---

## 6 · Implementierungs-Reihenfolge in Slices

| Slice | Inhalt | Status |
|---|---|---|
| **2.3.1** | Foundation · `DetailPage.astro` · `sources.json` · `SourceStempel.astro` · Cross-Page-Navigation-Anchor | ✅ 13.5.2026 |
| **2.3.2** | /wirtschaft Slim · Krypto-Hero (live) · Indizes-Grid · Wirtschafts-News · Trade-Setups Placeholder | ✅ 13.5.2026 |
| **2.3.3** | /wetter Slim · 8 Wetter-Symbol-SVGs · Open-Meteo-Anbindung · Foto-Spots mit Picker-Algo | ✅ 13.5.2026 |
| **2.3.4** | /news Slim (4 Kategorien) UND /kalender iCal-Read-Only (in einem Slice gebündelt) | ✅ 13.5.2026 |
| **2.3.5** | Astronomie-Sub-Section in /wetter · Polish · Volltest aller 4 Detail-Pages · Phase-2.3-Abschluss | ✅ 13.5.2026 |

**Vorgehen pro Slice:** Wie in Phase 2.2 etabliert · Plan-First · npm run build vor Push · feat-Commit + docs-Commit · Vercel-Verifikation.

---

## 7 · Slice-Spezifikationen (kurz)

### 7.1 Slice 2.3.1 · Foundation

**Files:**
- `src/layouts/DetailPage.astro` als gemeinsames Layout für alle 4 Detail-Pages. Reuse Magazine.astro plus konsistente Page-Header-Struktur (Titel, optionale Eyebrow).
- `src/data/sources.json` mit allen externen Quellen
- `src/components/SourceStempel.astro` zeigt Quellen pro Page als kleinen Footer-Stempel
- `src/lib/sourceFilter.ts` filtert Quellen nach Modul-Tag

**Cross-Page-Navigation:** Detail-Pages bekommen oben rechts neben dem Titel einen „← Zur Übersicht"-Link zurück zum Cover. Plus konsistente Sektion-Reihenfolge pro Page-Typ.

### 7.2 Slice 2.3.2 · /wirtschaft

**Live-Anbindung:** CoinGecko-API `https://api.coingecko.com/api/v3/coins/markets?...` für BTC, ETH, SOL, XRP, SUI in einem Request. Cache 60 Sekunden (`Astro.response.headers.set('Cache-Control', 's-maxage=60')`). Fallback bei API-Error: letzte bekannte Werte aus `wirtschaft.json` + Hinweis.

**Komponenten-Stapel:**
1. KryptoHero (BTC gross, dann ETH/SOL/XRP/SUI als kleine Strip-Cards)
2. IndizesGrid (4 Karten SMI/DAX/S&P/Nasdaq · statisch)
3. WirtschaftsNews (3–5 Headlines)
4. TradeSetupsPlaceholder mit explizitem „Phase 6+"-Hinweis

**Vermillon:** Negative Deltas in Vermillon, sonst neutral. Selbe Konvention wie KryptoCard im Cover.

### 7.3 Slice 2.3.3 · /wetter

**Live-Anbindung Open-Meteo:** `https://api.open-meteo.com/v1/forecast?latitude=47.4762&longitude=8.3056&...` mit allen relevanten Variablen (temperature, wind, weather_code, sunrise, sunset). Kein Auth nötig. Cache 30 Min.

**8 Wetter-Symbol-SVGs:** Jedes als eigene .astro-Komponente in `src/components/wetter-symbole/`. Pattern: sumi-e monolinig, stroke `var(--fg)` 1.5px, kein Fill (oder `var(--bg-card)` für Überdeckung). Wrapper-Funktion `WetterSymbol.astro` nimmt WMO-Code-Prop und rendert das passende SVG.

**Foto-Spot-Algorithmus:**
```
matchSpot(wetter, tageszeit) {
  wenn (regen oder gewitter) → kein Spot · Hinweis "Heute drinnen"
  wenn (klar + goldene_stunde aktiv) → match auf "goldene-stunde"-Tag
  wenn (nebel + früher Morgen) → match auf "nebelmeer"-Tag
  sonst → Top-Spot nach kürzester Fahrzeit
}
```

**Layout:**
1. WetterDetail (Symbol gross + Temperatur + 7-Tage-Strip + Wind/Niederschlag)
2. FotoSpots (Tages-Empfehlung gross + Liste der 4 Spots als Karten)

### 7.4 Slice 2.3.4 · /news + /kalender

**Bewusst gebündelt** weil beide schlanke Slim-Layouts sind und sich gegenseitig nicht blockieren.

**/news:** 4 Kategorie-Sektionen (Tech · Foto · Architektur · Politik). Jede mit 3–5 Headlines aus `news-voll.json`. Headlines als Links (target="_blank").

**/kalender:**
- Server-side iCal-Fetch + Parse
- Export `prerender = false` für SSR
- Termine-Liste · Heute + nächste 7 Tage
- Fallback auf `kalender-fallback.json` wenn Fetch fehlschlägt
- Hinweis am Footer „Read-Only · Bearbeitung im Google Calendar selbst"

**ENV-Var-Setup:**
1. Lokal: `.env` mit `KALENDER_ICAL_URL=...`
2. `.gitignore` muss `.env` enthalten (prüfen!)
3. Vercel: Settings → Environment Variables → `KALENDER_ICAL_URL` produktiv setzen

### 7.5 Slice 2.3.5 · Astronomie + Polish

**Astronomie-Sektion** unter Wetter-Hauptblock auf /wetter. Nur sichtbar wenn etwas Bemerkenswertes ansteht (Meteor-Peak +/- 5 Tage, Vollmond +/- 2 Tage, Planeten-Event +/- 7 Tage).

**SunCalc-Integration:** Mondphase als kleines SVG (Halbmond, Sichel, Vollmond, Neumond gerendert). Goldene/Blaue Stunde sind bereits in WetterCard auf Cover — hier nicht duplizieren. Astronomie-Sektion fokussiert auf *seltene* Events.

**Polish-Tasks:**
- Konsistenz aller Detail-Pages (Spacing, Eyebrow-Stil)
- Cross-Page-Navigation (Cover → Detail → zurück) testen
- Mobile-Volltest aller 4 Pages
- Dark-Mode-Volltest
- Vermillon-Quote-Check über alle Pages

**Phase-2.3-Abschluss in `_pendenzen.md` und SESSION_LOG markieren.**

---

## 8 · Anti-Patterns für Phase 2.3

- ❌ **Keine Charts** · ECharts kommt Phase 4
- ❌ **Keine echten Trade-Setups** · Placeholder genügt
- ❌ **Keine OAuth-Anbindung Kalender** · iCal-URL als Wegwerf-Code
- ❌ **Keine Auto-Aggregation RSS für News** · manuelle Kuration via Cowork
- ❌ **Keine Bitvavo-Portfolio-Daten** · entscheidet Mario später ob überhaupt
- ❌ **Keine Live-Aktienindizes-API** · statische Stubs (Cowork füllt ab Phase 5)
- ❌ **Keine Astronomie-API** · hartcodierte 2026-Events + SunCalc lokal
- ❌ **Keine Bilder einbinden in Detail-Pages** · Slim-Layout, Bilder kommen später
- ❌ **iCal-URL niemals committen** · ENV-Var only

---

## 9 · Offene Fragen (nach Phase 2.3 zu klären)

1. **News-Quellen-Erweiterung** — sind die vorgeschlagenen Quellen pro Kategorie OK oder sollen sie ergänzt werden?
2. **Foto-Spots-Erweiterung** — welche Spots fehlen über die 4 Aargau-Spots hinaus?
3. **Astronomie-Tiefe** — soll Phase 4 (Charts) eine Jupiter-Höhenkurve oder Mondphase-Visualisierung bringen?
4. **CoinGecko-Rate-Limit** — bei Free Tier 10-30 Calls/Min. Bei vielen Concurrent-Visitors später ggf. Anbindung an `noEmits`-Cache-Layer oder API-Key.
5. **Cowork-Prompt-Schema** — wie genau soll Cowork ab Phase 5 die JSONs befüllen? Eigene Spec.

---

## 10 · Vermillon-Quote-Check

DRG-Hard-Rule: ≤ 3 % Flächenanteil.

**In Phase 2.3 voraussichtliche Vermillon-Setzungen:**
- Negative Krypto/Indizes-Deltas (rotgefärbt)
- Eyebrows pro Page-Sektion (klein, mono)
- Aktive Wetter-Warnung wenn Sturm/Gewitter (analog Event-Banner)
- News-Headlines aus kuratierten Kategorien bekommen KEINE Vermillon-Akzente

**Erwarteter Wert pro Detail-Page:** < 1.5 % · komfortabel unter Limit.

---

## 11 · Stolpersteine

Aus Phase 2.1/2.2 dokumentiert · gilt weiter:

1. **Worktree-Falle** · `cd /Users/mariomacstudio/Developer/mario-hq && ...`
2. **Plan-First-Regel** vor jedem nicht-trivialen Edit
3. **Build-Test ist Pflicht** vor `git push`
4. **Build-Fehler-Handling** · max 1 Fix-Attempt, dann `git restore .`
5. **„Lokal funktioniert" ≠ „gepusht"** · Done = Vercel grün + URL verifiziert
6. **TypeScript strict** · keine `any` ohne Begründung
7. **HMR-Cache-Bug** bei Vite-Dev-Server nach Layout-Edits · dev-Server neu starten wenn CSS fehlt
8. **Layout-Anchor-Border** (Erkenntnis aus 2.2.4) · `border: 1.5px solid transparent` als Default vermeidet Layout-Shift wenn Border später dynamisch erscheint

**Neue Stolpersteine erwartet für 2.3:**

9. **ENV-Var-Hygiene** · `.env` lokal + Vercel UI · niemals in Repo
10. **API-Rate-Limits** · CoinGecko Free Tier 10-30/Min · Open-Meteo grosszügig aber prüfen
11. **SSR vs SSG** · `/kalender.astro` braucht `export const prerender = false`, andere Pages bleiben SSG
12. **iCal-Parse-Edge-Cases** · All-Day-Events, Wiederholungen, Zeitzone (Europe/Zurich)

---

## 12 · Commit-Konventionen für Phase 2.3

Conventional Commits, Deutsch · gleicher Stil wie 2.2:

```
feat: detail-pages slice 2.3.X · <inhalt>

- Komponente A mit X
- Daten-Layer in JSON · Resolver in TS
- Live-API-Anbindung wo zutreffend
- index.astro / detail-page integriert die neuen Komponenten
```

```
docs: slice 2.3.X abgeschlossen · pendenzen + log
```

---

## 13 · Übergabe zur Phase 4 und 5

Phase 2.3 schliesst die Site-First-Tiefe-Later-Phase ab. Was danach kommt:

- **Phase 3 · Content-Pipeline** · Briefing-Schema in Astro Content Collections, Archive-Page baut sich automatisch
- **Phase 4 · Charts** · ECharts für Krypto-Sparklines, Wetter-Wochen-Bars, Mondphase, Indizes-Sparklines
- **Phase 5 · Automation** · Cowork-Scheduled-Task befüllt alle `*.json`-Stubs täglich · Obsidian-Sync via Doppel-Write
- **Phase 6 · Briefing-Erweiterungen** · Trade-Setups konkret, Streaks-Heatmap, Daily Learning, On-Chain
- **Phase 7+ · Post-MVP-Module** · Habits · Workout · Zeit · Voll-Kalender · Foto-Pipeline

Jede dieser Phasen bekommt bei Bedarf ihre eigene Spec-Datei im selben Format wie diese.

---

*Bei jedem abgeschlossenen Slice: dieses File unter §6 aktualisieren (Slice-Status), `_pendenzen.md` ergänzen, `SESSION_LOG.md` Eintrag oben.*
