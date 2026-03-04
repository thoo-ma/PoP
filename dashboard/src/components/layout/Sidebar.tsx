'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'XP & Leveling',    href: '/xp',        icon: '⬆' },
  { label: 'Currency (POOP)',   href: '/currency',   icon: '💰' },
  { label: 'Cooldown',         href: '/cooldown',   icon: '⏱' },
  { label: 'Stat Points',      href: '/stat-points', icon: '📊' },
  { label: 'Breeding',         href: '/breed',      icon: '🧬' },
  { label: 'Minting',          href: '/minting',    icon: '🎰' },
  { label: 'Sensors',          href: '/sensors',    icon: '📱' },
  { label: 'Energy Drain',     href: '/energy',     icon: '🔋' },
  { label: 'Loot Roll',        href: '/loot',       icon: '🎲' },
  { label: 'Cloud Run',        href: '/cloud-run',  icon: '☁' },
] as const

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-neutral-800 bg-neutral-950">
      {/* Logo / title */}
      <div className="flex h-14 items-center gap-2 border-b border-neutral-800 px-4">
        <span className="text-lg font-semibold tracking-tight text-white">PoP</span>
        <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-400">
          Config
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <div className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-neutral-500">
          Mechanics
        </div>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors',
                active
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200',
              )}
            >
              <span className="w-5 text-center text-xs">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-neutral-800 px-4 py-3 text-[11px] text-neutral-600">
        Game Config Dashboard
      </div>
    </aside>
  )
}
