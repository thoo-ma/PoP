'use client'

import { useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { useGameConfigStore } from '@/store/gameConfigStore'

export function AppShell({ children }: { children: React.ReactNode }) {
  const fetch    = useGameConfigStore((s) => s.fetch)
  const error    = useGameConfigStore((s) => s.error)
  const warnings = useGameConfigStore((s) => s.warnings)

  useEffect(() => {
    fetch()
  }, [fetch])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        {error && (
          <div className="flex items-center gap-2 border-b border-red-900/60 bg-red-950/40 px-6 py-2.5 text-xs text-red-400">
            <span className="font-semibold">DB unreachable</span>
            <span className="text-red-500/70">—</span>
            <span>displaying hardcoded defaults. Values shown do not reflect the live database.</span>
            <span className="ml-auto text-red-500/60">{error}</span>
          </div>
        )}
        {warnings.length > 0 && (
          <div className="border-b border-amber-900/60 bg-amber-950/30 px-6 py-2.5 text-xs text-amber-400">
            <span className="font-semibold">{warnings.length} config row{warnings.length > 1 ? 's' : ''} failed validation</span>
            <span className="text-amber-500/70"> — using defaults for: </span>
            <span className="font-mono">{warnings.map((w) => w.split('"')[1]).join(', ')}</span>
          </div>
        )}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
