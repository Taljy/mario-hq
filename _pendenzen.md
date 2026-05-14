---
type: pendenzen
projekt: mario-hq
aktualisiert: 26-05-14 (Phase 5 Slice 5.2 abgeschlossen · 5.2a + 5.2b)
aktuelle-phase: 5 (Cover-Sync) · Slice 5.1 ✅ · 5.2 ✅ · 5.3 als Nächstes
---

# Mario's HQ · Pendenzen

> Tagesaktueller Stand. Bei jeder Session aktualisieren. Erledigtes nach unten in „Erledigt".

---

## 🌟 Nordstern · Life-Cockpit-Vision

Mario's HQ ist die langfristige Vision: ein **zentrales Steuerungs- und Anzeige-Tool** für Marios digitalen Alltag. Konsolidiert Informationen aus vielen Apps in einer eigenen, brandkohärenten Oberfläche.

**Prinzip — Read-First, kein Sync-Stress:** Das HQ zeigt Daten aus Quell-Systemen an, bearbeitet sie nicht. Sync-Hölle vermieden.

**MVP-Fokus 2026:** Das Morgenbriefing produktionsreif machen (Phase 1–5). Andere Module bleiben Platzhalter, bis Bedürfnis konkret wird.

**Geplante Module nach MVP (Phase 7+):**

- 🔧 **Habits-Tracker** mit GitHub-Style Heatmap · ausgewählte Habits aus Streaks-App gespiegelt
- 🔧 **Workout-Log** mit Übungs-Historie und Progression
- 🔧 **Zeit-Modul** als Ersatz für Session-App
- 🔧 **Projekt-Übersicht** (Studio Darugna · DREK · Privat)
- 📆 **Voll-Kalender** mit Google-Sync bidirektional · Drag-Drop · Quick-Add · Akiflow/Routine-inspiriert
- 🔧 **Apption.co Widget-Integration** prüfen (Timer mit Google-Calendar-Anbindung)
- 🔧 **Foto-Pipeline** für DRG-Workflow

**Open Question:** Welches Modul aus Phase 7+ ist als erstes wirklich gewünscht? — Klären, sobald Phase 4 produktionsreif läuft.

**Bewusst draussen (vielleicht für immer):**
- ❌ Essen/Gesundheit · ❌ Shopping · ❌ Ziele/Planung · ❌ Lesen/Lernen

---

## ✅ Phase 4 · Charts + Trading-Watchlist — Abgeschlossen (14.5.2026)

**Phase 2.3 ist abgeschlossen (13.5.2026).** Detail-Pages Slim produktionsreif: 5 Slices, 4 Pages live (/wirtschaft mit CoinGecko · /wetter mit Open-Meteo + Astronomie · /news statisch · /kalender mit iCal-Read-Only).

**Phase 4 · Charts + Trading-Watchlist auf /wirtschaft** — alle 8 Slices abgeschlossen 14.5.2026. Strategische Wende vom 13.5.2026 abends:

- **Cowork-Automation entfällt komplett.** Live-APIs + manuelle JSON-Pflege ersetzen die geplante tägliche Cowork-Generation. Briefing-Bereitschaft um 06:00 CEST wird via Live-API-Fetches zum Page-Load gelöst.
- **Phase 3 (Content-Pipeline) wartet** bis Bedarf konkret ist · Habits/Notizen-Tracking oder Archiv-Wunsch sind Trigger.
- **Phase 4 wird breiter:** Editorial-Charts (Sparklines, F&G, Mondphase) plus Trading-Indikatoren (Funding Rates, Open Interest, Long/Short Ratio, Coinbase Premium, Stablecoin Supply) plus vollständige Multi-Asset-Watchlist (Crypto, Aktien, Forex, Commodities) alles auf /wirtschaft als langem scrollintensiven Wirtschafts-Hub.

