/**
 * Shared ECharts dark-theme style constants.
 * Spread these into chart option objects to avoid repeating the same colours across pages.
 *
 * Usage:
 *   tooltip: { trigger: 'axis' as const, ...CHART_TOOLTIP },
 *   legend:  { data: [...RARITIES], ...CHART_LEGEND },
 *   xAxis:   { type: 'category', ..., ...CHART_AXIS_STYLES },
 *   yAxis:   { type: 'value',  ..., ...CHART_AXIS_STYLES, splitLine: CHART_SPLIT_LINE },
 */

export const CHART_TOOLTIP = {
  backgroundColor: "#1a1a1a",
  borderColor: "#333",
  textStyle: { color: "#e5e5e5", fontSize: 12 },
};

export const CHART_LEGEND = {
  textStyle: { color: "#a3a3a3", fontSize: 11 },
  top: 0,
};

export const CHART_AXIS_STYLES = {
  axisLine: { lineStyle: { color: "#404040" } },
  axisLabel: { color: "#a3a3a3", fontSize: 11 },
  nameTextStyle: { color: "#a3a3a3", fontSize: 12 },
};

export const CHART_SPLIT_LINE = {
  lineStyle: { color: "#262626" },
};
