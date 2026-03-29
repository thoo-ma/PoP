'use client'

import { usePathname } from 'next/navigation'
import { useGameConfigStore } from '@/store/gameConfigStore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const SECTION_LABELS: Record<string, string> = {
  '/xp': 'XP & Leveling',
  '/currency': 'Currency (POOP)',
  '/cooldown': 'Cooldown',
  '/stat-points': 'Stat Points',
  '/breed': 'Breeding',
  '/minting': 'Minting',
  '/sensors': 'Sensors',
  '/energy': 'Energy Drain',
  '/loot': 'Loot Roll',
  '/cloud-run': 'Cloud Run',
  '/degen-bar': 'Degen Bar',
}

export function Header() {
  const { loading, error, sources, drafts, clearDrafts } = useGameConfigStore()
  const pathname = usePathname()
  const section = SECTION_LABELS[pathname] ?? null

  const dbCount = Object.values(sources).filter((s) => s === 'db').length
  const totalCount = Object.keys(sources).length
  const draftCount = Object.keys(drafts).length

  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-4">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-neutral-400 text-sm hover:text-neutral-200">
                Game Balance
              </BreadcrumbLink>
            </BreadcrumbItem>
            {section && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-sm font-medium text-neutral-200">
                    {section}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
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
        {draftCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearDrafts}
            className="h-7 px-2 text-[11px] text-amber-400 hover:text-amber-300 hover:bg-amber-950/40"
          >
            Reset all ({draftCount})
          </Button>
        )}
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