**Phase-4-Status (Stand 14.5.2026):**
- Slice 4.1 ✅ ECharts-Foundation + BTC-Sparkline · lokal + Production
- Slice 4.2 ✅ Trading-Indikatoren-Block · lokal komplett · Production zeigt Fallback wegen US-Datacenter-IP-Block (Binance, später auch Bybit · siehe Slice 5.1)
- Slice 4.3 ✅ Multi-Anbieter-Watchlist-Foundation · watchlist.json · twelveDataFetcher · watchlistAggregator · coingeckoFetcher erweitert
- Slice 4.4 ✅ Watchlist-Komponenten · WatchlistItem + WatchlistGruppe + WatchlistSektion · Mini-Sparklines für Crypto · collapsible Gruppen · in /wirtschaft integriert
- Slice 4.5 ✅ Aktien + Forex/Commodities-Sektion · Endpoint-Architektur (/api/aktien + /api/forex) wegen hartem 8/min-Credits-Limit · Commodities/Indizes Fallback B (weglassen) · IndizesGrid + Footer-Fix
- Slice 4.5b ✅ Krypto-Card-Rebuild · gemeinsame AssetCard · KryptoSektion (Rename) · zwei neue Krypto-Blöcke (BTC/ETH/SOL/XRP/SUI/TRX + ADA/AVAX/HBAR/JUP/GST/DOT) · Aktien-Doppelung weg · watchlist.json nur noch Krypto · aktien.ts + forex.ts NEU als typesafe Konstanten
- Slice 4.5c ✅ Daten-Architektur-Cleanup · watchlistAggregator → kryptoAggregator · Typ-Renames · tdMap-Parameter + tote twelvedata-Logik raus · Datei -30% kleiner
- Spec-Sync ✅ Phase-4-Spec an Realität nach 4.5b/c angeglichen · §2/§3/§4.1/§5/§6/§7.3/§7.4/§7.5/§7.8/§9/§11 aktualisiert · Eyebrow "WATCHLIST" → "MÄRKTE"
- Slice 4.6 ✅ Wetter-Wochen-Bars (ECharts vertikale Floating-Bars) + Mondphase-SVG (Custom-SVG, mathematisch korrekt) auf /wetter · astronomieResolver um ist_zunehmend erweitert
- Slice 4.7 ✅ Macro-Timeline (Editorial-Liste) + Fear & Greed Gauge (Halbkreis-Tacho) auf /wirtschaft · 9 echte Macro-Events 14.5.-28.5.2026 · alternative.me-Fetcher mit 1h Cache
- Slice 4.8 ✅ Polish + Volltest + Phase-4-Abschluss (inkl. §7.7-Realitäts-Notiz + Cover-Stempel)

**Phase-4-Nachläufer-Slice · Binance/Bybit-Swap-Versuch (14.5.2026, Commits `91ef169` + `7de6592`):**
Binance-Production-Block sollte per Anbieter-Swap zu Bybit V5 behoben werden. Bybit-Fetcher technisch sauber gebaut, lokal alle 4 Cards live, Build grün, deployed. **Production-Verifikation fehlgeschlagen** — Bybit ist von Vercel-US-Lambda-IPs ebenfalls geblockt. DeFiLlama läuft weiter → struktureller Befund: nicht Binance-spezifisch, sondern Derivate-Börsen-Klasse blockt US-Datacenter-IPs (siehe Production-Issues unten). **Schnell-Fix-Pfad ist erschöpft.** Verbleibend nur noch Architektur-Lösung (Fetch-und-ablegen, geparkt mit neuem Trigger). Bybit-Code bleibt auf main · UI-Wahrheit korrekt ("Fallback · Bybit offline"), funktional gleich wie vor dem Swap.

**Slice-Nummerierungs-Klärung:** Die frühere Bezeichnung *"Slice 5.1 Binance/Bybit-Swap"* war ein Übergangs-Label am Ende von Phase 4. Phase 5 (Cover-Sync) startet die Slice-Zählung neu mit 5.1, 5.2, 5.3, 5.4 (siehe Roadmap unten). Commits aus dem Nachläufer bleiben unverändert (Git-Geschichte ist unveränderlich), wir referenzieren sie weiterhin per SHA (`91ef169`, `7de6592`), nicht per Slice-Nummer.

## 🎯 Phase 5 · Cover-Sync · in Arbeit (14.5.2026)

