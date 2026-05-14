---
type: phasenspezifikation
projekt: mario-hq
phase: 4
erstellt: 26-05-13
aktualisiert: 26-05-14 (Spec-Sync nach Slice 4.5c)
status: 4.1–4.5 abgeschlossen · 4.5b/c (IA-Umbau ausserhalb Spec) abgeschlossen · 4.6/4.7/4.8 offen
referenz: Strategie-Chat 13.5.2026 (claude.ai Web)
ersetzt: ursprüngliche Phase-4-Roadmap aus _pendenzen.md (5-Punkt-Liste)
---

# Phase 4 · Charts + Trading-Watchlist auf /wirtschaft

> **Für Claude Code in einer neuen Session:** Dieses File ist self-contained. Alle Architektur-Entscheidungen aus dem Strategie-Chat sind hier festgehalten. SKILL.md, _projekt.md und _pendenzen.md gelten parallel. Phase-2.2-Spec (Cover) und Phase-2.3-Spec (Detail-Pages) sind Pattern-Vorbild für Slice-Disziplin, Card-Shells und Fetcher-Patterns.

---

## 1 · Übersicht und Strategischer Kontext

**Was sich geändert hat:** Phase 4 wurde im Strategie-Chat 13.5.2026 abends vom ursprünglichen *„Charts (ECharts) für Sparklines/Gauges/Mondphase"* auf *„Charts + Trading-Watchlist auf /wirtschaft als langer Wirtschafts-Hub"* erweitert. Cowork (Phase 5) entfällt komplett · Phase 3 wartet bis Bedarf konkret.

**Strategischer Schwerpunkt:** /wirtschaft wird zur **Multi-Asset-Wirtschafts-Zeitung** mit Editorial-Charts oben und vollständiger Trading-Watchlist (analog Marios TradingView-Setup) als langer scrollintensiver Hauptbereich. Andere Pages bleiben Editorial schlank.

**Motivations-Aspekt:** Mario ist Swing-Trader · braucht morgens um 06:00 CEST den Orientierungs-Überblick auf eigene Coins/Aktien/Forex/Commodities. Live-APIs liefern das ohne Cowork-Generation. Die /wirtschaft wird zum täglich gelesenen Wirtschafts-Modul · funktioniert als Boilerplate-Argument *„Personal Trading-Magazine mit native APIs"*.

**06:00-Bereitschaft:** Wird automatisch gelöst durch Live-API-Fetches zum Page-Load. Wenn Mario um 06:00 die Seite öffnet, kriegt er den dann aktuellsten Stand. Keine Build-Generation, kein Scheduled Task, keine Cowork-Schicht nötig.

---

## 2 · Architektur-Modell

Phase 4 setzt das **Hybrid-Modell mit Live-Inseln** aus Phase 2.3 fort, aber **erweitert es auf Multi-Asset**:

- **Live-APIs (Page-SSR):** CoinGecko · Binance Public · Coinbase Public · DeFiLlama · Open-Meteo (bereits)
- **Live-APIs (eigene API-Routes mit Edge-Cache + SWR seit 4.5):** Twelve Data via `/api/aktien` (s-maxage=1200) + `/api/forex` (s-maxage=1320) — Page-Fetch wäre wegen 8/min-Credits-Limit unmöglich gewesen
- **Statische JSON-Stubs:** Krypto-Watchlist-Definition (`watchlist.json` · nur Krypto seit 4.5b) · Aktien-Definition (`src/data/aktien.ts`) · Forex-Definition (`src/data/forex.ts`) · Trading-Indikator-Konfiguration · Macro-Events
- **Custom-SVG-Charts** (kein ECharts): Mondphase, vielleicht Wetter-Wochen-Bars
- **ECharts-Charts** (mit DRG-Theme-Customization): Sparklines, Gauge, Timeline
- **Caching:** 60s Page-Cache auf /wirtschaft (für CoinGecko-Liveness) · 20–22min Edge-Cache auf den Twelve-Data-Endpoints (siehe oben) · 30min Wetter (Open-Meteo)

**Bewusst NICHT in Phase 4:**
- Keine Cowork-Anbindung (entfällt komplett)
- Keine Content Collections (Phase 3 zurückgestellt)
- Keine Trade-Setup-Empfehlungen (Phase 6+)
- Keine Bitvavo-Portfolio-Anzeige (Phase 6+, falls überhaupt)
- Keine WebSocket-Streaming (Order-Book-Tiefe ist zu komplex für jetzt)
- Keine Liquidations-Heatmap (Coinglass-API kostenpflichtig · Scraping heikel · weglassen)
- Kein Volume-Profile (Berechnungs-intensiv · Phase 6+ wenn Bedarf)
- Keine Sentiment-Indikatoren (LunarCrush rauschig · Phase 6+)

---

## 3 · Modul-Entscheidungen im Überblick

| Modul | Datenquelle | API-Key nötig | Phase-4-Slice |
|---|---|---|---|
| **Editorial-Charts** | | | |
| BTC-Sparkline (7-Tage) | CoinGecko | nein | 4.1 |
| Altcoin-Sparklines | CoinGecko | nein | 4.4 |
| ~~Indizes-Sparklines~~ ENTFÄLLT | (Twelve Data Free Tier liefert keine Indices · Fallback B in 4.5 gewählt) | — | — |
| Fear & Greed Gauge | Alternative.me | nein | 4.7 |
| Macro-Timeline | manuelle JSON-Stubs | nein | 4.7 |
| Wetter-Wochen-Bars | Open-Meteo (schon im Einsatz) | nein | 4.6 |
| Mondphase-SVG | SunCalc (schon im Einsatz) · Custom-SVG | nein | 4.6 |
| **Trading-Indikatoren** | | | |
| Funding Rates | Binance Futures Public | nein | 4.2 |
| Open Interest | Binance Futures Public | nein | 4.2 |
| Long/Short Ratio | Binance Public | nein | 4.2 |
| Coinbase Premium | Coinbase Public + Binance Public + Eigenlogik | nein | 4.2 |
| Stablecoin Supply | DeFiLlama | nein | 4.2 |
| **Asset-Sektionen** (4.5b: Krypto/Aktien getrennte Card-Sektionen statt Multi-Asset-Watchlist) | | | |
| Krypto-Watchlist (BTC/ETH/SOL/XRP/SUI/TRX + ADA/AVAX/HBAR/JUP/GST/DOT, zwei Blöcke) | CoinGecko · Markets-Endpoint | nein | 4.4 + 4.5b |
| Aktien-Sektion (AAPL · NVDA · TSLA · MSFT · AMZN · META) | Twelve Data via `/api/aktien` | ja | 4.5 |
| Forex (EUR/USD · CHF/USD · EUR/CHF · GBP/USD) | Twelve Data via `/api/forex` | ja | 4.5 |
| ~~Indices (SPX · NAS100 · DAX · SMI)~~ ENTFÄLLT | (Twelve Data Free Tier: 403 · Fallback B in 4.5 gewählt) | — | — |
| ~~Commodities (USOIL · UKOIL)~~ ENTFÄLLT | (Twelve Data Free Tier: WTI/GOLD matchen falsche NYSE-Aktien · SILVER/BRENT 403 · in 4.5 alle vier aus watchlist.json entfernt) | — | — |

