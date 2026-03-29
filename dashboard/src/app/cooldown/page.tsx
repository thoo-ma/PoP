'use client'

import { useMemo } from 'react'
import LazyChart from '@/components/LazyChart'
import { useGameConfigStore } from '@/store/gameConfigStore'
import { useShallow } from 'zustand/react/shallow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { NumberInput } from '@/components/ui/number-input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MAX_LEVEL } from '@pop/shared/xp'
import { calcCooldownHours } from '@pop/shared/cooldown'
import { TYPES, TYPE_COLORS } from '@/lib/constants'
import { CHART_TOOLTIP, CHART_LEGEND, CHART_AXIS_STYLES, CHART_SPLIT_LINE } from '@/lib/chartTheme'

function formatHours(h: number): string {
  if (h < 1) return `${Math.round(h * 60)}m`
  const hrs = Math.floor(h)
  const mins = Math.round((h - hrs) * 60)
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`
}

export default function CooldownPanel() {
  const cd = useGameConfigStore(useShallow((s) => ({ ...s.config.cooldown, ...s.drafts.cooldown })))
  const source = useGameConfigStore((s) => s.sources.cooldown)
  const setDraft = useGameConfigStore((s) => s.setDraft)
  const clearDraftForKey = useGameConfigStore((s) => s.clearDraftForKey)
  const hasDraft = useGameConfigStore((s) => s.drafts.cooldown !== undefined)

  const levels = useMemo(() => Array.from({ length: MAX_LEVEL }, (_, i) => i + 1), [])

  const chartOptions = useMemo(() => {
    const series = TYPES.map((t) => ({
      name: t,
      type: 'line' as const,
      data: levels.map((lvl) => +calcCooldownHours(t, lvl, cd).toFixed(2)),
      lineStyle: { color: TYPE_COLORS[t], width: 2 },
      itemStyle: { color: TYPE_COLORS[t] },
      symbol: 'circle' as const,
      symbolSize: 4,
      areaStyle: { color: `${TYPE_COLORS[t]}10` },
    }))

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis' as const,
        ...CHART_TOOLTIP,
        formatter: (
          params: Array<{ name: string; value: number; seriesName: string; color: string }>,
        ) => {
          const lvl = params[0]?.name
          const lines = params.map(
            (p) =>
              `<span style="color:${p.color}">●</span> ${p.seriesName}: <b>${formatHours(p.value)}</b>`,
          )
          return `Level ${lvl}<br/>${lines.join('<br/>')}`
        },
      },
      legend: { data: [...TYPES], ...CHART_LEGEND },
      grid: { top: 40, right: 40, bottom: 40, left: 60 },
      xAxis: {
        type: 'category' as const,
        data: levels.map(String),
        name: 'Level',
        nameLocation: 'middle' as const,
        nameGap: 28,
        ...CHART_AXIS_STYLES,
      },
      yAxis: {
        type: 'value' as const,
        name: 'Hours',
        ...CHART_AXIS_STYLES,
        splitLine: CHART_SPLIT_LINE,
      },
      series,
    }
  }, [cd, levels])

  const handleBase = (type: string, value: string) => {
    const num = parseFloat(value)
    if (!isNaN(num)) {
      setDraft('cooldown', {
        COOLDOWN_BASES: { ...cd.COOLDOWN_BASES, [type]: num },
      })
    }
  }

  const handleScalar = (field: 'LINEAR_MULT' | 'EXP_MULT', value: string) => {
    const num = parseFloat(value)
    if (!isNaN(num)) setDraft('cooldown', { [field]: num })
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-white">Cooldown</h2>
        <Badge
          variant="outline"
          className={
            source === 'db'
              ? 'border-blue-800 text-blue-400 text-[10px]'
              : 'border-neutral-700 text-neutral-500 text-[10px]'
          }
        >
          {source === 'db' ? 'Live from DB' : 'Using defaults'}
        </Badge>
        {hasDraft && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearDraftForKey('cooldown')}
            className="h-7 px-2 text-[11px] text-amber-400 hover:text-amber-300 hover:bg-amber-950/40"
          >
            Reset
          </Button>
        )}
      </div>

      {/* Formula */}
      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300">Formula</CardTitle>
        </CardHeader>
        <CardContent>
          <code className="text-sm text-neutral-400">
            cooldown_hours = <span className="text-blue-400">base</span> + level ×{' '}
            <span className="text-green-400">{cd.LINEAR_MULT}</span> + level² ×{' '}
            <span className="text-purple-400">{cd.EXP_MULT}</span>
          </code>
        </CardContent>
      </Card>

      {/* Parameters */}
      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300">Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs text-neutral-500 mb-2 block">Base Cooldown (hours)</Label>
            <div className="grid grid-cols-3 gap-3">
              {TYPES.map((t) => (
                <div key={t} className="space-y-1">
                  <Label className="text-[10px]" style={{ color: TYPE_COLORS[t] }}>
                    {t}
                  </Label>
                  <NumberInput
                    step={0.5}
                    value={cd.COOLDOWN_BASES[t]}
                    onChange={(v) => handleBase(t, v)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-green-400">LINEAR_MULT</Label>
              <NumberInput
                step={0.01}
                value={cd.LINEAR_MULT}
                onChange={(v) => handleScalar('LINEAR_MULT', v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-purple-400">EXP_MULT</Label>
              <NumberInput
                step={0.001}
                value={cd.EXP_MULT}
                onChange={(v) => handleScalar('EXP_MULT', v)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-neutral-300">Cooldown by Level</CardTitle>
        </CardHeader>
        <CardContent>
          <LazyChart option={chartOptions} style={{ height: 360 }} />
        </CardContent>
      </Card>

      {/* Data table */}
      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-neutral-300">Cooldown Table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-800 text-left text-[11px] uppercase tracking-wider text-neutral-500">
                  <th className="px-3 py-2">Level</th>
                  {TYPES.map((t) => (
                    <th key={t} className="px-3 py-2" style={{ color: TYPE_COLORS[t] }}>
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {levels.map((lvl) => (
                  <tr key={lvl} className="border-b border-neutral-800/50 text-neutral-300">
                    <td className="px-3 py-1.5 font-mono text-neutral-400">{lvl}</td>
                    {TYPES.map((t) => (
                      <td key={t} className="px-3 py-1.5 font-mono">
                        {formatHours(calcCooldownHours(t, lvl, cd))}
                      </td>
                    ))}
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
