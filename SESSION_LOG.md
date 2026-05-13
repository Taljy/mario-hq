# Mario's HQ · Session Log

## 26-05-13 (Update 16) · Slice 2.3.3 implementiert

### Was gemacht
- 8 Wetter-Symbol-SVGs sumi-e monolinig in `src/components/wetter-symbole/` · Painters-Model für Wolken-Fill (var(--bg-card) überdeckt Sonnenstrahlen korrekt im Dark-Mode)
- `WetterSymbol.astro` Wrapper mit WMO-Code-Mapping · size-Prop via inline-flex (kein Scoping-Problem)
- `openMeteoFetcher.ts` · Open-Meteo Baden AG (47.4762, 8.3056) · forecast_days=8 · heute + 7 Wochentage · wochentagKurz via Intl (Europe/Zurich-safe)
- `fotoSpotPicker.ts` · 4-Regel-Algorithmus: Regen → kein Spot · Nebel+Frühmorgens → Lägern · Klar+Abend → Goldene-Stunde · Fallback → kürzeste Fahrzeit
- `WetterDetail.astro` · Hero mit 96px Symbol + Fraunces-Temp + Sonnenzeiten · 7-Tage-Strip (7 Karten, Mobile 4-Spalten)
- `FotoSpots.astro` · Empfehlung-Hero (Fraunces-Name · italic Hinweis · Tags) + Alle-Spots-Grid
- `/wetter.astro` auf DetailPage + SSR · Cache 30min/1h SWR

### Erkenntnisse
- **Painters-Model für SVG-Dunkel-Symbole.** `fill="var(--bg-card)"` auf Wolken-Pfad überdeckt Sonnenstrahlen korrekt — im Dark-Mode wechselt das automatisch zu sumi-dunkel ohne eigene Dark-Mode-Regel.
- **Worktree-Falle bestätigt.** Build ohne `cd /Users/mariomacstudio/Developer/mario-hq &&`-Prefix lief im Worktree und zeigte falsches Ergebnis (Static statt Hybrid). Konvention stärker einhalten.
- **Open-Meteo timezone-Param via `%2F`.** URL-Encoding für den Slash in `Europe/Zurich` ist nötig, sonst wird die Param falsch geparst.
- **Foto-Spot-Algorithmus aktuell sehr simpel.** Bei echter Nutzung wird sich zeigen welche Fälle fehlen (z.B. Föhn-Wind für Geissberg, Frühlings/Herbst-Filter).

### Offene Pendenzen
- Slice 2.3.4 als Nächstes (/news Slim + /kalender iCal Read-Only)
- Astronomie-Sektion in 2.3.5 (SunCalc + 2026-Events in /wetter)
- Aufräum-Tasks aus Phase 2.1 weiterhin offen
- Foto-Spots-Datenbank über 4 Aargau-Spots hinaus erweitern (später)

### Files dieser Session
- `src/data/wetter-fallback.json` (neu)
- `src/data/foto-spots.json` (neu)
- `src/lib/openMeteoFetcher.ts` (neu)
- `src/lib/fotoSpotPicker.ts` (neu)
- `src/components/wetter-symbole/` (9 Files: 8 SVGs + Wrapper)
- `src/components/wetter/WetterDetail.astro` (neu)
- `src/components/wetter/FotoSpots.astro` (neu)
- `src/pages/wetter.astro` (modifiziert · DetailPage · SSR)
- `_pendenzen.md` (Slice 2.3.3 abgehakt)
- `SESSION_LOG.md` (Update 16)

---

## 26-05-13 (Update 15) · Slice 2.3.2 implementiert

### Was gemacht
- `@astrojs/vercel` Adapter installiert · `astro.config.mjs` mit `adapter: vercel()` · `.vercel/` in `.gitignore`
- `/wirtschaft.astro` auf SSR umgestellt via `export const prerender = false` · echter CoinGecko-Fetch bei jedem Request
- `Cache-Control: s-maxage=60, stale-while-revalidate=300` via `Astro.response.headers`
- `coingeckoFetcher.ts` mit 5s `AbortSignal.timeout()` · Try/Catch · JSON-Fallback bei API-Fehler · kein Auth nötig
- `wirtschaftResolver.ts` für statische Indizes + News aus `wirtschaft.json`
- 4 Komponenten in `src/components/wirtschaft/`: KryptoHero · IndizesGrid · WirtschaftsNews · TradeSetupsPlaceholder
- Live-Verifikation: BTC $81'096 mit "LIVE · 12:24 CEST"-Stempel echte CoinGecko-Daten

### Erkenntnisse
- **Astro v6 Hybrid-SSR funktioniert sauber.** `output: 'static'` (Default) + `adapter: vercel()` + `export const prerender = false` per-Page ist der korrekte Ansatz in Astro v6 — kein `output: 'hybrid'` mehr nötig (deprecated). Build-Mode zeigt "server" sobald eine SSR-Page existiert.
- **`AbortSignal.timeout()` ist Node 17.3+.** Mit Astro v6 auf Node 22 funktioniert das problemlos — kein separates `setTimeout`/`clearTimeout`-Pattern nötig.
- **toLocaleString('de-CH') auf dem Vercel-Server.** Funktioniert mit Full-ICU in Node 22/Vercel-Runtime: Apostroph als Tausenderpunkt korrekt rendert.
- **Fallback-Pattern als Vorlage.** Exakt das gleiche Try/Catch-Muster wird für Open-Meteo (Slice 2.3.3) und iCal (Slice 2.3.4) wiederverwendet.

