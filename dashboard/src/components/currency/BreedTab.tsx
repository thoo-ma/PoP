'use client'

import { useMemo } from 'react'
import LazyChart from '@/components/LazyChart'
import { useGameConfigStore } from '@/store/gameConfigStore'
import { useShallow } from 'zustand/react/shallow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { NumberInput } from '@/components/ui/number-input'
import { RARITIES, RARITY_COLORS } from '@/lib/constants'
import { CHART_TOOLTIP, CHART_LEGEND, CHART_AXIS_STYLES, CHART_SPLIT_LINE } from '@/lib/chartTheme'

function computeBreed(
  breedCount: number,
  rarity: string,
  cfg: {
    BREED_BASE_PRICE_USD: number
    BREED_GROWTH_RATE: number
    BREED_USD_PER_TOKEN: number
    BREED_RARITY_MULTIPLIER: Record<string, number>
  },
): number {
  const usd =
    cfg.BREED_BASE_PRICE_USD *
    Math.pow(cfg.BREED_GROWTH_RATE, breedCount) *
    (cfg.BREED_RARITY_MULTIPLIER[rarity] ?? 1)
  return Math.round(usd / cfg.BREED_USD_PER_TOKEN)
}

export function BreedTab() {
  const cur = useGameConfigStore(
    useShallow((s) => ({ ...s.config.currency, ...s.drafts.currency })),
  )
  const setDraft = useGameConfigStore((s) => s.setDraft)

  const chartOptions = useMemo(() => {
    const counts = Array.from({ length: cur.BREED_MAX_COUNT + 1 }, (_, i) => i)
    const series = RARITIES.map((r) => ({
      name: r,
      type: 'bar' as const,
      data: counts.map((c) => computeBreed(c, r, cur)),
      itemStyle: { color: RARITY_COLORS[r] },
      barMaxWidth: 20,
    }))
    return {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis' as const, ...CHART_TOOLTIP },
      legend: { data: [...RARITIES], ...CHART_LEGEND },
      grid: { top: 40, right: 40, bottom: 40, left: 80 },
      xAxis: {
        type: 'category' as const,
        data: counts.map(String),
        name: 'Breed Count',
        nameLocation: 'middle' as const,
        nameGap: 28,
        ...CHART_AXIS_STYLES,
      },
      yAxis: {
        type: 'value' as const,
        name: '$POOP Cost',
        ...CHART_AXIS_STYLES,
        splitLine: CHART_SPLIT_LINE,
      },
      series,
    }
  }, [cur])

  const handleChange = (field: string, value: string) => {
    const num = parseFloat(value)
    if (!isNaN(num)) setDraft('currency', { [field]: num })
  }

  const handleRarityMult = (rarity: string, value: string) => {
    const num = parseFloat(value)
    if (!isNaN(num)) {
      setDraft('currency', {
        BREED_RARITY_MULTIPLIER: { ...cur.BREED_RARITY_MULTIPLIER, [rarity]: num },
      })
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300">Breed Formula</CardTitle>
        </CardHeader>
        <CardContent>
          <code className="text-sm text-neutral-400">
            tokens = round(<span className="text-blue-400">{cur.BREED_BASE_PRICE_USD}</span> ×{' '}
            <span className="text-green-400">{cur.BREED_GROWTH_RATE}</span>
            <sup>breedCount</sup> × rarityMult /{' '}
            <span className="text-amber-400">{cur.BREED_USD_PER_TOKEN}</span>)
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
              <Label className="text-xs text-blue-400">BASE_PRICE_USD</Label>
              <NumberInput
                step={0.01}
                value={cur.BREED_BASE_PRICE_USD}
                onChange={(v) => handleChange('BREED_BASE_PRICE_USD', v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-green-400">GROWTH_RATE</Label>
              <NumberInput
                step={0.1}
                value={cur.BREED_GROWTH_RATE}
                onChange={(v) => handleChange('BREED_GROWTH_RATE', v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-amber-400">USD_PER_TOKEN</Label>
              <NumberInput
                step={0.0001}
                value={cur.BREED_USD_PER_TOKEN}
                onChange={(v) => handleChange('BREED_USD_PER_TOKEN', v)}
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
                    step={1}
                    value={cur.BREED_RARITY_MULTIPLIER[r]}
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
            Breed Cost Escalation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LazyChart option={chartOptions} style={{ height: 320 }} />
        </CardContent>
      </Card>

      {/* Cost table */}
      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-neutral-300">Cost Table ($POOP)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-800 text-left text-[11px] uppercase tracking-wider text-neutral-500">
                  <th className="px-3 py-2">Breed #</th>
                  {RARITIES.map((r) => (
                    <th key={r} className="px-3 py-2" style={{ color: RARITY_COLORS[r] }}>
                      {r}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: cur.BREED_MAX_COUNT + 1 }, (_, i) => (
                  <tr key={i} className="border-b border-neutral-800/50 text-neutral-300">
                    <td className="px-3 py-1.5 font-mono text-neutral-400">{i}</td>
                    {RARITIES.map((r) => (
                      <td key={r} className="px-3 py-1.5 font-mono">
                        {computeBreed(i, r, cur).toLocaleString()}
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
