---
typ: handover
projekt: mario-hq
erstellt: 26-05-14
zweck: Nahtloser Übergang in neue claude.ai-Session + neue Claude-Code-Session
gilt-bis: Slice 4.5 abgeschlossen · danach neues Handover
ersetzt: HANDOVER-2026-05-14.md (Slice-4.4-Handover)
---

# Handover · Mario's HQ · Stand 14.5.2026 · nach Slice 4.4

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
- Slice 4.4 ✅ Watchlist-UI-Komponenten auf /wirtschaft · inkl. Mini-Sparklines · Preis-Format-Fix
- **Slice 4.5 ← NÄCHSTER SCHRITT** · Aktien + Forex/Commodities-Sektion
- Slice 4.6 Wetter-Wochen-Bars + Mondphase-SVG
- Slice 4.7 Macro-Timeline + Fear & Greed Gauge
- Slice 4.8 Polish + Volltest + Phase-Abschluss

Commits Slice 4.4: feat `9135f8e` · docs `576939d` · fix `58cff3a`

---

## 3 · Nächster Schritt · Slice 4.5

**Aktien-Sektion + Forex/Commodities-Sektion auf /wirtschaft.**
Detail-Spezifikation in `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` §7.5.

Foundation steht: `twelveDataFetcher.ts`, `watchlistAggregator.ts`, `watchlist.json`
(6 Gruppen, 28 Items) sind aus 4.3/4.4 da. Die Twelve-Data-Items werden in der
Watchlist aus 4.4 bereits gerendert — aber die meisten stehen auf `ist_live: false`.

**KRITISCH vor Implementation — Twelve-Data-Free-Tier-Test (Spec §7.5):**
Slice 4.5 MUSS mit dem echten API-Key testen, was der Free Tier liefert,
BEVOR Code gebaut wird. Bekannter Stand aus 4.3-Test:
- Aktien (AAPL, NVDA, TSLA, MSFT, AMZN, META) · Forex (EUR/USD, CHF/USD, GBP/USD, EUR/CHF) → ✅ live
- Indizes (SPX, NDX, DAX, SMI) → ❌ nicht im Free Tier
- BRENT (XBR/USD) → ❌ nicht im Free Tier
- WTI → liefert $4.40 statt ~$60 · falsches Symbol oder Einheit · MUSS in 4.5 untersucht werden

**Indizes-Entscheidung (Spec §7.5, Mario-Entscheidung nötig):**
Wenn der Test bestätigt, dass Indizes/BRENT fehlen → Fallback wählen:
- A: Alpha Vantage (25 Calls/Tag, eigene ENV-Var, nur für die 4 Indizes)
- B: Indizes weglassen, nur Einzelaktien + Forex tracken
→ Diese Entscheidung in der neuen claude.ai-Session mit Mario klären, bevor
  der GO-Prompt geschrieben wird.

---

## 4 · Offene Punkte für Slice 4.5 (klären in der Strategie-Session)

1. **WTI-Symbol-Bug** · liefert $4.40 statt ~$60 · Symbol-/Einheiten-Problem ·
   Claude Code soll als ersten Teilschritt einen API-Test-Call machen und das
   richtige Symbol/Format finden.
2. **Indizes-Fallback A oder B** · siehe oben · Mario-Entscheidung vor GO-Prompt.
3. **Mini-Sparklines bei Twelve-Data-Items** · Free Tier liefert keine brauchbare
   History · in 4.4 bewusst nur Crypto-Items mit Sparkline · bei 4.5 bleiben
   Aktien/Forex/Commodities ohne Sparkline (Spec §9 Punkt 3).
4. **Doppel-Anzeige Indizes** · /wirtschaft hat aktuell sowohl die alten Indizes-
   Cards (SMI/DAX/S&P/NASDAQ aus Slice 2.3.2, statische Platzhalter-Werte) ALS
   AUCH die Indizes-Gruppe in der neuen Watchlist. Klären: alte Cards ersetzen,
   behalten, oder zusammenführen? Gehört in den 4.5-Scope.

---

## 5 · Kleinaufgaben (in Slice 4.5 oder separat einschiebbar)

- **Footer-Phasen-Label** · /wirtschaft-Footer zeigt noch "Phase 2.3" · sollte
  "Phase 4" sein · Quelle vermutlich Magazine-Layout oder eine Config-Konstante ·
  trivialer Fix, kann in den 4.5-fix-Commit oder als eigener Mini-docs-Fix.
- **Spec-Sync §4.1/§7.4** · die Phase-4-Spec beschreibt noch das alte TradingView-
  Schema ("Move2Earn"-Gruppe, Coin-ID-Verifikation) · die echte watchlist.json ist
  die generische 28-Item-Liste · §4.1 hat schon einen Vermerk, §7.4 noch nicht
  vollständig · Spec an den realen Stand angleichen.

---

## 6 · Bekannte Production-Issues (nicht blockierend für Slice 4.5)