**Indices-Klärung (war Slice 4.5):** Test in 4.5 hat bestätigt, dass Indices, Commodities (Spots), SILVER und BRENT im Twelve Data Free Tier nicht verfügbar sind. **Fallback B (weglassen)** wurde gewählt — Mario nimmt keinen bezahlten Plan, Alpha Vantage als zweite API wurde verworfen. Indizes-Items bleiben als Offline-Stub in der historischen Watchlist-Gruppe nicht mehr nötig (in 4.5b komplett aus watchlist.json entfernt).

---

## 4 · Datenarchitektur

### 4.1 src/data/watchlist.json

> **Stand nach 4.5b:** Die ursprüngliche Multi-Asset-Watchlist mit TradingView-Schema (Index/BTC/Move2Earn/Aktien/Forex/Commodities) wurde in 4.5b zugunsten einer **zwei-blockigen Krypto-Watchlist** aufgegeben. Aktien und Forex haben jetzt eigene typesafe-Konstanten-Module (`src/data/aktien.ts` + `src/data/forex.ts`), Commodities/Indizes sind entfallen (Free-Tier-Erkenntnisse aus 4.5). `watchlist.json` enthält **ausschliesslich Krypto** und ist mit `anbieter: "coingecko"` strikt typisiert.

Aktuelles Schema:

```json
{
  "gruppen": [
    {
      "id": "krypto-block-1",
      "label": "Krypto · Block 1",
      "items": [
        { "id": "bitcoin",  "symbol": "BTC", "name": "Bitcoin",  "anbieter": "coingecko" },
        { "id": "ethereum", "symbol": "ETH", "name": "Ethereum", "anbieter": "coingecko" },
        { "id": "solana",   "symbol": "SOL", "name": "Solana",   "anbieter": "coingecko" },
        { "id": "ripple",   "symbol": "XRP", "name": "XRP",      "anbieter": "coingecko" },
        { "id": "sui",      "symbol": "SUI", "name": "Sui",      "anbieter": "coingecko" },
        { "id": "tron",     "symbol": "TRX", "name": "TRON",     "anbieter": "coingecko" }
      ]
    },
    {
      "id": "krypto-block-2",
      "label": "Krypto · Block 2",
      "items": [
        { "id": "cardano",                 "symbol": "ADA",  "name": "Cardano",   "anbieter": "coingecko" },
        { "id": "avalanche-2",             "symbol": "AVAX", "name": "Avalanche", "anbieter": "coingecko" },
        { "id": "hedera-hashgraph",        "symbol": "HBAR", "name": "Hedera",    "anbieter": "coingecko" },
        { "id": "jupiter-exchange-solana", "symbol": "JUP",  "name": "Jupiter",   "anbieter": "coingecko" },
        { "id": "green-satoshi-token",     "symbol": "GST",  "name": "STEPN GST", "anbieter": "coingecko" },
        { "id": "polkadot",                "symbol": "DOT",  "name": "Polkadot",  "anbieter": "coingecko" }
      ]
    }
  ]
}
```

**Felder:** `id` (CoinGecko-ID, in 4.5b alle live verifiziert) · `symbol` (Display) · `name` (Display) · `anbieter` (immer `"coingecko"`).

**Aktien-/Forex-Definitionen:** `src/data/aktien.ts` und `src/data/forex.ts` als typesafe TypeScript-Konstanten — werden von den `/api/aktien` + `/api/forex`-Endpoints **und** den jeweiligen Sektionen gelesen.

### 4.2 src/data/macro-events.json

Manuell gepflegte Macro-Events für die Macro-Timeline-Visualisierung in Slice 4.7. Mario aktualisiert ~monatlich.

```json
{
  "events": [
    {
      "datum": "2026-05-14",
      "name": "US CPI April",
      "kategorie": "inflation",
      "impact": "hoch",
      "uhrzeit": "14:30 CEST"
    },
    {
      "datum": "2026-05-21",
      "name": "SNB-Zinsentscheid",
      "kategorie": "central-bank",
      "impact": "hoch",
      "uhrzeit": "09:30 CEST"
    },
    {
      "datum": "2026-06-12",
      "name": "FOMC-Sitzung",
      "kategorie": "central-bank",
      "impact": "kritisch",
      "uhrzeit": "20:00 CEST"
    }
  ]
}
```

**Kategorien:** `inflation` · `central-bank` · `employment` · `gdp` · `geopolitik`
**Impact-Stufen:** `kritisch` (FOMC, ECB, SNB) · `hoch` (CPI, NFP) · `mittel` (sekundäre Daten)

### 4.3 src/data/trading-konfig.json

Konfiguration der Trading-Indikatoren-Anzeige für Slice 4.2.

```json
{
  "funding_rates": {
    "coins": ["BTCUSDT", "ETHUSDT", "SOLUSDT"],
    "endpoint": "https://fapi.binance.com/fapi/v1/premiumIndex",
    "interval_minuten": 15
  },
  "open_interest": {
    "coins": ["BTCUSDT", "ETHUSDT", "SOLUSDT"],
    "endpoint": "https://fapi.binance.com/fapi/v1/openInterest"
  },
  "long_short_ratio": {
    "coins": ["BTCUSDT", "ETHUSDT"],
    "endpoint": "https://fapi.binance.com/futures/data/topLongShortAccountRatio",
    "period": "5m"
  },
  "coinbase_premium": {
    "coin": "bitcoin",
    "binance_endpoint": "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT",
    "coinbase_endpoint": "https://api.coinbase.com/v2/exchange-rates?currency=BTC"
  },
  "stablecoin_supply": {
    "stables": ["tether", "usd-coin"],
    "endpoint": "https://stablecoins.llama.fi/stablecoins"
  }
}
```

### 4.4 ECharts-DRG-Theme

ECharts hat einen sehr eigenen Default-Look ("Tech-Dashboard"). Wir definieren ein zentrales DRG-Theme das **alle** ECharts-Instanzen nutzen.

**Pfad:** `src/lib/echarts-drg-theme.ts`

**Theme-Definition basiert auf:**

