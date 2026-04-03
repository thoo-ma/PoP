'use client'

import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useGameConfigStore } from '@/store/gameConfigStore'

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
  const { drafts, clearDrafts } = useGameConfigStore()
  const pathname = usePathname()
  const section = SECTION_LABELS[pathname] ?? null

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
      </div>
    </header>
  )
}