> **Detail-Spezifikation:** `docs/PHASE-5-COVER-SYNC-SPEC.md`

Cover-Daten-Cards auf Live-Stand bringen. Bewusst alle in einem Vorhaben. Krypto-Card nutzt NUR CoinGecko-Preise (keine Trading-Indikatoren wegen IP-Block-Vererbung).

- Slice 5.1 ✅ Spec + SSR-Foundation + KryptoCard live · feat `7af3bf9` · Production live mit `$81'432 · +2.3% · Fear · F&G 34`
- Slice 5.2a ✅ getStundenHeute() in astronomieResolver via SunCalc · feat `8decc27`. Plan-Befund: wmoSymbol-Helper aus Original-Plan unnötig (WetterSymbol-Wrapper schon zentralisiert seit 2.3) → 5.2 in 5.2a/5.2b geteilt analog 4.5b/4.5c, bleibt EIN Slice in der 4er-Phasen-Zählung
- Slice 5.2b ✅ WetterCard live-Swap (Open-Meteo + getStundenHeute + getFotoEmpfehlung) · feat `a5ffb9e` · Production live mit `6° · Vorwiegend klar · S 3 km/h · Goldene 20:11 — 20:56 · Blaue 20:56 — 22:19 · "Klarer Abend · goldene Stunde ideal für Architektur-Spots."`. Mario-Entscheidung in 5.2b: Blaue-Stunde-Definition von `sunset → dusk` (≈ 36 min) auf `sunset → nauticalDusk` (≈ 82 min, erweitertes fotografisches Fenster) korrigiert.
- Slice 5.3 als Nächstes · Kalender + Macro + News + EventBanner
- Slice 5.4 · Polish + Volltest + Phase-5-Abschluss + Cover-Stempel "Phase 5"

---

## ⏭️ Nächste konkrete Schritte

### Mario-TODO
- [x] **KALENDER_ICAL_URL** in Vercel Dashboard eingetragen · beide Projekte (mario-hq + mario-hq-qc6f) · /kalender zeigt Live-Termine
- [x] **TWELVE_DATA_API_KEY** in .env (lokal) + Vercel Dashboard eingetragen · bereit für Slice 4.3
- [x] **PHASE-4-SPEC** erstellt · `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md`
- [x] **Vercel-Doppel-Projekt bereinigt** (14.5.2026) · ältere `mario-hq`-Instanz gelöscht · nur noch `mario-hq-qc6f` aktiv unter `mario-hq-qc6f.vercel.app`. Klarstellung: KEINES der beiden Projekte hatte je eine Custom Domain — beide liefen nur auf Default-`.vercel.app`. Custom Domain steht weiter aus (Phase 6).
- [~] **Vercel-Derivate-Börsen-IP-Block** · im Phase-4-Nachläufer-Slice (Commits `91ef169` + `7de6592`) zu struktureller Anbieter-Klassen-Block bestätigt (Binance + Bybit beide blockiert · DeFiLlama läuft). Anbieter-Swap-Pfad erschöpft. → Verbleibender Fix: **Architektur-Umbau Fetch-und-ablegen, GEPARKT** mit Trigger "Mario nutzt /wirtschaft regelmässig auf Production/Mobile und will die 4 Cards dort live". Cheap-Schritt-1 vor Pipeline-Bau: testen ob GH-Actions-Runner Bybit/Binance erreicht — wenn nein, Residential-IP-Lösung nötig.
- [ ] **Glassnode-Subscription evaluieren** · On-Chain-Analytics Industrie-Standard · ~$39/Monat · Entscheidung wenn Slice 4.2 produktiv läuft und Nutzungs-Pattern bekannt
- [x] **Cover-Meta-Stempel** · CoverFooter.astro auf "Phase 4" aktualisiert (Slice 4.8)
- [ ] **Worktree-Reste aufräumen** · zwei verwaiste Claude-Code-Worktrees im Repo: `.claude/worktrees/crazy-roentgen-49029d` (5c4e8a1 · HQ-Pivot 12.5.) und `.claude/worktrees/lucid-noyce-c570f5` (00535aa · Phase 2.2 · weit hinter main). Kein Risiko, nur Müll. Aufräumen via `git worktree remove <pfad>` plus ggf. `git branch -D <branch>`. An jeden künftigen Slice anhängbar — keine eigene Slice-Notwendigkeit.

