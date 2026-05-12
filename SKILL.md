# Mario's HQ — Skill für Claude Code

> **Pflicht-Lektüre vor jeder Coding-Session.** Wenn du Claude Code bist und in diesem Repo arbeitest: lies dieses File komplett, bevor du Code anfasst.

---

## Projekt-Identität

- **Was:** Mario's HQ — persönliches Magazin-Cockpit · Tägliches Morgenbriefing als Kern-Modul
- **Für wen:** Mario · Baden AG, Schweiz · Foto/Design-Hintergrund · aktiver Trader
- **Visuelle Familie:** Studio Da Rugna · Architekturfotografie-Studio · gleiche Brand-Sprache, anderer Use Case
- **Stil:** Editorial-warm · Fraunces × Inter · Vermillon-Akzent · ruhig, dicht, sachlich
- **Repo:** `github.com/Taljy/mario-hq` *(Public)*
- **Deploy:** Vercel · Auto-Deploy on push to `main`
- **Production-URL:** `mario-hq.vercel.app` *(provisorisch)*

**Wichtig:** Mario's HQ ist **kein Studio-Da-Rugna-Kunden-Touchpoint**. Es ist Marios privates Tool, das in der DRG-Visualsprache atmet. Heisst: DRG-Tokens und Schriften strikt — DRG-Regeln pragmatisch (z.B. Emojis im Briefing-Output erlaubt, weil's keine Kunden-Sicht ist).

---

## Tech-Stack

| Layer | Wahl | Notizen |
|---|---|---|
| Framework | Astro v6 | File-based Routing in `src/pages/` · Content Collections in `src/content/` |
| Sprache | TypeScript | Strict — keine `any` ohne Begründung |
| Styling | Tailwind v4 | Mit `@theme`-Tokens in `src/styles/global.css` · **kein `tailwind.config.js`** |
| Tailwind-Integration | `@tailwindcss/vite` | Astro-natives Setup |
| Charts | Apache ECharts | Via Client-Island in `.astro`-Files |
| Daten | Markdown + JSON | Content Collections für Briefings · JSON in `src/data/` |
| Package Manager | npm | Konsistent zu DREK |
| Node | v24.x | |

---

## Designsystem · Studio Da Rugna

### Brand-Farben (raw tokens)

| Token | Hex | Rolle |
|---|---|---|
| `--vermillon` | `#E34234` | **Signaturfarbe — max 3% Flächenanteil** |
| `--vermillon-deep` | `#C8341F` | Hover/Pressed |
| `--vermillon-soft` | `#F0635A` | Dark-Mode adjusted |
| `--sumi-900` | `#1A1A1A` | Sumi Schwarz — Haupttext, Logo |
| `--sumi-800` | `#2A2A2A` | Dark Surface raised |
| `--sumi-700` | `#3A3A3A` | |
| `--tinte-dunkel` | `#4A4A4A` | H2/H3, Sekundärtext |
| `--tinte-mittel` | `#8A8A8A` | Meta, Captions, Hairlines |
| `--tinte-hell` | `#B8B6B0` | Disabled / faintest |
| `--papier` | `#E8E6E1` | Card-Hintergründe (Light) |
| `--washi` | `#FAFAF7` | Page-Hintergrund (Light) |
| `--washi-pure` | `#FFFFFF` | Reine Foto-Mats only |

### Semantische Tokens (Light Mode)

```css
--bg:           var(--washi);       /* Page */
--bg-raised:    #FFFFFF;            /* Surfaces */
--bg-card:      var(--papier);      /* Cards */
--bg-inset:     #F2F0EB;            /* Recessed */

--fg:           var(--sumi-900);    /* Haupttext */
--fg-muted:     var(--tinte-dunkel);/* Sekundär */
--fg-subtle:    var(--tinte-mittel);/* Meta */
--fg-faint:     var(--tinte-hell);  /* Disabled */

--accent:       var(--vermillon);
--accent-hover: var(--vermillon-deep);
--accent-fg:    #FFFFFF;

--hairline:        rgba(26, 26, 26, 0.12);
--hairline-strong: rgba(26, 26, 26, 0.24);
```

### Dark Mode

Standard mitgenommen — DRG hat ihn fertig. Trigger via `data-theme="dark"` auf `<html>` oder `prefers-color-scheme`.

