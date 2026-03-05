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

export default function LootRollPanel() {
  const loot             = useGameConfigStore(useShallow((s) => ({ ...s.config.loot_roll, ...s.drafts.loot_roll })))
  const source           = useGameConfigStore((s) => s.sources.loot_roll)
  const setDraft         = useGameConfigStore((s) => s.setDraft)
  const clearDraftForKey = useGameConfigStore((s) => s.clearDraftForKey)
  const hasDraft         = useGameConfigStore((s) => s.drafts.loot_roll !== undefined)

  const holds = useMemo(
    () => Array.from({ length: loot.MAX_HOLDS + 1 }, (_, i) => i),
    [loot.MAX_HOLDS],
  )

  const probabilities = useMemo(
    () => holds.map((h) => Math.min(1, loot.BASE_WIN_PROBABILITY + h * loot.PER_HOLD_INCREMENT)),
    [holds, loot.BASE_WIN_PROBABILITY, loot.PER_HOLD_INCREMENT],
  )

  const chartOptions = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: '#1a1a1a',
      borderColor: '#333',
      textStyle: { color: '#e5e5e5', fontSize: 12 },
      formatter: (params: Array<{ name: string; value: number }>) => {
        const h = params[0]?.name
        const pct = ((params[0]?.value ?? 0) * 100).toFixed(1)
        return `${h} hold${Number(h) !== 1 ? 's' : ''}: <b>${pct}%</b>`
      },
    },
    grid: { top: 30, right: 60, bottom: 40, left: 60 },
    xAxis: {
      type: 'category' as const,
      data: holds.map(String),
      name: 'Holds',
      nameLocation: 'middle' as const,
      nameGap: 28,
      axisLine: { lineStyle: { color: '#404040' } },
      axisLabel: { color: '#a3a3a3', fontSize: 11 },
      nameTextStyle: { color: '#a3a3a3', fontSize: 12 },
    },
    yAxis: {
      type: 'value' as const,
      name: 'Win Probability',
      min: 0,
      max: 1,
      nameTextStyle: { color: '#a3a3a3', fontSize: 12 },
      axisLine: { lineStyle: { color: '#404040' } },
      axisLabel: {
        color: '#a3a3a3',
        fontSize: 11,
        formatter: (v: number) => `${(v * 100).toFixed(0)}%`,
      },
      splitLine: { lineStyle: { color: '#262626' } },
    },
    series: [
      {
        name: 'P(win)',
        type: 'bar' as const,
        data: probabilities.map((p) => ({
          value: +p.toFixed(4),
          itemStyle: {
            color: `hsl(${Math.round(p * 120)}, 72%, 55%)`,
            borderRadius: [3, 3, 0, 0],
          },
        })),
        barMaxWidth: 60,
        label: {
          show: true,
          position: 'top' as const,
          color: '#e5e5e5',
          fontSize: 11,
          formatter: (p: { value: number }) => `${(p.value * 100).toFixed(1)}%`,
        },
      },
    ],
  }), [holds, probabilities])

  const handleChange = (field: keyof typeof loot, value: string) => {
    const num = field === 'MAX_HOLDS' ? parseInt(value, 10) : parseFloat(value)
    if (isNaN(num) || num < 0) return
    setDraft('loot_roll', { [field]: num })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-white">Loot Roll</h2>
        <Badge
          variant="outline"
          className={source === 'db'
            ? 'border-blue-800 text-blue-400 text-[10px]'
            : 'border-neutral-700 text-neutral-500 text-[10px]'}
        >
          {source === 'db' ? 'Live from DB' : 'Using defaults'}
        </Badge>
        {hasDraft && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearDraftForKey('loot_roll')}
            className="h-7 px-2 text-[11px] text-amber-400 hover:text-amber-300 hover:bg-amber-950/40"
          >
            Reset
          </Button>
        )}
      </div>

      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300">Formula</CardTitle>
        </CardHeader>
        <CardContent>
          <code className="text-sm text-neutral-400">
            P(win) = min(1,{' '}
            <span className="text-blue-400">{loot.BASE_WIN_PROBABILITY}</span> + holds ×{' '}
            <span className="text-green-400">{loot.PER_HOLD_INCREMENT}</span>)
          </code>
          <p className="mt-2 text-xs text-neutral-600">
            Max holds per session: <span className="text-neutral-400">{loot.MAX_HOLDS}</span>
          </p>
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300">Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-blue-400">BASE_WIN_PROBABILITY</Label>
              <NumberInput
                step={0.01} min={0} max={1}
                value={loot.BASE_WIN_PROBABILITY}
                onChange={(v) => handleChange('BASE_WIN_PROBABILITY', v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-green-400">PER_HOLD_INCREMENT</Label>
              <NumberInput
                step={0.01} min={0} max={1}
                value={loot.PER_HOLD_INCREMENT}
                onChange={(v) => handleChange('PER_HOLD_INCREMENT', v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-amber-400">MAX_HOLDS</Label>
              <NumberInput
                step={1} min={0} max={100}
                value={loot.MAX_HOLDS}
                onChange={(v) => handleChange('MAX_HOLDS', v)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-neutral-300">Win Probability by Holds</CardTitle>
        </CardHeader>
        <CardContent>
          <LazyChart option={chartOptions} style={{ height: 280 }} />
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-neutral-300">Probability Table</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-500">
                <th className="py-2 text-left px-3">Holds</th>
                <th className="py-2 text-left px-3">P(win)</th>
                <th className="py-2 text-left px-3">1-in-N</th>
              </tr>
            </thead>
            <tbody>
              {holds.map((h, i) => {
                const p = probabilities[i]
                return (
                  <tr key={h} className="border-b border-neutral-800/50 text-neutral-300">
                    <td className="px-3 py-1.5 font-mono text-neutral-400">{h}</td>
                    <td className="px-3 py-1.5 font-mono">{((p ?? 0) * 100).toFixed(1)}%</td>
                    <td className="px-3 py-1.5 font-mono text-neutral-500">
                      {p && p > 0 ? `1-in-${(1 / p).toFixed(1)}` : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
