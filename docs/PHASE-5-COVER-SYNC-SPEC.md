---
type: phasenspezifikation
projekt: mario-hq
phase: 5
erstellt: 26-05-14
aktualisiert: 26-05-14 (Slice 5.2 abgeschlossen · 5.2a + 5.2b durch)
status: 5.1 ✅ · 5.2 ✅ (5.2a + 5.2b) · 5.3/5.4 offen
referenz: Cover-Sync-Plan-Chat 14.5.2026 (claude.ai)
ersetzt: Cover-Sync-Punkte aus _pendenzen.md vor Phase-5-Eröffnung
---

# Phase 5 · Cover-Sync · Cover auf Live-Stand bringen

> **Für Claude Code in einer neuen Session:** Dieses File ist self-contained. Phase 2.2 (Cover-Layout-Spec) ist Pattern-Vorbild und bleibt frozen — Phase 5 ändert keine Layouts, nur Datenquellen. Phase-4-Spec und SKILL.md gelten parallel.

---

## 1 · Ziel

Das Cover (`/`) zeigt bei mehreren Daten-Cards heute noch Platzhalter (statische JSON-Stubs), während die Detail-Seiten /wirtschaft + /wetter Live-Daten haben. Phase 5 zieht das Cover nach. Bewusst kein Halb-Zustand — ALLE Daten-Cards in einem Vorhaben.

**Krypto-Card-Quelle ist hart festgelegt:** NUR CoinGecko-Preise. KEINE Trading-Indikatoren auf dem Cover — die würden den Vercel-IP-Block (Phase-4-Nachläufer · Binance + Bybit blockiert · siehe `_pendenzen.md` Production-Issues) auf die Startseite vererben. CoinGecko läuft auf Production sauber, in 5.1 (Phase-4-Nachläufer) explizit als Gegenbeweis bestätigt.

**Keine Layout-Änderungen.** Phase 2.2 bleibt frozen. Cards füllen sich neu, sehen aber gleich aus.

---

## 2 · Slice-Reihenfolge

Phase 5 = **4 Slices total.**

| Slice | Inhalt | Umfang | Status |
|---|---|---|---|
| **5.1** | Spec + SSR-Foundation (prerender=false, Cache-Header, Promise.all-Block) + KryptoCard live (CoinGecko + Fear & Greed) | klein-mittel | ✅ abgeschlossen |
| **5.2** | Wetter-Card live · `astronomieResolver.getStundenHeute()` für Goldene/Blaue Stunde · `WetterCard.astro` auf `getWetterErgebnis()` + `getStundenHeute()` + `getFotoEmpfehlung()` · WetterSymbol-Wrapper direkt verwendet (kein eigener Helper nötig, siehe Bau-Aufteilung) | mittel | ✅ abgeschlossen (5.2a + 5.2b) |
| **5.3** | KalenderCard (`getKalenderTermine()`) · MacroCard (`getMacroEvents()`, Indizes-Zeile weggelassen) · NewsCard (`cover_headlines`-Feld in `news-voll.json`) · EventBanner (auf `macroEventsResolver`, Trigger nach Event-Zählung entschieden) · alte Stub-Resolver löschen | mittel | offen |
| **5.4** | Polish + Volltest Light/Dark/Mobile 375px + Cover-Stempel "Phase 4" → "Phase 5" + Phase-5-Synthese in SESSION_LOG + HANDOVER + Spec abschliessen | klein | offen |

**Reihenfolge-Begründung:**
- **5.1 zuerst:** CoinGecko hat im Phase-4-Nachläufer bewiesen, dass es von Vercel-IPs erreichbar ist → minimales Restrisiko. Beweist die SSR-Foundation (Cover wird zu `prerender = false`) auf der Live-Pipeline. Etabliert das Pattern für die folgenden Slices.
- **5.2 als Zweites:** Open-Meteo läuft bereits stabil auf Production. Längste pro-Card-Arbeit (Symbol + Bedingung + Wind + 2× Stunde + Foto-Hinweis). **Bewusst in 5.2a/5.2b geteilt** (komplexester Slice der Phase 5): 5.2a baut den Foundation-Baustein `getStundenHeute()`, 5.2b macht den eigentlichen WetterCard-Swap. Analoge Bau-Aufteilung wie 4.5b/4.5c — gehört in dieselbe 4er-Phasen-Zählung (5.1/5.2/5.3/5.4), ist keine neue Phasen-Nummer.
- **5.3 als Drittes:** iCal + macroEventsResolver sind battle-tested aus Phase 4. Drei Cards + ein Banner in einem Slice — alle aber kleine Swaps.
- **5.4 als Abschluss:** Volltest erst nach allen Swaps sinnvoll. Hygiene + Doku.

