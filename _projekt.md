---
type: projektbeschrieb
projekt: mario-hq
owner: Mario
erstellt: 26-05-12
aktualisiert: 26-05-13
status: Phase 2.3 ✅ → Phase 4 geplant
zweck: Einstiegs-Dokument für jeden neuen Chat — Vision, Stand, Architektur
---

# Mario's HQ · Projektbeschrieb

> **Für Claude in einem neuen Chat:** Lies dieses File zuerst. Dann `_pendenzen.md` für den aktuellen Stand und `SESSION_LOG.md` für die jüngste Historie. SKILL.md ist die Pflicht-Lektüre für Claude Code.

---

## 1. Vision

**Mario's HQ** ist Marios persönliches Cockpit als Magazin-Website — sein zentrales Anlauf-Tool im Alltag. Es konsolidiert Informationen aus vielen Apps in einer eigenständigen, brandkohärenten Oberfläche, die er auf Desktop und iPad öffnet.

**Kernprodukt heute:** Tägliches Morgenbriefing — der morgendliche Einstieg mit Wirtschaft, Wetter, Foto-Chancen, Kalender, News.

**Langfristige Vision — siehe Nordstern in `_pendenzen.md`:** Erweiterung um Habits, Workout, Zeiterfassung, Foto-Pipeline, Finanz-Dashboard. Jedes Modul wird als eigene Phase ausgebaut. **Scope-Disziplin:** keine Vision blockiert das MVP.

**Grundprinzip — Read-First, kein Sync-Stress:** Das HQ **zeigt** Informationen aus Quell-Systemen an, **bearbeitet** sie nicht. Beispiel: Termine kommen aus Google Calendar (read-only Anzeige), bearbeitet werden sie im Kalender selbst. So vermeiden wir die Sync-Hölle, die viele All-in-One-Tools scheitern lässt.

---

## 2. Aufgaben-Architektur — 4-Typen-Trennung

Mario hat aktiv entschieden, **nicht alle Aufgaben an einem Ort zu konsolidieren**. Stattdessen klare Trennung nach Aufgaben-Typ:

| Aufgaben-Typ | Quell-System | Beispiel |
|---|---|---|
| **Termingebundene Aufgaben** (Datum/Uhrzeit) | Apple/Google Calendar | „Zahnarzt Mi 13:00" |
| **Projektbezogene Tasks** (Code, HQ-Aufbau) | `_pendenzen.md` im jeweiligen Repo | „Phase 2 · Dark-Mode-Toggle einbauen" |
| **Tagesnotizen / fliegende Ideen** | Obsidian (Second_Brain) | „Idee: Foto-Spot Kloster Wettingen" |
| **Wiederkehrende Habits** | Streaks-App (extern) | Sport, Meditation, Lesen |

**Das HQ zeigt sie nur an** — bearbeitet werden sie am Quell-Ort.

---

## 3. Tech-Stack

| Schicht | Wahl | Begründung |
|---|---|---|
| Framework | **Astro v6** | Content-fokussiert, Markdown-nativ, echtes Multi-Page-Routing, Vite 7 |
| Sprache | **TypeScript** | Konsistent zu DREK-Projekten, strict |
| Styling | **Tailwind v4** | Mit `@theme`-Tokens, kein `tailwind.config.js` |
| Charts | **Apache ECharts** | Editorial-Optik, Finanz-native |
| Daten | **Markdown-Collections + JSON** | Astro Content Collections für Briefings, JSON für strukturierte Daten |
| Package Manager | **npm** | Konsistent zu DREK |
| Hosting | **Vercel** | Konsistent zu DREK · Auto-Deploy on push to main |
| Repo-Host | **GitHub · Taljy · Public** | |

**Nicht** verwendet (bewusst): React, shadcn/ui — Astro reicht.

---

## 4. Visuelle Identität — Studio Da Rugna

Mario's HQ übernimmt die **visuelle Sprache von Studio Da Rugna** (Marios Architekturfotografie-Studio). Bewusste Marken-Kohärenz. Es ist aber **kein DRG-Kunden-Touchpoint**, sondern privates Tool. Daher: Tokens strikt, Regeln pragmatisch.

### Farben

- **Page:** Washi `#FAFAF7` (warm-weiss, japanisch inspiriert) · Light Mode default
- **Cards:** Papier `#E8E6E1` · Inset `#F2F0EB`
- **Text:** Sumi-900 `#1A1A1A` für Haupttext · Tinte-Stufen für Hierarchie
- **Akzent:** Vermillon `#E34234` — **Signaturfarbe, max 3% Flächenanteil**. Nur CTAs, Krypto-Negativ, gezielte Hervorhebungen.
- **Dark Mode:** mitgenommen.

