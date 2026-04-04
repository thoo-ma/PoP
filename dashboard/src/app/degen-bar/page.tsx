'use client'

import { calcBustChance, calcReducedCost, calcReduction } from '@pop/shared/degenBar'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { useShallow } from 'zustand/react/shallow'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { NumberInput } from '@/components/ui/number-input'
import { useGameConfigStore } from '@/store/gameConfigStore'

const BASE_COST = 100
const PREVIEW_LEVELS = [0, 10, 25, 50, 75, 100]

export default function DegenBarPanel() {
  const degen = useGameConfigStore(
    useShallow((s) => ({ ...s.config.degen_bar, ...s.drafts.degen_bar })),
  )
  const setDraft = useGameConfigStore((s) => s.setDraft)
  const clearDraftForKey = useGameConfigStore((s) => s.clearDraftForKey)
  const hasDraft = useGameConfigStore((s) => s.drafts.degen_bar !== undefined)

  const cfg = useMemo(
    () => ({
      SAFE_BUST_COEF: degen.SAFE_BUST_COEF,
      DEGEN_BUST_BASE: degen.DEGEN_BUST_BASE,
      DEGEN_BUST_SCALE: degen.DEGEN_BUST_SCALE,
      DEGEN_ZONE_THRESHOLD: degen.DEGEN_ZONE_THRESHOLD,
      MAX_REDUCTION: degen.MAX_REDUCTION,
    }),
    [degen],
  )

  const rows = useMemo(
    () =>
      PREVIEW_LEVELS.map((d) => {
        const reduction = calcReduction(d, cfg)
        const cost = calcReducedCost(BASE_COST, d, cfg)
        const bust = calcBustChance(d, cfg)
        const success = 1 - bust
        const ev = (success * cost + bust * BASE_COST) / BASE_COST
        return { d, reduction, cost, bust, ev }
      }),
    [cfg],
  )

  const handleChange = (field: keyof typeof cfg, value: string) => {
    const num = parseFloat(value)
    if (Number.isNaN(num) || num < 0) {
      toast.error('Value must be 0 or greater')
      return
    }
    setDraft('degen_bar', { [field]: num })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-white">Degen Bar</h2>
        {hasDraft && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearDraftForKey('degen_bar')}
            className="h-7 px-2 text-[11px] text-amber-400 hover:text-amber-300 hover:bg-amber-950/40"
          >
            Reset
          </Button>
        )}
      </div>

      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300">Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <div className="space-y-1.5">
              <Label className="text-xs text-blue-400">Safe Zone Bust Coefficient</Label>
              <NumberInput
                step={0.01}
                min={0}
                max={1}
                value={degen.SAFE_BUST_COEF}
                onChange={(v) => handleChange('SAFE_BUST_COEF', v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-orange-400">Degen Zone Base Bust %</Label>
              <NumberInput
                step={0.5}
                min={0}
                max={100}
                value={degen.DEGEN_BUST_BASE}
                onChange={(v) => handleChange('DEGEN_BUST_BASE', v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-red-400">Degen Zone Bust Scale</Label>
              <NumberInput
                step={1}
                min={0}
                max={1000}
                value={degen.DEGEN_BUST_SCALE}
                onChange={(v) => handleChange('DEGEN_BUST_SCALE', v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-amber-400">Degen Zone Threshold %</Label>
              <NumberInput
                step={1}
                min={0}
                max={99}
                value={degen.DEGEN_ZONE_THRESHOLD}
                onChange={(v) => handleChange('DEGEN_ZONE_THRESHOLD', v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-green-400">Maximum Cost Reduction</Label>
              <NumberInput
                step={0.05}
                min={0}
                max={1}
                value={degen.MAX_REDUCTION}
                onChange={(v) => handleChange('MAX_REDUCTION', v)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-neutral-300">Live Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-500">
                <th className="py-2 px-3 text-left">Degen %</th>
                <th className="py-2 px-3 text-left">Reduction</th>
                <th className="py-2 px-3 text-left">Cost (base {BASE_COST})</th>
                <th className="py-2 px-3 text-left">Bust %</th>
                <th className="py-2 px-3 text-left">EV</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ d, reduction, cost, bust, ev }) => (
                <tr key={d} className="border-b border-neutral-800/50 text-neutral-300">
                  <td className="px-3 py-1.5 font-mono text-neutral-400">{d}%</td>
                  <td className="px-3 py-1.5 font-mono text-green-400">
                    {(reduction * 100).toFixed(1)}%
                  </td>
                  <td className="px-3 py-1.5 font-mono">{cost}</td>
                  <td className="px-3 py-1.5 font-mono text-red-400">{(bust * 100).toFixed(2)}%</td>
                  <td className="px-3 py-1.5 font-mono text-blue-400">{ev.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-[11px] text-neutral-600">
            EV = (P(success) × reducedCost + P(bust) × baseCost) / baseCost. Values &lt; 1 mean the
            player pays less on average.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
