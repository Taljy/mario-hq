---
type: phasenspezifikation
projekt: mario-hq
phase: 5
erstellt: 26-05-14
aktualisiert: 26-05-14 (Slice 5.3 abgeschlossen)
status: 5.1 ✅ · 5.2 ✅ · 5.3 ✅ · 5.4 offen
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
| **5.3** | KalenderCard (`getKalenderTermine()`) · MacroCard (3er-Vorausschau mit `getNaechsteWichtigeEvents()`, Indizes + Puls + Live-Stempel komplett raus) · NewsCard (`cover_headlines`-Feld in `news-voll.json`) · EventBanner **stillgelegt** (Datei bleibt, aus index.astro ausgebunden) · alte Stub-Resolver gelöscht | mittel | ✅ abgeschlossen |
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
| KalenderCard | ~~Stub~~ ✅ | ~~`kalenderResolver` → `kalender.json`~~ (gelöscht 5.3) | ✅ Live | `icalFetcher.getKalenderTermine()` | 5.3 |
| MacroCard | ~~Stub~~ ✅ | ~~`macroResolver` → `macro.json`~~ (gelöscht 5.3) | ✅ Live | `macroEventsResolver.getNaechsteWichtigeEvents(3)` (3er-Vorausschau · Indizes/Puls/Live-Stempel raus) | 5.3 |
| NewsCard | ~~Stub~~ ✅ | ~~`newsResolver.getNewsHeute()` → `news.json`~~ (gelöscht 5.3) | ✅ Live | `newsResolver.getNewsHeute()` aus `news-voll.json#cover_headlines` (Mario-gepflegt, Single-Source) | 5.3 |
| EventBanner | Stub | ~~`eventResolver` → `events.json`~~ (gelöscht 5.3) | **stillgelegt** | aus `index.astro` ausgebunden · Datei bleibt für Wiederanschluss · siehe §4.6 | 5.3 |

**Werden gelöscht (mit ihrem Slice):**
- `src/lib/kryptoResolver.ts` + `src/data/krypto.json` ✅ gelöscht in 5.1
- `src/lib/wetterPicker.ts` + `src/data/wetter.json` ✅ gelöscht in 5.2b
- `src/lib/kalenderResolver.ts` + `src/data/kalender.json` ✅ gelöscht in 5.3
- `src/lib/macroResolver.ts` + `src/data/macro.json` ✅ gelöscht in 5.3
- `src/lib/eventResolver.ts` + `src/data/events.json` ✅ gelöscht in 5.3
- `src/data/news.json` ✅ gelöscht in 5.3 (Inhalt nach `news-voll.cover_headlines`)
- `src/components/EventBanner.astro` bleibt erhalten · stillgelegt (siehe §4.6)
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

> **Realitäts-Hinweis (14.5.2026, nach 5.3):**
> - **Logik-Bug vor Push gefunden + gefixt:** Original-Plan war `ergebnis.tage.slice(1, 8)` für den Wochen-Strip. `icalFetcher.parseIcal()` baut `tage`-Array aber **nur aus Tagen MIT Terminen** — leere Tage fehlen komplett. Wochen-Strip zeigte nur 1 Tag statt 7.
> - **Fix:** Defensive Wochen-Strip-Generierung über `Array.from({length: 7})` mit explizitem Datum-Offset · pro Tag in `tageMap` (`Map<datum, KalenderTag>`) nachschauen · "frei" als Default-Label · Wochentag via `Intl.DateTimeFormat`.
> - **Heute-Block analog:** nicht via `tage[0]`, sondern `tageMap.get(heuteIso)` — sonst würde "Heute frei" als `tage[1]` (nächster Tag mit Terminen) anzeigen.
> - Live-Stempel: icalFetcher liefert keinen `fetch_zeit` → Card generiert eigene Zeit mit gleicher Format-Konvention wie KryptoCard/WetterCard.
>
> Der ursprüngliche Spec-Text bleibt darunter als Entscheidungs-Kontext stehen.

**Heute:** Statischer Termine-Stub aus `kalender.json`.

**Live-Quelle:** `getKalenderTermine()` (icalFetcher, ENV-gestützt mit Fallback). Heute-Termine + Wochen-Strip aus den 7 nächsten Tagen.

### 4.4 MacroCard (Slice 5.3)

> **Realitäts-Hinweis (14.5.2026, nach 5.3):**
> - **Konzept-Wechsel von Mario in 5.3-Freigabe:** Original-Plan war "heutiges Event" (1 Zeile) mit Pulse-Animation synchron zum EventBanner. Neues Konzept: **3er-Vorausschau** auf wichtige Events (kritisch || hoch) ab heute · kein Puls · kein Live-Stempel · ruhige Liste.
> - Neue Helper-Funktion: `macroEventsResolver.getNaechsteWichtigeEvents(anzahl = 3): MacroEvent[]` · defensive (liefert 2/1/0 Events bei dünnem Fenster oder nicht-gepflegter JSON).
> - Datum-Format: `"Heute"` (wenn datum === heute) sonst `"DD. Monat"` (z.B. `"20. Mai"`) via `Intl.DateTimeFormat('de-CH', {day:'numeric', month:'long', timeZone:'Europe/Zurich'})`.
> - **Komplett entfernt:** Indizes-Zeile (Frontmatter `indizesStrip` + Template `.indizes` + CSS-Block) · Pulse-Animation (`.macro-card.event-aktiv` + `@keyframes hq-pulse-border` hell + dark + `prefers-reduced-motion`-Block + `.event-marker`).
> - **Kein Live-Stempel:** Macro-Kalender ist Mario-gepflegtes JSON, kein Live-Fetch · UI-Wahrheits-Prinzip · `card-head` einseitig (nur Eyebrow links). Bonus: MacroCard ist auf 375px **nicht** vom card-head-Wrap-Problem betroffen (kein Stempel als Partner rechts).
> - Mobile-Grid für Event-Zeilen ≤480px: Datum + Zeit oben, Name unten · kompakter auf engem Viewport.
> - Empty-State bei 0 Events: italic Leer-Hinweis `"Keine wichtigen Macro-Events in den nächsten 14 Tagen."` · greift wenn macro-events.json nicht nachgepflegt ist.
>
> Der ursprüngliche Spec-Text bleibt darunter als Entscheidungs-Kontext stehen.

