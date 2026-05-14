// echartsRenderer — Client-only ECharts Initialisierungs-Utility
// NUR aus <script>-Blöcken importieren — nie aus Astro-Frontmatter
// Wird von Sparkline.astro verwendet · künftig auch von Gauge.astro etc.

import * as echarts from 'echarts';
import { drgTheme, DRG_COLORS } from './echarts-drg-theme';

// Singleton-Guard: Theme nur einmal registrieren
let themeRegistered = false;

export function ensureThemeRegistered(): void {
  if (!themeRegistered) {
    echarts.registerTheme('drg', drgTheme);
    themeRegistered = true;
  }
}

// Linie-Farbe aus Trend und aktuellem Theme ableiten
export function getLineColor(values: number[], isDark: boolean): string {
  if (values.length < 2) {
    return isDark ? DRG_COLORS.sumiDark : DRG_COLORS.sumiLight;
  }
  const trend = values[values.length - 1] - values[0];
  if (trend < 0) return DRG_COLORS.accent;
  return isDark ? DRG_COLORS.sumiDark : DRG_COLORS.sumiLight;
}

export interface SparklineInstance {
  chart: echarts.ECharts;
  destroy: () => void;
}

export interface WetterWochenBarsDaten {
  wochentage: string[];   // X-Achse-Labels (Mo, Di, ...)
  min:        number[];   // °C pro Tag · Untergrenze des Balkens
  max:        number[];   // °C pro Tag · Obergrenze des Balkens
}

// initWetterWochenBars — vertikale Floating-Bars für Min/Max-Temperatur über 7 Tage
// Floating-Bar-Trick: zwei series — eine unsichtbare "Sockel" (0 → min) + eine
// sichtbare (min → max), die optisch zur Range zwischen Min und Max wird.
// X-Achse sichtbar (Wochentage), Y-Achse sichtbar (°C-Werte), keine Tooltips.
export function initWetterWochenBars(
  el: HTMLElement,
  daten: WetterWochenBarsDaten,
): { chart: echarts.ECharts; destroy: () => void } | null {
  if (!el || daten.wochentage.length === 0) return null;

  ensureThemeRegistered();

  const isDark = document.documentElement.dataset.theme === 'dark';
  const barColor   = isDark ? DRG_COLORS.sumiDark : DRG_COLORS.sumiLight;
  const axisColor  = isDark ? DRG_COLORS.textSubtle : DRG_COLORS.textMuted;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sockel-Werte (0 → min) und Range-Werte (max - min)
  const sockel = daten.min;
  const range  = daten.max.map((m, i) => m - daten.min[i]);

  const chart = echarts.init(el, 'drg');

  chart.setOption({
    grid: { left: 28, right: 4, top: 8, bottom: 22, containLabel: false },
    xAxis: {
      type: 'category',
      data: daten.wochentage,
      axisLine:  { show: false },
      axisTick:  { show: false },
      axisLabel: { show: true, color: axisColor, fontFamily: 'JetBrains Mono, monospace', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      axisLine:  { show: false },
      axisTick:  { show: false },
      axisLabel: { show: true, color: axisColor, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, formatter: '{value}°' },
      splitLine: { show: false },
    },
    series: [
      {
        // Sockel (transparent) · macht die zweite series zur "floating" Bar
        type: 'bar',
        stack: 'temp',
        data: sockel,
        itemStyle: { color: 'transparent' },
        silent: true,
        emphasis: { disabled: true },
      },
      {
        // Range (sichtbar) · min → max
        type: 'bar',
        stack: 'temp',
        data: range,
        itemStyle: { color: barColor, borderRadius: 2 },
        barMaxWidth: 18,
        emphasis: { disabled: true },
      },
    ],
    tooltip:           { show: false },
    animation:         !reducedMotion,
    animationDuration: reducedMotion ? 0 : 200,
    animationEasing:   'cubicOut',
  });

  // LIVE Theme-Switch: MutationObserver auf data-theme
  const themeObserver = new MutationObserver(() => {
    const nowDark = document.documentElement.dataset.theme === 'dark';
    const newBar  = nowDark ? DRG_COLORS.sumiDark : DRG_COLORS.sumiLight;
    const newAxis = nowDark ? DRG_COLORS.textSubtle : DRG_COLORS.textMuted;
    chart.setOption({
      xAxis: { axisLabel: { color: newAxis } },
      yAxis: { axisLabel: { color: newAxis } },
      series: [{}, { itemStyle: { color: newBar } }],
    });
  });
  themeObserver.observe(document.documentElement, {
    attributes:      true,
    attributeFilter: ['data-theme'],
  });

  const resizeObserver = new ResizeObserver(() => chart.resize());
  resizeObserver.observe(el);

  const destroy = () => {
    themeObserver.disconnect();
    resizeObserver.disconnect();
    chart.dispose();
  };

  return { chart, destroy };
}

// Sparkline initialisieren und alle Observer einrichten
// Gibt ein Cleanup-Objekt zurück
export function initSparkline(
  el: HTMLElement,
  values: number[]
): SparklineInstance | null {
  if (!el || values.length === 0) return null;

  ensureThemeRegistered();

  const isDark = document.documentElement.dataset.theme === 'dark';
  const lineColor = getLineColor(values, isDark);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const chart = echarts.init(el, 'drg');

  chart.setOption({
    grid:   { left: 0, right: 0, top: 2, bottom: 2 },
    xAxis:  { type: 'category', show: false, boundaryGap: false },
    yAxis:  { type: 'value', show: false, scale: true },
    series: [{
      type:      'line',
      data:      values,
      symbol:    'none',
      lineStyle: { width: 1.5, color: lineColor },
      areaStyle: undefined,
      smooth:    false,
    }],
    tooltip:           { show: false },
    animation:         !reducedMotion,
    animationDuration: reducedMotion ? 0 : 200,
    animationEasing:   'cubicOut',
  });

  // LIVE Theme-Switch: MutationObserver auf data-theme Attribut
  // Wenn Mario den Theme-Toggle klickt → Linienfarbe sofort aktualisieren
  const themeObserver = new MutationObserver(() => {
    const nowDark = document.documentElement.dataset.theme === 'dark';
    const newColor = getLineColor(values, nowDark);
    chart.setOption({
      series: [{ lineStyle: { color: newColor } }],
    });
  });

  themeObserver.observe(document.documentElement, {
    attributes:      true,
    attributeFilter: ['data-theme'],
  });

  // ResizeObserver — responsives Resize
  const resizeObserver = new ResizeObserver(() => {
    chart.resize();
  });
  resizeObserver.observe(el);

  // Cleanup-Funktion für spätere Verwendung (z.B. bei Page-Navigation)
  const destroy = () => {
    themeObserver.disconnect();
    resizeObserver.disconnect();
    chart.dispose();
  };

  return { chart, destroy };
}
