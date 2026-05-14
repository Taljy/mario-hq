---
typ: handover
projekt: mario-hq
erstellt: 26-05-14
zweck: Nahtloser Übergang in neue claude.ai-Session + neue Claude-Code-Session
gilt-bis: Spec-Sync §7.4/§7.5 abgeschlossen oder Slice 4.6 begonnen
---

# Handover · Mario's HQ · Stand 14.5.2026 · nach Slice 4.5c

> **Für die neue claude.ai-Session:** Dieses Dokument als ersten Input geben.
> Ausführliche Historie in `_pendenzen.md`, `_projekt.md`, `SESSION_LOG.md` und
> den Spec-Files im Repo.

---

## 1 · Was ist Mario's HQ

Editorial-Magazin als persönliches Cockpit. Astro v6 · TypeScript strict ·
Tailwind v4 · ECharts v6. DRG-Design-System (Fraunces / Inter / JetBrains Mono ·
Vermillon-Akzent ≤ 3 % · Sumi/Washi/Papier-Palette).

- **Repo:** github.com/Taljy/mario-hq (public)
- **Lokal:** ~/Developer/mario-hq
- **Production:** mario-hq-qc6f.vercel.app (kanonisch · siehe Doppel-Projekt-Issue)
- **Vision:** persönliches Cockpit · möglicher Open-Source-Boilerplate-Wert

Mario ist Architekturfotograf (Studio Da Rugna), Swing-Trader, Schweizer
Hochdeutsch, du-Form. Pragmatischer Maximalismus.

---

## 2 · Wo wir gerade stehen

**Phase 4** (Charts + Trading-Watchlist) · IN ARBEIT

Phase-4-Slice-Status:
- Slice 4.1 ✅ ECharts-Foundation + DRG-Theme + BTC-Sparkline
- Slice 4.2 ✅ Trading-Indikatoren-Block (lokal komplett · Production Binance-Fallback, siehe Issue)
- Slice 4.3 ✅ Multi-Anbieter-Watchlist-Foundation + Cleanup
- Slice 4.4 ✅ Watchlist-UI-Komponenten + Mini-Sparklines + Preis-Format-Fix
- Slice 4.5 ✅ Aktien + Forex-Sektion · Twelve-Data-Endpoint-Architektur
- Slice 4.5b ✅ Krypto-Card-Rebuild · gemeinsame AssetCard (NICHT Spec-Slice, IA-Umbau)
- Slice 4.5c ✅ Daten-Architektur-Cleanup · kryptoAggregator (NICHT Spec-Slice, interner Refactor)
- **Spec-Sync §7.4/§7.5 ← NÄCHSTER SCHRITT** · Phase-4-Spec an die /wirtschaft-Realität nach 4.5b/c angleichen (oder direkt 4.6, je nach Mario)
- Slice 4.6 Wetter-Wochen-Bars + Mondphase-SVG (Spec §7.6)
- Slice 4.7 Macro-Timeline + Fear & Greed Gauge (Spec §7.7)
- Slice 4.8 Polish + Volltest + Phase-Abschluss (Spec §7.8)

Commits Slice 4.5c: feat `458ad1a` · docs ausstehend (mit diesem Handover-Push)

---

## 3 · Nächster Schritt · Spec-Sync §7.4 und §7.5

**Reiner Doku-Slice. Kein Code-Change.** Die Phase-4-Spec
`docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` ist in zwei Bereichen durch die
Realität überholt:

### §7.4 · Slice 4.4 · Watchlist-Komponenten
- Beschreibt noch das alte TradingView-Schema mit "Move2Earn"-Gruppe und 16
  Crypto-Items
- Reale Implementation: zwei thematische Krypto-Blöcke aus 4.5b
  (Block 1: BTC/ETH/SOL/XRP/SUI/TRX · Block 2: ADA/AVAX/HBAR/JUP/GST/DOT)