---

## 🗺️ Phasen-Roadmap

### Phase 1 · Setup ✅ *(12.5.2026)*
Toolchain · Konventionen · Visual-Identität · Astro-Foundation · Smoketest.

### Phase 2 · Information-Architektur + Hauptmodule

**Phase 2.1 · IA & Navigation** ✅ *(Foundation für alle weiteren Module, abgeschlossen 12.5.2026)*
- [x] Header mit HQ-Branding (Logo/Wordmark · Navigation · Dark-Mode-Toggle)
- [x] Footer mit Meta (Build-Datum, Version, Link zu Repo)
- [x] Multi-Page-Routing für 6 Routes:
  - [x] `/` (Cover · Tagesübersicht)
  - [x] `/wirtschaft` (Krypto + Macro + News-Wirtschaft)
  - [x] `/wetter` (Wetter + Foto + Astronomie)
  - [x] `/news` (Tech, Foto, Architektur, Politik)
  - [x] `/kalender` (Read-Only Google Cal)
  - [x] `/archiv` (alte Briefings)
- [x] Platzhalter-Links in der Navigation für Phase 7+ Module (Habits, Workout, Zeit, Projekte)
- [x] Magazine.astro produktionsreif (über Smoketest hinaus)
- [x] Dark-Mode-Toggle als UI-Element
- [x] Mobile-Layout iPad 768px verifizieren

**Phase 2.2 · Cover-Page Layout**
> **Detail-Spezifikation:** `docs/PHASE-2.2-COVER-SPEC.md`
- [x] **Slice 2.2.1** Eyebrow · Hero-Bild · Zitat · Hero-Datum
- [x] **Slice 2.2.2** Geschichte-Strip · Event-Banner
- [x] **Slice 2.2.3** Wetter+Foto-Card · Kalender-Card
- [x] **Slice 2.2.4** Krypto · Macro · News Cards
- [x] **Slice 2.2.5** Footer · Polish · Mobile · Dark-Mode

**Phase 2.3 · Detail-Pages Slim** ✅ *(13.5.2026)*
> **Detail-Spezifikation:** `docs/PHASE-2.3-DETAIL-PAGES-SPEC.md`
- [x] **Slice 2.3.1** Foundation · DetailPage-Layout · sources.json · SourceStempel
- [x] **Slice 2.3.2** /wirtschaft Slim · Krypto-Hero (live) · Indizes · News · Trade-Placeholder
- [x] **Slice 2.3.3** /wetter Slim · 8 Wetter-Symbole · Open-Meteo · Foto-Spots
- [x] **Slice 2.3.4** /news Slim (4 Kategorien) + /kalender iCal Read-Only
- [x] **Slice 2.3.5** Astronomie-Sektion · Polish · Volltest · Phase-2.3-Abschluss

### Phase 3 · Content-Pipeline · *(zurückgestellt)*

Aufgeschoben bis Bedarf konkret · Trigger sind:
- Habits/Notizen-Tracking braucht persistente Daten
- Archiv-Wunsch · Mario möchte alte Briefings durchsuchen

Bei Aktivierung: Briefing-Frontmatter-Schema · Content Collections · Archive-Page aus Collection.

### Phase 4 · Charts + Trading-Watchlist auf /wirtschaft ✅ *(14.5.2026)*

> **Detail-Spezifikation:** `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md`

Editorial-Charts UND Trading-Tools auf einer Page. Vollständige Multi-Asset-Watchlist analog Marios TradingView-Setup.