- `textStyle.fontFamily`: `"Inter, system-ui, sans-serif"`
- Achsen-Labels: var(--font-mono) für Datumsangaben, var(--font-body) für Texte
- Standard-Farbpalette der ECharts-Series **komplett überschreiben** mit DRG-Tokens:
  - Primary line: `var(--fg)` (Sumi-Schwarz)
  - Up: neutrale Farbe (nicht grün)
  - Down: `var(--accent)` (Vermillon)
  - Background: transparent
- Tooltips: kein eigener Schatten, Hairline-Border, var(--font-body) 12px
- Grid: minimale Padding, keine Hauptlinien, dezente Achsen
- Animationen: nur `easing: 'cubicOut'`, Dauer 200ms, **kein Bounce**

**Theme-Registration** beim ersten Import:

```ts
import * as echarts from 'echarts';
import { drgTheme } from './echarts-drg-theme';
echarts.registerTheme('drg', drgTheme);
```

Alle Chart-Komponenten initialisieren mit:
```ts
const chart = echarts.init(domEl, 'drg');
```

### 4.5 ENV-Vars für Phase 4

| Variable | Quelle | Wofür | Slice |
|---|---|---|---|
| `TWELVE_DATA_API_KEY` | twelvedata.com gratis Signup | Aktien/Forex/Commodities/Indices | 4.3 |

**Pattern wie KALENDER_ICAL_URL aus Slice 2.3.4:**
- Lokal in `.env` (gitignored)
- Vercel Dashboard alle drei Environments
- Niemals im Frontend-JS exponiert · nur server-side via `import.meta.env.TWELVE_DATA_API_KEY`

---

## 5 · Komponenten-Liste

| Komponente | Status | Slice |
|---|---|---|
| `src/lib/echarts-drg-theme.ts` | Neu | 4.1 |
| `src/lib/echartsRenderer.ts` (Astro-Islands-Wrapper) | Neu | 4.1 |
| `src/components/charts/Sparkline.astro` | Neu | 4.1 |
| `src/components/wirtschaft/KryptoHero.astro` (umgebaut · Sparkline integriert) | Modifiziert | 4.1 |
| `src/lib/binanceFetcher.ts` (Funding, OI, L/S) | Neu | 4.2 |
| `src/lib/coinbasePremiumFetcher.ts` | Neu | 4.2 |
| `src/lib/defiLlamaFetcher.ts` (Stablecoin Supply) | Neu | 4.2 |
| `src/components/wirtschaft/TradingIndikatoren.astro` | Neu | 4.2 |
| `src/components/wirtschaft/FundingRatesCard.astro` | Neu | 4.2 |
| `src/components/wirtschaft/OpenInterestCard.astro` | Neu | 4.2 |
| `src/components/wirtschaft/LongShortRatioCard.astro` | Neu | 4.2 |
| `src/components/wirtschaft/CoinbasePremiumCard.astro` | Neu | 4.2 |
| `src/components/wirtschaft/StablecoinSupplyCard.astro` | Neu | 4.2 |
| `src/lib/watchlistAggregator.ts` (Multi-Anbieter-Bündelung) → in 4.5c umbenannt zu `src/lib/kryptoAggregator.ts` (reiner Krypto-Aggregator) | Neu · 4.5c refaktoriert | 4.3 |
| `src/lib/twelveDataFetcher.ts` | Neu | 4.3 |
| `src/data/watchlist.json` (in 4.5b auf nur-Krypto reduziert) | Neu | 4.3 |
| `src/components/wirtschaft/WatchlistSektion.astro` → in 4.5b umbenannt zu `KryptoSektion.astro` | Neu · 4.5b umbenannt | 4.4 |
| `src/components/wirtschaft/WatchlistGruppe.astro` → in 4.5b umbenannt zu `KryptoGruppe.astro` (Card-Grid statt Zeilenliste) | Neu · 4.5b refaktoriert | 4.4 |
| `src/components/wirtschaft/WatchlistItem.astro` (mit Mini-Sparkline) → in 4.5b GELÖSCHT (durch AssetCard ersetzt) | Neu · 4.5b entfernt | 4.4 |
| `src/components/wirtschaft/AssetCard.astro` (gemeinsame Card-Basis für Krypto + Aktien) | Neu | 4.5b |
| `src/components/wirtschaft/AktienSektion.astro` (in 4.5b auf AssetCard refaktoriert) | Neu | 4.5 |
| `src/components/wirtschaft/ForexCommoditiesSektion.astro` (in 4.5b: Datenquelle auf forex.ts umgestellt) | Neu | 4.5 |
| `src/pages/api/aktien.ts` (SSR-Endpoint, Edge-Cache 20min + SWR) | Neu | 4.5 |
| `src/pages/api/forex.ts` (SSR-Endpoint, Edge-Cache 22min + SWR, TTL-Versatz) | Neu | 4.5 |
| `src/data/aktien.ts` (typesafe Aktien-Definition) | Neu | 4.5b |
| `src/data/forex.ts` (typesafe Forex-Definition) | Neu | 4.5b |
| `src/components/wetter/WetterWochenBars.astro` (ECharts) | Neu | 4.6 |
| `src/components/wetter/MondphaseSvg.astro` (Custom-SVG) | Neu | 4.6 |
| `src/data/macro-events.json` | Neu | 4.7 |
| `src/lib/fearGreedFetcher.ts` | Neu | 4.7 |
| `src/components/wirtschaft/MacroTimeline.astro` | Neu | 4.7 |
| `src/components/wirtschaft/FearGreedGauge.astro` (ECharts-Gauge) | Neu | 4.7 |
| `src/pages/wirtschaft.astro` (zentrale Integration aller Sektionen) | Modifiziert | jeder Slice |
| `src/pages/wetter.astro` (Wochen-Bars + Mondphase) | Modifiziert | 4.6 |
| `src/data/sources.json` (4 neue Quellen) | Modifiziert | 4.1+ |

---

## 6 · Implementierungs-Reihenfolge in Slices

