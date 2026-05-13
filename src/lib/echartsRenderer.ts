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