### Typografie

| Rolle | Font | Variante |
|---|---|---|
| **Display** | **Fraunces** | Variable opsz/wght · Light für grosse Display, Regular für H1/H2 |
| **Body** | **Inter** | Variable wght · Default 400 |
| **Mono** | **JetBrains Mono** | 400/500 |

**Pairing-Logik:** Display-Serif × Sans-Body — wie Monocle, FT Weekend. Kühl, datenfähig, editorial-warm zugleich.

### Type-Scale

```css
--fs-display:   clamp(3.5rem, 6vw + 1rem, 6.5rem);    /* 56–104 */
--fs-h1:        clamp(2.25rem, 3.5vw + 1rem, 3.5rem); /* 36–56 */
--fs-h2:        clamp(1.75rem, 2vw + 1rem, 2.25rem);  /* 28–36 */
--fs-h3:        1.375rem;
--fs-h4:        1.125rem;
--fs-body-l:    1.125rem;
--fs-body-m:    1rem;
--fs-body-s:    0.9375rem;
--fs-caption:   0.8125rem;
--fs-meta:      0.6875rem;   /* uppercase eyebrows only */
```

### Spacing-Scale (4px-Base)

```
--s-1: 4px   --s-5: 24px   --s-9:  96px
--s-2: 8px   --s-6: 32px   --s-10: 128px
--s-3: 12px  --s-7: 48px   --s-11: 192px
--s-4: 16px  --s-8: 64px
```

### Form-Regeln

- **Radii zurückhaltend:** 0, 2px (Form-Felder, Tags), 4px (Buttons, Cards), 9999px (Badges only). **Keine `rounded-xl`, keine `rounded-full` ausser Badges.**
- **Schatten subtil:** Zwei Stops — `shadow-1` (sehr leicht), `shadow-2` (Cards). Keine `shadow-lg`, kein Glow.
- **Hairlines** statt Borders: `1px solid var(--hairline)` für Trennlinien.
- **Container:** `--container: 1440px` · `--container-text: 720px` (Reading) · `--container-wide: 1680px` (Galerie).
- **Animations:** `--ease-out` und `--ease-in-out` — **keine Spring/Bounce**.

### Hard Rules (von DRG übernommen)

1. **Vermillon ≤ 3% Flächenanteil.** Akzent, nicht Hintergrund. CTA-Buttons, einzelne Hervorhebungen, Krypto-Negativ-Werte ja — grosse Flächen NEIN.
2. **Editorial-warm everywhere.** Briefing ist kein Dashboard — keine Tech-Bro-Ästhetik.
3. **No marketing fluff.** Keine „Stunning insights!", keine Werbe-Phrasen. Schweizer Klarheit.
4. **No bouncy animations.** Ease-out, ease-in-out — keine spring physics.

### DRG-Regeln · Briefing-Ausnahmen

- **Emojis erlaubt** im Briefing-Output (Block-Header: 📅🌤️📷🗓️🪙📈). Begründung: privates Tool, keine Kunden-Sicht. Im Code/UI-Chrome (Buttons, Navigation) trotzdem **keine Emojis**.

---

## Tailwind v4 · `@theme`-Setup

In `src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  /* Brand tokens — generieren Tailwind-Utilities wie bg-vermillon, text-sumi-900 */
  --color-vermillon:      #E34234;
  --color-vermillon-deep: #C8341F;
  --color-vermillon-soft: #F0635A;

  --color-sumi-900: #1A1A1A;
  --color-sumi-800: #2A2A2A;
  --color-sumi-700: #3A3A3A;

  --color-tinte-dunkel: #4A4A4A;
  --color-tinte-mittel: #8A8A8A;
  --color-tinte-hell:   #B8B6B0;

  --color-washi:  #FAFAF7;
  --color-papier: #E8E6E1;

  --font-display: 'Fraunces', 'Georgia', serif;
  --font-body:    'Inter', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', monospace;
}

:root {
  /* Semantische Tokens — via var() direkt in Components */
  --bg:           var(--color-washi);
  --bg-raised:    #FFFFFF;
  --bg-card:      var(--color-papier);
  --fg:           var(--color-sumi-900);
  --fg-muted:     var(--color-tinte-dunkel);
  --fg-subtle:    var(--color-tinte-mittel);
  --accent:       var(--color-vermillon);
  --hairline:     rgba(26, 26, 26, 0.12);
}

:root[data-theme="dark"] {
  --bg:           var(--color-sumi-900);
  --bg-raised:    var(--color-sumi-800);
  --bg-card:      #232323;
  --fg:           var(--color-washi);
  --fg-muted:     #C8C6C0;
  --fg-subtle:    var(--color-tinte-mittel);
  --hairline:     rgba(250, 250, 247, 0.12);
}

@layer base {
  html { font-family: var(--font-body); color: var(--fg); background: var(--bg); }
}
```