| Slice | Inhalt | Umfang | Status |
|---|---|---|---|
| **4.1** | ECharts-Foundation · DRG-Theme · Astro-Islands-Pattern · BTC-Hero mit Sparkline | mittel | ✅ abgeschlossen |
| **4.2** | Trading-Indikatoren-Block (Funding · OI · L/S · Coinbase Premium · Stablecoin Supply) | gross | ✅ abgeschlossen |
| **4.3** | Multi-Anbieter-Watchlist-Foundation · Twelve-Data-Fetcher · ENV-Setup · watchlist.json | mittel | ✅ abgeschlossen |
| **4.4** | Watchlist-Komponenten mit Gruppierung · alle Crypto-Items · Mini-Sparklines | gross | ✅ abgeschlossen |
| **4.5** | Aktien-Sektion + Forex/Commodities-Sektion · Endpoint-Architektur (zwei Endpoints + Edge-Cache + SWR) wegen 8/min-Credits-Limit · Commodities komplett raus · Indizes Fallback B (weglassen) | gross | ✅ abgeschlossen |
| **4.5b/c** | (KEIN Spec-Slice · IA-Umbau nach Mario-Wunsch, eingeschoben zwischen 4.5 und 4.6) · 4.5b: gemeinsame AssetCard, Krypto auf Card-Layout, neue Block-Struktur (BTC/ETH/SOL/XRP/SUI/TRX + ADA/AVAX/HBAR/JUP/GST/DOT), Aktien-Doppelung weg, watchlist.json nur noch Krypto, aktien.ts/forex.ts neu, Eyebrow "Krypto · Märkte" · 4.5c: interner Daten-Architektur-Cleanup (Aggregator-Rename zu kryptoAggregator + Typ-Renames + Dead-Code-Removal, ~30% LOC-Reduktion) | mittel | 4.5b ✅ · 4.5c ✅ |
| **4.6** | Wetter-Wochen-Bars (ECharts vertikale Floating-Bars) + Mondphase-SVG (Custom-SVG mit korrekter Sichel-/Gibbous-Geometrie) auf /wetter · astronomieResolver um ist_zunehmend-Feld erweitert | mittel | ✅ abgeschlossen |
| **4.7** | Macro-Timeline (Editorial-Liste statt ECharts-Zeitachse · siehe §7.7-Realitäts-Notiz für 4.8) + Fear & Greed Gauge (ECharts Halbkreis-Tacho) auf /wirtschaft · 9 recherchierte Macro-Events 14.5.-28.5.2026 · fearGreedFetcher mit 1h Cache | mittel | ✅ abgeschlossen |
| **4.8** | Polish · Cross-Page-Konsistenz · Volltest · Phase-4-Abschluss | klein | offen |

**Anzahl Slices:** 8 (gegenüber 5 in Phase 2.3)
**Geschätzter Umfang:** grösser als Phase 2.3 wegen ECharts-Lernkurve und Multi-Asset-Komplexität

---

## 7 · Detail-Spezifikationen pro Slice

### 7.1 Slice 4.1 · ECharts-Foundation + BTC-Hero mit Sparkline

**Ziel:** Technische Foundation für alle künftigen ECharts-Komponenten gelegt. Eine sichtbare Anwendung (BTC-Hero) als Beweis.

**Files:**
- `src/lib/echarts-drg-theme.ts` · Theme-Definition
- `src/lib/echartsRenderer.ts` · Astro-Islands-Wrapper-Komponente die ECharts im Browser initialisiert
- `src/components/charts/Sparkline.astro` · wiederverwendbare Sparkline-Komponente
- `src/components/wirtschaft/KryptoHero.astro` · BTC-Card aus Slice 2.3.2 umbauen · Sparkline integrieren

**ECharts-Setup:**

```bash
npm install echarts
```

**Astro-Islands-Pattern:** ECharts braucht Client-Side-JavaScript. Astro-Komponenten rendern statisch · Client-Hydration mit `client:visible` Directive in der Verwendung:

```astro
<Sparkline values={btc.history} client:visible />
```

**Sparkline-Komponente** zeichnet eine einfache Linie ohne Achsen, ohne Grid, nur die Linie. Vermillon wenn negative Tendenz, sonst neutrale Sumi-Farbe. Pflicht-Pattern für Editorial-Look.

**BTC-History-Endpunkt:** CoinGecko `/coins/bitcoin/market_chart?vs_currency=usd&days=7&interval=hourly`. Liefert Array von `[timestamp, price]`-Paaren · in Sparkline transformieren.

**KryptoHero-Umbau:**
- Bestehende BTC-Anzeige aus 2.3.2 bleibt erhalten
- Sparkline rechts daneben oder darunter integrieren · Mario entscheidet im visuellen Test
- Höhe ca. 60-80px · sumi-e-Reduktion (nur Linie, kein Fill, keine Punkte)

**Verifikation:**
- ECharts lädt nur auf /wirtschaft (Bundle-Splitting-Check via Network-Tab)
- Sparkline rendert mit DRG-Theme · keine ECharts-Default-Farben
- prefers-reduced-motion respektiert (keine Animations-Pulse)
- Light/Dark/Mobile

**Anti-Patterns 4.1:**
- ❌ Keine ECharts-Default-Theme (Standard-Tech-Look)
- ❌ Keine Achsen/Grid auf Sparklines
- ❌ Keine Tooltips auf Sparklines (das ist Editorial, nicht interaktiv)
- ❌ ECharts global laden (nur auf /wirtschaft via Islands)

### 7.2 Slice 4.2 · Trading-Indikatoren-Block

**Ziel:** Marios Trading-Indikatoren als eigenständige Sektion auf /wirtschaft, unter dem Editorial-Hero, vor der Watchlist.

**Files:**
- 5 neue Fetcher · `binanceFetcher.ts` (Funding · OI · L/S in einem File), `coinbasePremiumFetcher.ts`, `defiLlamaFetcher.ts`
- 6 neue Komponenten · `TradingIndikatoren.astro` als Wrapper, 5 Sub-Karten

**Indikator-Logik:**

**Funding Rates** · Binance `/fapi/v1/premiumIndex?symbol=BTCUSDT`
- Liefert `lastFundingRate` (z.B. 0.0001 = 0.01%)
- Wenn positiv = Longs zahlen Shorts = überhitzt Long-Seite
- Wenn negativ = Shorts zahlen Longs = überhitzt Short-Seite
- Schwelle für "extreme" rot markiert: >0.1% oder <-0.1%

**Open Interest** · Binance `/fapi/v1/openInterest?symbol=BTCUSDT`
- Liefert `openInterest` als String (Anzahl Kontrakte)
- Anzeigen als formatierte Zahl mit Schweizer-Tausenderpunkt
- Sparkline der letzten 24h erfordert zusätzlich `/futures/data/openInterestHist?symbol=BTCUSDT&period=1h&limit=24`

**Long/Short Ratio** · Binance `/futures/data/topLongShortAccountRatio?symbol=BTCUSDT&period=5m&limit=1`
- Liefert `longShortRatio` (z.B. 1.5 = 1.5x mehr Longs als Shorts)
- Extreme: >2.0 = Contrarian-Signal Short · <0.5 = Contrarian-Signal Long