### 6.1 · Vercel blockt Binance-API
Auf Production zeigen 4 Trading-Indikator-Cards "FALLBACK · BINANCE OFFLINE"
(Funding Rates, Open Interest, Long/Short Ratio, Coinbase Premium). Lokal
funktioniert alles. Geo-/IP-Block von Binance gegen Vercel-Server-IPs.
→ **Mini-Reparatur-Slice.** Lösungswege: Edge-Function-Proxy, alternative API
(Bybit/OKX), oder pragmatisch akzeptieren. Slice 4.5 ist NICHT betroffen ·
Twelve Data hat keine Geo-Blocks.

### 6.2 · Vercel-Doppel-Projekt
Zwei Vercel-Projekte deployen dasselbe Repo: `mario-hq` und `mario-hq-qc6f`.
Jeder Push baut doppelt, ENV-Vars doppelt gepflegt. `mario-hq-qc6f` ist
kanonisch. **Gute Nachricht:** `qc6f` hat KEINE Custom Domain dran (verifiziert
im Vercel-Dashboard 14.5.) · das überzählige `mario-hq`-Projekt kann gefahrlos
gelöscht werden, es hängt keine Domain dran. → **Mini-Hygiene-Slice.**

### 6.3 · Twelve Data Free Tier · Indices + Commodities limitiert
Siehe §3 · wird in Slice 4.5 direkt adressiert.

---

## 7 · Mini-Slices die zwischendrin eingeschoben werden können

Unabhängig von der Slice-Reihenfolge:
- **Mini-Reparatur · Vercel-Binance-Block** · diagnostizieren und lösen
- **Mini-Hygiene · Vercel-Doppel-Projekt** · `mario-hq` löschen (gefahrlos, keine
  Domain), `qc6f` als kanonisch bestätigen, Doku-URLs prüfen

**Empfehlung:** Slice 4.5 direkt · die Mini-Slices sind nicht blockierend.
Der Doppel-Projekt-Slice ist sehr klein und risikoarm geworden — kann gut als
Aufwärmer vor 4.5 dienen, wenn Mario niedrige Energie hat.

---

## 8 · Etablierte Arbeitsweise (bewährt über Phase 2.2-4.4)

- **Spec-First** · Plan-First · Slice-Pattern (feat-Commit + docs-Commit)
- **Foundation-First** · Pattern-Klon · Verifikation: Build grün → Light/Dark/Mobile → Console → Vercel HTTP 200
- **GO-Prompt-Stil:** claude.ai schreibt ausführliche strukturierte GO-Prompts,
  Mario kopiert sie in den Claude-Code-Chat
- **Plan-First bewährt sich:** Bei Slice 4.4 hat der Plan-First-Schritt die
  Spec-vs-Datei-Diskrepanz korrekt abgefangen, bevor falscher Code entstand
- **Stil-Treue:** Schweizer Hochdeutsch, du-Form, Em-Dash, Mittelpunkt, DRG-Tokens

**Stolpersteine die immer gelten:**
- Worktree-Falle · `cd /Users/mariomacstudio/Developer/mario-hq && ...` chainen
- Build-Test vor Push · Pflicht
- ENV-Vars: lokal in .env (gitignored) + beide Vercel-Projekte · Redeploy nötig
- TypeScript strict · keine any
- Twelve-Data-Symbol-Format · Aktien plain (TSLA), Forex Slash (EUR/USD),
  Commodities Code (WTI, BRENT) · MUSS pro Symbol verifiziert werden (siehe WTI-Bug)
- API-Key server-side only via `import.meta.env` · nie im Frontend-Bundle

---

## 9 · Spec-/Doku-Files im Repo

- `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` · aktuelle Phase · §7.5 ist Slice 4.5
- `docs/PHASE-2.2-COVER-SPEC.md` · abgeschlossen · Pattern-Vorbild
- `docs/PHASE-2.3-DETAIL-PAGES-SPEC.md` · abgeschlossen · Pattern-Vorbild
- `_pendenzen.md` · Roadmap, offene Fragen, Production-Issues
- `_projekt.md` · Architektur, Entscheidungen, Mario-Kontext
- `SESSION_LOG.md` · chronologisches Log · letzter Eintrag Update 25 + Fix-Nachtrag

---

## 10 · Erster Schritt in der neuen Session

1. Neue claude.ai-Session: dieses Handover als ersten Input geben
2. claude.ai klärt mit Mario: Indizes-Fallback A oder B · Doppel-Anzeige-Indizes
3. claude.ai liest `PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` §7.5 und baut den GO-Prompt
4. Neue Claude-Code-Session öffnen · GO-Prompt rüberkopieren
5. Claude Code macht als ersten Teilschritt den Twelve-Data-API-Test (Aktien,
   Forex, Indizes, WTI-Symbol) und zeigt Plan-First

**Empfehlung:** Slice 4.5 direkt. Optional vorher der Doppel-Projekt-Mini-Slice
als risikoarmer Aufwärmer.
