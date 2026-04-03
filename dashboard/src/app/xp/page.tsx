'use client'

import { useMemo } from 'react'
import LazyChart from '@/components/LazyChart'
import { useGameConfigStore } from '@/store/gameConfigStore'
import { useShallow } from 'zustand/react/shallow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { NumberInput } from '@/components/ui/number-input'

import { Button } from '@/components/ui/button'
import { MAX_LEVEL, xpThreshold } from '@pop/shared/xp'
import { CHART_TOOLTIP, CHART_AXIS_STYLES, CHART_SPLIT_LINE } from '@/lib/chartTheme'

export default function XpPanel() {
  const setDraft = useGameConfigStore((s) => s.setDraft)
  const clearDraftForKey = useGameConfigStore((s) => s.clearDraftForKey)
  const hasDraft = useGameConfigStore((s) => s.drafts.xp !== undefined)
  const xp = useGameConfigStore(useShallow((s) => ({ ...s.config.xp, ...s.drafts.xp })))

  // Generate chart data: levels 1–MAX_LEVEL
  const chartData = useMemo(() => {
    const levels: number[] = []
    const thresholds: number[] = []
    const uses: number[] = []

    for (let lvl = 1; lvl <= MAX_LEVEL; lvl++) {
      const threshold = xpThreshold(lvl, xp)
      levels.push(lvl)
      thresholds.push(threshold)
      uses.push(Math.ceil(threshold / xp.XP_PER_USE))
    }

    return { levels, thresholds, uses }
  }, [xp])

  // Cumulative XP to reach each level (from level 1)
  const cumulativeData = useMemo(() => {
    const cumulative: number[] = []
    let total = 0
    for (const t of chartData.thresholds) {
      total += t
      cumulative.push(total)
    }
    return cumulative
  }, [chartData.thresholds])

  const thresholdChartOptions = useMemo(
    () => ({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis' as const,
        ...CHART_TOOLTIP,
        formatter: (params: Array<{ name: string; value: number; seriesName: string }>) => {
          const lvl = params[0]?.name
          const lines = params.map((p) => `${p.seriesName}: <b>${p.value.toLocaleString()}</b>`)
          return `Level ${lvl}<br/>${lines.join('<br/>')}`
        },
      },
      grid: { top: 40, right: 60, bottom: 40, left: 60 },
      xAxis: {
        type: 'category' as const,
        data: chartData.levels.map(String),
        name: 'Level',
        nameLocation: 'middle' as const,
        nameGap: 28,
        ...CHART_AXIS_STYLES,
      },
      yAxis: [
        {
          type: 'value' as const,
          name: 'XP Required',
          ...CHART_AXIS_STYLES,
          splitLine: CHART_SPLIT_LINE,
        },
        {
          type: 'value' as const,
          name: 'Uses Needed',
          ...CHART_AXIS_STYLES,
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: 'XP Threshold',
          type: 'bar',
          data: chartData.thresholds,
          itemStyle: { color: '#3b82f6', borderRadius: [2, 2, 0, 0] },
          barMaxWidth: 32,
        },
        {
          name: 'Uses Needed',
          type: 'line',
          yAxisIndex: 1,
          data: chartData.uses,
          lineStyle: { color: '#f59e0b', width: 2 },
          itemStyle: { color: '#f59e0b' },
          symbol: 'circle',
          symbolSize: 5,
        },
      ],
    }),
    [chartData],
  )

  const cumulativeChartOptions = useMemo(
    () => ({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis' as const, ...CHART_TOOLTIP },
      grid: { top: 40, right: 40, bottom: 40, left: 60 },
      xAxis: {
        type: 'category' as const,
        data: chartData.levels.map(String),
        name: 'Level',
        nameLocation: 'middle' as const,
        nameGap: 28,
        ...CHART_AXIS_STYLES,
      },
      yAxis: {
        type: 'value' as const,
        name: 'Cumulative XP',
        ...CHART_AXIS_STYLES,
        splitLine: CHART_SPLIT_LINE,
      },
      series: [
        {
          name: 'Cumulative XP',
          type: 'line',
          data: cumulativeData,
          areaStyle: { color: 'rgba(59, 130, 246, 0.1)' },
          lineStyle: { color: '#3b82f6', width: 2 },
          itemStyle: { color: '#3b82f6' },
          symbol: 'circle',
          symbolSize: 4,
          smooth: true,
        },
      ],
    }),
    [chartData.levels, cumulativeData],
  )

  const handleChange = (field: keyof typeof xp, value: string) => {
    const num = parseFloat(value)
    if (!Number.isNaN(num)) {
      setDraft('xp', { [field]: num })
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-white">XP & Leveling</h2>
        {hasDraft && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearDraftForKey('xp')}
            className="h-7 px-2 text-[11px] text-amber-400 hover:text-amber-300 hover:bg-amber-950/40"
          >
            Reset
          </Button>
        )}
      </div>

      {/* Formula display */}
      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300">Formula</CardTitle>
        </CardHeader>
        <CardContent>
          <code className="text-sm text-neutral-400">
            xpThreshold(level) = max(<span className="text-amber-400">{xp.XP_FORMULA_FLOOR}</span>,
            round(<span className="text-blue-400">{xp.XP_FORMULA_BASE}</span> + level ×{' '}
            <span className="text-green-400">{xp.XP_FORMULA_LINEAR}</span> + level² ×{' '}
            <span className="text-purple-400">{xp.XP_FORMULA_QUADRATIC}</span>))
          </code>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300">Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-blue-400">BASE</Label>
              <NumberInput
                value={xp.XP_FORMULA_BASE}
                onChange={(v) => handleChange('XP_FORMULA_BASE', v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-green-400">LINEAR</Label>
              <NumberInput
                step={0.1}
                value={xp.XP_FORMULA_LINEAR}
                onChange={(v) => handleChange('XP_FORMULA_LINEAR', v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-purple-400">QUADRATIC</Label>
              <NumberInput
                step={0.01}
                value={xp.XP_FORMULA_QUADRATIC}
                onChange={(v) => handleChange('XP_FORMULA_QUADRATIC', v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-amber-400">FLOOR</Label>
              <NumberInput
                value={xp.XP_FORMULA_FLOOR}
                onChange={(v) => handleChange('XP_FORMULA_FLOOR', v)}
              />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-neutral-600">
            XP per use: <span className="text-neutral-400">{xp.XP_PER_USE}</span>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-neutral-800 bg-neutral-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-300">XP per Level</CardTitle>
          </CardHeader>
          <CardContent>
            <LazyChart option={thresholdChartOptions} style={{ height: 320 }} />
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-300">
              Cumulative XP Curve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LazyChart option={cumulativeChartOptions} style={{ height: 320 }} />
          </CardContent>
        </Card>
      </div>

      {/* Data table */}
      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-neutral-300">Level Table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-800 text-left text-[11px] uppercase tracking-wider text-neutral-500">
                  <th className="px-3 py-2">Level</th>
                  <th className="px-3 py-2">XP Required</th>
                  <th className="px-3 py-2">Uses ({xp.XP_PER_USE} XP/use)</th>
                  <th className="px-3 py-2">Cumulative XP</th>
                  <th className="px-3 py-2">Cumulative Uses</th>
                </tr>
              </thead>
              <tbody>
                {chartData.levels.map((lvl, i) => (
                  <tr key={lvl} className="border-b border-neutral-800/50 text-neutral-300">
                    <td className="px-3 py-1.5 font-mono text-neutral-400">{lvl}</td>
                    <td className="px-3 py-1.5 font-mono">
                      {chartData.thresholds[i].toLocaleString()}
                    </td>
                    <td className="px-3 py-1.5 font-mono">{chartData.uses[i]}</td>
                    <td className="px-3 py-1.5 font-mono">{cumulativeData[i].toLocaleString()}</td>
                    <td className="px-3 py-1.5 font-mono">
                      {Math.ceil(cumulativeData[i] / xp.XP_PER_USE)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