### Schriften

- **Display:** **Fraunces** — variable opsz/wght, Light für grosse Display, Regular für H1/H2
- **Body:** **Inter** — variable wght, kühl und datenfähig
- **Mono:** **JetBrains Mono** — für Daten, Code, Zahlen-Strips

### Hard Rules (DRG-Erbe)

1. Vermillon ≤ 3 % Flächenanteil
2. Editorial-warm everywhere — kein Tech-Bro-Dashboard
3. No marketing fluff — Schweizer Klarheit
4. No bouncy animations

### Briefing-Ausnahme

Emojis sind **im Briefing-Output erlaubt** (📅🌤️🪙 etc.) — privates Tool, keine Kunden-Sicht. Im UI-Chrome (Buttons, Navigation, Form-Labels) trotzdem keine Emojis.

---

## 5. Modul-Architektur

```
Mario's HQ
│
├── 📰 MORGENBRIEFING (Kern-Modul, Phase 2 produktionsreif)
│   ├── /          Cover · Tagesübersicht mit allen Block-Snippets
│   ├── /wirtschaft  Krypto + Macro + Wirtschafts-News (HAUPTMODUL)
│   ├── /wetter     Wetter + Foto-Chancen + Astronomie (HAUPTMODUL)
│   ├── /news       Tech · Foto · Architektur · Politik (regional/global)
│   ├── /kalender   Read-Only aus Google Calendar
│   └── /archiv     Alte Briefings durchsuchen
│
├── 🏃 HABITS (Platzhalter Phase 2 · Ausbau Phase 7+)
├── 💪 WORKOUT (Platzhalter Phase 2 · Ausbau Phase 7+)
├── ⏱️ ZEIT (Platzhalter Phase 2 · Ausbau Phase 7+)
├── 🎯 PROJEKTE (Platzhalter Phase 2 · Ausbau Phase 7+)
└── 📆 VOLL-KALENDER (Post-MVP · Google-Sync bidirektional · Akiflow/Routine-inspiriert)
```

**Bewusst draussen** (vielleicht für immer):
- Essen/Gesundheit — App tut's
- Shopping — Apps tun's
- Ziele/Planung — gehört in Obsidian, nicht in tägliches Cockpit
- Lesen/Lernen — gehört in Obsidian

---

## 6. Daten-Architektur