**Coinbase Premium** · Eigenlogik:
- Binance BTCUSDT-Preis via `api.binance.com/api/v3/ticker/price?symbol=BTCUSDT`
- Coinbase BTC-USD-Preis via `api.coinbase.com/v2/exchange-rates?currency=BTC` (Rate `USD`)
- Differenz: `(coinbase - binance) / binance * 100` in %
- Positiv = US-Demand stark · Negativ = US-Demand schwach
- Schwelle: ±0.1% als "neutral" Band

**Stablecoin Supply** · DeFiLlama `https://stablecoins.llama.fi/stablecoins`
- Liefert alle Stablecoins mit `circulating` field
- Filter auf USDT + USDC · Summe als Total Stablecoin Market Cap
- Veränderung 24h und 7d als Delta-Anzeige

**Card-Design:** Jede Indikator-Card analog zu KryptoCard aus Cover (var(--bg-card), padding 18px, Eyebrow in Vermillon, Wert prominent in Fraunces). Mini-Sparkline pro Card wenn historische Daten verfügbar (Funding, OI, L/S).

**Layout:** 5 Cards in einem 3+2-Grid (oder 5er-Strip) unter dem Editorial-Hero.

**Cache:** 60s pro Endpoint via `Cache-Control: s-maxage=60`.

### 7.3 Slice 4.3 · Multi-Anbieter-Watchlist-Foundation

> **Status nach 4.5b/c:** Die Multi-Anbieter-Aggregator-Idee wurde nach dem Twelve-Data-API-Test in 4.5 und dem IA-Umbau in 4.5b/c grundlegend überarbeitet. Realität heute:
> - `watchlistAggregator.ts` → **`kryptoAggregator.ts`** (4.5c) · ein reiner Krypto-Aggregator, keine Multi-Anbieter-Logik mehr
> - Aktien + Forex laufen über eigene **API-Endpoints** mit Edge-Cache (siehe §7.5)
> - Bulk-Call-Annahme "1-2 Calls / Page-Load" hat sich als falsch erwiesen: Twelve Data zählt **1 Credit pro Symbol** im Bulk, das hat in 4.5 die Endpoint-Architektur erzwungen
> - Cache "5min für Aktien" wurde auf 20min/22min angepasst (4.5)
>
> Der ursprüngliche Spec-Text bleibt darunter als Entscheidungs-Kontext stehen.

**Ziel:** Foundation für die grosse Watchlist · Multi-Anbieter-Bündelung in einer Aggregator-Funktion · Twelve-Data-Fetcher als neuer API-Anbieter.

**Files:**
- `src/data/watchlist.json` (siehe §4.1)
- `src/lib/twelveDataFetcher.ts` · holt Aktien/Forex/Commodities/Indices in Bulk
- `src/lib/watchlistAggregator.ts` · liest watchlist.json, gruppiert Items nach Anbieter, ruft die jeweiligen Fetchers auf, kombiniert Ergebnisse

**ENV-Setup:**
- Lokal: `.env` ergänzen mit `TWELVE_DATA_API_KEY=`
- Mario trägt echten Key selbst ein (gratis Signup auf twelvedata.com)
- Vercel Dashboard für Production

**Twelve-Data-Endpoint:** `https://api.twelvedata.com/quote?symbol=TSLA,NVDA,GOOGL&apikey=KEY` (Komma-getrennte Symbole, Bulk-Call mit 1 Credit pro Symbol).

**Free-Tier-Limit:** 800 Calls/Tag, 8 Calls/Minute. Bei ~10-15 Symbolen + Bulk-Call = 1-2 Calls pro Page-Load. Reicht für ~400 Page-Loads pro Tag (mehr als ausreichend für privat).

**Aggregator-Logik:**

```ts
interface WatchlistEintrag {
  symbol: string;
  preis: number;
  delta_24h_prozent: number;
  volumen_24h?: number;
  ist_live: boolean;
  fetch_zeit: string;
}

interface WatchlistGruppe {
  id: string;
  name: string;
  items: WatchlistEintrag[];
}

export async function getWatchlist(): Promise<WatchlistGruppe[]> {
  // 1. Lese watchlist.json
  // 2. Gruppiere alle Items nach Anbieter
  // 3. Pro Anbieter EIN Bulk-Call (CoinGecko: alle Coin-IDs in einem Call,
  //    Twelve Data: alle Symbole in einem Call)
  // 4. Merge Ergebnisse zurück in watchlist.json-Reihenfolge mit Gruppierung
  // 5. Return strukturiert für UI
}
```

**Defensive-Fetching:** Pro Anbieter eigener Try/Catch · wenn ein Anbieter fehlschlägt (z.B. Twelve-Data-Key fehlt), wird nur dieser Bereich auf Fallback gesetzt · andere Anbieter laufen weiter.

**Caching:** 60s für Crypto, 5min für Aktien (Markt-Updates seltener nötig).

### 7.4 Slice 4.4 · Watchlist-Komponenten mit Gruppierung

> **Status nach 4.5b:** Die hier beschriebene Multi-Asset-Watchlist mit WatchlistSektion/Gruppe/Item-Komponenten als Zeilen-Liste wurde in 4.5b umgebaut:
> - **Komponenten umbenannt + Layout neu:** `WatchlistSektion.astro` → `KryptoSektion.astro`, `WatchlistGruppe.astro` → `KryptoGruppe.astro` (jetzt Card-Grid statt Zeilen-Liste), `WatchlistItem.astro` gelöscht
> - **Gemeinsame AssetCard** (`src/components/wirtschaft/AssetCard.astro`) — Karten-Basis für Krypto UND Aktien, mit optionalen Feldern Sparkline (Krypto) bzw. Tageshoch/-tief (Aktien)
> - **Nur noch Krypto** in der Watchlist · zwei thematische Blöcke statt offener Multi-Asset-Liste · Aktien/Forex sind eigene Card-Sektionen (siehe §7.5)
> - **Symbol-Logo-Kreis** (Sumi-e Buchstabe) bewusst entfernt zugunsten der schlankeren AssetCard-Optik
> - **Eyebrow** "WATCHLIST · MÄRKTE" → "KRYPTO · MÄRKTE" nach Spec-Sync
> - **Collapsible-Pattern** (Button + aria-expanded) bleibt
> - **Mini-Sparklines** bleiben Desktop-only (Mobile: extra-Zelle inkl. Hairline-Trenner ausgeblendet)
>
> Der ursprüngliche Spec-Text bleibt darunter als Entscheidungs-Kontext stehen.

**Ziel:** Die Watchlist visuell rendern mit Gruppierung wie in Marios TradingView. Alle Crypto-Items vollständig.

**Files:**
- `src/components/wirtschaft/WatchlistSektion.astro` · Wrapper für gesamte Watchlist
- `src/components/wirtschaft/WatchlistGruppe.astro` · pro Gruppe (BTC, Move2Earn, ...) ein Block
- `src/components/wirtschaft/WatchlistItem.astro` · ein einzelnes Symbol mit Preis/Delta/optional Mini-Sparkline