### Offene Pendenzen
- Slice 2.3.3 als Nächstes (/wetter Slim · 8 Wetter-Symbol-SVGs · Open-Meteo · Foto-Spots)
- CoinGecko-Rate-Limit (10–30/Min Free Tier) bei späteren Concurrent-Visitors prüfen
- Aufräum-Tasks aus Phase 2.1 weiterhin offen

### Files dieser Session
- `astro.config.mjs` (Vercel-Adapter)
- `.gitignore` (.vercel/ hinzugefügt)
- `package.json` + `package-lock.json` (@astrojs/vercel)
- `src/data/wirtschaft.json` (neu)
- `src/lib/coingeckoFetcher.ts` (neu)
- `src/lib/wirtschaftResolver.ts` (neu)
- `src/components/wirtschaft/KryptoHero.astro` (neu)
- `src/components/wirtschaft/IndizesGrid.astro` (neu)
- `src/components/wirtschaft/WirtschaftsNews.astro` (neu)
- `src/components/wirtschaft/TradeSetupsPlaceholder.astro` (neu)
- `src/pages/wirtschaft.astro` (modifiziert · SSR + DetailPage)
- `_pendenzen.md` (Slice 2.3.2 abgehakt)
- `SESSION_LOG.md` (Update 15)

---

## 26-05-13 (Update 14) · Slice 2.3.1 implementiert

### Was gemacht
- `sources.json` mit 7 Quellen-Einträgen: CoinGecko · Cowork (statisch) · Open-Meteo · SunCalc · Astronomie-Highlights · Google Calendar (iCal) · Cowork (kuratiert)
- `sourceFilter.ts` mit `getSourcesFor(modul)` und `getAllSources()` · TypeScript strict · keine any
- `SourceStempel.astro` mit externen Links (target="_blank" rel="noopener") und Use-Beschreibungen · conditional: rendert nur wenn Einträge vorhanden
- `DetailPage.astro` als gemeinsames Layout für /wirtschaft · /wetter · /news · /kalender · wraps Magazine.astro · Back-Link "← Zurück zum Cover" · optionale Eyebrow · Fraunces-H1 · Hairline-Separator · SourceStempel am Ende
- `/archiv.astro` auf DetailPage umgestellt · bewusst permanent da Phase 3 Content Collections direkt auf diesem Layout aufbaut · modul="archiv" → SourceStempel rendert korrekt nichts (kein Eintrag)

### Erkenntnisse
- **SourceStempel conditional-leer ist korrektes Verhalten.** `modul="archiv"` liefert leere Liste → `{sources.length > 0 && ...}` blendet Stempel aus. Kein Spezialfall nötig, das Muster skaliert sauber auf jedes Modul.
- **DetailPage-`<title>` interpoliert.** `${title} · Mario's HQ` ergibt z.B. "Archiv · Mario's HQ" — konsistentes Browser-Tab-Pattern für alle Detail-Pages gesetzt.
- **Dark-Mode via `data-theme` · nicht `prefers-color-scheme`.** Site nutzt localStorage-Toggle, nicht CSS Media Query. Preview-Verifikation via `preview_eval: document.documentElement.dataset.theme = 'dark'` statt `colorScheme`-Option.

### Offene Pendenzen
- Slice 2.3.2 als Nächstes (/wirtschaft Slim · Krypto-Hero live via CoinGecko · Indizes · News · Trade-Setups-Placeholder)
- Aufräum-Tasks aus Phase 2.1 weiterhin offen (`<details>`-Stolperstein · Worktree-Falle in SKILL.md)

### Files dieser Session
- `src/data/sources.json` (neu)
- `src/lib/sourceFilter.ts` (neu)
- `src/components/SourceStempel.astro` (neu)
- `src/layouts/DetailPage.astro` (neu)
- `src/pages/archiv.astro` (auf DetailPage umgestellt)
- `_pendenzen.md` (Slice 2.3.1 abgehakt)
- `SESSION_LOG.md` (Update 14)

---

## 26-05-13 (Update 13) · Phase 2.3 Konsolidierung + Spec

### Was gemacht
- Strategische Diskussion: Phase 2.3/2.4/2.5/2.6 zu einer konsolidierten Phase 2.3 · Detail-Pages Slim zusammengefasst (Site-First-Tiefe-Later-Prinzip)
- Architektur-Entscheidungen pro Detail-Modul getroffen:
  · Krypto via CoinGecko-API (live)
  · Wetter via Open-Meteo (live, gratis)
  · Kalender via iCal-Geheim-URL (Wegwerf-Code bis Phase 8)
  · 8 Wetter-Symbole als sumi-e SVGs
  · 4 Aargau-Foto-Spots mit Picker-Algorithmus
  · Astronomie via SunCalc lokal + hartcodierte 2026-Events
  · News kuratiert ab Phase 5 via Cowork