```
┌─────────────────────────────────────────────────────────┐
│  Quell-Systeme (read-only zugegriffen)                  │
│  Google Calendar · Streaks-App · Bitvavo · Web-Search   │
└────────────────────────┬────────────────────────────────┘
                         ↓ via Live-APIs zum Page-Load
┌─────────────────────────────────────────────────────────┐
│  Live-APIs                                              │
│  CoinGecko · Open-Meteo · iCal · Twelve Data (4.3+)    │
└────────────────────────┬────────────────────────────────┘
                         ↓ SSR oder Build
┌─────────────────────────────────────────────────────────┐
│  Daten im Repo (manuell gepflegt)                       │
│  src/data/*.json · sources.json · foto-spots.json       │
└────────────────────────┬────────────────────────────────┘
                         ↓ Build / SSR via Vercel
┌─────────────────────────────────────────────────────────┐
│  Astro Website — Mario's HQ                             │
│  Multi-Page · SSR-Hybrid · Charts inline (ECharts)      │
└────────────────────────┬────────────────────────────────┘
                         ↓ Push to GitHub
┌─────────────────────────────────────────────────────────┐
│  Vercel · Auto-Deploy                                   │
│  Production-URL: mario-hq-qc6f.vercel.app               │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Wichtige Entscheidungen

| Entscheidung | Datum | Begründung |
|---|---|---|
| Niveau 3 (Astro + Hosting) statt Magazin-App | 12.5. | Mario will lernen — langfristig richtig |
| Vercel als Hoster | 12.5. | Konsistent zu DREK · Auto-Deploy via Push |
| Studio-Da-Rugna-Visual-Identität | 12.5. | Brand-Kohärenz · DRG-System fertig durchdacht |
| Inter statt Newsreader als Body-Font | 12.5. | Folgt DRG-Pairing · kühler, datenfähiger |
| Vermillon als einziger Akzent | 12.5. | DRG-Signatur · max 3 % Fläche |
| Dark Mode mitnehmen | 12.5. | DRG hat ihn fertig · Abend-Sessions sinnvoll |
| Emojis im Briefing erlaubt | 12.5. | Privates Tool · keine Kunden-Sicht |
| Astro v6 (statt v5) | 12.5. | Stable seit März 2026 · Vite 7 · Zod 4 |
| **Projekt-Pivot zu „Mario's HQ"** | **12.5.** | **Briefing ist Modul, nicht Endzweck · Life-Cockpit-Vision** |
| **4-Typen-Aufgaben-Trennung** | **12.5.** | **Read-First-Prinzip · keine Sync-Hölle** |
| **Phase 2 = Wirtschaft + Wetter/Foto parallel** | **12.5.** | **Beide Hauptmodule produktionsreif vor weiterem Ausbau** |
| Content Collections für Briefings | 12.5. | Astro-natives Pattern · Markdown lebt parallel im Obsidian-Vault |
| Multi-Page statt Single-Page | 12.5. | Magazin-Gefühl · echte URLs · Browser-Vor/Zurück |
| ECharts statt Chart.js | 12.5. | Finanz-native, schickeres Editorial-Look |
| Voll-Kalender als eigenes Post-MVP-Modul | 13.5. | Bidirektionaler Google-Sync zu komplex für Briefing-MVP · Akiflow/Routine als visuelle Referenz · Reihenfolge innerhalb Post-MVP offen |
| **Phase-2.3-Konsolidierung (Detail-Pages Slim)** | **13.5.** | **4 Sub-Phasen (2.3/2.4/2.5/2.6) zu einer Phase zusammengefasst** — Site-First-Tiefe-Later-Prinzip · alle 4 Detail-Pages slim produktionsreif statt eine tief ausgebaut |
| **Vercel-Adapter SSR-Hybrid-Mode** | **13.5.** | **`output: 'static'` + `@astrojs/vercel` + per-page `prerender=false`** — SSR nur wo Live-APIs nötig (/wirtschaft · /wetter · /kalender) · SSG für statische Pages (/news u.a.) |
| **iCal-Geheim-URL als Wegwerf-Brücke für /kalender** | **13.5.** | **Google-Calendar-iCal ohne OAuth** — pragmatisch für Phase 2.3 · URL als server-only ENV-Var · vollständige OAuth-Implementierung verschiebt sich auf Phase 8 (Voll-Kalender) |
| **Cowork-Verzicht · Phase 5 gestrichen** | **13.5.** | **Live-APIs + manuelle JSON-Pflege reichen** · Briefing-Bereitschaft via Page-Load-Fetches · Architektur-Vereinfachung · Open-Source-Boilerplate-Wert steigt |
| Phase 3 als wenn-dann-Aufschub | 13.5. | Content-Collections ohne Inhalt machen keinen Sinn · entsteht wenn Habits/Notizen-Tracking oder Archiv-Bedarf konkret |
| **Phase 4 erweitert · Charts + Trading-Watchlist** | **13.5.** | **Editorial-Charts und Trading-Indikatoren plus Multi-Asset-Watchlist** alles auf /wirtschaft · 8 Slices |
| ECharts als Chart-Library | 13.5. | Industrie-Standard für Finanz-Charts · DRG-Theme-Customization Pflicht für Editorial-Look · Dashboard-Default vermeiden |
| Twelve Data für Aktien/Forex/Commodities | 13.5. | Free Tier 800 Calls/Tag · ein API-Key für alles · Indices möglicherweise im Free Tier limitiert · Fallback in Slice 4.5 klären |

---

## 8. Pfade & URLs

| Was | Wo |
|---|---|
| Code-Repo lokal | `~/Developer/mario-hq/` |
| GitHub-Repo | `https://github.com/Taljy/mario-hq` |
| Dev-Server | `http://localhost:4321` (oder 4322/4323 wenn belegt) |
| Production | `https://mario-hq-qc6f.vercel.app` |
| Obsidian-Vault | `~/Second_Brain/` |
| Briefing-Daten im Repo | `src/content/briefings/JJJJ-MM-TT.md` |
| DRG-Design-System (Referenz) | claude.ai/design · Studio Da Rugna Design System |

---

## 9. Briefing-Struktur (sieben Blöcke)

Diese Reihenfolge ist etabliert und stabil — sie ist der etablierte Briefing-Vertrag:

