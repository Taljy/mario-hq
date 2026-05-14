---
typ: handover
projekt: mario-hq
erstellt: 26-05-14
zweck: Nahtloser Übergang in neue claude.ai-Session + neue Claude-Code-Session
gilt-bis: Slice 4.5b abgeschlossen · danach neues Handover
---

# Handover · Mario's HQ · Stand 14.5.2026 · nach Slice 4.5

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
- **Slice 4.5b ← NÄCHSTER SCHRITT** · Krypto-Card-Rebuild + Watchlist-IA neu (NICHT in der Spec, von Mario nach 4.5 gewünscht)
- Slice 4.6 Wetter-Wochen-Bars + Mondphase-SVG (Spec §7.6)
- Slice 4.7 Macro-Timeline + Fear & Greed Gauge (Spec §7.7)
- Slice 4.8 Polish + Volltest + Phase-Abschluss (Spec §7.8)

Commits Slice 4.5: feat `7b0322b` · docs `a193f50`

---

## 3 · Nächster Schritt · Slice 4.5b · Krypto-Card-Rebuild + Watchlist-IA neu

**Das ist KEIN Spec-Slice.** Mario hat nach Slice 4.5 entschieden, die
Informationsarchitektur von /wirtschaft umzubauen. Spec §7.6 (Wetter) wird DAHINTER
geschoben. Die Spec-Nummerierung bleibt, dieser Slice heisst 4.5b.

**Hintergrund:** Slice 4.5 hat die AktienSektion als Card-Layout gebracht (Symbol ·
Name · Preis · Delta · Tageshoch/-tief). Mario gefällt diese Card-Darstellung —
und sie ist der Watchlist-Zeilen-Optik aus Slice 4.4 überlegen. Konsequenz: Die
Card-Darstellung wird das Muster für die ganze /wirtschaft-Seite.

**Was Mario entschieden hat:**
1. **Aktien-Gruppe RAUS aus der Watchlist** — die AktienSektion aus 4.5 ist der
   eine Ort für Aktien. Aktuell sind Aktien doppelt auf der Seite (Watchlist-Gruppe
   "AKTIEN · US TECH" + AktienSektion) — das wird aufgelöst.
2. **Krypto kriegt dasselbe Card-Layout** wie die Aktien — weg von den kompakten
   Watchlist-Zeilen aus Slice 4.4, hin zu Cards.
3. **Zwei Krypto-Blöcke, neue Zusammensetzung:**
   - Block 1: BTC · ETH · SOL · XRP · SUI · TRX
   - Block 2: ADA · AVAX · HBAR · JUP · GST · DOT

**Offene strategische Frage — in der claude.ai-Session VOR dem GO-Prompt klären:**
Wenn Krypto UND Aktien beide als Card-Sektionen dargestellt werden — was bleibt
dann von der WatchlistSektion / WatchlistGruppe / WatchlistItem-Komponenten aus
Slice 4.4 überhaupt übrig? Möglich, dass die ganze Watchlist-Komponente obsolet
wird und /wirtschaft aus lauter Card-Sektionen besteht (KryptoSektion Block 1,
KryptoSektion Block 2, AktienSektion, ForexSektion). Dann ist 4.5b kein
"Aktien rausnehmen", sondern ein Teil-Rebuild der /wirtschaft-IA. Was bleibt,
was fliegt — Mini-Sparklines, Collapsible-Gruppen, der Watchlist-Apparat — muss
sauber durchgedacht werden, bevor das ein GO-Prompt wird.

**Daten-Vorarbeit nötig (gehört in den 4.5b-Plan):**
- `watchlist.json` muss umgebaut werden auf die neue Block-Struktur
- Neue/geänderte Coin-IDs brauchen CoinGecko-Verifikation:
  - TRX ist neu (war in keiner bisherigen Liste)
  - GST und JUP waren schon in der alten Spec als unsichere Schätzungen markiert
    (green-satoshi-token, jupiter-exchange-solana)
  - HBAR (hedera-hashgraph) prüfen
- Verifikation via `https://api.coingecko.com/api/v3/coins/list` — kostet keine
  besonderen Credits, sollte erster Teilschritt im Slice sein

---

## 4 · Kleinaufgaben (einschiebbar)

- **Cover-Phasen-Stempel** · auf der Cover-Page steht unten rechts noch
  "MARIO'S HQ · V0.1 · PHASE 2.2" — separates Layout-Meta-Element, nicht der
  globale Footer (der ist schon auf "Phase 4"). Trivialer Mini-Hygiene-Fix.
  In `_pendenzen.md` notiert.
- **Spec-Sync §7.4 + §7.5** · DRINGEND geworden. Die Phase-4-Spec beschreibt
  eine /wirtschaft-Realität, die es nicht mehr gibt: §7.4 redet vom alten
  TradingView-Schema ("Move2Earn"), §7.5 hat zwar einen Realitäts-Hinweis am
  Anfang (in 4.5 ergänzt), ist im Kern aber überholt — keine Commodities, keine
  Indizes-Daten, Endpoint-Architektur statt Page-Fetch. Mit dem 4.5b-Rebuild
  ändert sich die IA nochmal — sinnvoll, den Spec-Sync NACH 4.5b zu machen,
  wenn die neue IA steht, und dann §7.4/§7.5 in einem Rutsch an die Realität
  anzugleichen.

---

## 5 · Bekannte Production-Issues (nicht blockierend für Slice 4.5b)