- Komponenten-Namen sind nicht mehr WatchlistSektion/WatchlistGruppe/WatchlistItem
  sondern KryptoSektion/KryptoGruppe + AssetCard

### §7.5 · Slice 4.5 · Aktien + Forex/Commodities-Sektion
- Hat in 4.5 bereits einen Realitäts-Hinweis am Anfang bekommen
- Im Kern aber noch von vor dem API-Test: spricht von Indices-Fallback A/B
  (entschieden: B = weglassen), WTI als Tabellen-Eintrag (entschieden: alle
  Commodities raus), Page-Fetch (entschieden: zwei eigene API-Endpoints mit
  Edge-Cache)
- Layout-Beschreibung "4 Cards in 2x2-Grid oder 4er-Strip" ist überholt:
  reale Implementation = 6 Cards in 3×2-Grid via gemeinsame AssetCard

### Was der Spec-Sync konkret tut
- §7.4 vollständig neu schreiben — die alten TradingView-Listen raus, die
  reale 4.5b-Block-Struktur beschreiben, gemeinsame AssetCard erwähnen
- §7.5 ebenfalls neu schreiben — Endpoint-Architektur dokumentieren, harte
  8/min-Credits-Limit-Realität, Commodities-Leer-Zustand, AssetCard-Pattern
- §6 Implementations-Reihenfolge: 4.5b/4.5c-Eintrag in der Tabelle ist schon
  drin, ggf. präzisieren
- Phase 4 ist intern-konsistent danach: Spec beschreibt das, was real existiert

### Umfang
Geschätzt 30-60min — reines Editieren in einer Datei, kein Code-Touch,
kein Build-Risiko. Kann auch als kurzer docs-Commit direkt mit Slice 4.6
verbunden werden, wenn Mario das einfach mitnehmen will.

---

## 4 · Alternativ-Pfad · Slice 4.6 direkt

Wenn Mario lieber wieder sichtbare Arbeit will: Slice 4.6 (Wetter-Wochen-Bars
+ Mondphase-SVG auf /wetter) ist der nächste Spec-Slice. Spec §7.6 beschreibt
das Vorhaben sauber, dort gibt es keine Realitäts-Lücke wie auf /wirtschaft.

**Empfehlung:** Spec-Sync zuerst (1 Stunde Doku, schliesst /wirtschaft sauber
ab, dann ist Phase 4 ab Slice 4.6 wieder Spec-konform), dann 4.6.

---

## 5 · Kleinaufgaben (einschiebbar)

- **Cover-Phasen-Stempel** · auf der Cover-Page steht unten rechts noch
  "MARIO'S HQ · V0.1 · PHASE 2.2" — separates Layout-Meta-Element, nicht der
  globale Footer. Trivialer Mini-Hygiene-Fix.

---

## 6 · Bekannte Production-Issues (nicht blockierend)

### 6.1 · Vercel blockt Binance-API
Auf Production zeigen 4 Trading-Indikator-Cards "FALLBACK · BINANCE OFFLINE".
Lokal funktioniert alles. Geo-/IP-Block von Binance gegen Vercel-Server-IPs.
→ **Mini-Reparatur-Slice.** Lösungswege: Edge-Function-Proxy, alternative API
(Bybit/OKX), oder pragmatisch akzeptieren.

### 6.2 · Vercel-Doppel-Projekt
`mario-hq` (ohne Custom Domain) kann gefahrlos gelöscht werden, `qc6f` ist
kanonisch. → **Mini-Hygiene-Slice.**

### 6.3 · Twelve Data Free Tier · harte Limits
Aus Slice 4.5: 8 Credits/min UND 800 Credits/Tag. Hat die Endpoint-
Architektur erzwungen (zwei API-Routes mit Edge-Cache + SWR).

### 6.4 · CoinGecko-Rate-Limit
Free Tier ~10-30 Calls/min. Bei intensiven API-Tests (z.B. wie in 4.5b/c-
Verifikation heute) kann CoinGecko temporär 429 zurückgeben → Krypto-Cards
zeigen "—". Defensive Logik im neuen `kryptoAggregator` greift sauber. Limit
resettet pro Minute.