**Reihenfolge:** `@import "tailwindcss"` zuerst, dann `@theme`, dann `:root`. Tailwind v4 ist da entspannt — diese Reihenfolge ist die offiziell empfohlene.

### Fonts laden

Im Layout (`src/layouts/Magazine.astro`) via `<link>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=Inter:wght@300..700&family=JetBrains+Mono:wght@400;500&display=swap" />
```

---

## Anti-Patterns — NICHT verwenden

- ❌ **Newsreader, Cormorant, andere Serif-Body-Fonts** — Body ist Inter
- ❌ **Andere Akzentfarben** (Crimson, Ochre, Moss aus altem Editorial-Brief) — nur Vermillon
- ❌ **Vermillon-Flächen, Vermillon-Backgrounds, grosse Vermillon-Buttons** — max 3%
- ❌ **`rounded-xl`, `rounded-2xl`, `rounded-full`** ausser Badges
- ❌ **`shadow-lg`, `shadow-xl`, Glow-Effects, Glassmorphism**
- ❌ **`tailwind.config.js`** — wir nutzen `@theme` in CSS
- ❌ **Spring/Bounce-Animations** — nur ease-out, ease-in-out
- ❌ **Marketing-Sprache** im UI — keine „Amazing!", „Insights!", „Discover!"
- ❌ **shadcn/ui** — Astro-Komponenten reichen
- ❌ **Emojis im UI-Chrome** (Buttons, Navigation, Form-Labels) — nur im Briefing-Content

---

## Workflow-Spielregeln

### Plan-First

Vor jedem nicht-trivialen Edit: **Plan zeigen, OK abwarten.** Auch wenn der Plan offensichtlich erscheint.

> Trigger-Phrase **„in einem Zug durchpushen"** ist ein **STOP-Signal**, kein GO-Signal. Bedeutet: Mario will einen Schritt zurück und sauberer planen.

### Build-Test ist Pflicht

Vor jedem `git push`:
```bash
npm run build
```
Auch bei reinen Doc-Änderungen.

### Build-Fehler-Handling

- **Maximal 1 Fix-Attempt** bei einem unklaren Build-Fehler
- Danach `git restore .` (revert) und Mario fragen
- TypeScript-Fehler: STOP, nicht raten, fragen

### „Lokal funktioniert" ≠ „gepusht"

Eine Aufgabe gilt erst als done, wenn:
1. `npm run build` lokal grün
2. `git push` erfolgreich
3. Vercel-Deploy grün
4. URL im Browser verifiziert

### Timeboxes

- **60–90 Minuten pro Iteration**, dann committen — auch wenn unfertig
- Nach 90 Min: Status notieren in `_pendenzen.md`, dann pausieren

### Energy-Level-aware Optionen

Bei Klärungs-Fragen 2–4 Optionen anbieten, getaggt:
- 🟢 **Niedrig** — Housekeeping, Routine, Doku
- 🟡 **Mittel** — Polish, kleine Features
- 🔴 **Hoch** — heikles/strategisches, neue Konzepte

---

## Schreibstil

- **Schweizer Hochdeutsch** — `ss` statt `ß` · kein Dialekt im Code · keine Floskeln
- **du-Form** im Briefing-Output, im Repo-Code (Comments), in Doku
- **Em-Dash** `—` (U+2014) für Einschübe
- **Mittelpunkt** `·` (U+00B7) für Trenner-Listen
- **Typografische Apostrophe** `'` statt `'`
- **Datum-Format in Filenames:** `JJ-MM-TT__Name-Mit-Bindestrich`
- **Datum in Text:** `12.5.2026` oder `Di 12.5.` (kompakt) · `12. Mai 2026` formell

