/**
 * Tree-shaken ECharts bundle.
 * Only registers the chart types and components we actually use,
 * cutting the bundle from ~540 KB to ~180 KB.
 */
import * as echarts from "echarts/core";

// Chart types we use
import { BarChart, LineChart, RadarChart } from "echarts/charts";

// Components we use
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  RadarComponent,
} from "echarts/components";

// Renderer
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  BarChart,
  LineChart,
  RadarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  RadarComponent,
  CanvasRenderer,
]);

export default echarts;