- Spec-File `docs/PHASE-2.3-DETAIL-PAGES-SPEC.md` committed
- Out-of-Band-Edit Commit d1b88a6 nachgeloggt (Site-Footer Phase 2.1 → 2.2 Korrektur nach Phase-2.2-Abschluss)

### Erkenntnisse
- **Konsolidierung war richtig.** Volle Vertiefung pro Modul macht ohne Charts (Phase 4) und Cowork-Daten (Phase 5) nur Mockup-Arbeit. Slim-Layouts jetzt geben dem HQ als Ganzes Gestalt.
- **iCal statt OAuth für Kalender im MVP.** OAuth-Setup ist 200+ Zeilen, eigene Slice-Last, ENV-Management. iCal-URL als Wegwerf-Brücke bis Phase 8 (Voll-Kalender).
- **Out-of-Band-Edit-Pattern erkannt.** Spontane Auto-Edit-Pop-ups in Claude Code können Logging-Lücken erzeugen. Künftig vorsichtig sein.

### Offene Pendenzen
- Slice 2.3.1 als Nächstes (Foundation für Detail-Pages)
- Aufräum-Tasks aus Phase 2.1 weiterhin offen (`<details>`-Stolperstein, Worktree-Falle in SKILL.md)
- Cowork-Prompt-Schema für JSON-Befüllung ab Phase 5 definieren (eigene Spec wahrscheinlich)

### Files dieser Session
- `docs/PHASE-2.3-DETAIL-PAGES-SPEC.md` (neu)
- `_pendenzen.md` (Phase-2.3-Konsolidierung)
- `SESSION_LOG.md` (Update 13)

---

## 26-05-13 (Update 12) · Slice 2.2.5 + Phase 2.2 Abschluss

