'use client'

import { useMemo, useState } from 'react'
import LazyChart from '@/components/LazyChart'
import { useGameConfigStore } from '@/store/gameConfigStore'
import { useShallow } from 'zustand/react/shallow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { NumberInput } from '@/components/ui/number-input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MAX_LEVEL } from '@shared/xp'

const TYPES    = ['turbo-flush', 'cruise-seat', 'zen-fortress'] as const
const RARITIES = ['common', 'rare', 'legendary', 'transcendent'] as const
const RARITY_COLORS: Record<string, string> = {
  common:       '#a3a3a3',
  rare:         '#3b82f6',
  legendary:    '#f59e0b',
  transcendent: '#a855f7',
}
const TYPE_COLORS: Record<string, string> = {
  'turbo-flush':  '#ef4444',
  'cruise-seat':  '#22c55e',
  'zen-fortress': '#3b82f6',
}

// ─── Inline compute helpers (avoids .ts extension import issues) ──────────────

function computeReward(
  type: string, rarity: string, level: number,
  cfg: { REWARD_BASE_PRICE_USD: number; REWARD_GROWTH_RATE: number; REWARD_USD_PER_TOKEN: number;
         REWARD_TYPE_MULTIPLIER: Record<string, number>; REWARD_RARITY_MULTIPLIER: Record<string, number> },
): number {
  const usd = cfg.REWARD_BASE_PRICE_USD
    * Math.pow(cfg.REWARD_GROWTH_RATE, level - 1)
    * (cfg.REWARD_TYPE_MULTIPLIER[type] ?? 1)
    * (cfg.REWARD_RARITY_MULTIPLIER[rarity] ?? 1)
  return Math.max(1, Math.round(usd / cfg.REWARD_USD_PER_TOKEN))
}

function computeRepair(
  level: number, rarity: string, energyPct: number,
  cfg: { REPAIR_COEF_A: number; REPAIR_COEF_B: number; REPAIR_USD_PER_TOKEN: number;
         REPAIR_RARITY_MULTIPLIER: Record<string, number> },
): number {
  const fullUsd = (cfg.REPAIR_COEF_A * Math.pow(level, 2) + cfg.REPAIR_COEF_B)
    * (cfg.REPAIR_RARITY_MULTIPLIER[rarity] ?? 1)
  return Math.round(energyPct * fullUsd / cfg.REPAIR_USD_PER_TOKEN)
}

function computeBreed(
  breedCount: number, rarity: string,
  cfg: { BREED_BASE_PRICE_USD: number; BREED_GROWTH_RATE: number; BREED_USD_PER_TOKEN: number;
         BREED_RARITY_MULTIPLIER: Record<string, number> },
): number {
  const usd = cfg.BREED_BASE_PRICE_USD
    * Math.pow(cfg.BREED_GROWTH_RATE, breedCount)
    * (cfg.BREED_RARITY_MULTIPLIER[rarity] ?? 1)
  return Math.round(usd / cfg.BREED_USD_PER_TOKEN)
}

// ─── Sub-panels ───────────────────────────────────────────────────────────────