---

## 3 · Card-Live-Status-Tabelle

| Card | Vor Phase 5 | Quelle | Nach Phase 5 | Quelle | Slice |
|---|---|---|---|---|---|
| KryptoCard | Stub | `kryptoResolver` → `krypto.json` | Live | `coingeckoFetcher.getKryptoStand()` + `fearGreedFetcher.getFearGreed()` | 5.1 |
| WetterCard | ~~Stub~~ ✅ | ~~`wetterPicker` → `wetter.json`~~ (gelöscht 5.2b) | ✅ Live | `openMeteoFetcher.getWetterErgebnis()` + `astronomieResolver.getStundenHeute()` + `fotoSpotPicker.getFotoEmpfehlung()` | 5.2 |
| KalenderCard | Stub | `kalenderResolver` → `kalender.json` | Live | `icalFetcher.getKalenderTermine()` | 5.3 |
| MacroCard | Stub | `macroResolver` → `macro.json` | Live | `macroEventsResolver.getMacroEvents()` (Indizes-Zeile weggelassen) | 5.3 |
| NewsCard | Stub | `newsResolver.getNewsHeute()` → `news.json` | Live | `newsResolver` aus `news-voll.json#cover_headlines` (Mario-gepflegt) | 5.3 |
| EventBanner | Stub | `eventResolver` → `events.json` | Live | `macroEventsResolver` (Trigger in 5.3 nach Zählung) | 5.3 |

**Werden gelöscht (mit ihrem Slice):**
- `src/lib/kryptoResolver.ts` + `src/data/krypto.json` ✅ gelöscht in 5.1
- `src/lib/wetterPicker.ts` + `src/data/wetter.json` ✅ gelöscht in 5.2b
- `src/lib/kalenderResolver.ts` + `src/data/kalender.json` (5.3)
- `src/lib/macroResolver.ts` + `src/data/macro.json` (5.3)
- `src/lib/eventResolver.ts` + `src/data/events.json` (5.3)
- `src/data/news.json` (5.3, `getNewsHeute()` zieht dann aus `news-voll.cover_headlines`)

---

## 4 · Cards im Detail

### 4.1 KryptoCard (Slice 5.1)

**Heute:** Statischer BTC-Stub aus `krypto.json` (Preis `$95'420`, Delta `-1.8%`, F&G `Neutral · 47`).

**Live-Quelle:**
- `getKryptoStand()` → `KryptoErgebnis.coins` (BTC = `coins.find(c => c.symbol === 'BTC')`)
- `getFearGreed()` → `FearGreedStand.wert + .label`

**Card-Logik:**
- Live-Stempel: `Live · {krypto.fetch_zeit}` wenn `krypto.ist_live`, sonst `Fallback · CoinGecko offline`
- F&G-Zeile: `{fearGreed.label} · F&G {fearGreed.wert}` wenn `fearGreed.ist_live`, sonst `— · F&G —`
- BTC-Preis: `toLocaleString('de-CH')` mit Schweizer Apostroph (existierendes Pattern bleibt)
- Delta-Klasse: `< 0` → `.negativ` (Vermillon), sonst neutral

**Kein Sparkline auf dem Cover** — Phase-2.2-Layout fixiert.

### 4.2 WetterCard (Slice 5.2)