**Layout-Pattern aus Screenshot der Strategie-Runde:**
- Gruppen-Header collapsible (`<details>` ablehnen wegen Phase-2.1-Stolperstein · stattdessen Button + aria-expanded · siehe Phase-2.1-Lessons-Learned in SKILL.md)
- Pro Item: Symbol-Logo (klein, ~24px) · Symbol-Name (Mono 12px) · Preis (Fraunces 14px) · Delta (12px, Vermillon bei Minus) · 24h-Volumen (Mono 11px var(--fg-subtle))
- Mini-Sparkline rechts (~80x20px) wenn Anbieter Historical-Data liefert (CoinGecko ja, Twelve Data Free Tier limitiert)

**Symbol-Logos:** Mario hat keine eigenen Logos · drei Wege:
1. CoinGecko liefert Logo-URLs (`image.thumb` field) · nutzen für Crypto
2. Yahoo Finance Logo-URL-Pattern für Aktien (inoffiziell · scraping-Risiko)
3. Fallback: einfacher Text-Buchstabe in Kreis wie `(B)` für BTC etc.

Mein Tipp: **3 als Pattern** mit selbst-gerendertem Mono-Buchstabe in Sumi-Kreis. Konsistent, DRG-konform, ohne Abhängigkeiten. Logos später als Polish wenn Bedarf.

**Sortierung pro Gruppe:** wie in watchlist.json definiert (Mario bestimmt Reihenfolge manuell). Keine Auto-Sortierung nach Marktkapitalisierung.

**Mobile:** Items als kompakte Liste 1-spaltig. Mini-Sparkline weglassen auf Mobile (Platz).

### 7.5 Slice 4.5 · Aktien + Forex/Commodities-Sektion

> **Realitäts-Hinweis (14.5.2026, nach 4.5 + 4.5b/c):**
> - Twelve-Data-Free-Tier hat ein **hartes** 8-Credits/min-Limit (1 Credit pro Symbol im Bulk-Call). Ein 10-Symbol-Bulk → sofortiges 429. Das hat eine **Endpoint-Architektur erzwungen** (`/api/aktien` + `/api/forex` getrennt, jeder unter 8 Credits, mit Edge-Cache + stale-while-revalidate · TTL-Versatz 1200s / 1320s) statt eines Page-Fetches.
> - **WTI/GOLD** matchen im Free Tier **falsche NYSE-Aktien** (W&T Offshore Inc. $4.40, Gold.com Inc. $41), nicht Spot-Preise. **SILVER/BRENT** sind 403. Alle vier komplett aus `watchlist.json` entfernt — Commodities-Tabelle zeigt nur einen ehrlichen Leer-Hinweis "Im aktuellen Datentier nicht verfügbar".
> - **Indices** nicht im Free Tier (bestätigt) — in 4.5 als Offline-Stub belassen, in 4.5b komplett aus `watchlist.json` entfernt. **Fallback B (weglassen)** gewählt, keine Alpha-Vantage-Anbindung.
> - **Layout (nach 4.5b):** Aktien als 3×2-Cards (Desktop) via gemeinsame `AssetCard`-Komponente (siehe §7.4-Realitäts-Box) — nicht 2×2 wie ursprünglich geplant. Forex bleibt Tabelle, Commodities-Spalte zeigt nur den Leer-Hinweis.
> - **AktienSektion-Komponente** ist seit 4.5b ein dünner Wrapper um AssetCard (gleiche Karten-Basis wie KryptoSektion).
> - Daily-Credit-Total: ~720/Tag, unter 800/Tag-Limit.
> - Cold-Start nach Deploy: Erster Page-Hit zeigt Forex offline (Aktien-6 + Forex-4 in derselben Minute), zweiter Hit liefert beides live (Aktien-Cache HIT, Forex frisch). Akzeptiert.
>
> Der ursprüngliche Spec-Text bleibt darunter als Entscheidungs-Kontext stehen.

**Ziel:** Twelve-Data-Anbindung produktiv. Aktien-Sektion + Forex/Commodities-Sektion als eigene Blöcke.

**Files:**
- `src/components/wirtschaft/AktienSektion.astro`
- `src/components/wirtschaft/ForexCommoditiesSektion.astro`

**Indices-Klärung KRITISCH:**

Twelve-Data-Free-Tier hat möglicherweise keine Indices (SPX, NAS100, DAX, SMI). Ein Test-Call mit dem API-Key ist Pflicht:

```
GET https://api.twelvedata.com/quote?symbol=SPX&apikey=YOUR_KEY
```

Wenn Response = Error oder "Symbol not found":

**Fallback-Strategie A: Alpha Vantage** (25 Calls/Tag)
- Nur für die 4 Indizes
- `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPX&apikey=KEY`
- Eigene ENV-Var `ALPHA_VANTAGE_API_KEY`
- 4 Indizes täglich = 4 Calls = funktioniert mit 25-Tages-Limit auch bei 6 Page-Loads/Tag

**Fallback-Strategie B: Indices weglassen**
- Aktien-Sektion zeigt nur TSLA, NVDA, GOOGL, MSFT, META, COIN
- Indices entfallen oder kommen später mit kostenpflichtigem Twelve-Data-Plan

**Mario-Entscheidung in Slice 4.5 nötig** · vor Implementation API-Test machen, dann je nach Ergebnis A oder B wählen.

**Layout Aktien:** Vier Cards in einem 2x2-Grid oder 4er-Strip. Pro Card: Symbol, Preis in Fraunces, Delta in Vermillon bei Minus, Tageshoch/-tief als Subtext.

**Layout Forex/Commodities:** Kompakte Tabelle ohne Cards. Forex-Paare und Oil-Preise als zwei kleine Tabellen.

### 7.6 Slice 4.6 · Wetter-Wochen-Bars + Mondphase-SVG

**Ziel:** /wetter erweitern um zwei Charts. Wetter-Wochen-Bars in ECharts, Mondphase als Custom-SVG.

**Files:**
- `src/components/wetter/WetterWochenBars.astro` · ECharts Bar-Chart für Min/Max-Temperaturen über 7 Tage
- `src/components/wetter/MondphaseSvg.astro` · Custom-SVG-Visualisierung der Mondphase

**Wetter-Wochen-Bars:**
- Daten kommen aus `wetter.woche` (schon in Open-Meteo-Fetcher aus Phase 2.3)
- ECharts horizontale Bars · Pro Tag zwei Bars (Min und Max) als Range-Visualisierung
- X-Achse: Wochentage (Mo-So)
- Y-Achse: Temperatur in °C
- DRG-Theme zwingend · keine ECharts-Default-Tooltips
- Höhe ~120px