---

## Commit-Konventionen

**Conventional Commits**, Deutsch oder Englisch — nicht mixen pro Commit.

```
feat:     <neues Feature>
fix:      <Bug-Fix>
style:    <CSS / visuell ohne Logik-Änderung>
refactor: <Umstrukturierung ohne Verhaltensänderung>
chore:    <Housekeeping · Tooling · Deps>
docs:     <Doku-Änderung>
content:  <neuer Briefing-Eintrag · JSON-Daten-Update>
```

**Beispiel:**

```
feat: studio-da-rugna tokens und font-stack integriert

- @theme-Block mit vermillon/sumi/washi/papier
- Fraunces + Inter + JetBrains Mono via Google Fonts
- Light + Dark Mode Tokens in :root und [data-theme="dark"]
- Smoketest auf index.astro
```

---

## Naming-Konventionen

| Was | Stil | Beispiel |
|---|---|---|
| Files / Assets | `kebab-case` | `hero-bild.png`, `briefing-2026-05-12.md` |
| Astro-Components | `PascalCase.astro` | `WeatherCard.astro`, `MacroBanner.astro` |
| TS-Utilities | `camelCase.ts` | `formatDate.ts`, `loadBriefing.ts` |
| Types | `PascalCase.ts` | `Briefing.ts`, `WeatherData.ts` |
| Pages | `kebab-case.astro` | `src/pages/wetter.astro` |
| Content-Files | `JJJJ-MM-TT.md` | `src/content/briefings/2026-05-12.md` |
| Meta-Files | `_underscore-prefix.md` | `_pendenzen.md`, `_projekt.md` |

---

## Produktive Pfade

```
~/Developer/mario-hq/
├── _projekt.md
├── _pendenzen.md
├── SKILL.md
├── SESSION_LOG.md
├── README.md
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── .gitignore
├── public/
│   └── images/
├── src/
│   ├── assets/
│   ├── components/         ← .astro PascalCase
│   ├── content/
│   │   └── briefings/      ← JJJJ-MM-TT.md
│   ├── content.config.ts
│   ├── data/               ← JSON
│   ├── layouts/
│   │   └── Magazine.astro
│   ├── lib/
│   ├── pages/              ← kebab-case routes
│   ├── styles/
│   │   └── global.css      ← @theme + :root + base
│   └── types/
└── docs/
```

---

## Bekannte Stolpersteine

1. **Tailwind v4 ist anders als v3.** Keine `tailwind.config.js`. Tokens kommen aus `@theme`-Block in `global.css`.

2. **Astro Content Collections** brauchen ein Schema in `src/content.config.ts`. Wenn das Schema das Markdown-Frontmatter nicht matched, bricht der Build.

3. **ECharts in Astro** lädt nur clientseitig — `client:load` oder `client:visible` Directive auf der Komponente nicht vergessen.

4. **Vercel cached aggressiv.** Bei „funktioniert lokal, deployed nicht": Vercel-Cache leeren via Force-Redeploy.

5. **Vermillon-Versuchung.** Beim Stylen will man Vermillon-Buttons, Vermillon-Backgrounds. **Widerstehen.** Vermillon ist Akzent. Max 3%.

6. **Fraunces opsz-Achse:** `font-variation-settings: "opsz" 144` für Display, `"opsz" 96` für H1, `"opsz" 48` für H2. Sonst sieht der Font generisch aus.

7. **iPad-Test ist Pflicht** — Mario liest viel auf dem iPad. Layout immer auf 768px-Viewport verifizieren.

8. **`@import url(...)`-Google-Fonts in CSS** funktioniert, aber langsamer als `<link>` im HTML-Head. Wir nutzen `<link>` im Layout.

---

## Wenn du fertig bist

Nach jeder Session:

1. `SESSION_LOG.md` aktualisieren (neuer Eintrag oben)
2. `_pendenzen.md` aktualisieren (Erledigtes raus, Neues rein)
3. Commits gemacht? `git push` erfolgreich?
4. Build grün auf Vercel?
5. Wenn alles ja → Session schliessen.

---

*Bei strukturellen Änderungen am Stack, Designsystem oder Workflow: dieses File aktualisieren.*