1. 📅 **Heute in der Geschichte** — ein prägnanter Satz
2. 🌤️ **Wetter Baden AG** — Temp, Wind, Sonne, Goldene + Blaue Stunde
3. 📷 **Fotografie** — nur wenn besonders · 🔭 Astronomie als Unter-Section · **unter Wetter angesiedelt**
4. 🗓️ **Kalender** — Heute + Morgen detailliert, Rest der Woche kompakt
5. 📅 **Wochenvorschau** — Wetter-Trend + Highlights + Astronomie
6. 🪙 **Krypto** — BTC analytisch, Fear & Greed, Altcoins (ETH/SOL/XRP/SUI), News
7. 📊 **Macro-Kalender** — Today-Hero + Wochen-Liste + Portfolio-Implikation

**Portfolio-Coins:** BTC, ETH, SOL, XRP, SUI
**Standort:** Baden AG, Schweiz · **Zeitzone:** Europe/Zurich · **Sprache:** Deutsch (Schweizer Hochdeutsch)

---

## 10. Kontext über Mario (für Claude-Instanzen)

- **Geräte:** Mac Studio (`mariomacstudio`) + iPad · arbeitet von beiden
- **Vault liegt lokal** unter `~/Second_Brain/`, NICHT in iCloud/Drive
- **Tradet aktiv** (Bitvavo) · Bitcoin-Skeptiker zur Geldpolitik, aber Pragmatiker im Trading
- **Studio Darugna** als Business · Architekturfotografie · Designsystem-Owner (DRG)
- **DREK-Welt** als Web-Projekt-Familie (`drek-home`, `bikes-martina`, `mtb-build`)
- **Ton:** Freundlich-direkt, Schweizer Hochdeutsch okay, **keine Floskeln**
- **Reflektiert ehrlich** was funktioniert und was nicht → konstruktive Kritik kommt gut an
- **Foto-affines Auge:** DRG-Look ist sein eigenes — kennt jede Token-Entscheidung
- **Lernend, nicht Pro-Dev:** baut sein erstes echtes Web-Projekt · braucht erklärende Antworten, nicht nur Code
- **Reibungsfrei-Fokus:** „Mir ist extrem wichtig, dass ich ein System habe das reibungslos funktioniert"
- **Swing-Trader (aktuell)** — tradet aktiv aber zeitlich entspannter · nicht Daytrader · 1H- bis Tages-Setups
- **Pragmatischer Maximalismus** — lieber zu viele Tools jetzt · später ausbauen wenn ungenutzt
- **06:00 CEST Briefing-Bereitschaft** — Hard-Anforderung · HQ muss morgens orientiert sein

---

## 11. Aktuelle Tool-Landschaft (Stand 12.5.2026)

Wichtig für Verständnis welche Apps konsolidiert werden sollen und welche extern bleiben.

| Bereich | Aktuell | HQ-Plan |
|---|---|---|
| Kalender | Apple Calendar + Google Calendar | **Read-Only-Anzeige im HQ** · Bearbeitung extern |
| Notizen | Obsidian (Second_Brain) | **Bleibt extern** · evtl. Read-Bridge |
| Tasks (Projekt) | `_pendenzen.md` | **Bleibt im Repo** · zentrales Tool |
| Tasks (Termin) | im Kalender | **Read-Only-Anzeige im HQ** |
| Zeiterfassung | Session-App + Notion | **Platzhalter** Phase 2 · Ausbau Phase 7+ |
| Workout | Notion-Tracker | **Platzhalter** Phase 2 · Ausbau Phase 7+ |
| Habits | Streaks-App | **Bleibt extern**, ausgewählte Habits gespiegelt |
| Trading | Bitvavo | **Bleibt extern** · Daten-Anzeige im HQ |
| News | RSS-Feeds, Browser-Bookmarks | **Konsolidiert im /news-Tab** |

---

## 12. Wie ein neuer Chat einsteigt

**Drei Wege je nach Zweck:**

### Konzeptarbeit / Strategie (claude.ai Web-Chat)
Im Projekt „Morgenbriefing" neuen Chat öffnen, dieses File und `_pendenzen.md` anhängen, schreiben:
> *„Lies _projekt.md und _pendenzen.md. Lass uns an Phase X weiterarbeiten."*

### Konkretes Coding (Claude Code im Repo)
```bash
cd ~/Developer/mario-hq
claude
```
Claude Code liest automatisch `SKILL.md` aus dem Repo-Root und kennt damit alle Konventionen inkl. DRG-Tokens.

---

*Bei jeder grösseren Änderung an Vision, Stack, Visual-Identität oder Architektur: dieses File aktualisieren.*
