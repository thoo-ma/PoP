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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CHART_TOOLTIP, CHART_LEGEND, CHART_AXIS_STYLES, CHART_SPLIT_LINE } from '@/lib/chartTheme'

const DIFFICULTIES = ['easy', 'normal', 'strict'] as const
const DIFF_COLORS: Record<string, string> = {
  easy: '#22c55e',
  normal: '#f59e0b',
  strict: '#ef4444',
}

const PRESET_FIELDS = [
  { key: 'MOVEMENT_THRESHOLD', label: 'Movement', step: 0.01, unit: '' },
  { key: 'ROTATION_THRESHOLD', label: 'Rotation', step: 0.01, unit: '' },
  { key: 'STEP_COOLDOWN', label: 'Step Cooldown', step: 100, unit: 'ms' },
  { key: 'GRACE_PERIOD', label: 'Grace Period', step: 50, unit: 'ms' },
  { key: 'WARNING_COOLDOWN', label: 'Warning CD', step: 100, unit: 'ms' },
] as const

type PresetField = (typeof PRESET_FIELDS)[number]['key']

export default function SensorsPanel() {
  const sensors = useGameConfigStore(
    useShallow((s) => ({ ...s.config.sensors, ...s.drafts.sensors })),
  )
  const source = useGameConfigStore((s) => s.sources.sensors)
  const setDraft = useGameConfigStore((s) => s.setDraft)
  const clearDraftForKey = useGameConfigStore((s) => s.clearDraftForKey)
  const hasDraft = useGameConfigStore((s) => s.drafts.sensors !== undefined)

  // Radar chart for motion presets (normalise each axis 0–1)
  const radarOptions = useMemo(() => {
    // Normalisation maxes per field (for display only)
    const maxes: Record<string, number> = {
      MOVEMENT_THRESHOLD: 0.3,
      ROTATION_THRESHOLD: 0.2,
      STEP_COOLDOWN: 3000,
      GRACE_PERIOD: 1000,
      WARNING_COOLDOWN: 2500,
    }
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item' as const,
        ...CHART_TOOLTIP,
      },
      legend: { data: [...DIFFICULTIES], ...CHART_LEGEND },
      radar: {
        indicator: PRESET_FIELDS.map((f) => ({
          name: f.label,
          max: maxes[f.key],
        })),
        axisName: { color: '#a3a3a3', fontSize: 11 },
        splitLine: { lineStyle: { color: '#333' } },
        splitArea: { show: false },
        axisLine: { lineStyle: { color: '#404040' } },
      },
      series: [
        {
          type: 'radar' as const,
          data: DIFFICULTIES.map((d) => ({
            name: d,
            value: PRESET_FIELDS.map((f) => sensors.SENSOR_PRESETS[d][f.key]),
            lineStyle: { color: DIFF_COLORS[d], width: 2 },
            itemStyle: { color: DIFF_COLORS[d] },
            areaStyle: { color: `${DIFF_COLORS[d]}22` },
          })),
        },
      ],
    }
  }, [sensors])

  const audioChartOptions = useMemo(
    () => ({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item' as const,
        ...CHART_TOOLTIP,
      },
      grid: { top: 20, right: 60, bottom: 40, left: 60 },
      xAxis: {
        type: 'category' as const,
        data: [...DIFFICULTIES],
        ...CHART_AXIS_STYLES,
      },
      yAxis: {
        type: 'value' as const,
        name: 'Threshold (0–1)',
        min: 0,
        max: 1,
        ...CHART_AXIS_STYLES,
        splitLine: CHART_SPLIT_LINE,
      },
      series: [
        {
          name: 'Audio Threshold',
          type: 'bar' as const,
          barMaxWidth: 60,
          data: DIFFICULTIES.map((d) => ({
            value: sensors.AUDIO_THRESHOLDS[d],
            itemStyle: { color: DIFF_COLORS[d], borderRadius: [3, 3, 0, 0] },
          })),
          label: {
            show: true,
            position: 'top' as const,
            color: '#e5e5e5',
            fontSize: 12,
          },
        },
      ],
    }),
    [sensors],
  )

  const handlePreset = (difficulty: string, field: PresetField, value: string) => {
    const num = parseFloat(value)
    if (isNaN(num)) return
    setDraft('sensors', {
      SENSOR_PRESETS: {
        ...sensors.SENSOR_PRESETS,
        [difficulty]: {
          ...sensors.SENSOR_PRESETS[difficulty as (typeof DIFFICULTIES)[number]],
          [field]: num,
        },
      },
    })
  }

  const handleAudio = (difficulty: string, value: string) => {
    const num = parseFloat(value)
    if (isNaN(num) || num < 0 || num > 1) return
    setDraft('sensors', {
      AUDIO_THRESHOLDS: { ...sensors.AUDIO_THRESHOLDS, [difficulty]: num },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-white">Sensors</h2>
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
            onClick={() => clearDraftForKey('sensors')}
            className="h-7 px-2 text-[11px] text-amber-400 hover:text-amber-300 hover:bg-amber-950/40"
          >
            Reset
          </Button>
        )}
      </div>

      <Tabs defaultValue="presets" className="w-full">
        <TabsList className="bg-neutral-900 border border-neutral-800">
          <TabsTrigger value="presets" className="data-[state=active]:bg-neutral-800 text-xs">
            Motion Presets
          </TabsTrigger>
          <TabsTrigger value="audio" className="data-[state=active]:bg-neutral-800 text-xs">
            Audio Detection
          </TabsTrigger>
        </TabsList>

        <TabsContent value="presets" className="space-y-4 mt-4">
          <Card className="border-neutral-800 bg-neutral-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-300">
                Thresholds per Difficulty
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-500">
                    <th className="py-2 pr-4 text-left">Field</th>
                    {DIFFICULTIES.map((d) => (
                      <th
                        key={d}
                        className="px-3 py-2 text-center capitalize font-medium"
                        style={{ color: DIFF_COLORS[d] }}
                      >
                        {d}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PRESET_FIELDS.map((f) => (
                    <tr key={f.key} className="border-b border-neutral-800/50">
                      <td className="py-1.5 pr-4">
                        <div className="text-xs text-neutral-300">{f.label}</div>
                        {f.unit && <div className="text-[10px] text-neutral-600">{f.unit}</div>}
                      </td>
                      {DIFFICULTIES.map((d) => (
                        <td key={d} className="px-3 py-1">
                          <NumberInput
                            step={f.step}
                            min={0}
                            value={sensors.SENSOR_PRESETS[d][f.key]}
                            onChange={(v) => handlePreset(d, f.key, v)}
                            size="sm"
                            className="w-28"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card className="border-neutral-800 bg-neutral-900/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-neutral-300">
                Difficulty Profile (Radar)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LazyChart option={radarOptions} style={{ height: 340 }} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio" className="space-y-4 mt-4">
          <Card className="border-neutral-800 bg-neutral-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-300">
                Audio Confidence Threshold (0 – 1)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-neutral-500">
                Minimum YAMNet confidence score required to count as a valid toilet flush detection.
                Higher = harder to trigger.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {DIFFICULTIES.map((d) => (
                  <div key={d} className="space-y-1.5">
                    <Label
                      className="text-xs font-medium capitalize"
                      style={{ color: DIFF_COLORS[d] }}
                    >
                      {d}
                    </Label>
                    <NumberInput
                      step={0.05}
                      min={0}
                      max={1}
                      value={sensors.AUDIO_THRESHOLDS[d]}
                      onChange={(v) => handleAudio(d, v)}
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
                Threshold by Difficulty
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LazyChart option={audioChartOptions} style={{ height: 240 }} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