- [x] **Slice 4.1** ECharts-Foundation + DRG-Theme + BTC-Hero mit Sparkline
- [x] **Slice 4.2** Trading-Indikatoren-Block · Funding · OI · L/S · Coinbase Premium · Stablecoin Supply
- [x] **Slice 4.3** Multi-Anbieter-Watchlist-Foundation · Twelve-Data-Fetcher · ENV-Setup
- [x] **Slice 4.4** Watchlist-Komponenten mit Gruppierung · Crypto-Items komplett
- [x] **Slice 4.5** Aktien-Sektion + Forex/Commodities-Sektion · Endpoint-Architektur
- [x] **Slice 4.5b** Krypto-Card-Rebuild · gemeinsame AssetCard · IA-Umbau
- [x] **Slice 4.5c** Interner Daten-Architektur-Cleanup (kryptoAggregator)
- [x] **Spec-Sync** Phase-4-Spec an Realität nach 4.5b/c angeglichen · Eyebrow-Fix
- [x] **Slice 4.6** Wetter-Wochen-Bars + Mondphase-SVG auf /wetter
- [x] **Slice 4.7** Macro-Timeline + Fear & Greed Gauge auf /wirtschaft
- [x] **Slice 4.8** Polish + Volltest + Phase-4-Abschluss · §7.7-Realitäts-Notiz · Cover-Stempel · SESSION_LOG Synthese

### Phase 5 · Cover-Sync — Cover auf Live-Stand bringen · in Arbeit *(14.5.2026)*

> **Detail-Spezifikation:** `docs/PHASE-5-COVER-SYNC-SPEC.md`

Cover-Daten-Cards auf Live-Stand bringen. Bewusst alle in einem Vorhaben — kein Halb-Zustand. Krypto-Card nutzt NUR CoinGecko (keine Trading-Indikatoren wegen IP-Block-Vererbung).

- [x] **Slice 5.1** Spec + SSR-Foundation + KryptoCard live · feat `7af3bf9`
- [x] **Slice 5.2** Wetter-Card live · Bau-Aufteilung 5.2a/5.2b
  - [x] **5.2a** getStundenHeute() in astronomieResolver · feat `8decc27`
  - [x] **5.2b** WetterCard-Live-Swap + nauticalDusk-Korrektur · feat `a5ffb9e`
- [ ] **Slice 5.3** Kalender + Macro + News + EventBanner (Macro-Indizes-Zeile weggelassen · NewsCard zieht aus cover_headlines in news-voll.json · EventBanner-Trigger nach Event-Zählung)
- [ ] **Slice 5.4** Polish + Volltest + Cover-Stempel "Phase 5" + Phase-5-Abschluss

### Phase 6 · Briefing-Erweiterungen
- [ ] **Streaks-Tracker** mit GitHub-Style Heatmap (im Briefing eingeblendet)
- [ ] **Bike-Wetter** mit Trail-Score (Aargau-Trails)
- [ ] **Trade-Setups** konkret (Entry/SL/TP mit R:R)
- [ ] **On-Chain & Sentiment** (Whales, Exchange-Reserven, MVRV)
- [ ] **Daily Learning** (Buchidee, Sprache, KI-Tool des Tages)
- [ ] Eigene Domain einrichten (`hq.dasdarugna.ch` o.ä.)

### Phase 7+ · Life-Cockpit-Erweiterungen (eigene Module)
- [ ] **Habits-Modul** mit Streaks-App-Spiegelung
- [ ] **Workout-Modul** als Bike-/Workout-Log
- [ ] **Zeit-Modul** als Session-Ersatz
- [ ] **Projekt-Modul** (Studio Darugna · DREK · Privat)
- [ ] **Apption.co Widgets** prüfen und integrieren
- [ ] **Foto-Pipeline** für DRG-Workflow
- [ ] **Obsidian-Sync-Ausbau** (Symlink-Brücke oder API)
- [ ] **Voll-Kalender** mit Google-Sync bidirektional · OAuth · Drag-Drop · Akiflow/Routine-inspiriert

---

## 💡 Backlog · Ideen ohne Phase

- Sprach-Toggle (Schweizer Hochdeutsch / Englisch für Reisen)
- PDF-Export pro Briefing
- iOS-Widget für „Briefing heute"-Quickaccess
- RSS-Feed der Briefings für andere Reader
- Reise-Modus: Wetter/Foto-Block adaptiert auf Reiseort
- Email-Briefing-Versand als Backup

---

## Foto-Inspiration · /wetter (Konzept steht, Umsetzung offen)

