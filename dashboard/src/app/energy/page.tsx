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

const TYPES = ['turbo-flush', 'cruise-seat', 'zen-fortress'] as const
const TYPE_COLORS: Record<string, string> = {
  'turbo-flush': '#ef4444', 'cruise-seat': '#22c55e', 'zen-fortress': '#3b82f6',
}

export default function EnergyPanel() {
  const energy           = useGameConfigStore(useShallow((s) => ({ ...s.config.energy_drain, ...s.drafts.energy_drain })))
  const source           = useGameConfigStore((s) => s.sources.energy_drain)
  const setDraft         = useGameConfigStore((s) => s.setDraft)
  const clearDraftForKey = useGameConfigStore((s) => s.clearDraftForKey)
  const hasDraft         = useGameConfigStore((s) => s.drafts.energy_drain !== undefined)

  // Expected drain per use at resilience=0 (worst case) and resilience=50
  const tableRows = useMemo(() => {
    return TYPES.map((t) => {
      const mult = energy.TYPE_DRAIN_MULT[t]
      const midRoll = (energy.ENERGY_ROLL_MIN + energy.ENERGY_ROLL_MAX) / 2
      const worstMin = energy.ENERGY_ROLL_MIN * mult
      const worstMax = energy.ENERGY_ROLL_MAX * mult
      const r50Min   = worstMin * 0.5
      const r50Max   = worstMax * 0.5
      return { type: t, mult, midRoll, worstMin, worstMax, r50Min, r50Max }
    })
  }, [energy])

  const multChartOptions = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item' as const,
      backgroundColor: '#1a1a1a',
      borderColor: '#333',
      textStyle: { color: '#e5e5e5', fontSize: 12 },
    },
    grid: { top: 20, right: 40, bottom: 40, left: 100 },
    xAxis: {
      type: 'value' as const,
      min: 0,
      axisLabel: { color: '#a3a3a3', fontSize: 11 },
      axisLine: { lineStyle: { color: '#404040' } },
      splitLine: { lineStyle: { color: '#262626' } },
    },
    yAxis: {
      type: 'category' as const,
      data: [...TYPES],
      axisLine: { lineStyle: { color: '#404040' } },
      axisLabel: { color: '#a3a3a3', fontSize: 11 },
    },
    series: [{
      name: 'Drain Multiplier',
      type: 'bar' as const,
      barMaxWidth: 30,
      data: TYPES.map((t) => ({
        value: energy.TYPE_DRAIN_MULT[t],
        itemStyle: { color: TYPE_COLORS[t], borderRadius: [0, 4, 4, 0] },
      })),
      label: {
        show: true,
        position: 'right' as const,
        color: '#a3a3a3',
        fontSize: 11,
        formatter: (p: { value: number }) => `×${p.value}`,
      },
    }],
  }), [energy])

  const handleTypeMult = (type: string, value: string) => {
    const num = parseFloat(value)
    if (isNaN(num) || num < 0) return
    setDraft('energy_drain', {
      TYPE_DRAIN_MULT: { ...energy.TYPE_DRAIN_MULT, [type]: num },
    })
  }

  const handleScalar = (field: 'ENERGY_ROLL_MIN' | 'ENERGY_ROLL_MAX', value: string) => {
    const num = parseFloat(value)
    if (isNaN(num) || num < 0) return
    setDraft('energy_drain', { [field]: num })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-white">Energy Drain</h2>
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
            onClick={() => clearDraftForKey('energy_drain')}
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
            loss = rand(<span className="text-blue-400">{energy.ENERGY_ROLL_MIN}</span>,{' '}
            <span className="text-green-400">{energy.ENERGY_ROLL_MAX}</span>) × (1 − resilience/100) × typeMult
          </code>
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300">Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-blue-400">ROLL_MIN</Label>
              <NumberInput min={0} step={1} value={energy.ENERGY_ROLL_MIN}
                onChange={(v) => handleScalar('ENERGY_ROLL_MIN', v)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-green-400">ROLL_MAX</Label>
              <NumberInput min={0} step={1} value={energy.ENERGY_ROLL_MAX}
                onChange={(v) => handleScalar('ENERGY_ROLL_MAX', v)} />
            </div>
          </div>

          <div>
            <Label className="text-xs text-neutral-500 mb-2 block">Type Drain Multipliers</Label>
            <div className="grid grid-cols-3 gap-3">
              {TYPES.map((t) => (
                <div key={t} className="space-y-1">
                  <Label className="text-[10px]" style={{ color: TYPE_COLORS[t] }}>{t}</Label>
                  <NumberInput step={0.1} min={0} value={energy.TYPE_DRAIN_MULT[t]}
                    onChange={(v) => handleTypeMult(t, v)} />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-neutral-300">Type Multipliers</CardTitle>
        </CardHeader>
        <CardContent>
          <LazyChart option={multChartOptions} style={{ height: 200 }} />
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-neutral-300">
            Expected Drain per Use
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-500">
                <th className="py-2 pr-4 text-left">Type</th>
                <th className="px-3 py-2 text-center">Mult</th>
                <th className="px-3 py-2 text-center">Resilience 0% (min–max)</th>
                <th className="px-3 py-2 text-center">Resilience 50% (min–max)</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((r) => (
                <tr key={r.type} className="border-b border-neutral-800/50 text-neutral-300">
                  <td className="py-1.5 pr-4">
                    <span className="text-xs font-medium" style={{ color: TYPE_COLORS[r.type] }}>{r.type}</span>
                  </td>
                  <td className="px-3 py-1.5 text-center font-mono text-neutral-400">×{r.mult}</td>
                  <td className="px-3 py-1.5 text-center font-mono">
                    {r.worstMin.toFixed(1)} – {r.worstMax.toFixed(1)}
                  </td>
                  <td className="px-3 py-1.5 text-center font-mono text-neutral-400">
                    {r.r50Min.toFixed(1)} – {r.r50Max.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
