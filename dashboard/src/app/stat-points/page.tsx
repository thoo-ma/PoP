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
import { RARITIES, RARITY_COLORS } from '@/lib/constants'
import { CHART_TOOLTIP, CHART_AXIS_STYLES, CHART_SPLIT_LINE } from '@/lib/chartTheme'

export default function StatPointsPanel() {
  const sp = useGameConfigStore(
    useShallow((s) => ({ ...s.config.stat_points, ...s.drafts.stat_points })),
  )
  const source = useGameConfigStore((s) => s.sources.stat_points)
  const setDraft = useGameConfigStore((s) => s.setDraft)
  const clearDraftForKey = useGameConfigStore((s) => s.clearDraftForKey)
  const hasDraft = useGameConfigStore((s) => s.drafts.stat_points !== undefined)

  const chartOptions = useMemo(
    () => ({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item' as const,
        ...CHART_TOOLTIP,
      },
      grid: { top: 20, right: 40, bottom: 40, left: 60 },
      xAxis: {
        type: 'category' as const,
        data: [...RARITIES],
        ...CHART_AXIS_STYLES,
        axisLabel: {
          color: '#a3a3a3',
          fontSize: 11,
          formatter: (v: string) => v.charAt(0).toUpperCase() + v.slice(1),
        },
      },
      yAxis: {
        type: 'value' as const,
        name: 'Points / level',
        min: 0,
        ...CHART_AXIS_STYLES,
        splitLine: CHART_SPLIT_LINE,
      },
      series: [
        {
          name: 'Stat Points',
          type: 'bar' as const,
          barMaxWidth: 60,
          data: RARITIES.map((r) => ({
            value: sp.STAT_POINTS_BY_RARITY[r],
            itemStyle: { color: RARITY_COLORS[r], borderRadius: [3, 3, 0, 0] },
          })),
          label: {
            show: true,
            position: 'top' as const,
            color: '#e5e5e5',
            fontSize: 13,
            fontWeight: 'bold' as const,
          },
        },
      ],
    }),
    [sp],
  )

  const handleChange = (rarity: string, value: string) => {
    const num = parseInt(value, 10)
    if (!isNaN(num) && num >= 0) {
      setDraft('stat_points', {
        STAT_POINTS_BY_RARITY: { ...sp.STAT_POINTS_BY_RARITY, [rarity]: num },
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-white">Stat Points</h2>
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
            onClick={() => clearDraftForKey('stat_points')}
            className="h-7 px-2 text-[11px] text-amber-400 hover:text-amber-300 hover:bg-amber-950/40"
          >
            Reset
          </Button>
        )}
      </div>

      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300">
            Points per Level-Up by Rarity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {RARITIES.map((r) => (
              <div key={r} className="space-y-1.5">
                <Label
                  className="text-xs font-medium capitalize"
                  style={{ color: RARITY_COLORS[r] }}
                >
                  {r}
                </Label>
                <NumberInput
                  min={0}
                  step={1}
                  value={sp.STAT_POINTS_BY_RARITY[r]}
                  onChange={(v) => handleChange(r, v)}
                  className="h-10"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-neutral-300">
            Points per Level-Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LazyChart option={chartOptions} style={{ height: 260 }} />
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-neutral-300">
            Cumulative at Max Level ({MAX_LEVEL})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {RARITIES.map((r) => {
              const total = sp.STAT_POINTS_BY_RARITY[r] * (MAX_LEVEL - 1)
              return (
                <div
                  key={r}
                  className="rounded-md border border-neutral-800 bg-neutral-950 p-4 text-center"
                >
                  <div className="text-[11px] capitalize mb-1" style={{ color: RARITY_COLORS[r] }}>
                    {r}
                  </div>
                  <div className="text-3xl font-bold text-white">{total}</div>
                  <div className="text-[10px] text-neutral-600 mt-1">total stat pts</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