> **Realitäts-Hinweis (14.5.2026, nach 5.2a + 5.2b):**
> - **Bau-Aufteilung 5.2a / 5.2b** (analog 4.5b/4.5c-Pattern · gehört in EINEN Slice der 4er-Phase-5-Zählung):
>   - **5.2a ✅** (feat `8decc27`): `astronomieResolver.getStundenHeute()` als isolierter Foundation-Baustein
>   - **5.2b ✅** (feat `a5ffb9e`): WetterCard.astro-Live-Swap + Blaue-Stunde-Definitions-Anpassung + Inline-SVG-Duplikat durch Wrapper ersetzt + Stub-Files gelöscht
> - **`wmoSymbol.ts` ist NICHT entstanden** (Plan-First-Befund in 5.2a): `WetterSymbol.astro` war bereits seit Phase 2.3 zentralisiert (`src/components/wetter-symbole/WetterSymbol.astro` mit eigener `symbolFor()`-Mapping-Funktion). Cover-WetterCard nutzt den Wrapper direkt mit `<WetterSymbol wmoCode={...} size={64} />`. Das Inline-SVG-Duplikat (byte-genau identisch zu `SonneWolken.astro`) wurde in 5.2b entfernt.
> - **Blaue-Stunde-Definition korrigiert** (Mario-Entscheidung in 5.2b): von der in 5.2a vermerkten `sunset → dusk` (≈ 36 min, bürgerliche Dämmerung) auf **`sunset → nauticalDusk`** (≈ 82 min, Sonne 12° unter Horizont · erweitertes fotografisches Fenster). Begründung: Card als Inspirations-Werkzeug, nicht Timing-Anker. Sanity-Check Baden 14.5.: SunCalc.nauticalDusk 22:19 CEST vs sunrise-sunset.org 22:18 CEST (1-min-Drift wie in 5.2a, normal).
> - **`niederschlag_mm` bewusst nicht auf Cover angezeigt** · Layout-Treue zum Phase-2.2-Stub-Layout. Wert ist in `WetterErgebnis.heute.niederschlag_mm` verfügbar, `WetterDetail.astro` auf /wetter zeigt ihn (conditional bei `> 0`). Falls Cover-Card jemals Niederschlag mitzeigen soll: dedizierte Mario-Entscheidung + Layout-Anpassung.
> - **Mobile-Layout-Befund (Notiz aus 5.2b-Verifikation)**: card-head auf 375px wrappt Eyebrow + Live-Stempel je auf zwei Zeilen ("WETTER & FOTO · BADEN" / "AG" links, "LIVE · 22:51" / "CEST" rechts). Funktional ok, optisch eng. Bewusst nicht in 5.2b umdesignt — Slice 5.4 (Polish/Volltest) ist der Ort, falls Mario Anpassung will.
>
> Der ursprüngliche Spec-Text bleibt darunter als Entscheidungs-Kontext stehen.

**Heute:** Statischer Wetter-Stub aus `wetter.json`.

**Live-Quellen:**
- `getWetterErgebnis()` → `wetter.heute` (Temp, Min/Max, wmo_code, bedingung, wind_kmh, wind_richtung)
- `getStundenHeute()` (neu in 5.2a) via SunCalc → Goldene Stunde + Blaue Stunde Start/Ende
- `getFotoEmpfehlung(wetter.heute)` → `begruendung`-Text für `foto_hinweis`

**Goldene/Blaue-Stunde-Definition (fotografische Entscheidung, keine Naturkonstante):**
- `goldene_stunde`: `SunCalc.goldenHour` (≈ 45 min vor Sonnenuntergang) → `SunCalc.sunset`
- `blaue_stunde`: `SunCalc.sunset` → `SunCalc.nauticalDusk` (Sonne 12° unter Horizont · **erweitertes fotografisches Fenster ≈ 82 min** · Mario-Entscheidung in 5.2b · Card als Inspirations-Werkzeug, nicht Timing-Anker)
- Alternative wäre `blaue_stunde` bis `dusk` (bürgerliche Dämmerung, ≈ 36 min · kompaktere klassische Definition). Mario kann später anpassen.
- Sanity-Check Baden 14.5.2026 gegen unabhängige Referenz `api.sunrise-sunset.org`: sunset 20:56 vs 20:57 · nauticalDusk 22:19 vs 22:18 · 1-min-Drift ist normaler Implementations-Drift zwischen astronomischen Bibliotheken.

