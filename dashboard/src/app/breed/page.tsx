'use client'

import { useMemo } from 'react'
import LazyChart from '@/components/LazyChart'
import { useGameConfigStore } from '@/store/gameConfigStore'
import { useShallow } from 'zustand/react/shallow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NumberInput } from '@/components/ui/number-input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RARITIES, RARITY_COLORS } from '@/lib/constants'
import { CHART_TOOLTIP, CHART_LEGEND, CHART_AXIS_STYLES, CHART_SPLIT_LINE } from '@/lib/chartTheme'

const PAIR_KEYS = [
  'common+common',
  'common+rare',
  'rare+rare',
  'rare+legendary',
  'legendary+legendary',
  'legendary+transcendent',
  'transcendent+transcendent',
] as const

type PairKey = typeof PAIR_KEYS[number]

function rowSum(row: readonly [number, number, number, number]): number {
  return row[0] + row[1] + row[2] + row[3]
}

export default function BreedPanel() {
  const breed            = useGameConfigStore(useShallow((s) => ({ ...s.config.breed, ...s.drafts.breed })))
  const source           = useGameConfigStore((s) => s.sources.breed)
  const setDraft         = useGameConfigStore((s) => s.setDraft)
  const clearDraftForKey = useGameConfigStore((s) => s.clearDraftForKey)
  const hasDraft         = useGameConfigStore((s) => s.drafts.breed !== undefined)

  const chartOptions = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'shadow' as const },
      ...CHART_TOOLTIP,
    },
    legend: { data: [...RARITIES], ...CHART_LEGEND },
    grid: { top: 40, right: 20, bottom: 60, left: 160 },
    xAxis: {
      type: 'value' as const,
      max: 100,
      ...CHART_AXIS_STYLES,
      axisLabel: { color: '#a3a3a3', fontSize: 11, formatter: (v: number) => `${v}%` },
      splitLine: CHART_SPLIT_LINE,
    },
    yAxis: {
      type: 'category' as const,
      data: [...PAIR_KEYS],
      ...CHART_AXIS_STYLES,
    },
    series: RARITIES.map((r, i) => ({
      name: r,
      type: 'bar' as const,
      stack: 'total',
      itemStyle: { color: RARITY_COLORS[r] },
      label: {
        show: true,
        color: '#fff',
        fontSize: 10,
        formatter: (params: { value: number }) => params.value > 2 ? `${params.value}%` : '',
      },
      data: PAIR_KEYS.map((key) => breed.BREED_PROBABILITIES[key][i]),
    })),
  }), [breed])

  const handleChange = (pair: PairKey, idx: number, value: string) => {
    const num = parseFloat(value)
    if (isNaN(num) || num < 0 || num > 100) return
    const current = [...breed.BREED_PROBABILITIES[pair]] as [number, number, number, number]
    current[idx] = num
    setDraft('breed', {
      BREED_PROBABILITIES: { ...breed.BREED_PROBABILITIES, [pair]: current },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-white">Breeding Probabilities</h2>
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
            onClick={() => clearDraftForKey('breed')}
            className="h-7 px-2 text-[11px] text-amber-400 hover:text-amber-300 hover:bg-amber-950/40"
          >
            Reset
          </Button>
        )}
      </div>

      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300">
            Outcome Probabilities (%)
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-500">
                <th className="py-2 pr-4 text-left font-medium">Parent Pair</th>
                {RARITIES.map((r) => (
                  <th key={r} className="px-2 py-2 text-center font-medium capitalize" style={{ color: RARITY_COLORS[r] }}>
                    {r}
                  </th>
                ))}
                <th className="px-2 py-2 text-center font-medium text-neutral-500">Sum</th>
              </tr>
            </thead>
            <tbody>
              {PAIR_KEYS.map((pair) => {
                const row = breed.BREED_PROBABILITIES[pair]
                const sum = rowSum(row)
                const invalid = Math.abs(sum - 100) > 0.01
                return (
                  <tr key={pair} className="border-b border-neutral-800/50">
                    <td className="py-1.5 pr-4 font-mono text-[11px] text-neutral-400">{pair}</td>
                    {RARITIES.map((_, idx) => (
                      <td key={idx} className="px-2 py-1">
                        <NumberInput
                          step={0.1}
                          min={0}
                          max={100}
                          value={row[idx]}
                          onChange={(v) => handleChange(pair, idx, v)}
                          size="sm"
                          className="w-20"
                        />
                      </td>
                    ))}
                    <td className="px-2 py-1.5 text-center font-mono text-sm">
                      <span className={invalid ? 'font-bold text-red-400' : 'text-neutral-400'}>
                        {sum.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p className="mt-2 text-[11px] text-neutral-600">
            Each row must sum to 100. Rows highlighted in red are invalid.
          </p>
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-neutral-300">Outcome Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <LazyChart option={chartOptions} style={{ height: 340 }} />
        </CardContent>
      </Card>

      {/* Rarity legend */}
      <div className="flex gap-6">
        {RARITIES.map((r) => (
          <div key={r} className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: RARITY_COLORS[r] }} />
            <span className="text-xs capitalize text-neutral-400">{r}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