Mario will die /wetter-Seite zu "Wetter und Foto" ausbauen — als
Inspirationsquelle, die fotografische Gelegenheiten erkennt.

**Konzept (durchdacht, aber bewusst noch nicht umgesetzt):**
- foto-spots.json wird KURATIERT (von Mario, ggf. mit Cowork-Recherche-
  Unterstützung) — KEIN automatischer Feed. Recherche von gestern bestätigt:
  es gibt keine maschinell abrufbare Foto-Spot-Quelle für die Region.
  Quellen wie ShotHotspot, SwissPhotoSpots sind Browse-Karten, keine APIs —
  und Abgreifen wäre rechtlich heikel + qualitativ dünn.
- Geplanter Slice 4.6b in drei Teilen:
  1. Spot-Datenmodell — Metadaten-Felder pro Spot (ideales_wetter,
     beste_tageszeit, saison, Blickrichtung, kurze Beschreibung)
  2. Matching-Logik — Seite matcht heutige Wetterlage + Tageszeit-Fenster
     gegen die Spots, zeigt den/die heute passenden, rotiert unter den
     passenden ("Gelegenheiten erkennen")
  3. Spezial-Slot für besondere fotografische Ereignisse + Wetter-zu-Foto-
     Beschreibungssatz aus vorhandenen Wetterdaten
  Plus: Seiten-Umbenennung "Wetter" → "Wetter und Foto"
- Inhalt (die eigentlichen Spots) wächst danach organisch via JSON-Pflege,
  kein weiterer Slice nötig.

**Offener Punkt vor dem Slice — eine kreative Entscheidung von Mario:**
Welche Metadaten-Felder pro Spot ergeben aus Fotografen-Sicht Sinn? Das
Datenmodell hängt daran. Muss Mario festlegen, bevor 4.6b geplant werden kann.

**Recherche-Material** (Marios Quellen zum Spots-Finden, NICHT zum Abgreifen):
- shothotspot.com — strukturierte Karte, 122 Spots für Kanton Aargau
- swissphotospots.com — kuratierte Karte mit GPS, Parkplatz, Schwierigkeit
- 1981photographers.com — Community-Fotolocation-Sammlung
- ifolor / mountainmoments / phototraveler.ch — redaktionelle Listen

---

## ✅ Erledigt

### 26-05-14 (Mario · Vercel-Doppel-Projekt bereinigt)
- Älteres Vercel-Projekt `mario-hq` gelöscht · nur noch `mario-hq-qc6f` aktiv unter `mario-hq-qc6f.vercel.app`
- Klarstellung: KEINES der beiden Projekte hatte je eine Custom Domain (frühere _pendenzen-Notiz "qc6f hat die Custom Domain" war falsch) — beide liefen nur auf Default-`.vercel.app`
- Custom Domain `hq.dasdarugna.ch` o.ä. steht weiter aus (Phase 6)
- ENV-Vars-Doppelpflege entfällt damit ab sofort · nur noch ein Projekt-Setup

### 26-05-12 (Abend · Phase 2.1 abgeschlossen)
- Layout-Foundation für Mario's HQ produktionsreif gebaut
- 9 Routes funktional: Cover, Wirtschaft, Wetter, News, Kalender, Archiv, Habits, Workout, Zeit
- Header mit Brand-Lockup, client-side de-CH Datum, Theme-Toggle
- Top-Navigation mit MVP-Gruppe + Sektionstrenner + Phase-7-Gruppe
- Mobile-Layout mit Hamburger-Toggle (Button + JS, kein <details>)
- Theme-Toggle mit localStorage-Persistierung, FOUC-Schutz, sanftem Transition
- Live auf Vercel: mario-hq-qc6f.vercel.app
- Repo public: github.com/Taljy/mario-hq
- Build grün (9 pages in 614ms), Push erfolgreich

