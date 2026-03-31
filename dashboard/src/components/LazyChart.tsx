'use client'

import { lazy, Suspense } from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Lazy-loaded ECharts wrapper.
 * The heavy echarts bundle is code-split into its own chunk,
 * shared across all pages via dynamic import.
 */
const ReactEChartsLazy = lazy(() =>
  import('echarts-for-react/lib/core').then((mod) => {
    return import('@/lib/echarts').then((echartsModule) => ({
      default: (props: any) => {
        const Core = mod.default
        return <Core echarts={echartsModule.default} {...props} />
      },
    }))
  }),
)

interface LazyChartProps {
  option: Record<string, unknown>
  style?: React.CSSProperties
  className?: string
}

function ChartFallback({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={style} className="flex items-center justify-center text-xs text-neutral-600">
      Loading chart…
    </div>
  )
}

export default function LazyChart({ option, style, className }: LazyChartProps) {
  return (
    <Suspense fallback={<ChartFallback style={style} />}>
      <ReactEChartsLazy option={option} style={style} className={className} />
    </Suspense>
  )
}
