'use client'

import { useMemo } from 'react'
import { toast } from 'sonner'
import LazyChart from '@/components/LazyChart'
import { useGameConfigStore } from '@/store/gameConfigStore'
import { useShallow } from 'zustand/react/shallow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { NumberInput } from '@/components/ui/number-input'
import { MAX_LEVEL } from '@pop/shared/xp'
import { RARITIES, RARITY_COLORS } from '@/lib/constants'
import { CHART_TOOLTIP, CHART_LEGEND, CHART_AXIS_STYLES, CHART_SPLIT_LINE } from '@/lib/chartTheme'

function computeRepair(
  level: number,
  rarity: string,
  energyPct: number,
  cfg: {
    REPAIR_COEF_A: number
    REPAIR_COEF_B: number
    REPAIR_USD_PER_TOKEN: number
    REPAIR_RARITY_MULTIPLIER: Record<string, number>
  },
): number {
  const fullUsd =
    (cfg.REPAIR_COEF_A * level ** 2 + cfg.REPAIR_COEF_B) *
    (cfg.REPAIR_RARITY_MULTIPLIER[rarity] ?? 1)
  return Math.round((energyPct * fullUsd) / cfg.REPAIR_USD_PER_TOKEN)
}

export function RepairTab() {
  const cur = useGameConfigStore(
    useShallow((s) => ({ ...s.config.currency, ...s.drafts.currency })),
  )
  const setDraft = useGameConfigStore((s) => s.setDraft)

  const chartOptions = useMemo(() => {
    const levels = Array.from({ length: MAX_LEVEL }, (_, i) => i + 1)
    const series = RARITIES.map((r) => ({
      name: r,
      type: 'line' as const,
      data: levels.map((lvl) => computeRepair(lvl, r, 1.0, cur)),
      lineStyle: { color: RARITY_COLORS[r], width: 2 },
      itemStyle: { color: RARITY_COLORS[r] },
      symbol: 'circle' as const,
      symbolSize: 4,
    }))
    return {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis' as const, ...CHART_TOOLTIP },
      legend: { data: [...RARITIES], ...CHART_LEGEND },
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
        name: '$POOP (full repair)',
        ...CHART_AXIS_STYLES,
        splitLine: CHART_SPLIT_LINE,
      },
      series,
    }
  }, [cur])

  const handleChange = (field: string, value: string) => {
    const num = parseFloat(value)
    if (Number.isNaN(num)) {
      toast.error('Please enter a valid number')
      return
    }
    setDraft('currency', { [field]: num })
  }

  const handleRarityMult = (rarity: string, value: string) => {
    const num = parseFloat(value)
    if (Number.isNaN(num)) {
      toast.error('Please enter a valid number')
      return
    }
    setDraft('currency', {
      REPAIR_RARITY_MULTIPLIER: { ...cur.REPAIR_RARITY_MULTIPLIER, [rarity]: num },
    })
  }

  return (
    <div className="space-y-4">
      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300">Repair Formula</CardTitle>
        </CardHeader>
        <CardContent>
          <code className="text-sm text-neutral-400">
            tokens = round((<span className="text-blue-400">{cur.REPAIR_COEF_A}</span> × level² +{' '}
            <span className="text-green-400">{cur.REPAIR_COEF_B}</span>) × rarityMult /{' '}
            <span className="text-amber-400">{cur.REPAIR_USD_PER_TOKEN}</span> × Δenergy/maxEnergy)
          </code>
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300">Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-blue-400">COEF_A</Label>
              <NumberInput
                step={0.01}
                value={cur.REPAIR_COEF_A}
                onChange={(v) => handleChange('REPAIR_COEF_A', v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-green-400">COEF_B</Label>
              <NumberInput
                step={0.01}
                value={cur.REPAIR_COEF_B}
                onChange={(v) => handleChange('REPAIR_COEF_B', v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-amber-400">USD_PER_TOKEN</Label>
              <NumberInput
                step={0.0001}
                value={cur.REPAIR_USD_PER_TOKEN}
                onChange={(v) => handleChange('REPAIR_USD_PER_TOKEN', v)}
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-neutral-500 mb-2 block">Rarity Multipliers</Label>
            <div className="grid grid-cols-4 gap-3">
              {RARITIES.map((r) => (
                <div key={r} className="space-y-1">
                  <Label className="text-[10px]" style={{ color: RARITY_COLORS[r] }}>
                    {r}
                  </Label>
                  <NumberInput
                    step={0.1}
                    value={cur.REPAIR_RARITY_MULTIPLIER[r]}
                    onChange={(v) => handleRarityMult(r, v)}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-neutral-300">
            Full Repair Cost by Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LazyChart option={chartOptions} style={{ height: 320 }} />
        </CardContent>
      </Card>
    </div>
  )
}