### 5.1 · Vercel blockt Binance-API
Auf Production zeigen 4 Trading-Indikator-Cards "FALLBACK · BINANCE OFFLINE"
(Funding Rates, Open Interest, Long/Short Ratio, Coinbase Premium). Lokal
funktioniert alles. Geo-/IP-Block von Binance gegen Vercel-Server-IPs.
→ **Mini-Reparatur-Slice.** Lösungswege: Edge-Function-Proxy, alternative API
(Bybit/OKX), oder pragmatisch akzeptieren. Twelve Data und CoinGecko haben
keine Geo-Blocks.

### 5.2 · Vercel-Doppel-Projekt
Zwei Vercel-Projekte deployen dasselbe Repo: `mario-hq` und `mario-hq-qc6f`.
Jeder Push baut doppelt, ENV-Vars doppelt gepflegt. `mario-hq-qc6f` ist
kanonisch. **`qc6f` hat KEINE Custom Domain** (verifiziert 14.5.) — das
überzählige `mario-hq`-Projekt kann gefahrlos gelöscht werden.
→ **Mini-Hygiene-Slice.**

### 5.3 · Twelve Data Free Tier · harte Limits
Aus Slice 4.5: 8 Credits/min UND 800 Credits/Tag, je 1 Credit pro Symbol im
Bulk-Call. Hat die Endpoint-Architektur erzwungen (zwei getrennte API-Routes
mit geteiltem Edge-Cache + stale-while-revalidate). Indizes, Commodities,
SILVER/BRENT sind im Free Tier nicht verfügbar — bewusst weggelassen, nicht
behelfsmässig dargestellt.

---

## 6 · Mini-Slices die zwischendrin eingeschoben werden können

- **Mini-Reparatur · Vercel-Binance-Block** · diagnostizieren und lösen
- **Mini-Hygiene · Vercel-Doppel-Projekt** · `mario-hq` löschen (gefahrlos, keine
  Domain), `qc6f` als kanonisch bestätigen, Doku-URLs prüfen
- **Mini-Hygiene · Cover-Phasen-Stempel** · "PHASE 2.2" → "Phase 4"

**Empfehlung:** Slice 4.5b direkt — die Krypto-IA ist Marios aktueller Fokus.
Die Mini-Slices sind nicht blockierend. Der Doppel-Projekt-Slice ist sehr klein
und risikoarm — guter Aufwärmer bei niedriger Energie.

---

## 7 · Etablierte Arbeitsweise (bewährt über Phase 2.2-4.5)

- **Spec-First** · Plan-First · Slice-Pattern (feat-Commit + docs-Commit)
- **Foundation-First** · Pattern-Klon · Verifikation: Build grün → Light/Dark/Mobile → Console → Vercel HTTP 200
- **GO-Prompt-Stil:** claude.ai schreibt ausführliche strukturierte GO-Prompts,
  Mario kopiert sie in den Claude-Code-Chat
- **Plan-First bewährt sich stark:** In Slice 4.5 hat der API-Test-vor-Code-Schritt
  zwei strukturelle Probleme aufgedeckt (WTI/GOLD-Symbol-Konflikt, 8/min-Limit),
  bevor falscher Code entstand. Bei komplexen Slices mehrere Plan-Runden machen.
- **Stil-Treue:** Schweizer Hochdeutsch, du-Form, Em-Dash, Mittelpunkt, DRG-Tokens

**Stolpersteine die immer gelten:**
- Worktree-Falle · `cd /Users/mariomacstudio/Developer/mario-hq && ...` chainen
- Build-Test vor Push · Pflicht, auch bei Doc-Änderungen
- ENV-Vars: lokal in .env (gitignored) + beide Vercel-Projekte · Redeploy nötig
- TypeScript strict · keine any
- prerender = false auf api/-Routes (SSR, sonst Build-Zeit-statisch)
- Vercel-Edge-Cache greift NICHT in npm run dev — Cache-Verifikation immer auf
  Production
- Claude-Code-Preview-Browser kann nur localhost öffnen, keine Vercel-URLs —
  Production-Verifikation via curl/HTTP-Checks, nicht Preview-Rendering
- CoinGecko-Rate-Limit · Bulk-Call für alle Coin-IDs, nicht einzeln

---

## 8 · Spec-/Doku-Files im Repo

- `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` · aktuelle Phase · §7.4+§7.5 sind
  durch die Realität überholt (Spec-Sync nach 4.5b geplant)
- `docs/PHASE-2.2-COVER-SPEC.md` · abgeschlossen · Pattern-Vorbild
- `docs/PHASE-2.3-DETAIL-PAGES-SPEC.md` · abgeschlossen · Pattern-Vorbild
- `_pendenzen.md` · Roadmap, offene Fragen, Production-Issues
- `_projekt.md` · Architektur, Entscheidungen, Mario-Kontext
- `SESSION_LOG.md` · chronologisches Log · letzter Eintrag Slice 4.5

---

## 9 · Erster Schritt in der neuen Session

1. Neue claude.ai-Session: dieses Handover als ersten Input geben
2. claude.ai klärt mit Mario die offene strategische Frage aus §3: Was bleibt
   von der Watchlist-Komponente, wenn Krypto + Aktien Card-Sektionen werden?
   Wird die WatchlistSektion ersetzt oder umgebaut?
3. claude.ai baut daraus den GO-Prompt für Slice 4.5b — mit CoinGecko-ID-
   Verifikation (TRX, GST, JUP, HBAR) als erstem Teilschritt
4. Neue Claude-Code-Session öffnen · GO-Prompt rüberkopieren · Plan-First

**Empfehlung:** Slice 4.5b direkt. Das ist Marios aktueller Fokus und ändert
die /wirtschaft-IA — sollte vor den restlichen Phase-4-Slices (4.6/4.7) stehen.