### Was gemacht
- CoverFooter mit Generierungs- und Live-BTC-Stempel
- src/lib/generierung.ts als zentrale Quelle (statisch in MVP, Phase 5 liefert echte Timestamps)
- Dark-Mode-Polish an drei Komponenten:
  · HeroImage: hardcodiertes Licht-Gradient (#EEEBE3) war helles Rechteck gegen dark-bg — auf #1E1E1E/#161616 umgestellt, Opacities leicht abgesenkt
  · EventBanner: background von 0.06 auf 0.12 — war fast unsichtbar auf sumi-900
  · MacroCard: separater hq-pulse-border-dark Keyframe (0.28/0.65 statt 0.18/0.55)
- Volltest Light/Dark · 375px/1280px · Conditional-Tests · Console sauber

### Erkenntnisse
- Viewport-Höhe für Preview-Tests relevant: bei 800px-Höhe und 1380px-Seite sieht man nur Teile → Taller-Viewport (1500px+) macht Volltest in einem Screenshot möglich
- `transferSize === 0` in performance.getEntriesByType('resource') ist kein 404 — das sind 304-Cached-Responses im Vite-Dev-Server
- Dark-Mode-Background für SVG via `:root[data-theme="dark"] .hero-image { background: ... }` in Astro-scoped Style funktioniert sauber — Astro scopet nur den .hero-image-Selektor, :root bleibt global
- Phase 2.2 ist die erste Phase mit echtem Editorial-Charakter · 5 Slices als Increment-Pattern bewährt

### Offene Pendenzen
- Phase 2.3 startet · /wirtschaft als Detail-Page (Krypto-Hero, Macro-Timeline, Indizes, News-Wirtschaft)
- Aufräum-Tasks aus Phase 2.1: <details>-Stolperstein + Worktree-Falle in SKILL.md dokumentieren
- Site-Footer noch auf "Phase 2.1" — sollte auf "Phase 2.2" nachgeführt werden (kleiner Aufräum-Task)

### Files dieser Session
- `src/lib/generierung.ts` (neu)
- `src/components/CoverFooter.astro` (neu)
- `src/pages/index.astro` (modifiziert · Footer integriert)
- `src/components/HeroImage.astro` (Dark-Mode-Polish)
- `src/components/EventBanner.astro` (Dark-Mode-Polish)
- `src/components/MacroCard.astro` (Dark-Mode-Polish)
- `_pendenzen.md` (Slice 2.2.5 abgehakt · Phase 2.3 als aktuelle Phase)
- `SESSION_LOG.md` (Update 12)

---

## 26-05-13 (Update 11) · Slice 2.2.4 implementiert

### Was gemacht
- krypto.json + macro.json + news.json statische Stubs
- kryptoResolver.ts + macroResolver.ts + newsResolver.ts (Pattern 1:1 aus 2.2.3)
- KryptoCard mit Fraunces-Preis · toLocaleString('de-CH') Schweizer Apostroph-Tausenderpunkt · Delta in Vermillon bei Minus
- MacroCard mit conditional Event-Pulse-Animation (gekoppelt an eventResolver.ts aus Slice 2.2.2) · prefers-reduced-motion-Schutz · Indizes-Strip mit flat/+/−-Format im Frontmatter berechnet
- NewsCard mit 3 Headlines-Stack · last-child margin-0
- index.astro: .supporting-Grid repeat(3, minmax(0, 1fr)) · Mobile-Stack unter 768px
- Conditional-Test via events.json-Datumswechsel bestanden · Pulse + Stempel verschwinden korrekt

### Erkenntnisse
- `@keyframes` in Astro-scoped `<style>` werden korrekt kompiliert — Animationsname wird mit data-astro-cid-Hash gescopert, Referenz im gleichen Block funktioniert automatisch
- prefers-reduced-motion via `CSSMediaRule.conditionText` in den kompilierten Stylesheets verifizierbar — kein manueller macOS-System-Switch nötig für CI-nahe Verifikation
- `border: 1.5px solid transparent` als Default-State hält Card-Grösse stabil wenn Event-Aktiv-Border erscheint — kein Layout-Shift

### Offene Pendenzen
- Slice 2.2.5 als letzter Cover-Slice (CoverFooter · Polish · Dark-Mode-Verbesserungen · Mobile-Volltest)
- Live-CoinGecko-API, MeteoSwiss, RSS-Aggregator kommen spätere Phasen

### Files dieser Session
- `src/data/krypto.json` (neu)
- `src/data/macro.json` (neu)
- `src/data/news.json` (neu)
- `src/lib/kryptoResolver.ts` (neu)
- `src/lib/macroResolver.ts` (neu)
- `src/lib/newsResolver.ts` (neu)
- `src/components/KryptoCard.astro` (neu)
- `src/components/MacroCard.astro` (neu)
- `src/components/NewsCard.astro` (neu)
- `src/pages/index.astro` (modifiziert)
- `_pendenzen.md` (Slice 2.2.4 abgehakt)
- `SESSION_LOG.md` (Update 11)

---

## 26-05-13 (Update 10) · Slice 2.2.3 implementiert

### Was gemacht
- wetter.json + kalender.json mit statischen Stubs
- wetterPicker.ts + kalenderResolver.ts (Pattern aus 2.2.2)
- WetterCard.astro mit custom sumi-e SVG-Symbol (var(--fg) für Dark-Mode-Auto-Anpassung, Wolke via var(--bg-card) als Painters-Model-Clip)
- KalenderCard.astro mit Termin-Liste + Wochen-Strip
- index.astro: co-heroes Grid minmax(0,1.7fr)/minmax(0,1fr), Mobile stackt
- Beide Cards mit Vermillon-Eyebrows

### Erkenntnisse
- Astro-Dev-Server kann nach mehrfachen index.astro-Edits alten CSS-Cache halten — `display: grid` greift erst nach Server-Neustart. Symptom: eval zeigt `display: block`. Fix: Server killen + preview_start neu aufrufen.
- SVG `fill="var(--bg-card)"` für Wolken-Masking funktioniert in inline SVG ohne Extra-Aufwand — Dark-Mode-Auto-Switch kostenfrei über semantische Tokens.
- `minmax(0, 1.7fr) minmax(0, 1fr)` statt plain `1.7fr 1fr` verhindert Grid-Overflow bei langem Card-Inhalt.

### Offene Pendenzen
- Slice 2.2.4 als Nächstes (Krypto · Macro · News Cards · 3er-Reihe)
- Wetter-Symbol-Set + MeteoSwiss-Anbindung kommt Phase 2.4
- Google-Calendar-Read-Only kommt Phase 2.6
- Aufräum-Tasks aus Phase 2.1 weiterhin offen

### Files dieser Session
- `src/data/wetter.json` (neu)
- `src/data/kalender.json` (neu)
- `src/lib/wetterPicker.ts` (neu)
- `src/lib/kalenderResolver.ts` (neu)
- `src/components/WetterCard.astro` (neu)
- `src/components/KalenderCard.astro` (neu)
- `src/pages/index.astro` (modifiziert)
- `_pendenzen.md` (Slice 2.2.3 abgehakt)
- `SESSION_LOG.md` (Update 10)

---

## 26-05-13 (Update 9) · Slice 2.2.2 implementiert

### Was gemacht
- geschichte.json mit 5 Demo-Einträgen (gemischte Themen entsprechend Marios Bias)
- events.json mit Powell-Demo-Event für heute
- geschichtePicker.ts und eventResolver.ts (Pattern analog zu zitatePicker.ts aus Slice 2.2.1)
- GeschichteStrip.astro (Pattern-Klon vom Zitat-Strip mit Eyebrow in Tinte-Mittel statt Vermillon)
- EventBanner.astro mit conditional Rendering
- index.astro integriert beide neuen Komponenten

### Erkenntnisse
- `(match as Event) ?? null` im Spec-Code ist TypeScript-Strict-Problem: `undefined as Event` ist fragwürdige Assertion. Sichere Lösung: ternäres `match ? (match as Event) : null`.
- Conditional-Test via hartkodiertem Datum bestätigt: CSS-Klasse bleibt im `<style>`-Block, aber kein DOM-Element wenn Event null — korrektes Verhalten.
- `grep -c` zählt Zeilen, nicht Vorkommen — für Conditional-Test `class="event-banner"` statt `.event-banner` als Suchmuster nutzen.

### Offene Pendenzen
- Slice 2.2.3 als Nächstes (Wetter+Foto Card · Kalender Card · Co-Heroes)
- Aufräum-Tasks aus Phase 2.1 weiterhin offen

### Files dieser Session
- `src/data/geschichte.json` (neu)
- `src/data/events.json` (neu)
- `src/lib/geschichtePicker.ts` (neu)
- `src/lib/eventResolver.ts` (neu)
- `src/components/GeschichteStrip.astro` (neu)
- `src/components/EventBanner.astro` (neu)
- `src/pages/index.astro` (modifiziert)
- `_pendenzen.md` (Slice 2.2.2 abgehakt)
- `SESSION_LOG.md` (Update 9)

---

## 26-05-13 (Update 8) · Slice 2.2.1 implementiert

### Was gemacht
- Daten-Layer: zitate.json (11 Zitate), ausgabe.ts (Counter + KW + Wochentag + Monat), zitatePicker.ts (deterministische Tages-Auswahl)
- Drei neue Astro-Komponenten: HeroImage (sumi-e Berg-SVG), CoverHeader (Eyebrow + Hero-Datum), Zitat (Tages-Strip mit Vermillon-Eyebrow)
- index.astro: Mini-Stub ersetzt durch echtes Layout
- _pendenzen.md: Phase 2.2 in 5 Slices umgegliedert

### Erkenntnisse
- DateDisplay.astro aus Phase 2.1 nicht wiederverwendet — andere Grösse (44px vs. Display-Scale) und andere opsz (96 vs. 144). Build-time-computed ist für SSG + tägliche Rebuilds die richtige Wahl.
- SVG-CSS aus inline-style in `<style>`-Block ausgelagert — Media-Query ohne `!important` möglich.
- Terminal-Verifikation des Ausgabe-Counters vor Komponenten-Build: sauberes Vorgehen, deckt Logik-Bugs vor UI-Arbeit auf.

### Offene Pendenzen
- Slice 2.2.2 als Nächstes (Geschichte-Strip + Event-Banner)
- Aufräum-Tasks aus Phase 2.1 weiterhin offen

### Files dieser Session
- `src/data/zitate.json` (neu)
- `src/lib/ausgabe.ts` (neu)
- `src/lib/zitatePicker.ts` (neu)
- `src/components/HeroImage.astro` (neu)
- `src/components/CoverHeader.astro` (neu)
- `src/components/Zitat.astro` (neu)
- `src/pages/index.astro` (modifiziert)
- `_pendenzen.md` (Phase 2.2 Slice-Umgliederung)
- `SESSION_LOG.md` (Update 8)

---

## 26-05-13 (Update 7) · Phase 2.2 Spec dokumentiert

### Was gemacht
- Strategie-Chat zu Phase 2.2 Cover-Page durchgeführt
- Skizze A v3 als visuelle Referenz iteriert (3 Versionen)
- Architektur-Entscheidung: Modell C (Hybrid mit Live-Inseln)
- 5 Slices definiert (2.2.1 bis 2.2.5)
- Spec-File docs/PHASE-2.2-COVER-SPEC.md committed

### Erkenntnisse
- Modell C ist editorial-konform · Magazin-Charakter bleibt, kritische Daten sind live · kein Update-Suffix nötig
- Spec-File als Brücke zwischen claude.ai-Sessions · Token-Limit in Strategie-Chats macht Repo-Dokumente wichtig

### Offene Pendenzen
- Slice 2.2.1 implementieren (Eyebrow, Hero-Bild, Zitat)
- Aufräum-Tasks aus Phase 2.1 weiterhin offen

### Files dieser Session
- `docs/PHASE-2.2-COVER-SPEC.md` (neu)
- `_pendenzen.md`
- `SESSION_LOG.md` (Update 7)

---

## 26-05-13 (Update 6) · Voll-Kalender als Post-MVP-Modul dokumentiert

### Was gemacht

**Strategische Diskussion: Voll-Kalender als eigenes Modul**
- Phase 2.6 bleibt Read-Only-Kalender (Google Calendar API, kein Write-Zugriff)
- Voll-Kalender (bidirektionaler Google-Sync, Drag-Drop, Quick-Add) als eigenständiges Post-MVP-Modul definiert
- Akiflow und Routine als visuelle Referenz für UI/UX festgehalten
- Drei Docs-Files aktualisiert: `_pendenzen.md`, `_projekt.md`, `SESSION_LOG.md`

### Erkenntnisse

- **Akiflow/Routine als Benchmark:** Nicht das Feature-Set kopieren — die Reibungslosigkeit als Massstab nehmen. Voll-Kalender lohnt sich nur, wenn er spürbar besser als der native Kalender ist.
- **Read-First-Reihenfolge bewährt sich:** Phase 2.6 Read-Only zuerst aufbauen. Wenn die API-Integration sitzt, ist Voll-Kalender ein inkrementeller Write-Layer — kein Rewrite.
- **Strategie vor Code:** Modul-Grenzen jetzt klären spart später Architektur-Schulden. Der Trigger für Voll-Kalender bleibt offen — bewusst, nicht vergessen.

### Offene Pendenzen

- Phase 2.2 · Cover-Page Layout startet als nächstes
- SKILL.md: Worktree-Falle + `<details>`-Shadow-Box-Modell dokumentieren (bei nächstem `docs:`-Commit)

### Files dieser Session

- `_pendenzen.md` (Voll-Kalender in Nordstern, Phase 7+, Offene Fragen)
- `_projekt.md` (Modul-Architektur, Entscheidungs-Tabelle)
- `SESSION_LOG.md` (dieser Eintrag)

---

## 26-05-12 (Update 5) · Phase 2.1 live · Layout-Foundation komplett

### Was gemacht

**Drei Commits in einem produktiven Abend-Block:**
- Commit 1 (21eda17): Layout-Foundation — Header, Navigation, ThemeToggle, DateDisplay, Footer, PhasePlaceholder, Magazine-Refactor, Cover-Mini-Stub
- Commit 2 (f7e2261): 8 Platzhalter-Pages für MVP- und Phase-7-Module
- Push zu GitHub, Vercel Auto-Deploy auf mario-hq-qc6f.vercel.app

**Wichtige Architektur-Entscheidung mitten in Phase 2.1:**
- Erster Ansatz mit `<details>` als Layout-Wrapper scheiterte am Browser-Shadow-Box-Modell
- Diagnose: `<details>` exponiert intern einen anonymen Wrapper, der `<summary>` und alle anderen Kinder trennt; Grid-Items waren nicht die direkten DOM-Kinder
- Lösung: Wechsel zu Button + JS-Toggle (`aria-expanded`, 6 Zeilen Inline-JS)
- `:has()`-Selektor für robusten Mobile-Collapse
- Cross-Browser robust, kein UA-Shadow-DOM-Stress

### Erkenntnisse

- **Plan-First-Regel bewährt sich:** Sonnet 4.6 hat den `<details>`-Bug bei der Browser-Verifikation entdeckt, vor dem Commit. Saubere Diagnose statt blinden Fix-Versuchen.
- **Spec-Treue vs. Pragmatismus:** `<details>` ist semantisch für Inhalt-Disclosure (FAQ, Spoiler), nicht für Navigations-Layout. Die richtige Wahl ist manchmal der Standard-Button mit `aria-expanded`.
- **Vermillon-Quote sehr sparsam:** Active-Underline alleine = 0.006% Page-Area. Drei-Prozent-Regel komfortabel eingehalten.
- **Worktree-Falle besteht:** Jeder bash-Call muss `cd /Users/mariomacstudio/Developer/mario-hq && ...` chainen. Claude Code rutscht sonst in `.claude/worktrees/...` zurück.
- **DRG-Tokens funktionieren wie geplant:** Fraunces × Inter × JetBrains Mono, Washi/Sumi/Papier/Vermillon — alles in CSS-Variablen sauber. Theme-Switch ist eine einzige `data-theme`-Mutation.

### Offene Pendenzen

- SKILL.md: Worktree-Falle als bekannten Stolperstein dokumentieren (bei nächstem `docs:`-Commit)
- SKILL.md: `<details>`-Shadow-Box-Modell als „bewusst verworfene Pattern" dokumentieren
- Phase 2.2 vorbereiten: Cover-Page als echte Tagesübersicht mit 5 Modul-Cards

### Files dieser Session

- Commit 1: 6 neue Komponenten + 3 modifizierte (Magazine, index, global.css)
- Commit 2: 8 neue Platzhalter-Pages
- Update 5 in SESSION_LOG.md (dieser Eintrag)
- Phase-2.1-Abschluss in _pendenzen.md

---

## 26-05-12 (Update 4) · Repo-Rename zu `mario-hq`

### Was gemacht
- GitHub-Repo `Taljy/mario-hq` erstellt (statt `morgenbriefing`)
- Lokaler Ordner umbenannt: `~/Developer/morgenbriefing/` → `~/Developer/mario-hq/`
- Alle Meta-Files aktualisiert: package.json, SKILL.md, _projekt.md, _pendenzen.md
- Historische Referenzen in `docs/UEBERGABE-morgenbriefing.md` und `_pendenzen.md` (Erledigt-Sektion) bleiben unverändert als Archiv

### Erkenntnis
- Konsequente Umbenennung jetzt — bevor GitHub-Push und Vercel-Setup. Pivot zum richtigen Zeitpunkt: später wäre teurer.
- Repo-Name matched jetzt Produktname „Mario's HQ".

---
## 26-05-12 (Update 3) · Mario's HQ · Strategischer Pivot von Briefing zu Cockpit

### Was gemacht

**Strategische Reflexion nach Phase-1-Abschluss**
Mario fragt sich, ob das Projekt mehr werden sollte als ein tägliches Briefing — ein zentrales Steuerungstool, das fragmentierte Apps konsolidiert. Detaillierte Bestandsaufnahme aller aktuell genutzten Tools, dann strategischer Cut:

- **Hauptmodul:** Wirtschafts-Briefing (Krypto, Macro, Märkte, News) — höchster täglicher Nutzwert
- **MVP-Module Phase 2:** Cover + Wirtschaft + Wetter/Foto + News + Kalender (Read-Only) + Archiv
- **Phase 6+:** Briefing-Erweiterungen (Trade-Setups, Bike-Wetter, News-Aggregator)
- **Phase 7+:** HQ-Lebensbereiche (Habits, Workout, Zeiterfassung)
- **Bewusst draussen:** Essen, Shopping, Ziele, Lernen — gehören in Obsidian oder existierende Apps

**Drei Schlüssel-Entscheidungen**
1. **Name:** Mario's HQ (Repo bleibt `morgenbriefing`, UI/Branding pivotiert) — *später revidiert in Update 4: Repo wurde umbenannt zu `mario-hq`*
2. **Aufgaben-Architektur:** 4-Typen-Trennung — Cal (termingebunden) · Obsidian (Notizen) · _pendenzen.md (Code) · Streaks (Habits). HQ zeigt Read-Only an, bearbeitet wird am Quell-Ort.
3. **Phase 2 Schwerpunkt:** Wirtschaft + Wetter/Foto parallel produktionsreif, statt nacheinander

**Phase 2 neu strukturiert in 6 Sub-Phasen**
- 2.1 Informations-Architektur & Navigation
- 2.2 Cover-Page Layout
- 2.3 /wirtschaft Vertiefung
- 2.4 /wetter Vertiefung
- 2.5 /news handgepflegt
- 2.6 /kalender Read-Only

**Files aktualisiert**
- `_projekt.md` komplett neu — Mario's HQ als Cockpit, Modul-Übersicht, Read-Only-Prinzip, 4-Typen-Aufgaben-Architektur
- `_pendenzen.md` komplett neu — neue Nordstern-Sektion, Phase 2 in 6 Sub-Phasen, klare Abgrenzung MVP vs. später vs. draussen
- `SESSION_LOG.md` (dieser Eintrag)

### Erkenntnisse

- **Reality-Check via Bestandsaufnahme war wertvoll.** Beim Aufschreiben aller Apps wurde klar: viele Bereiche gehören nicht ins HQ (Essen, Shopping). Andere brauchen klare Quell-Hoheit (Habits → Streaks, Notizen → Obsidian).
- **Read-Only-Prinzip ist die wichtigste Entscheidung.** Vermeidet die Synchronisations-Hölle, die jedes Cockpit-Projekt killt. HQ wird zum Fenster auf bestehende Quellen, nicht zur weiteren Quell-App.
- **HQ-Pivot zur richtigen Zeit.** Vor Phase 2 ist der Moment für strategische Klarheit. Phase 2 würde Multi-Page-Routing aufbauen — wenn jetzt sechs Routes geplant sind statt zwei, ändert das die Architektur massiv. Später Refactoring wäre teurer.
- **Pragmatischer Scope-Cut.** Mario hat selbst formuliert „eins nach dem anderen einbauen, viele Module erstmal nur als Platzhalter." Genau richtiges Mantra für ein Solo-Projekt mit Tagesjob.
- **Wirtschaftsblock ist das wertvollste Modul.** Mario sagt das selbst: bereitet ihn auf den Trading-Tag vor. Das treibt die Energie-Verteilung in Phase 2.

### Offene Pendenzen

- Aktualisierte `_projekt.md` und `_pendenzen.md` ins Repo kopieren (ersetzt die alten)
- Mini-Commit: `docs: mario's HQ pivot · projekt und pendenzen aktualisiert`
- Dann Aufräum-Tasks (SKILL-Update auf v6, GitHub-Push, Vercel-Setup)
- Dann Phase 2.1 starten · Information-Architektur & Navigation

### Files dieser Session

- `_projekt.md` (komplett überarbeitet)
- `_pendenzen.md` (komplett überarbeitet)
- `SESSION_LOG.md` (Eintrag ergänzt)

---
## 26-05-12 (Update 2) · Visual-Identität-Pivot zu Studio Da Rugna

### Was gemacht

**Strategische Wende vor dem ersten Astro-Setup**
- Mario entschied: visuelle Identität nicht eigenständig-Editorial, sondern **Studio-Da-Rugna-Familie** — Marken-Kohärenz über alle seine Projekte
- DRG-Design-System (`colors_and_type.css`, `tailwind.tokens.js`, `SKILL.md`) als Token-Basis integriert
- Token-Mapping: Cream → Washi · Ink → Sumi-900 · Crimson → Vermillon · Newsreader → Inter
- DRG-Hard-Rules übernommen (Vermillon max 3%, no marketing fluff, no bouncy animations)
- Emoji-Regel-Konflikt geklärt: DRG-strikt für UI-Chrome, aber im Briefing-Content erlaubt (privates Tool, keine Kunden-Sicht)
- Dark Mode mitgenommen (DRG hat ihn fertig)

**Files aktualisiert**
- `SKILL.md` · komplett neu mit DRG-Tokens, Inter statt Newsreader, DRG-Anti-Patterns
- `_projekt.md` · Sektion „Visuelle Identität" umgeschrieben · Entscheidungs-Tabelle erweitert
- `SESSION_LOG.md` · dieser Eintrag

**Claude Code drüben war pausiert** seit dem Astro-Plan — bewusst gestoppt vor Schritt 1, um nicht mit falschen Tokens loszulegen.

### Erkenntnisse

- **Pivot zur richtigen Zeit.** Vor dem ersten `npm create astro` ist der Stopp-Moment richtig — kein nachträgliches Refactoring von Tokens nötig.
- **DRG-System ist Premium-Qualität.** Type-Scale mit clamp(), opsz-Achse für Fraunces, zwei Schatten-Stops, durchdachte Light/Dark-Tokens. Mario hat hier nicht halb-improvisiert.
- **Inter statt Newsreader ist mutiger Move.** Wechsel Serif-Body → Sans-Body verändert den Charakter spürbar. Funktioniert: Display-Serif × Sans-Body ist FT-Weekend/Monocle-Standard.
- **Hard-Rule-Konflikt sauber gelöst.** DRG's „no emoji" für Kunden-Touchpoints macht Sinn — Mario's „privates Tool"-Argument macht die Briefing-Ausnahme legitim. Wichtig: im UI-Chrome trotzdem strikt.

### Offene Pendenzen

- Aktualisierte Files (`SKILL.md`, `_projekt.md`) ins Repo kopieren (ersetzt die alten)
- Claude Code drüben mit GO-Prompt starten (Phase 1 · Astro-Setup mit DRG-Tokens)
- `_pendenzen.md` bleibt unverändert (Phasen-Struktur identisch, nur Token-Bezeichnungen darin)

### Files dieser Session

- `SKILL.md` (überarbeitet)
- `_projekt.md` (überarbeitet)
- `SESSION_LOG.md` (Eintrag ergänzt)

---

> Chronologisch, neueste oben. Pro Session: Datum, Was gemacht, Erkenntnisse, Offene Pendenzen.

---

## 26-05-12 · Setup-Phase 1 + Meta-Dokumentation

### Was gemacht

**Strategische Entscheidungen**
- Architektur evaluiert · drei Niveaus diskutiert (Daily-HTML / Magazine-App / Static Site)
- **Niveau 3 gewählt:** Astro + Vercel · echte Multi-Page-Site mit Auto-Deploy
- Tech-Stack festgelegt: Astro v5 · TypeScript · Tailwind v4 · ECharts · Vercel
- Visuelle Identität: Editorial-Look (Fraunces + Newsreader), eigenständig — nicht DREK-Brand

**Setup**
- Voraussetzungs-Check: Node v24, npm v11, Git 2.50 vorhanden · Brew + VS Code + Claude Code fehlten
- Homebrew 5.1.11 installiert · PATH konfiguriert in `~/.zprofile`
- VS Code 1.115.0 existierte bereits · `code`-CLI via Command Palette verknüpft
- Claude Code 2.1.139 via native installer · PATH-Fix für `~/.local/bin` in `~/.zshrc`

**Konventionen geklärt**
- Web-Projekt-Konventionen aus DREK destilliert (separater Chat im DREK-Projekt)
- `WEBPROJEKT-KONVENTIONEN.md` als Referenz importiert
- Setup-Plan an Konventionen angepasst: Vercel statt Cloudflare Pages, `~/Developer/` als Pfad, TypeScript ja

**Meta-Dokumente erstellt**
- `_projekt.md` · Vision, Stack, Architektur, Kontext über Mario
- `_pendenzen.md` · 5-Phasen-Roadmap mit aktuellem Stand
- `SKILL.md` · Konventionen für Claude Code in diesem Repo
- `SESSION_LOG.md` · dieses File

### Erkenntnisse

- **Konventionen-File via Schwester-Chat war Gold wert.** Spart in Zukunft jedes Mal die Frage „wie machst du das normalerweise". `WEBPROJEKT-KONVENTIONEN.md` als zentrale Referenz.
- **Niveau 3 statt Magazine-App war richtige Wahl.** Mario will lernen, das ist die Investition wert. Die fünf Phasen sind klar abgegrenzt, jede liefert eigenständigen Wert.
- **Editorial-Identität bewusst gewählt, nicht DREK-Brand übernommen.** Das Briefing ist ein persönliches Projekt, eigene Ästhetik macht Sinn.
- **Tailwind v4 ist neu für Astro-Setup**, aber für Mario konsistent mit DREK-Projekten — `@theme` in CSS statt `tailwind.config.js`.

### Offene Pendenzen

- Drei Mario-Fragen warten: Pfad, Repo-Name, Domain-Strategie (siehe `_pendenzen.md`)
- GitHub-Repo anlegen (Owner: Taljy, Public, ohne Init-Files)
- Astro-Projekt initialisieren mit `npm create astro@latest`
- Erste Live-URL auf Vercel
- Meta-Files ins Repo-Root commiten

### Files dieser Session

- `WEBPROJEKT-KONVENTIONEN.md` *(aus Schwester-Chat)*
- `_projekt.md`
- `_pendenzen.md`
- `SKILL.md`
- `SESSION_LOG.md`

---

*Eintrag-Template für nächste Session:*

```markdown
## JJ-MM-TT · Session-Titel

### Was gemacht
- ...

### Erkenntnisse
- ...

### Offene Pendenzen
- ...

### Files dieser Session
- ...
```