**Mondphase-SVG:**
- Daten aus `astronomieResolver.ts` (schon vorhanden seit Phase 2.3)
- Custom-SVG rendert Mond als Kreis mit teilweise schattiertem Halbkreis
- Beleuchtungs-Prozent → Berechnung der Schatten-Form
- Zunehmend (links beleuchtet) vs Abnehmend (rechts beleuchtet)
- Stroke `var(--fg)` 1.5px für Konturkreis · Schatten in `var(--bg-card)`
- ~60x60px Grösse · sumi-e-Reduktion

**Integration in /wetter:** WetterWochenBars unter WetterDetail · MondphaseSvg innerhalb AstronomieSektion.

### 7.7 Slice 4.7 · Macro-Timeline + Fear & Greed Gauge

**Ziel:** Zwei weitere Editorial-Charts auf /wirtschaft. Macro-Timeline als horizontale Event-Zeitachse. Fear & Greed Gauge als Halbkreis-Tachometer.

**Files:**
- `src/components/wirtschaft/MacroTimeline.astro` · ECharts horizontale Timeline mit farbcodierten Events
- `src/components/wirtschaft/FearGreedGauge.astro` · ECharts Gauge-Chart
- `src/lib/fearGreedFetcher.ts` · API-Anbindung zu Alternative.me

**Macro-Timeline:**
- Daten aus `macro-events.json` (siehe §4.2)
- Horizontale Zeitachse für die nächsten 14 Tage
- Events als Punkte mit Beschriftung
- Farb-Codierung nach Impact: kritisch=Vermillon · hoch=Tinte-Mittel · mittel=Tinte-Hell
- Mario aktualisiert macro-events.json manuell ~monatlich

**Fear & Greed Gauge:**
- API: `https://api.alternative.me/fng/?limit=1` (gratis, kein Key)
- Liefert Wert 0-100 + Label ("Extreme Fear", "Fear", "Neutral", "Greed", "Extreme Greed")
- Visualisierung als Halbkreis-Tachometer mit Nadel
- Farbverlauf von Vermillon (0) → neutral (50) → neutral (100) · nicht grün, weil DRG-Tokens kein Grün haben
- Wert in Fraunces gross in der Mitte
- Label darunter in Mono

**Caching:** Fear & Greed 1h Cache (ändert sich langsam).

### 7.8 Slice 4.8 · Polish + Volltest + Phase-4-Abschluss

**Ziel:** Cross-Page-Konsistenz auf /wirtschaft, da diese durch die vorherigen Slices stark gewachsen ist. Phase-4-Abschluss-Doku.

**Tasks:**
- /wirtschaft visuell durchgehen · Sektion-Ordnung, Spacing, Eyebrow-Konsistenz
- Reihenfolge auf /wirtschaft: KryptoHero (mit Sparkline aus 4.1) → TradingIndikatoren (4.2) → KryptoSektion (4.4 + 4.5b · zwei Krypto-Blöcke als Card-Grid) → AktienSektion (4.5 · auf AssetCard) → ForexCommoditiesSektion (4.5) → MacroTimeline (4.7) → FearGreedGauge (4.7) → WirtschaftsNews (aus 2.3.2) → TradeSetupsPlaceholder
- Performance-Check: Lighthouse-Spot-Check (Performance, Accessibility, Best Practices)
- ECharts-Bundle-Size verifizieren (sollte ~250KB sein, nur auf /wirtschaft geladen)
- Mobile-Volltest mit Scrolling-Verhalten der langen Page
- Dark-Mode-Volltest
- _pendenzen.md auf Phase 5 als nächste Phase (falls eine ankommt) oder „Site komplett" markieren
- SESSION_LOG-Eintrag mit Phase-4-Synthese

---

## 8 · Anti-Patterns für Phase 4

- ❌ **ECharts-Default-Theme** · DRG-Theme zwingend für alle Charts
- ❌ **Tooltips auf Editorial-Sparklines** · das ist Briefing, nicht interaktiv. Tooltips nur bei Trading-Indikatoren-Charts wenn nötig
- ❌ **WebSocket-Streaming** · zu komplex für Phase 4, Snapshot-Pattern via SSR reicht
- ❌ **Liquidations-Heatmap** · Coinglass kostet, weglassen
- ❌ **Volume-Profile** · Phase 6+ wenn Bedarf
- ❌ **Sentiment-Indikatoren via LunarCrush** · rauschig, weglassen
- ❌ **Mehrere ENV-Vars für eine API** · Twelve Data ist ein Key für alles
- ❌ **API-Key in Frontend exponieren** · server-side only via `import.meta.env`
- ❌ **Indices ohne Free-Tier-Verifikation einsetzen** · Slice 4.5 muss zwingend testen vor Implementation
- ❌ **Spring/Bounce-Animationen** · nur ease-out, gleiche DRG-Hard-Rule
- ❌ **Watchlist auf Cover-Page** · Cover bleibt Editorial-Brief, Watchlist ist /wirtschaft-spezifisch
- ❌ **Cowork-Referenzen** in neuem Code · Phase 5 entfällt

---

## 9 · Offene Fragen (während Phase 4 zu klären)

1. ~~**Indices im Twelve Data Free Tier**~~ → **BEANTWORTET in 4.5**: nicht verfügbar (403), Fallback B (weglassen) gewählt, Indices komplett entfernt.
2. ~~**Coin-IDs für Move2Earn-Gruppe**~~ → **BEANTWORTET in 4.5b**: Move2Earn-Gruppe wurde im IA-Umbau aufgegeben. Die neue Krypto-Block-Struktur enthält von den ursprünglichen Move2Earn-Schätzungen nur noch HBAR (`hedera-hashgraph`), JUP (`jupiter-exchange-solana`) und GST (`green-satoshi-token` — Solana-Variante) — alle in 4.5b live verifiziert.
3. ~~**Mini-Sparklines bei Twelve-Data-Items**~~ → **BEANTWORTET in 4.5b**: AssetCard hat extra-Zelle disjunkt nach Anbieter — Krypto bekommt Sparkline (CoinGecko liefert History), Aktien bekommen stattdessen Tageshoch/-tief (Twelve Data liefert keine brauchbare History im Free Tier), Forex ohne extra-Zelle.
4. ~~**Symbol-Logos**~~ → **BEANTWORTET in 4.5b**: Logo-Kreis wurde mit dem AssetCard-Refactor aufgegeben — Konsistenz zwischen Krypto- und Aktien-Cards war wichtiger als das sumi-e-Logo-Detail. Symbol-Eyebrow oben links übernimmt die Identifikation.
5. **Macro-Events-Pflege-Workflow** · Mario aktualisiert macro-events.json manuell. Reicht das? Oder Auto-Sync mit TradingEconomics-API (kostenpflichtig) später? — bleibt offen für Slice 4.7

