// echarts-drg-theme — DRG-Design-System Tokens für alle ECharts-Instanzen
// WICHTIG: Kein ECharts-Import hier — Datei muss SSR-safe bleiben
// Hardcodierte Hex-Werte — ECharts kann keine CSS-Custom-Properties lesen
// Registration passiert in echartsRenderer.ts (client-only)

export const DRG_COLORS = {
  accent:     '#E34234', // Vermillon — Down-Trend · Event-Signal
  sumiLight:  '#2A2A2A', // Sumi-Schwarz — Up/Neutral-Trend in Light-Mode
  sumiDark:   '#E8E4DC', // Washi/Papier — Up/Neutral-Trend in Dark-Mode
  gridLine:   'rgba(42, 42, 42, 0.08)',
  gridLineDk: 'rgba(232, 228, 220, 0.10)',
  textMuted:  '#8A8680',
  textSubtle: '#BAB6B0',
} as const;

export const drgTheme = {
  color: [DRG_COLORS.sumiLight, DRG_COLORS.accent],
  backgroundColor: 'transparent',

  textStyle: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 11,
    color: DRG_COLORS.textMuted,
  },

  // Alle Achsen standardmässig unsichtbar — überschreibbar per setOption
  xAxis: {
    axisLine:  { show: false },
    axisTick:  { show: false },
    axisLabel: { show: false },
    splitLine: { show: false },
  },
  yAxis: {
    axisLine:  { show: false },
    axisTick:  { show: false },
    axisLabel: { show: false },
    splitLine: { show: false },
  },

  // Kein Tooltip — Editorial-Look
  tooltip: { show: false },

  // Grid-Defaults: nullrands für Sparklines, überschreibbar für grosse Charts
  grid: {
    left: 0, right: 0, top: 2, bottom: 2,
    containLabel: false,
  },

  // Linien-Defaults
  line: {
    lineStyle: { width: 1.5 },
    symbol:    'none',
    smooth:    false,
  },

  // Animation: kein Bounce — nur cubicOut, 200ms
  animation:         true,
  animationDuration: 200,
  animationEasing:   'cubicOut' as const,
} as const;