**Heute:** Statischer Macro-Stub aus `macro.json` (Tagesthema + Zeit + Indizes-Strip "SMI +0.3 · DAX flat").

**Live-Quelle:** `getMacroEvents()` (aus Phase 4.7).

**Indizes-Zeile entfällt komplett** (Mario-Entscheidung, siehe §5).

### 4.5 NewsCard (Slice 5.3)

> **Realitäts-Hinweis (14.5.2026, nach 5.3):**
> - 1:1 wie geplant umgesetzt · `news-voll.json` bekommt `cover_headlines: string[]`-Feld parallel zu `kategorien` · `_schema_doku`-Block ergänzt
> - Initial-Befüllung mit den 3 alten `news.json`-Headlines (Schweizer AI-Act / Saharastaub / Tesla) · Mario kann ab jetzt direkt in `news-voll.json` kuratieren
> - `getNewsHeute()` wechselt Quelle, `getNewsKategorien()` unverändert · `news.json`-Import komplett raus
> - NewsCard-Template/CSS unverändert (zieht weiter `news.headlines: string[]`-Shape)
>
> Der ursprüngliche Spec-Text bleibt darunter als Entscheidungs-Kontext stehen.

**Heute:** 3 Headlines aus `news.json` (separate Quelle parallel zu `news-voll.json` für /news).

**Nach 5.3:** `news.json` wird gelöscht. `news-voll.json` bekommt ein neues Feld `cover_headlines: string[]` (Mario-gepflegt). `getNewsHeute()` zieht daraus.

**Begründung Single-Source:** Behält Marios Kuratierungs-Hoheit, eliminiert zwei parallele Quellen.

### 4.6 EventBanner (Slice 5.3 · STILLGELEGT)

> **Realitäts-Hinweis (14.5.2026, nach 5.3):**
> - **Mario-Entscheidung in 5.3-Freigabe:** EventBanner **stillgelegt** statt umverdrahtet. Ruhigerer Cover-Charakter · die neue MacroCard-3er-Vorausschau übernimmt die Macro-Information.
> - `EventBanner.astro` **bleibt im Repo** · NICHT gelöscht. Aus `src/pages/index.astro` ausgebunden (Import + Render-Stelle entfernt).
> - `eventResolver.ts` + `events.json` wurden **gelöscht** (waren Stub, EventBanner zog daraus). Der Import in `EventBanner.astro` bleibt drin (broken) — Astro bundelt die Komponente nicht weil nicht imported, Build bleibt grün.
> - **Wiederanschluss-Anleitung im Datei-Header** der EventBanner.astro: 1) Import auf `macroEventsResolver` umstellen (neue Helper-Funktion z.B. `getHeutigesBannerEvent()` anlegen, Trigger `kritisch || hoch && datum === heute`), 2) Felder-Mapping anpassen (MacroEvent hat `name`/`uhrzeit`, keine `beschreibung`), 3) in `index.astro` wieder einhängen. ~10 min.
> - **Was damit entfällt:** `getHeutigesBannerEvent()` Shared Helper · Pulse/Banner-Synchronitäts-Verifikation · Trigger-Zählungs-Live-Test 14.5.

**Original-Spec (vor 5.3-Konzept-Wechsel):** Banner wäre auf `macroEventsResolver` umgestellt worden mit `kritisch || hoch`-Trigger (Mario-Zählung: 1× kritisch, 5× hoch, 3× mittel → ~6 sichtbare Tage). Diese Entscheidung war getroffen, wurde dann zugunsten der Stilllegung verworfen.

---

## 5 · Mario-Entscheidungen (Phase 5 Eröffnung)

| Entscheidung | Wahl | Begründung |
|---|---|---|
| Macro-Indizes-Zeile (SMI/DAX/etc) | **A · weglassen** | Stub stehenlassen wäre statische Lüge auf der Startseite. Ehrlich keine Indizes schlägt falsche Indizes. Indizes-API-Suche ist eigener Slice mit IP-Block-Risiko. |
| NewsCard-Quelle | **B · `cover_headlines` in `news-voll.json`** | Single-Source. `news.json` wird gelöscht. Kuratierungs-Hoheit bleibt bei Mario. |
| ~~EventBanner-Trigger~~ EventBanner-Stilllegung | **stillgelegt in 5.3** | Ursprünglich Trigger-Zählung 1/5/3 → kritisch∥hoch geplant. In 5.3-Freigabe verworfen zugunsten ruhigerer Cover · MacroCard-3er-Vorausschau übernimmt. Komponente bleibt für Wiederanschluss. |
| MacroCard-Konzept (5.3-Freigabe) | **3er-Vorausschau · kein Puls · kein Live-Stempel** | Card wird ruhige Liste statt Pulse-Trigger-Karte. Indizes-Zeile komplett raus. Synchronitäts-Frage zum EventBanner entfällt (Banner ist weg). |
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