function RewardTab() {
  const cur = useGameConfigStore(useShallow((s) => ({ ...s.config.currency, ...s.drafts.currency })))
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
      tooltip: {
        trigger: 'axis' as const,
        backgroundColor: '#1a1a1a',
        borderColor: '#333',
        textStyle: { color: '#e5e5e5', fontSize: 12 },
      },
      legend: {
        data: [...RARITIES],
        textStyle: { color: '#a3a3a3', fontSize: 11 },
        top: 0,
      },
      grid: { top: 40, right: 40, bottom: 40, left: 60 },
      xAxis: {
        type: 'category' as const,
        data: levels.map(String),
        name: 'Level',
        nameLocation: 'middle' as const,
        nameGap: 28,
        axisLine: { lineStyle: { color: '#404040' } },
        axisLabel: { color: '#a3a3a3', fontSize: 11 },
        nameTextStyle: { color: '#a3a3a3', fontSize: 12 },
      },
      yAxis: {
        type: 'value' as const,
        name: '$POOP Earned',
        nameTextStyle: { color: '#a3a3a3', fontSize: 12 },
        axisLine: { lineStyle: { color: '#404040' } },
        axisLabel: { color: '#a3a3a3', fontSize: 11 },
        splitLine: { lineStyle: { color: '#262626' } },
      },
      series,
    }
  }, [cur, selectedType])

  const handleChange = (field: string, value: string) => {
    const num = parseFloat(value)
    if (!isNaN(num)) setDraft('currency', { [field]: num })
  }

  const handleTypeMult = (type: string, value: string) => {
    const num = parseFloat(value)
    if (!isNaN(num)) {
      setDraft('currency', {
        REWARD_TYPE_MULTIPLIER: { ...cur.REWARD_TYPE_MULTIPLIER, [type]: num },
      })
    }
  }

  const handleRarityMult = (rarity: string, value: string) => {
    const num = parseFloat(value)
    if (!isNaN(num)) {
      setDraft('currency', {
        REWARD_RARITY_MULTIPLIER: { ...cur.REWARD_RARITY_MULTIPLIER, [rarity]: num },
      })
    }
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
              <NumberInput step={0.001} value={cur.REWARD_BASE_PRICE_USD}
                onChange={(v) => handleChange('REWARD_BASE_PRICE_USD', v)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-green-400">GROWTH_RATE</Label>
              <NumberInput step={0.01} value={cur.REWARD_GROWTH_RATE}
                onChange={(v) => handleChange('REWARD_GROWTH_RATE', v)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-amber-400">USD_PER_TOKEN</Label>
              <NumberInput step={0.0001} value={cur.REWARD_USD_PER_TOKEN}
                onChange={(v) => handleChange('REWARD_USD_PER_TOKEN', v)} />
            </div>
          </div>

          {/* Type multipliers */}
          <div>
            <Label className="text-xs text-neutral-500 mb-2 block">Type Multipliers</Label>
            <div className="grid grid-cols-3 gap-3">
              {TYPES.map((t) => (
                <div key={t} className="space-y-1">
                  <Label className="text-[10px]" style={{ color: TYPE_COLORS[t] }}>{t}</Label>
                  <NumberInput step={0.1} value={cur.REWARD_TYPE_MULTIPLIER[t]}
                    onChange={(v) => handleTypeMult(t, v)} size="sm" />
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
                  <Label className="text-[10px]" style={{ color: RARITY_COLORS[r] }}>{r}</Label>
                  <NumberInput step={0.1} value={cur.REWARD_RARITY_MULTIPLIER[r]}
                    onChange={(v) => handleRarityMult(r, v)} size="sm" />
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
            <CardTitle className="text-sm font-medium text-neutral-300">
              Reward by Level
            </CardTitle>
            <div className="flex gap-1">
              {TYPES.map((t) => (
                <button
                  key={t}
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

function RepairTab() {
  const cur = useGameConfigStore(useShallow((s) => ({ ...s.config.currency, ...s.drafts.currency })))
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
      tooltip: {
        trigger: 'axis' as const,
        backgroundColor: '#1a1a1a',
        borderColor: '#333',
        textStyle: { color: '#e5e5e5', fontSize: 12 },
      },
      legend: {
        data: [...RARITIES],
        textStyle: { color: '#a3a3a3', fontSize: 11 },
        top: 0,
      },
      grid: { top: 40, right: 40, bottom: 40, left: 60 },
      xAxis: {
        type: 'category' as const,
        data: levels.map(String),
        name: 'Level',
        nameLocation: 'middle' as const,
        nameGap: 28,
        axisLine: { lineStyle: { color: '#404040' } },
        axisLabel: { color: '#a3a3a3', fontSize: 11 },
        nameTextStyle: { color: '#a3a3a3', fontSize: 12 },
      },
      yAxis: {
        type: 'value' as const,
        name: '$POOP (full repair)',
        nameTextStyle: { color: '#a3a3a3', fontSize: 12 },
        axisLine: { lineStyle: { color: '#404040' } },
        axisLabel: { color: '#a3a3a3', fontSize: 11 },
        splitLine: { lineStyle: { color: '#262626' } },
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
        REPAIR_RARITY_MULTIPLIER: { ...cur.REPAIR_RARITY_MULTIPLIER, [rarity]: num },
      })
    }
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
              <NumberInput step={0.01} value={cur.REPAIR_COEF_A}
                onChange={(v) => handleChange('REPAIR_COEF_A', v)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-green-400">COEF_B</Label>
              <NumberInput step={0.01} value={cur.REPAIR_COEF_B}
                onChange={(v) => handleChange('REPAIR_COEF_B', v)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-amber-400">USD_PER_TOKEN</Label>
              <NumberInput step={0.0001} value={cur.REPAIR_USD_PER_TOKEN}
                onChange={(v) => handleChange('REPAIR_USD_PER_TOKEN', v)} />
            </div>
          </div>

          <div>
            <Label className="text-xs text-neutral-500 mb-2 block">Rarity Multipliers</Label>
            <div className="grid grid-cols-4 gap-3">
              {RARITIES.map((r) => (
                <div key={r} className="space-y-1">
                  <Label className="text-[10px]" style={{ color: RARITY_COLORS[r] }}>{r}</Label>
                  <NumberInput step={0.1} value={cur.REPAIR_RARITY_MULTIPLIER[r]}
                    onChange={(v) => handleRarityMult(r, v)} size="sm" />
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

function BreedTab() {
  const cur = useGameConfigStore(useShallow((s) => ({ ...s.config.currency, ...s.drafts.currency })))
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
      tooltip: {
        trigger: 'axis' as const,
        backgroundColor: '#1a1a1a',
        borderColor: '#333',
        textStyle: { color: '#e5e5e5', fontSize: 12 },
      },
      legend: {
        data: [...RARITIES],
        textStyle: { color: '#a3a3a3', fontSize: 11 },
        top: 0,
      },
      grid: { top: 40, right: 40, bottom: 40, left: 80 },
      xAxis: {
        type: 'category' as const,
        data: counts.map(String),
        name: 'Breed Count',
        nameLocation: 'middle' as const,
        nameGap: 28,
        axisLine: { lineStyle: { color: '#404040' } },
        axisLabel: { color: '#a3a3a3', fontSize: 11 },
        nameTextStyle: { color: '#a3a3a3', fontSize: 12 },
      },
      yAxis: {
        type: 'value' as const,
        name: '$POOP Cost',
        nameTextStyle: { color: '#a3a3a3', fontSize: 12 },
        axisLine: { lineStyle: { color: '#404040' } },
        axisLabel: { color: '#a3a3a3', fontSize: 11 },
        splitLine: { lineStyle: { color: '#262626' } },
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
              <NumberInput step={0.01} value={cur.BREED_BASE_PRICE_USD}
                onChange={(v) => handleChange('BREED_BASE_PRICE_USD', v)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-green-400">GROWTH_RATE</Label>
              <NumberInput step={0.1} value={cur.BREED_GROWTH_RATE}
                onChange={(v) => handleChange('BREED_GROWTH_RATE', v)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-amber-400">USD_PER_TOKEN</Label>
              <NumberInput step={0.0001} value={cur.BREED_USD_PER_TOKEN}
                onChange={(v) => handleChange('BREED_USD_PER_TOKEN', v)} />
            </div>
          </div>

          <div>
            <Label className="text-xs text-neutral-500 mb-2 block">Rarity Multipliers</Label>
            <div className="grid grid-cols-4 gap-3">
              {RARITIES.map((r) => (
                <div key={r} className="space-y-1">
                  <Label className="text-[10px]" style={{ color: RARITY_COLORS[r] }}>{r}</Label>
                  <NumberInput step={1} value={cur.BREED_RARITY_MULTIPLIER[r]}
                    onChange={(v) => handleRarityMult(r, v)} size="sm" />
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
                    <th key={r} className="px-3 py-2" style={{ color: RARITY_COLORS[r] }}>{r}</th>
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

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CurrencyPanel() {
  const source = useGameConfigStore((s) => s.sources.currency)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-white">Currency ($POOP)</h2>
        <Badge
          variant="outline"
          className={source === 'db'
            ? 'border-blue-800 text-blue-400 text-[10px]'
            : 'border-neutral-700 text-neutral-500 text-[10px]'
          }
        >
          {source === 'db' ? 'Live from DB' : 'Using defaults'}
        </Badge>
      </div>

      <Tabs defaultValue="reward" className="w-full">
        <TabsList className="bg-neutral-900 border border-neutral-800">
          <TabsTrigger value="reward" className="data-[state=active]:bg-neutral-800 text-xs">
            Use Reward
          </TabsTrigger>
          <TabsTrigger value="repair" className="data-[state=active]:bg-neutral-800 text-xs">
            Repair Cost
          </TabsTrigger>
          <TabsTrigger value="breed" className="data-[state=active]:bg-neutral-800 text-xs">
            Breed Cost
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reward"><RewardTab /></TabsContent>
        <TabsContent value="repair"><RepairTab /></TabsContent>
        <TabsContent value="breed"><BreedTab /></TabsContent>
      </Tabs>
    </div>
  )
}