---

## 10 · Vermillon-Quote-Check

DRG-Hard-Rule: ≤ 3 % Flächenanteil.

**In Phase 4 voraussichtliche Vermillon-Setzungen:**
- Negative Krypto/Aktien/Forex-Deltas (rotgefärbt) — können auf /wirtschaft viele sein
- Eyebrows pro Sektion
- Funding/L/S "Extreme"-Markierungen
- Macro-Event-Impact-Kritisch
- Fear & Greed Gauge-Achse bei "Extreme Fear"
- Coinbase Premium negativ

**Erwartet:** an manchen Tagen knapp am Limit · besonders Bärenmärkte mit vielen Minus-Deltas. **Watchlist-Items mit Minus-Delta nicht ALLE in Vermillon** · stattdessen: nur das Vorzeichen + Prozent-Zahl in Vermillon, der Item-Hintergrund bleibt neutral. So bleibt der Vermillon-Anteil flächenmässig klein, auch wenn 15 Coins gerade rot sind.

---

## 11 · Stolpersteine

Aus Phasen 2.1 bis 2.3 dokumentiert · gilt weiter:

1. **Worktree-Falle** · `cd /Users/mariomacstudio/Developer/mario-hq && ...`
2. **Plan-First-Regel** vor jedem nicht-trivialen Edit
3. **Build-Test ist Pflicht** vor `git push`
4. **Build-Fehler-Handling** · max 1 Fix-Attempt, dann `git restore .`
5. **„Lokal funktioniert" ≠ „gepusht"** · Done = Vercel grün
6. **TypeScript strict** · keine `any` ohne Begründung
7. **HMR-Cache-Bug** bei Vite-Dev-Server nach Layout-Edits · Dev-Server neu starten
8. **Layout-Anchor-Border** · `border: 1.5px solid transparent` als Default
9. **ENV-Var-Hygiene** · `.env` lokal + Vercel UI · niemals committen
10. **API-Rate-Limits** · pro Anbieter eigene Cache-Strategie

**Neue Stolpersteine erwartet für Phase 4:**

11. **ECharts-Bundle-Size** · prüfen dass nur auf /wirtschaft geladen wird (Astro-Islands-Pattern via `client:visible`)
12. **ECharts-Init-Race** · Theme muss vor erstem `echarts.init()`-Call registriert sein · `echarts.registerTheme()` zentral in einem Module-Side-Effect
13. **CoinGecko-Rate-Limit** · 10-30 Calls/Min Free Tier · Watchlist mit 16+ Coins muss BULK-Call nutzen, nicht 16 einzelne Calls
14. **Twelve-Data-Symbol-Format** · Aktien als Plain (TSLA), Forex als Slash (EUR/USD) · Mapping im `td_symbol`-Feld (in `src/data/aktien.ts` + `src/data/forex.ts`). Commodities-Symbole sind irreführend: `WTI`/`GOLD` matchen falsche NYSE-Aktien — alle vier Commodities in 4.5 komplett aus dem Setup entfernt.
15. **Astro-Islands `client:visible`** · ECharts initialisiert erst wenn Element im Viewport · für SSR-First-Paint kein Problem, aber wichtig für UX-Wahrnehmung
16. **Vercel-ENV-Var-Push** · neue Vars wie TWELVE_DATA_API_KEY müssen via Vercel CLI oder Dashboard gesetzt werden · nicht automatisch durch git push

**In Phase 4 hinzugelernt (aus Slice 4.5 / 4.5b/c):**

17. **Twelve-Data 8/min-Credits-Limit ist HART** · 1 Credit pro Symbol im Bulk-Call · ein 10-Symbol-Bulk = 10 Credits = sofort 429. Tageslimit 800/Tag obendrein. Hat die Endpoint-Architektur (zwei API-Routes mit Edge-Cache + SWR + TTL-Versatz) erzwungen — Page-Fetch funktioniert nicht auf Free Tier.
18. **Vite-HMR-Cache-Bug nach `git mv`** · Bei Komponenten-Renames zeigt der Vite-Dev-Server stale Reload-Errors für die alten Pfade. Production-Build ist trotzdem sauber. Lösung: Dev-Server neu starten (siehe SKILL.md Stolperstein 7).
19. **Vercel-Edge-Cache greift NICHT in `npm run dev`** · Cache-/SWR-Verhalten von API-Endpoints kann lokal nicht verifiziert werden — Production-Test via curl-Headers ist Pflicht.
20. **Refactor-Slices brauchen explizite "vorher = nachher"-Verifikation** · Nicht "sieht gut aus", sondern: grep sauber, Layout identisch, Build grün, Live-Werte unverändert. Stilles Drift bei reinen Renames ist sonst leicht möglich.
21. **Defensive Fetcher-Verträge VOR Direct-Await-Refactor verifizieren** · Bevor man `Promise.allSettled` gegen ein nacktes `await` tauscht: prüfen, ob es einen Code-Pfad gibt, der eine Rejection durchschlagen lässt (kann sonst zur weissen Page auf Production führen).

---

## 12 · Commit-Konventionen für Phase 4

Conventional Commits, Deutsch · gleicher Stil wie 2.2/2.3:

```
feat: charts slice 4.X · <inhalt>

- Foundation-Komponente A
- Fetcher mit Fallback-Pattern
- DRG-Theme-konform · ECharts-Default überschrieben
- wirtschaft.astro integriert die neuen Komponenten
```

```
docs: slice 4.X abgeschlossen · pendenzen + log
```

---

## 13 · Übergabe nach Phase 4

Nach Phase 4 ist /wirtschaft die Multi-Asset-Wirtschaftszeitung mit allen geplanten Charts und Trading-Tools. Was danach kommt:

- **Phase 3 wenn-dann** · Content-Pipeline wenn Habits/Notizen/Archiv-Bedarf entsteht
- **Phase 6 Briefing-Erweiterungen** · Trade-Setups konkret · Bike-Wetter mit Trail-Score · On-Chain & Sentiment · Daily Learning · eigene Domain
- **Phase 7+ Post-MVP-Module** · Habits · Workout · Zeit · Voll-Kalender (Phase 8) · Foto-Pipeline

Phase 4 schliesst die *Hauptseiten-Vertiefung* ab. Danach geht es um Erweiterungen, neue Module und Inhalts-Pflege.

---

*Bei jedem abgeschlossenen Slice: dieses File unter §6 aktualisieren (Slice-Status), `_pendenzen.md` ergänzen, `SESSION_LOG.md` Eintrag oben.*