---

## 7 · Mini-Slices die zwischendrin eingeschoben werden können

- **Mini-Reparatur · Vercel-Binance-Block**
- **Mini-Hygiene · Vercel-Doppel-Projekt löschen**
- **Mini-Hygiene · Cover-Phasen-Stempel** "PHASE 2.2" → "Phase 4"

---

## 8 · Etablierte Arbeitsweise (bewährt über Phase 2.2-4.5c)

- **Spec-First** · Plan-First · Slice-Pattern (feat-Commit + docs-Commit)
- **Slice-Aufteilung sichtbar/unsichtbar:** Bewährt in 4.5b/4.5c — sichtbarer
  Rebuild zuerst, dann interner Refactor. Verifikation des Refactors ist
  spezifisch: "vorher = nachher, Build grün, grep sauber".
- **Plan-First mehrfach bewährt:** API-Test vor Code in 4.5, Promise-Pfad-
  Prüfung vor Direct-Await in 4.5c.
- **GO-Prompt-Stil:** claude.ai schreibt ausführliche strukturierte GO-Prompts,
  Mario kopiert sie in den Claude-Code-Chat
- **Stil-Treue:** Schweizer Hochdeutsch, du-Form, Em-Dash, Mittelpunkt, DRG-Tokens

**Stolpersteine die immer gelten:**
- Worktree-Falle · `cd /Users/mariomacstudio/Developer/mario-hq && ...` chainen
- Build-Test vor Push · Pflicht, auch bei Doc-Änderungen
- ENV-Vars: lokal in .env (gitignored) + beide Vercel-Projekte · Redeploy nötig
- TypeScript strict · keine any
- prerender = false auf api/-Routes
- Vercel-Edge-Cache greift NICHT in npm run dev — Cache-Verifikation auf Production
- Claude-Code-Preview-Browser kann nur localhost öffnen, keine Vercel-URLs —
  Production-Verifikation via curl/HTTP-Checks
- CoinGecko-Rate-Limit · Bulk-Call für alle Coin-IDs, nicht einzeln
- Vite-HMR-Cache-Bug nach `git mv`: Dev-Server neu starten (Production-Build sauber)
- Refactor-Slices NUR mit "vorher = nachher"-Mentalität: kein Logik-Drift einschleichen

---

## 9 · Spec-/Doku-Files im Repo

- `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` · aktuelle Phase · §7.4+§7.5
  durch Realität überholt (Spec-Sync ist der nächste empfohlene Schritt)
- `docs/PHASE-2.2-COVER-SPEC.md` · abgeschlossen · Pattern-Vorbild
- `docs/PHASE-2.3-DETAIL-PAGES-SPEC.md` · abgeschlossen · Pattern-Vorbild
- `_pendenzen.md` · Roadmap, offene Fragen, Production-Issues
- `_projekt.md` · Architektur, Entscheidungen, Mario-Kontext
- `SESSION_LOG.md` · chronologisches Log · letzter Eintrag Slice 4.5c (Update 28)

---

## 10 · Erster Schritt in der neuen Session

**Falls Spec-Sync gewählt:**
1. claude.ai liest §7.4 und §7.5 + aktuelle Komponenten + SESSION_LOG 4.5b/c
2. Schreibt neuen §7.4 (Krypto-Block-Struktur, AssetCard) und neuen §7.5
   (Endpoint-Architektur, Commodities raus, AssetCard-Konsistenz) als
   docs-Patch
3. Mario reviewed und commited

**Falls Slice 4.6 direkt gewählt:**
1. claude.ai liest §7.6 und checkt /wetter-Daten (Open-Meteo, suncalc)
2. Baut GO-Prompt für 4.6 · Wetter-Wochen-Bars + Mondphase-SVG
3. Plan-First in Claude Code
