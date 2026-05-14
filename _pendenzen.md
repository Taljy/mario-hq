---
type: pendenzen
projekt: mario-hq
aktualisiert: 26-05-14 (Slice 4.8 · Phase-4-Abschluss)
aktuelle-phase: 4 ABGESCHLOSSEN
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
- Slice 4.2 ✅ Trading-Indikatoren-Block · lokal komplett · Production zeigt Fallback wegen Vercel-Binance-Block
- Slice 4.3 ✅ Multi-Anbieter-Watchlist-Foundation · watchlist.json · twelveDataFetcher · watchlistAggregator · coingeckoFetcher erweitert
- Slice 4.4 ✅ Watchlist-Komponenten · WatchlistItem + WatchlistGruppe + WatchlistSektion · Mini-Sparklines für Crypto · collapsible Gruppen · in /wirtschaft integriert
- Slice 4.5 ✅ Aktien + Forex/Commodities-Sektion · Endpoint-Architektur (/api/aktien + /api/forex) wegen hartem 8/min-Credits-Limit · Commodities/Indizes Fallback B (weglassen) · IndizesGrid + Footer-Fix
- Slice 4.5b ✅ Krypto-Card-Rebuild · gemeinsame AssetCard · KryptoSektion (Rename) · zwei neue Krypto-Blöcke (BTC/ETH/SOL/XRP/SUI/TRX + ADA/AVAX/HBAR/JUP/GST/DOT) · Aktien-Doppelung weg · watchlist.json nur noch Krypto · aktien.ts + forex.ts NEU als typesafe Konstanten
- Slice 4.5c ✅ Daten-Architektur-Cleanup · watchlistAggregator → kryptoAggregator · Typ-Renames · tdMap-Parameter + tote twelvedata-Logik raus · Datei -30% kleiner
- Spec-Sync ✅ Phase-4-Spec an Realität nach 4.5b/c angeglichen · §2/§3/§4.1/§5/§6/§7.3/§7.4/§7.5/§7.8/§9/§11 aktualisiert · Eyebrow "WATCHLIST" → "MÄRKTE"
- Slice 4.6 ✅ Wetter-Wochen-Bars (ECharts vertikale Floating-Bars) + Mondphase-SVG (Custom-SVG, mathematisch korrekt) auf /wetter · astronomieResolver um ist_zunehmend erweitert
- Slice 4.7 ✅ Macro-Timeline (Editorial-Liste) + Fear & Greed Gauge (Halbkreis-Tacho) auf /wirtschaft · 9 echte Macro-Events 14.5.-28.5.2026 · alternative.me-Fetcher mit 1h Cache
- Slice 4.8 ✅ Polish + Volltest + Phase-4-Abschluss (inkl. §7.7-Realitäts-Notiz + Cover-Stempel)

---

## ⏭️ Nächste konkrete Schritte

### Mario-TODO
- [x] **KALENDER_ICAL_URL** in Vercel Dashboard eingetragen · beide Projekte (mario-hq + mario-hq-qc6f) · /kalender zeigt Live-Termine
- [x] **TWELVE_DATA_API_KEY** in .env (lokal) + Vercel Dashboard eingetragen · bereit für Slice 4.3
- [x] **PHASE-4-SPEC** erstellt · `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md`
- [ ] **Vercel-Doppel-Projekt bereinigen** · zwei Projekte für dasselbe Repo entdeckt · eines löschen · kanonische URL klären · Vorsicht bei DNS/Custom-Domain
- [ ] **Vercel-Binance-Block diagnostizieren** · 4 Trading-Indikator-Cards zeigen Fallback auf Production · Bybit/OKX als Alternative evaluieren oder Edge-Function-Proxy
- [ ] **Glassnode-Subscription evaluieren** · On-Chain-Analytics Industrie-Standard · ~$39/Monat · Entscheidung wenn Slice 4.2 produktiv läuft und Nutzungs-Pattern bekannt
- [x] **Cover-Meta-Stempel** · CoverFooter.astro auf "Phase 4" aktualisiert (Slice 4.8)

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

**Vercel blockt Binance-API-Calls** *(entdeckt 13.5.2026)*

Auf `mario-hq-qc6f.vercel.app/wirtschaft` zeigen vier Trading-Indikator-Cards „FALLBACK · BINANCE OFFLINE":
- Funding Rates
- Open Interest
- Long/Short Ratio
- Coinbase Premium (nutzt Binance für Preis-Vergleich)

Lokal alles live. Stablecoin Supply (DeFiLlama) funktioniert auf Production korrekt. Wahrscheinlich Geo-/IP-Block von Binance gegen Vercel-Server-IPs oder rechtliche Compliance-Restriktion.

**Lösungsoptionen (für Mini-Reparatur-Slice):**
- Edge-Function-Proxy via Vercel · routet Calls über andere IPs
- Alternative API · Bybit oder OKX statt Binance · selbes Datenmodell · Free Public Endpoints
- Pragmatisch akzeptieren · /wirtschaft hauptsächlich lokal nutzen

**Vercel-Doppel-Projekt** *(entdeckt 13.5.2026)*

Zwei Vercel-Projekte deployen dasselbe GitHub-Repo:
- `mario-hq` → `mario-hq.vercel.app`
- `mario-hq-qc6f` → `mario-hq-qc6f.vercel.app` *(aktuelle Production-URL)*

ENV-Vars (KALENDER_ICAL_URL, TWELVE_DATA_API_KEY) mussten in beiden separat eingetragen werden. Aufräum-Task: eines löschen, das andere als kanonisch markieren. Vorsicht beim Löschen wegen möglicher Custom-Domain-Bindung.

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