**Symbol-Rendering:** WetterCard nutzt direkt `<WetterSymbol wmoCode={wetter.heute.wmo_code} size={64} />` aus `src/components/wetter-symbole/`. Wrapper hat ein `size`-Prop, das ist die einzige Variation gegenüber WetterDetail (das `size=96` und `size=32` nutzt).

### 4.3 KalenderCard (Slice 5.3)

**Heute:** Statischer Termine-Stub aus `kalender.json`.

**Live-Quelle:** `getKalenderTermine()` (icalFetcher, ENV-gestützt mit Fallback). `tage[0]` = Heute → Heute-Termine. `tage[1..7]` → Wochen-Strip kompakt formatiert.

### 4.4 MacroCard (Slice 5.3)

**Heute:** Statischer Macro-Stub aus `macro.json` (Tagesthema + Zeit + Indizes-Strip "SMI +0.3 · DAX flat").

**Live-Quelle:** `getMacroEvents()` (aus Phase 4.7). Heutiges Event = `events.find(e => e.datum === heute)`.

**Indizes-Zeile entfällt komplett** (Mario-Entscheidung, siehe §5). Card wird schlanker: Eyebrow + Tagesthema + Zeit.

### 4.5 NewsCard (Slice 5.3)

**Heute:** 3 Headlines aus `news.json` (separate Quelle parallel zu `news-voll.json` für /news).

**Nach 5.3:** `news.json` wird gelöscht. `news-voll.json` bekommt ein neues Feld `cover_headlines: string[]` (Mario-gepflegt). `getNewsHeute()` zieht daraus.

**Begründung Single-Source:** Behält Marios Kuratierungs-Hoheit, eliminiert zwei parallele Quellen.

### 4.6 EventBanner (Slice 5.3)

**Heute:** Pulse-Animation an Cover-Top, getriggert von `getAktivenEvent()` aus `events.json`.

**Übergangs-Verhalten zwischen 5.1 und 5.3:** EventBanner **bleibt funktional unverändert** während Slice 5.1 + 5.2. Der Promise.all-Block in `index.astro` zieht weiterhin `getAktivenEvent()` aus dem Stub. Sauberer Übergang. Erst in 5.3 wird die Quelle ausgetauscht.

**Nach 5.3:** Quelle ist `macroEventsResolver`. Trigger-Logik (`kritisch` allein vs. `kritisch || hoch`) wird in Slice 5.3 vor dem Verdrahten anhand der echten Event-Zählung in `macro-events.json` entschieden:
- 1–2 kritische Events im aktuellen Fenster → lockern auf `kritisch || hoch`
- 4–5 kritische Events → `kritisch` allein
- Ergebnis im 5.3-Slice-Bericht festhalten

**Ziel:** Banner soll lebendig wirken ohne abzustumpfen.

---

## 5 · Mario-Entscheidungen (Phase 5 Eröffnung)

| Entscheidung | Wahl | Begründung |
|---|---|---|
| Macro-Indizes-Zeile (SMI/DAX/etc) | **A · weglassen** | Stub stehenlassen wäre statische Lüge auf der Startseite. Ehrlich keine Indizes schlägt falsche Indizes. Indizes-API-Suche ist eigener Slice mit IP-Block-Risiko. |
| NewsCard-Quelle | **B · `cover_headlines` in `news-voll.json`** | Single-Source. `news.json` wird gelöscht. Kuratierungs-Hoheit bleibt bei Mario. |
| EventBanner-Trigger | **In 5.3 nach Zählung** | Datenabhängig, nicht vorab festlegen. Zählen vor Verdrahten. |
| Spec-Anlage | **Erster Task in Slice 5.1** | Kein separater Vor-Slice (Slice-Inflation vermeiden). Phase-4-Pattern: Spec parallel zur ersten Foundation-Arbeit. |

---

## 6 · Risiken

1. **prerender=false-Switch für `/index.html`** — heute prerendered (Build: `├─ /index.html`). Wird ab Slice 5.1 zur SSR-Function. Funktional kein Risiko (Detail-Pages laufen schon so), Build-Output ändert sich.

