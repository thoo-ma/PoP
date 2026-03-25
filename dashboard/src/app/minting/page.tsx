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
import { RARITIES, RARITY_COLORS } from '@/lib/constants'

export default function MintingPanel() {
  const minting          = useGameConfigStore(useShallow((s) => ({ ...s.config.minting, ...s.drafts.minting })))
  const source           = useGameConfigStore((s) => s.sources.minting)
  const setDraft         = useGameConfigStore((s) => s.setDraft)
  const clearDraftForKey = useGameConfigStore((s) => s.clearDraftForKey)
  const hasDraft         = useGameConfigStore((s) => s.drafts.minting !== undefined)

  const chartOptions = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'shadow' as const },
      backgroundColor: '#1a1a1a',
      borderColor: '#333',
      textStyle: { color: '#e5e5e5', fontSize: 12 },
      formatter: (params: Array<{ seriesName: string; value: number; color: string; name: string }>) => {
        const rarity = params[0]?.name ?? ''
        const minV = minting.STAT_RANGES[rarity as keyof typeof minting.STAT_RANGES]?.[0] ?? 0
        const maxV = minting.STAT_RANGES[rarity as keyof typeof minting.STAT_RANGES]?.[1] ?? 0
        return `${rarity}<br/>Range: <b>${minV} – ${maxV}</b>`
      },
    },
    grid: { top: 20, right: 40, bottom: 40, left: 120 },
    xAxis: {
      type: 'value' as const,
      min: 0,
      max: 100,
      axisLabel: { color: '#a3a3a3', fontSize: 11 },
      axisLine: { lineStyle: { color: '#404040' } },
      splitLine: { lineStyle: { color: '#262626' } },
    },
    yAxis: {
      type: 'category' as const,
      data: [...RARITIES].map((r) => r.charAt(0).toUpperCase() + r.slice(1)),
      axisLine: { lineStyle: { color: '#404040' } },
      axisLabel: { color: '#a3a3a3', fontSize: 11 },
    },
    series: [
      {
        name: 'Start',
        type: 'bar' as const,
        stack: 'range',
        itemStyle: { color: 'transparent' },
        data: RARITIES.map((r) => minting.STAT_RANGES[r]?.[0] ?? 0),
      },
      {
        name: 'Range',
        type: 'bar' as const,
        stack: 'range',
        barMaxWidth: 30,
        itemStyle: {
          color: undefined as unknown as string,
          borderRadius: [0, 4, 4, 0],
        },
        data: RARITIES.map((r) => ({
          value: (minting.STAT_RANGES[r]?.[1] ?? 0) - (minting.STAT_RANGES[r]?.[0] ?? 0),
          itemStyle: { color: RARITY_COLORS[r], borderRadius: [0, 4, 4, 0] },
        })),
        label: {
          show: true,
          position: 'right' as const,
          color: '#a3a3a3',
          fontSize: 11,
          formatter: (_: unknown, idx?: number) => {
            if (idx === undefined) return ''
            const r = RARITIES[idx]
            if (!r) return ''
            return `${minting.STAT_RANGES[r]?.[0]} – ${minting.STAT_RANGES[r]?.[1]}`
          },
        },
      },
    ],
  }), [minting])

  const handleChange = (rarity: string, slot: 0 | 1, value: string) => {
    const num = parseInt(value, 10)
    if (isNaN(num) || num < 0 || num > 100) return
    const current = [...(minting.STAT_RANGES[rarity as keyof typeof minting.STAT_RANGES] ?? [0, 100])] as [number, number]
    current[slot] = num
    // Enforce min ≤ max
    if (slot === 0 && current[0] > current[1]) current[1] = current[0]
    if (slot === 1 && current[1] < current[0]) current[0] = current[1]
    setDraft('minting', {
      STAT_RANGES: { ...minting.STAT_RANGES, [rarity]: current },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-white">Minting Stats</h2>
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
            onClick={() => clearDraftForKey('minting')}
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
            base_stat = rand(<span className="text-blue-400">min</span>,{' '}
            <span className="text-green-400">max</span>) — uniform draw at mint time, per rarity
          </code>
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300">Stat Ranges [min, max]</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {RARITIES.map((r) => {
              const [min, max] = minting.STAT_RANGES[r] ?? [0, 100]
              const invalid = min > max
              return (
                <div key={r} className="space-y-2">
                  <Label className="text-xs font-medium capitalize" style={{ color: RARITY_COLORS[r] }}>
                    {r}
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 space-y-1">
                      <div className="text-[10px] text-neutral-600">Min</div>
                      <NumberInput
                        min={0}
                        max={100}
                        value={min}
                        onChange={(v) => handleChange(r, 0, v)}
                        className={invalid ? 'border-red-700' : ''}
                      />
                    </div>
                    <span className="mt-4 text-neutral-600">–</span>
                    <div className="flex-1 space-y-1">
                      <div className="text-[10px] text-neutral-600">Max</div>
                      <NumberInput
                        min={0}
                        max={100}
                        value={max}
                        onChange={(v) => handleChange(r, 1, v)}
                        className={invalid ? 'border-red-700' : ''}
                      />
                    </div>
                  </div>
                  <div className="text-[10px] text-neutral-600 text-center">
                    avg: {((min + max) / 2).toFixed(1)}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-neutral-300">Range Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <LazyChart option={chartOptions} style={{ height: 220 }} />
        </CardContent>
      </Card>
    </div>
  )
}
