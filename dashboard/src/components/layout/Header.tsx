'use client'

import { useGameConfigStore } from '@/store/gameConfigStore'
import { Badge } from '@/components/ui/badge'

export function Header() {
  const { loading, error, sources } = useGameConfigStore()

  const dbCount = Object.values(sources).filter((s) => s === 'db').length
  const totalCount = Object.keys(sources).length

  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-medium text-neutral-200">Game Balance</h1>
        {loading && (
          <Badge variant="outline" className="border-neutral-700 text-neutral-500 text-[10px]">
            Loading…
          </Badge>
        )}
        {error && (
          <Badge variant="destructive" className="text-[10px]">
            Error: {error}
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-4 text-[11px] text-neutral-500">
        <span>
          <span className="text-neutral-300">{dbCount}</span>/{totalCount} from DB
        </span>
        <span>
          <span className="text-neutral-300">{totalCount - dbCount}</span> using defaults
        </span>
      </div>
    </header>
  )
}
