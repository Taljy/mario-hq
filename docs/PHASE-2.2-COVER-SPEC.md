---
type: phasenspezifikation
projekt: mario-hq
phase: 2.2
erstellt: 26-05-13
aktualisiert: 26-05-13
status: Spezifikation steht · Implementierung in Slices · 2.2.1 als nächster Slice
referenz: Strategie-Chat 13.5.2026 (claude.ai Web)
---

# Phase 2.2 · Cover-Page Spezifikation

> **Für Claude Code in einer neuen Session:** Dieses File ist self-contained. Alle Entscheidungen aus dem Strategie-Chat sind hier festgehalten. SKILL.md gilt parallel für DRG-Tokens, Schriften, Workflow-Regeln, Anti-Patterns.

---

## 1 · Übersicht

**Was:** Cover-Page (`/`) wird vom Mini-Stub aus Phase 2.1 zur echten Morning-at-a-Glance-Tagesübersicht ausgebaut. Magazin-Charakter · editorial-warm · FT-Weekend / Monocle / NYT-Morning als visuelle Familie.

**Warum hier:** Cover ist der tägliche Einstieg ins HQ. Sie konsolidiert alle Module als Teaser-Cards mit Klick-Vertiefung in die Detail-Pages.

**Motivations-Aspekt:** Cover ist nicht nur Informations-Verteiler, sondern täglicher Tageseinstieg. Zitat des Tages, Geschichte-Bezug, eigene Ausgabe-Nummer → ritueller Charakter. Mario baut das HQ primär für Motivation, sekundär für Zeitersparnis. Diese Hierarchie gilt durchgängig: lieber ein motivierendes Detail mehr als ein technisches.

---

## 2 · Architektur-Modell · Hybrid mit Live-Inseln

Das Cover folgt einem **Hybrid-Modell**:

- **Statisch · täglich generiert von Cowork (ab Phase 5):** Geschichte · Zitat · Kalender-Wochenübersicht · Foto-Hinweis · Astronomie · Wetter-Tagestrend · News
- **Live · bei Page-Load via API:** BTC-Kurs · Aktienindizes · Wetter-aktuell-jetzt
- **Live-Inseln zeigen eigenen Zeitstempel** („Live · 14:22")
- **Briefing-Generierungszeit** unten als Editorial-Vermerk („Generiert 06:30 CEST")

**Implikation:** kein Update-Suffix-Schema nötig — Briefing-Ausgabe = 1×/Tag, Live-Inseln aktualisieren sich von selbst.

**MVP-Pragmatik:** In den ersten Slices (2.2.1 bis 2.2.x) sind alle Inhalte statisch hartcodiert. Live-API-Anbindungen erst, wenn die Karten-Shells stehen.

---

## 3 · Visuelle Referenz · Layout-Skizze

Layout-Reihenfolge top-down (1440px-Container, Light Mode primär):

```
┌─────────────────────────────────────────────────┐
│  EYEBROW-ZEILE (--font-mono, uppercase, 11px)   │
│  Mario's HQ              KW 20 · Ausgabe #0014  │
│                                · Mittwoch       │
│  (Wochentag in Vermillon E34234)                │
├─────────────────────────────────────────────────┤
│                                                 │
│  [ HERO-BILD · ~5:1 Letterbox · 280px hoch ]    │
│  Abstrakte Berg/Nebel-Silhouette                │
│  In 2.2.1 als SVG-Platzhalter · Bild-Suche      │
│  in späterem Slice                              │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Mittwoch, 13. Mai 2026                         │  Hero-Datum
│                                                 │  Fraunces 300 · 44px
├─────────────────────────────────────────────────┤
│  ZITAT  „Italic-Satz."          — Autor         │  Zitat-Strip
│  (Eyebrow ZITAT in Vermillon · Satz in          │
│   Fraunces italic · Autor in Mono)              │
├─────────────────────────────────────────────────┤
│  GESCHICHTE  1945 — Italic-Satz                 │  Geschichte-Strip
│  (kommt in Slice 2.2.2)                         │
├─────────────────────────────────────────────────┤
│  ▍ EVENT-BANNER (nur wenn aktiv)                │  Special-Event
│    HEUTE 20:00 CEST · Powell-Rede · FOMC        │  Vermillon-soft bg
│  (kommt in Slice 2.2.2)                         │
├─────────────────────────────────────────────────┤
│  ┌────────────────────┐ ┌──────────────────┐    │
│  │ WETTER & FOTO      │ │ KALENDER · HEUTE │    │  Co-Heroes
│  │ ☼☁ 17°  Mix Sonne  │ │ 09:00 ...        │    │  1.7fr / 1fr
│  │ Goldene / Blaue    │ │ 12:45 ...        │    │  (Slice 2.2.3)
│  │ Foto-Hinweis       │ │ Diese Woche      │    │
│  └────────────────────┘ └──────────────────┘    │
├─────────────────────────────────────────────────┤
│  ┌──────┐ ┌──────────┐ ┌──────┐                 │
│  │KRYPTO│ │MACRO·★   │ │ NEWS │                 │  Supporting-3er
│  │$95k  │ │Powell    │ │head1 │                 │  (Slice 2.2.4)
│  │Live  │ │Event akt.│ │head2 │                 │
│  └──────┘ └──────────┘ └──────┘                 │  ★ = pulst wenn Event
├─────────────────────────────────────────────────┤
│  FOOTER (--font-mono, 10px, uppercase)          │
│  Generiert 06:30 CEST · Live-BTC 14:22          │
│  (kommt in Slice 2.2.5)                         │
└─────────────────────────────────────────────────┘
```

**Schlüssel-Setzungen:**

- Vermillon-Akzente auf: Wochentag · Zitat-Eyebrow · alle Card-Eyebrows · Krypto-Negativ-Werte · Event-Banner · Event-Card-Border
- Vermillon-Quote-Ziel: ≤ 3 % Fläche · DRG-Hard-Rule
- Schriften: Fraunces (Display/Italic) · Inter (Body) · JetBrains Mono (Eyebrows, Zeitstempel, Tabellen)

---

## 4 · Datenarchitektur

### 4.1 Ausgabe-Counter

**Start:** 30.4.2026 = Ausgabe #0001 (Marios Geburtstag, bewusster Start-Anker statt Repo-Erstellung)

**Format:** 4-stellig mit führenden Nullen · `#0001` · `#0014` · `#9999`

**Berechnung:** `(heute − 30.4.2026 in Tagen) + 1` → 13.5.2026 = **#0014**

**Update-Logik:** Bei wiederholtem Page-Load am selben Tag bleibt die Ausgabe-Nummer gleich. Modell C löst Update-Bedarf via Live-Inseln, kein Suffix-Schema (`Update01-15:30` etc.) nötig.

### 4.2 KW · Jahres-Kalenderwoche

**Standard:** ISO-8601 (Woche beginnt Montag, Woche 1 enthält den ersten Donnerstag)

**Beispiel:** 13.5.2026 → KW 20

**Implementation:** Native JS-Lösung über `Date`-Berechnung. Keine externe Dependency.

### 4.3 zitate.json

**Pfad:** `src/data/zitate.json`

**Schema:**

```json
{
  "zitate": [
    {
      "text": "Zitat-Volltext.",
      "autor": "Name oder null"
    }
  ]
}
```

**Daten (Stand 13.5.2026, Tippfehler korrigiert):**

```json
{
  "zitate": [
    { "text": "Mit Musik entscheidet es sich gut.", "autor": null },
    { "text": "Arbeite heute hart und geniesse es — Zukunfts-Mario wird dir danken.", "autor": null },
    { "text": "Use what you have.", "autor": null },
    { "text": "It's what you do in the dark that puts you in the light.", "autor": "Michael Phelps" },
    { "text": "Wer aufhört, besser zu werden, hat aufgehört, gut zu sein.", "autor": "Philip Rosenthal" },
    { "text": "Keep it simple.", "autor": null },
    { "text": "Fehler vermeidet man, indem man Erfahrung sammelt. Erfahrung sammelt man, indem man Fehler macht.", "autor": null },
    { "text": "Die Menschen müssen ihr neues, schönes Dasein selber schaffen — wenn wir es machen, ist es nur ein Käfig.", "autor": null },
    { "text": "Der Mensch ist unglücklich, weil er nicht weiss, dass er glücklich ist. Nur deshalb. Wer das erkennt, wird sofort glücklich sein.", "autor": "Dostojewski" },
    { "text": "Die primäre Voraussetzung für hohe Leistungsfähigkeit ist der geschickte Umgang mit Energie — Zeit spielt eine nachrangige Rolle.", "autor": "Tony Schwartz" },
    { "text": "Führe dein Studio, als ob du es in Abwesenheit eines guten Freundes verwaltest.", "autor": null }
  ]
}
```

**Künftige Erweiterungs-Präferenzen (für Mario beim manuellen Ergänzen):** Zen-Buddhismus · Shaolin · Einstein · Philosophen · Natur · Künstler.

**Obsidian-Sync (Phase 5+):** Cowork liest später aus `~/Second_Brain/Zitate.md` und schreibt `zitate.json` parallel. Im MVP editiert Mario `zitate.json` direkt via VS Code.

### 4.4 Tages-Auswahl-Logik · Zitat

Deterministisch reproduzierbar — gleiches Datum gibt gleiches Zitat:

```ts
const dayOfYear = (datum: Date) => {
  const start = new Date(datum.getFullYear(), 0, 0);
  const diff = datum.getTime() - start.getTime();
  return Math.floor(diff / 86_400_000);
};

const tageszitat = zitate[dayOfYear(heute) % zitate.length];
```

**Nicht zufällig** — Reproduzierbarkeit ist wichtig für Archive und Konsistenz innerhalb desselben Tages.

### 4.5 Geschichte-Themen-Bias (Phase 5 · Cowork-Prompt)

Reihenfolge bei Cowork-Kuration (höchste Priorität zuerst):

1. Schweizer Geschichte / Aargau-spezifisch
2. Architektur (allgemein · ohne Bauhaus/Modernismus-Fokus)
3. Kunst
4. Fotografie-Geschichte
5. Designgeschichte
6. Wissenschaft & Forschung
7. Trading- / Finanzgeschichte
8. Militärgeschichte
9. Wikipedia-Fallback wenn nichts Spezifisches trifft

**Nicht für Slice 2.2.1 relevant** — Geschichte ist im MVP-Slice noch hartcodiert in Slice 2.2.2.

### 4.6 Wetter-Symbol-Map (Phase 2.4)

Liste der zu zeichnenden Custom-SVG-Symbole im monolinigen DRG-Stil (Sumi-Stroke 1.5px, kein Fill, japanisch-reduziert):

- Sonne pur
- Mix Sonne · Wolken
- Bewölkt
- Regen
- Schneefall
- Gewitter
- Nebel
- Sturm

**Mapping-File später:** `src/data/wetter-symbole.json` mit MeteoSwiss-Code → Symbol-Name. **Nicht in Slice 2.2.1.**

---

## 5 · Komponenten-Liste

| Komponente | Status | Slice |
|---|---|---|
| `CoverHeader.astro` (Eyebrow-Zeile + Hero-Datum) | Neu | 2.2.1 |
| `HeroImage.astro` (Berg-SVG · später Foto-Wechsel) | Neu | 2.2.1 |
| `Zitat.astro` (Tages-Zitat aus JSON) | Neu | 2.2.1 |
| `GeschichteStrip.astro` | Neu | 2.2.2 |
| `EventBanner.astro` | Neu | 2.2.2 |
| `WetterCard.astro` (Hero · 1.7fr) | Neu | 2.2.3 |
| `KalenderCard.astro` (Co-Hero · 1fr) | Neu | 2.2.3 |
| `KryptoCard.astro` (Supporting) | Neu | 2.2.4 |
| `MacroCard.astro` (Supporting · Event-pulse) | Neu | 2.2.4 |
| `NewsCard.astro` (Supporting) | Neu | 2.2.4 |
| `CoverFooter.astro` (Generierungs-Stempel) | Neu | 2.2.5 |
| `src/lib/ausgabe.ts` (Counter + KW + Wochentag) | Neu | 2.2.1 |
| `src/lib/zitatePicker.ts` (Tages-Auswahl) | Neu | 2.2.1 |
| `src/data/zitate.json` | Neu | 2.2.1 |
| `src/pages/index.astro` (Integration) | Modifiziert | jeder Slice |

---

## 6 · Implementierungs-Reihenfolge in Slices

| Slice | Inhalt | Schätz-Dauer |
|---|---|---|
| **2.2.1** | Eyebrow-Zeile · Hero-Bild-SVG · Zitat-Modul · Hero-Datum | 45 Min |
| 2.2.2 | Geschichte-Strip · Event-Banner-Komponente (hartcodiert) | 45 Min |
| 2.2.3 | Wetter+Foto-Card · Kalender-Card (statische Stubs, kein Live-API) | 90 Min |
| 2.2.4 | Krypto-Card · Macro-Card · News-Card (statisch + Event-Pulse-CSS) | 60 Min |
| 2.2.5 | Cover-Footer · Polish · Mobile-Verifikation · Build · Commit · Push | 30 Min |
| **2.2.x später** | Wetter-Symbol-Set · echte Hero-Fotos · Live-API-BTC | eigene Slices |

---

## 7 · Detail-Spezifikation · Slice 2.2.1

> **Dies ist der Slice, der in der aktuellen Session implementiert wird.**

### 7.1 Files

**Neu:**
- `src/data/zitate.json` — Inhalt siehe §4.3
- `src/lib/ausgabe.ts` — Funktionen `getAusgabe`, `getAusgabeFormatiert`, `getKW`, `getWochentag` (siehe §7.5)
- `src/lib/zitatePicker.ts` — Funktion `getTageszitat` (siehe §7.6)
- `src/components/CoverHeader.astro` — Eyebrow-Zeile + Hero-Datum (siehe §7.2)
- `src/components/HeroImage.astro` — Berg-SVG (siehe §7.3)
- `src/components/Zitat.astro` — Zitat-Strip (siehe §7.4)

**Modifiziert:**
- `src/pages/index.astro` — Mini-Stub durch die drei neuen Komponenten ersetzen

**Prüfen vor Beginn:**
- Existiert `DateDisplay.astro` aus Phase 2.1? Falls ja, prüfen ob sie für das Hero-Datum wiederverwendbar ist — Schriftgrösse müsste skalierbar sein (44px statt vermutlich kleinerem Wert in Header). Falls Anpassung zu invasiv: neue Logik direkt in `CoverHeader.astro`.

### 7.2 CoverHeader.astro

**Funktion:** Eyebrow-Zeile mit Brand-Lockup links, Ausgabe-Metadaten rechts. Plus Hero-Datum direkt unterhalb (oder als eigene Sub-Komponente — Entscheidung von Sonnet).

**Layout Eyebrow:** Flexbox mit `justify-content: space-between`. Beide Seiten in `--font-mono`, 11px, uppercase, letter-spacing 0.12em.

**Linke Seite:** `Mario's HQ` in `--fg` (Sumi-900).

**Rechte Seite:** `KW {nr} · Ausgabe #{ausgabe} · {wochentag}` — letztes Element (Wochentag) in Vermillon `#E34234` bzw. `var(--accent)`.

**Hero-Datum darunter:** `{wochentag}, {tag}. {monat-name} {jahr}` in `var(--font-display)`, weight 300, size 44px, letter-spacing -0.02em, line-height 1.02.

**Datenquelle:** Importiert `getAusgabeFormatiert`, `getKW`, `getWochentag` aus `src/lib/ausgabe.ts`. Monatsname in Schweizer Hochdeutsch (Mai · Juni · etc.).

**Position:** Direkt unterhalb des Hero-Bilds.

### 7.3 HeroImage.astro

**Funktion:** Hero-Bild oberhalb des Hero-Datums. In Slice 2.2.1 als SVG-Platzhalter im sumi-e-Stil (abstrakte Bergsilhouette). Spätere Slices ersetzen das durch echte Naturfotos.

**SVG-Code (verbindlich für Slice 2.2.1):**

```html
<svg viewBox="0 0 1440 280" xmlns="http://www.w3.org/2000/svg"
     style="width: 100%; height: 280px; display: block; border-radius: 4px;
            background: linear-gradient(180deg, #EEEBE3 0%, #E8E6E1 100%);"
     role="img" aria-label="Abstrakte Bergsilhouette mit Nebellinien">
  <path d="M0,190 L140,150 L300,175 L490,115 L650,160 L830,100 L1010,148 L1180,124 L1340,162 L1440,148 L1440,280 L0,280 Z"
        fill="#B8B6B0" opacity="0.55"/>
  <path d="M0,225 L185,195 L370,215 L555,175 L740,200 L920,165 L1130,195 L1290,180 L1440,200 L1440,280 L0,280 Z"
        fill="#8A8A8A" opacity="0.45"/>
  <path d="M0,260 L230,240 L460,255 L690,230 L920,250 L1150,235 L1440,247 L1440,280 L0,280 Z"
        fill="#4A4A4A" opacity="0.35"/>
  <line x1="0" y1="130" x2="1440" y2="130" stroke="#FAFAF7" stroke-width="0.5" opacity="0.4"/>
  <line x1="0" y1="165" x2="1440" y2="165" stroke="#FAFAF7" stroke-width="0.5" opacity="0.3"/>
</svg>
```

**Dimensionen:** 1440×280px im Container. Höhe responsiv anpassen für Mobile.

**Mobile (< 768px):** Höhe auf ~160px reduzieren via CSS-Media-Query oder `aspect-ratio: 5/1`.

**Spätere Erweiterung:** Im Slice 2.2.x später durch Foto ersetzen. Suchbegriffe für Bild-Recherche: ruhig · meditativ · entsättigt · monochrom · Natur · Nebel · Berge · Wasser · Licht · Stein · Wolken · Holz · keine Menschen · keine Action.

### 7.4 Zitat.astro

**Funktion:** Strip mit Eyebrow „ZITAT" (Vermillon), Zitat-Text (Fraunces italic), Autor (Mono).

**Position:** Direkt unter dem Hero-Datum. In Slice 2.2.1 ist das das letzte Element der Cover-Page.

**Markup-Skizze (Astro):**

```astro
---
import { getTageszitat } from '../lib/zitatePicker';
const zitat = getTageszitat();
---

<div class="zitat-strip">
  <span class="eyebrow">Zitat</span>
  <span class="text">„{zitat.text}"</span>
  {zitat.autor && <span class="autor">— {zitat.autor}</span>}
</div>

<style>
  .zitat-strip {
    padding: 6px 0 14px;
    margin-bottom: 18px;
    border-bottom: 1px solid var(--hairline);
  }
  .eyebrow {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent);
    margin-right: 10px;
  }
  .text {
    font-family: var(--font-display);
    font-style: italic;
    font-size: 15px;
    color: var(--fg);
    line-height: 1.5;
  }
  .autor {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--fg-subtle);
    margin-left: 8px;
  }
</style>
```

**Datenquelle:** `getTageszitat(new Date())` aus `src/lib/zitatePicker.ts`.

**Edge-Case:** Wenn `autor === null`, wird die Autoren-Zeile weggelassen (kein Em-Dash, kein leerer Span).

### 7.5 src/lib/ausgabe.ts

**Exports:**

```ts
export const AUSGABE_START = new Date(2026, 3, 30); // 30. April 2026 (Monat 0-indexiert)

export function getAusgabe(datum: Date = new Date()): number {
  const diff = datum.getTime() - AUSGABE_START.getTime();
  return Math.floor(diff / 86_400_000) + 1;
}

export function getAusgabeFormatiert(datum: Date = new Date()): string {
  return `#${String(getAusgabe(datum)).padStart(4, '0')}`;
}

export function getKW(datum: Date = new Date()): number {
  // ISO-8601: Woche beginnt Montag, Woche 1 enthält ersten Donnerstag
  const d = new Date(Date.UTC(datum.getFullYear(), datum.getMonth(), datum.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

export function getWochentag(datum: Date = new Date()): string {
  const tage = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch',
                'Donnerstag', 'Freitag', 'Samstag'];
  return tage[datum.getDay()];
}

export function getMonatsname(datum: Date = new Date()): string {
  const monate = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  return monate[datum.getMonth()];
}
```

### 7.6 src/lib/zitatePicker.ts

**Exports:**

```ts
import zitateData from '../data/zitate.json';

export interface Zitat {
  text: string;
  autor: string | null;
}

export function getTageszitat(datum: Date = new Date()): Zitat {
  const start = new Date(datum.getFullYear(), 0, 0);
  const diff = datum.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86_400_000);
  return zitateData.zitate[dayOfYear % zitateData.zitate.length] as Zitat;
}
```

### 7.7 Modifikation src/pages/index.astro

**Mini-Stub durch echtes Layout ersetzen.** Reihenfolge der Komponenten:

```astro
---
import Magazine from '../layouts/Magazine.astro';
import CoverHeader from '../components/CoverHeader.astro';
import HeroImage from '../components/HeroImage.astro';
import Zitat from '../components/Zitat.astro';
---

<Magazine title="Cover · Mario's HQ">
  <HeroImage />
  <CoverHeader />
  <Zitat />
</Magazine>
```

**Reihenfolge-Anmerkung:** Hero-Bild zuerst, dann Header (mit Eyebrow + Datum), dann Zitat. Alternativ: Eyebrow vor Hero-Bild, Datum nach Hero-Bild — abhängig davon, ob Sonnet `CoverHeader` als monolithische oder als zwei Sub-Komponenten gestaltet. Skizze A v3 zeigt Eyebrow oben, dann Hero-Bild, dann Hero-Datum. Diese Reihenfolge ist die Referenz.

### 7.8 Abschluss-Verifikation

Vor `git push`:

- `npm run build` — muss grün durchlaufen, alle 9 Pages
- Lokal verifizieren auf http://localhost:4321
- Eyebrow-Zeile zeigt am 13.5.2026: `Mario's HQ` links · `KW 20 · Ausgabe #0014 · Mittwoch` rechts
- Wochentag in Vermillon sichtbar
- Hero-Bild zeigt drei überlappende Bergsilhouetten plus zwei Nebellinien
- Hero-Datum zeigt: `Mittwoch, 13. Mai 2026` in Fraunces 300, 44px
- Zitat ist deterministisch — bei wiederholtem Reload immer dasselbe Zitat
- Mobile-Test 768px-Viewport
- Theme-Toggle Light/Dark — Hero-Bild und Zitat müssen in beiden Modi lesbar sein

**Hinweis Dark Mode:** Im Berg-SVG sind fixe Grau-Werte verbaut (`#B8B6B0` etc.). Im Dark Mode wirken die anders, aber lesbar bleiben sie. Akzeptabel für 2.2.1 — Dark-Mode-Polish kommt in Slice 2.2.5.

---

## 8 · Anti-Patterns für Slice 2.2.1

- ❌ **Keine echten Bilder einbinden** — SVG-Platzhalter reicht. Echte Fotos kommen in Slice 2.2.x mit Bild-Recherche
- ❌ **Keine Live-APIs** — alle Daten statisch oder berechnet aus Datum
- ❌ **Keine Cards bauen** — Wetter / Kalender / Krypto / Macro / News kommen erst ab Slice 2.2.3
- ❌ **Keine Event-Banner-Logik** — kommt in 2.2.2
- ❌ **Keine Cowork-Integration** — alles ist hartcodierte Logik oder JSON
- ❌ **Keine `tailwind.config.js`** — DRG-Tokens via `@theme` in `global.css` bleiben Quelle der Wahrheit
- ❌ **Keine Spring/Bounce-Animationen** — wenn überhaupt CSS-Transitions, nur ease-out / ease-in-out
- ❌ **Keine Floskeln in Code-Comments** — Schweizer Klarheit, du-Form, em-dash

---

## 9 · Offene Fragen (nach Slice 2.2.1 zu klären)

1. **Hero-Bild-Quelle künftig** — Unsplash-API-Integration vs. eigene Bilder im `public/images/hero/` vs. DRG-Portfolio?
2. **Wetter-Symbol-Mapping** — welche Codes liefert MeteoSwiss? Mapping auf MeteoSchweiz-Icon-Codes nötig?
3. **Live-BTC-API** — CoinGecko vs. CryptoCompare vs. Bitvavo direkt? Rate-Limits klären.
4. **Mobile Cover-Stacking** — Reihenfolge der Cards auf 768px-Viewport? Wetter zuerst, Kalender zweitens, dann Supporting?
5. **Zitate-Erweiterung** — Mario fügt manuell in `zitate.json` ein, bis Phase 5 Obsidian-Sync läuft. Themen-Präferenzen: Zen-Buddhismus · Shaolin · Einstein · Philosophen · Natur · Künstler.

---

## 10 · Vermillon-Quote-Check

DRG-Hard-Rule: ≤ 3 % Flächenanteil.

In Slice 2.2.1 sind nur zwei Vermillon-Elemente sichtbar:
- Wochentag in Eyebrow (wenige Zeichen)
- Zitat-Eyebrow „ZITAT" (5 Zeichen, klein)

Quote in 2.2.1 voraussichtlich < 0.2 %. Komfortabel im grünen Bereich.

---

## 11 · Stolpersteine zu beachten

Aus Phase 2.1 dokumentiert · gilt für jede Code-Session:

1. **Worktree-Falle** — Claude Code rutscht manchmal in `.claude/worktrees/<random>/`. Jeder bash-Call muss `cd /Users/mariomacstudio/Developer/mario-hq && ...` chainen.
2. **Plan-First-Regel** — vor jedem nicht-trivialen Edit Plan zeigen, OK abwarten.
3. **Build-Test ist Pflicht** — `npm run build` vor jedem `git push`, auch bei Doc-only-Änderungen.
4. **Build-Fehler-Handling** — max 1 Fix-Attempt bei unklarem Fehler, danach `git restore .` und Mario fragen.
5. **„Lokal funktioniert" ≠ „gepusht"** — Done = Build grün + Push erfolgreich + Vercel-Deploy grün + URL im Browser verifiziert.
6. **TypeScript-strict** — keine `any` ohne Begründung.
7. **Fraunces opsz-Achse** — für 44px Hero-Datum: `font-variation-settings: "opsz" 96`. Sonst wirkt der Font generisch.

---

## 12 · Commit-Konvention für Slice 2.2.1

Conventional Commit, Deutsch:

```
feat: cover-page slice 2.2.1 · eyebrow, hero-bild, zitat

- CoverHeader mit KW + Ausgabe-Counter (#0014 ab 30.4.2026) + Hero-Datum
- HeroImage als sumi-e SVG-Platzhalter (1440x280, abstrakte Bergsilhouette)
- Zitat-Modul mit src/data/zitate.json (11 Zitate, deterministische Tages-Auswahl)
- src/lib/ausgabe.ts mit getAusgabe, getKW, getWochentag, getMonatsname
- src/lib/zitatePicker.ts mit getTageszitat
- index.astro integriert die neuen Komponenten
```

---

*Bei jedem abgeschlossenen Slice: dieses File unter §6 aktualisieren (Slice-Status), `_pendenzen.md` ergänzen, `SESSION_LOG.md` Eintrag oben.*