### 26-05-12 (Nachmittag · Strategischer Pivot)
- **Strategischer Pivot zu „Mario's HQ"** · Projekt wird Life-Cockpit, Briefing wird ein Modul
- **4-Typen-Aufgaben-Trennung definiert** · Cal · Obsidian · Repo · Streaks
- **Phase-2-Aufteilung in 4 Sub-Phasen** · IA · Cover · Wirtschaft · Wetter/Foto
- **Module mit Platzhaltern definiert** · Habits, Workout, Zeit, Projekte als Phase 7+
- **Scope bewusst eingeschränkt** · Essen, Shopping, Ziele/Planung, Lernen NICHT im HQ
- **`_projekt.md` und `_pendenzen.md` aktualisiert** auf neuen HQ-Stand

### 26-05-12 (Nachmittag · Phase 1 Abschluss)
- **Visuelle Identität-Pivot zu Studio Da Rugna** · DRG-Tokens und Schriften übernommen
- **Astro v6 + Tailwind v4 lokal aufgesetzt** · npm create astro mit --force --yes, Package-Name korrigiert
- **DRG-Theme-Tokens in global.css** · vermillon/sumi/washi/papier mit Light- und Dark-Mode-Layer
- **Magazine.astro Layout** · Fraunces × Inter × JetBrains Mono via Google Fonts CDN
- **Smoketest visuell verifiziert** · Fraunces-Display, Inter-Body, Papier-Card, Vermillon-Akzent
- **`npm run build` grün** · 1 page built in 609ms, keine Warnings
- **Erster Commit lokal** · feat: initial astro setup with tailwind v4 and DRG tokens

### 26-05-12 (Vormittag · Phase 1 Start)
- Architektur-Diskussion durchgeführt · Drei Niveaus evaluiert, Niveau 3 (Astro + Vercel) gewählt
- Web-Projekt-Konventionen aus DREK destilliert · `WEBPROJEKT-KONVENTIONEN.md` erstellt
- Setup-Tools installiert · Homebrew · VS Code · Claude Code
- Meta-Dokumente erstellt · `_projekt.md` · `_pendenzen.md` · `SKILL.md` · `SESSION_LOG.md`

### 26-05-11
- Macro-Modul auf Stufe 4 ausgebaut · Today-Hero + Wochen-Liste + Portfolio + Triggers
- Projekt-Anweisungen v2 in Claude-Projekt-Settings hinterlegt
- Übergabe-Datei `UEBERGABE-morgenbriefing.md` als Chat-Brücke erstellt

### Vorher
- 7-Block-Struktur etabliert und stabil
- Portfolio-Coins definiert (BTC, ETH, SOL, XRP, SUI)
- Obsidian-Vault `Second_Brain` mit Sync, Minimal Theme, briefing.css
- Erstes Markdown-Briefing `2026-05-07.md` als Test
- HTML-Dashboard `morgenbriefing-2026-05-12.html` mit Editorial-Look

---

## 🐛 Bekannte Production-Issues

**US-Datacenter-IPs sind von Derivate-Börsen geblockt — struktureller Befund** *(entdeckt 13.5.2026 · bestätigt 14.5.2026 im Phase-4-Nachläufer-Slice)*

Auf `mario-hq-qc6f.vercel.app/wirtschaft` zeigen vier Trading-Indikator-Cards FALLBACK. Lokal (Schweizer Residential-IP) läuft alles live.

**Bestätigte Anbieter-Blocks (Phase-4-Nachläufer-Slice, Commits `91ef169` + `7de6592`):**
- **Binance Futures Public API** — geblockt (13.5.)
- **Bybit V5 Public API** — geblockt (14.5., feat `91ef169`)
- **DeFiLlama** — läuft weiter problemlos → Beweis: anbieter-klassen-spezifisch (Derivate-Börsen mit US-Compliance-Risiko), kein Netzwerk-Problem
- **CoinGecko**, **Alternative.me**, **Coinbase Exchange Rates**, **Open-Meteo**, **Twelve Data** — alle laufen normal

**Routing-Befund:** Vercel deploy-Region `fra1` (Frankfurt-CDN) routet SSR-Function-Aufrufe zu `iad1` (US-AWS-Lambda). Header-Beweis: `x-vercel-id: fra1::iad1::...`. Die Derivate-Börsen blocken US-Datacenter-IP-Ranges (AWS, GCP, Azure, OCI) wegen US-CFTC/Treasury-Compliance — kein technischer Defekt, sondern strukturelle Anbieter-Policy.