2. **CoinGecko-Cache-Verhalten · DAUERHAFTES Cover-Pattern** — `Cache-Control: s-maxage=60, stale-while-revalidate=300` bedeutet: bei schnellen Reloads sieht der Nutzer denselben BTC-Preis bis zu 60 s. Bewusst gewähltes Pattern (1:1 wie /wirtschaft), nicht Bug. Wichtig bei Pflege/Debugging zu wissen — kein "Cache-Surprise".

3. **wmoSymbol-Refactor-Touch auf /wetter (5.2)** — `WetterDetail.astro` wird auf den neuen Helper umgestellt. Bewusste Refactor-Schuld bezahlen. Risiko gering, aber Volltest auf /wetter nach 5.2 Pflicht.

4. **Goldene/Blaue Stunde via SunCalc** — `astronomieResolver` hat sie heute nicht. `SunCalc.getTimes()` liefert die Werte lokal — keine API, kein IP-Risiko. Aber: Werte sind Tagesabhängig. Format-Konsistenz mit aktueller Card (`"20:00 — 20:48"`) prüfen.

5. **`cover_headlines`-Pflege** — Mario muss das Feld in `news-voll.json` selbst pflegen (analog `macro-events.json`). Wenn leer: Card zeigt Hinweis "Keine Headlines kuratiert" (oder bleibt versteckt). Entscheidung in 5.3.

6. **Custom Domain steht weiter aus (Phase 6)** — Klärung: KEINES der beiden früheren Vercel-Projekte hatte je eine Custom Domain, beide liefen nur auf Default-`.vercel.app`. Die alte _pendenzen-Notiz "qc6f hat die Custom Domain" war falsch und wird in 5.1 korrigiert.

---

## 7 · Anti-Patterns

- ❌ **Trading-Indikatoren aufs Cover** — explizit ausgeschlossen, würde IP-Block vererben
- ❌ **Cover-Layout-Änderungen** — Phase 2.2 ist frozen, Phase 5 ist data-only
- ❌ **Indizes-Live-Suche im Free Tier** — 4.5 Fallback B steht
- ❌ **Architektur-Antizipation** — Fetch-und-ablegen ist geparkt mit eigenem Trigger, nicht Teil von Phase 5
- ❌ **Parallel-Implementierung** — alle Live-Cards nutzen die existierenden Detail-Page-Fetcher (`getKryptoStand`, `getWetterErgebnis`, `getKalenderTermine`, `getMacroEvents` etc.), keine Cover-spezifischen Forks

---

## 8 · Spec-Sync-Konvention

Phase-4-Pattern etabliert: Bei Spec-Abweichung in der Umsetzung wird der ursprüngliche §-Text NICHT umgeschrieben, sondern eine **Realitäts-Box** an den Anfang des §-Blocks gesetzt (`> **Realitäts-Hinweis (Datum, nach Slice X.Y):**`), die Entscheidungs-Kontext + Abweichungs-Begründung dokumentiert. Original-Text bleibt darunter erhalten. Gilt auch für Phase 5.

---

## 9 · Slice-Nummerierungs-Klärung

**Wichtig für die Doku-Lesbarkeit:**

Die Bezeichnung *"Slice 5.1 Binance/Bybit-Swap"* (Commits `91ef169` + `7de6592`, am 14.5.2026) war ein **Übergangs-Label am Ende von Phase 4**. Dieser Slice war ein Phase-4-Nachläufer (Fix-Versuch für den Vercel-IP-Block) und wird als solcher in `_pendenzen.md` und `SESSION_LOG.md` referenziert.

**Phase 5 (Cover-Sync) startet die Slice-Zählung neu:** 5.1, 5.2, 5.3, 5.4.

Commits aus dem Phase-4-Nachläufer-Slice bleiben unverändert (Git-Geschichte ist unveränderlich), wir referenzieren sie weiterhin per SHA (`91ef169`, `7de6592`), nicht per Slice-Nummer.

---

*Bei jedem abgeschlossenen Slice: dieses File unter §2 (Status) aktualisieren, `_pendenzen.md` ergänzen, `SESSION_LOG.md` Eintrag oben.*
