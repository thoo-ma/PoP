'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import LazyChart from '@/components/LazyChart'
import { useGameConfigStore } from '@/store/gameConfigStore'
import { useShallow } from 'zustand/react/shallow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { NumberInput } from '@/components/ui/number-input'
import { MAX_LEVEL } from '@pop/shared/xp'
import { TYPES, RARITIES, RARITY_COLORS, TYPE_COLORS } from '@/lib/constants'
import { CHART_TOOLTIP, CHART_LEGEND, CHART_AXIS_STYLES, CHART_SPLIT_LINE } from '@/lib/chartTheme'

function computeReward(
  type: string,
  rarity: string,
  level: number,
  cfg: {
    REWARD_BASE_PRICE_USD: number
    REWARD_GROWTH_RATE: number
    REWARD_USD_PER_TOKEN: number
    REWARD_TYPE_MULTIPLIER: Record<string, number>
    REWARD_RARITY_MULTIPLIER: Record<string, number>
  },
): number {
  const usd =
    cfg.REWARD_BASE_PRICE_USD *
    cfg.REWARD_GROWTH_RATE ** (level - 1) *
    (cfg.REWARD_TYPE_MULTIPLIER[type] ?? 1) *
    (cfg.REWARD_RARITY_MULTIPLIER[rarity] ?? 1)
  return Math.max(1, Math.round(usd / cfg.REWARD_USD_PER_TOKEN))
}

export function RewardTab() {
  const cur = useGameConfigStore(
    useShallow((s) => ({ ...s.config.currency, ...s.drafts.currency })),
  )
  const setDraft = useGameConfigStore((s) => s.setDraft)
  const [selectedType, setSelectedType] = useState<string>('cruise-seat')

  const chartOptions = useMemo(() => {
    const levels = Array.from({ length: MAX_LEVEL }, (_, i) => i + 1)
    const series = RARITIES.map((r) => ({
      name: r,
      type: 'line' as const,
      data: levels.map((lvl) => computeReward(selectedType, r, lvl, cur)),
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
        name: '$POOP Earned',
        ...CHART_AXIS_STYLES,
        splitLine: CHART_SPLIT_LINE,
      },
      series,
    }
  }, [cur, selectedType])

  const handleChange = (field: string, value: string) => {
    const num = parseFloat(value)
    if (Number.isNaN(num)) {
      toast.error('Please enter a valid number')
      return
    }
    setDraft('currency', { [field]: num })
  }

  const handleTypeMult = (type: string, value: string) => {
    const num = parseFloat(value)
    if (Number.isNaN(num)) {
      toast.error('Please enter a valid number')
      return
    }
    setDraft('currency', {
      REWARD_TYPE_MULTIPLIER: { ...cur.REWARD_TYPE_MULTIPLIER, [type]: num },
    })
  }

  const handleRarityMult = (rarity: string, value: string) => {
    const num = parseFloat(value)
    if (Number.isNaN(num)) {
      toast.error('Please enter a valid number')
      return
    }
    setDraft('currency', {
      REWARD_RARITY_MULTIPLIER: { ...cur.REWARD_RARITY_MULTIPLIER, [rarity]: num },
    })
  }

  return (
    <div className="space-y-4">
      {/* Formula */}
      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300">Reward Formula</CardTitle>
        </CardHeader>
        <CardContent>
          <code className="text-sm text-neutral-400">
            tokens = max(1, round(
            <span className="text-blue-400">{cur.REWARD_BASE_PRICE_USD}</span> ×{' '}
            <span className="text-green-400">{cur.REWARD_GROWTH_RATE}</span>
            <sup>(level-1)</sup> × typeMult × rarityMult /{' '}
            <span className="text-amber-400">{cur.REWARD_USD_PER_TOKEN}</span>))
          </code>
        </CardContent>
      </Card>

      {/* Scalar params */}
      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300">Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-blue-400">BASE_PRICE_USD</Label>
              <NumberInput
                step={0.001}
                value={cur.REWARD_BASE_PRICE_USD}
                onChange={(v) => handleChange('REWARD_BASE_PRICE_USD', v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-green-400">GROWTH_RATE</Label>
              <NumberInput
                step={0.01}
                value={cur.REWARD_GROWTH_RATE}
                onChange={(v) => handleChange('REWARD_GROWTH_RATE', v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-amber-400">USD_PER_TOKEN</Label>
              <NumberInput
                step={0.0001}
                value={cur.REWARD_USD_PER_TOKEN}
                onChange={(v) => handleChange('REWARD_USD_PER_TOKEN', v)}
              />
            </div>
          </div>

          {/* Type multipliers */}
          <div>
            <Label className="text-xs text-neutral-500 mb-2 block">Type Multipliers</Label>
            <div className="grid grid-cols-3 gap-3">
              {TYPES.map((t) => (
                <div key={t} className="space-y-1">
                  <Label className="text-[10px]" style={{ color: TYPE_COLORS[t] }}>
                    {t}
                  </Label>
                  <NumberInput
                    step={0.1}
                    value={cur.REWARD_TYPE_MULTIPLIER[t]}
                    onChange={(v) => handleTypeMult(t, v)}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Rarity multipliers */}
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
                    value={cur.REWARD_RARITY_MULTIPLIER[r]}
                    onChange={(v) => handleRarityMult(r, v)}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart with type selector */}
      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-neutral-300">Reward by Level</CardTitle>
            <div className="flex gap-1">
              {TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedType(t)}
                  className={`rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
                    selectedType === t
                      ? 'bg-neutral-700 text-white'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <LazyChart option={chartOptions} style={{ height: 320 }} />
        </CardContent>
      </Card>
    </div>
  )
}