**Schnell-Fix-Pfad (Anbieter-Swap) ist erschöpft.** OKX wurde bewusst nicht getestet — selbes IP-Block-Risiko, selbe Compliance-Klasse.

**Verbleibender Lösungs-Pfad: nur noch Architektur — "Fetch-und-ablegen"**
- Modell: Externer Job (z.B. GitHub Actions, Vercel Cron, externer Server) holt die Daten aus einer kontrollierten IP, schreibt sie in Storage (Vercel KV, Upstash, JSON-in-Repo, ...). Page rendert nur aus Storage.
- **GEPARKT mit Trigger:** "Mario nutzt /wirtschaft regelmässig auf Production/Mobile und will die 4 Cards dort live." Alter Trigger ("nächster Anbieter blockt auch") ist verbraucht.
- **Schritt 1 vor jedem Pipeline-Bau (Cheap-Test):** verifizieren ob ein GitHub-Actions-Runner (Azure-IP) Bybit oder Binance überhaupt erreicht. Wenn nein → Residential-IP-Lösung nötig (eigener Mini-Server, Cloudflare Tunnel, oder bezahlter Proxy) → grösserer Architektur-Schritt.

**Aktueller UI-Stand (nach Phase-4-Nachläufer, akzeptiert):** Die 4 Cards zeigen "Fallback · Bybit offline" auf Production — ehrlicher als der vorherige "Binance offline"-Stand (Quellen-Wahrheit stimmt mit dem aktuellen Fetcher-Pfad), aber funktional identisch zu vorher.

---

## ❓ Offene Fragen für Mario

1. **Reise-Modus:** Wie soll der Standort dynamisch wechseln können? (Manuell im Frontmatter? Automatisch über IP?) *(Post-MVP · gehört zur Voll-Kalender-Diskussion · siehe Phase 7+)*
2. ~~**Cowork vs Claude Code:** Wer schreibt am Ende die täglichen Briefing-Files — Cowork (UI) oder Claude Code (lokal im Repo via CLI)?~~ → **Beantwortet:** Cowork = Scheduled Task ab Phase 5 (tägliches JSON/Markdown-Output) · Claude Code = Coding und Repo-Arbeit. Keine Überschneidung.
3. **Life-Cockpit-Priorität:** Welche Erweiterung würdest du als erstes wollen, sobald MVP läuft? Habits-Modul, Workout, Zeit-Modul?
4. **News-Quellen:** Welche konkreten Quellen für die `/news`-Sektion? Tech (Hacker News? The Verge?) · Architektur (Dezeen? Hochparterre.ch?) · Politik (NZZ? Tagi? Watson?)
5. **Trading-Daten:** Direkt-Anzeige des Bitvavo-Portfolios im HQ — oder nur Markt-Daten ohne dein eigenes Portfolio?
6. **Habits-Granularität:** Welche der Streaks-App-Habits sind „öffentlich" genug für HQ-Anzeige? (Sport, Lesen — nicht alle persönlichen)
7. **Voll-Kalender (Post-MVP):** Welcher konkrete Trigger startet die Implementierung? Was muss Phase 2.6 (Read-Only-Kalender) als API-Annahme treffen, damit das Voll-Kalender-Modul später sauber draufbauen kann?
8. **Glassnode-Integration?** Industrie-Standard für On-Chain-Analytics · Studio-Subscription ab ~$39/Monat · API-Access kostenpflichtig · Mario ist offen für bezahlte Tools wenn Mehrwert klar · Entscheidung wenn Phase-4-Trading-Indikatoren produktiv laufen und Nutzungs-Pattern bekannt ist.
9. **Trading-Daten-Tiefe vs Asset-Breite?** Glassnode hätte mehr Indikator-Tiefe (Hash Rate, Exchange Balances, ETF Net Flows, aggregierte Funding über alle Exchanges). Watchlist-Erweiterung (Slice 4.3–4.5) bringt mehr Asset-Breite (~30 Items). Welche Richtung hat Priorität für Mario?
