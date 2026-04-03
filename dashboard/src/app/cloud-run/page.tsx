'use client'

import { useGameConfigStore } from '@/store/gameConfigStore'
import { useShallow } from 'zustand/react/shallow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { NumberInput } from '@/components/ui/number-input'

import { Button } from '@/components/ui/button'

export default function CloudRunPanel() {
  const cr = useGameConfigStore(
    useShallow((s) => ({ ...s.config.cloud_run, ...s.drafts.cloud_run })),
  )
  const setDraft = useGameConfigStore((s) => s.setDraft)
  const clearDraftForKey = useGameConfigStore((s) => s.clearDraftForKey)
  const hasDraft = useGameConfigStore((s) => s.drafts.cloud_run !== undefined)

  const handleChange = (field: keyof typeof cr, value: string) => {
    const num = field === 'YAMNET_TOILET_FLUSH_CLASS' ? parseInt(value, 10) : parseFloat(value)
    if (Number.isNaN(num) || num < 0) return
    setDraft('cloud_run', { [field]: num })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-white">Cloud Run</h2>
        {hasDraft && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearDraftForKey('cloud_run')}
            className="h-7 px-2 text-[11px] text-amber-400 hover:text-amber-300 hover:bg-amber-950/40"
          >
            Reset
          </Button>
        )}
      </div>

      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300">About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-neutral-400">
          <p>
            These parameters are forwarded per-request from the{' '}
            <code className="rounded bg-neutral-800 px-1 py-0.5 text-xs text-neutral-300">
              detect-toilet-flush
            </code>{' '}
            edge function to the Google Cloud Run audio detection service.
          </p>
          <p>
            The service runs a <strong className="text-neutral-300">YAMNet</strong> model to
            classify audio and confirm toilet flush events. Changing these values affects detection
            sensitivity without redeploying the Python service.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-neutral-800 bg-neutral-900/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300">
              YAMNet Class Index
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-blue-400">YAMNET_TOILET_FLUSH_CLASS</Label>
              <NumberInput
                step={1}
                min={0}
                max={999}
                value={cr.YAMNET_TOILET_FLUSH_CLASS}
                onChange={(v) => handleChange('YAMNET_TOILET_FLUSH_CLASS', v)}
                className="h-10"
              />
            </div>
            <p className="text-[11px] text-neutral-600">
              Toilet flush is YAMNet class {cr.YAMNET_TOILET_FLUSH_CLASS}. Only change if the YAMNet
              model version changes its class mapping.
            </p>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300">
              Max Audio Duration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-green-400">MAX_AUDIO_DURATION (s)</Label>
              <NumberInput
                step={1}
                min={1}
                max={300}
                value={cr.MAX_AUDIO_DURATION}
                onChange={(v) => handleChange('MAX_AUDIO_DURATION', v)}
                className="h-10"
              />
            </div>
            <p className="text-[11px] text-neutral-600">
              Audio longer than this is truncated before being sent to the model. Reduces inference
              cost for very long recordings.
            </p>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300">
              Min Audio Duration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-amber-400">MIN_AUDIO_DURATION (s)</Label>
              <NumberInput
                step={0.1}
                min={0}
                max={60}
                value={cr.MIN_AUDIO_DURATION}
                onChange={(v) => handleChange('MIN_AUDIO_DURATION', v)}
                className="h-10"
              />
            </div>
            <p className="text-[11px] text-neutral-600">
              Audio shorter than this is rejected with an error — too brief for reliable YAMNet
              classification.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300">
            Current Config Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <tbody>
              {[
                {
                  label: 'YAMNet class',
                  value: `${cr.YAMNET_TOILET_FLUSH_CLASS} (toilet flush)`,
                  color: '#3b82f6',
                },
                { label: 'Min duration', value: `${cr.MIN_AUDIO_DURATION}s`, color: '#f59e0b' },
                { label: 'Max duration', value: `${cr.MAX_AUDIO_DURATION}s`, color: '#22c55e' },
                {
                  label: 'Valid window',
                  value: `${cr.MIN_AUDIO_DURATION}s – ${cr.MAX_AUDIO_DURATION}s (${cr.MAX_AUDIO_DURATION - cr.MIN_AUDIO_DURATION}s span)`,
                  color: '#a3a3a3',
                },
              ].map((row) => (
                <tr key={row.label} className="border-b border-neutral-800/50">
                  <td className="py-2 text-[11px] uppercase tracking-wider text-neutral-500 w-36">
                    {row.label}
                  </td>
                  <td className="py-2 font-mono text-sm" style={{ color: row.color }}>
                    {row.value}
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
