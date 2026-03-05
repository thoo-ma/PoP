'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  TrendingUp,
  Coins,
  Timer,
  BarChart3,
  Dna,
  Layers,
  Smartphone,
  Battery,
  Dices,
  Cloud,
  type LucideIcon,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const NAV_ITEMS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: 'XP & Leveling',   href: '/xp',          icon: TrendingUp  },
  { label: 'Currency (POOP)', href: '/currency',     icon: Coins       },
  { label: 'Cooldown',        href: '/cooldown',     icon: Timer       },
  { label: 'Stat Points',     href: '/stat-points',  icon: BarChart3   },
  { label: 'Breeding',        href: '/breed',        icon: Dna         },
  { label: 'Minting',         href: '/minting',      icon: Layers      },
  { label: 'Sensors',         href: '/sensors',      icon: Smartphone  },
  { label: 'Energy Drain',    href: '/energy',       icon: Battery     },
  { label: 'Loot Roll',       href: '/loot',         icon: Dices       },
  { label: 'Cloud Run',       href: '/cloud-run',    icon: Cloud       },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-900">
            <span className="text-[11px] font-bold leading-none">PoP</span>
          </div>
          <span className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground">
            Config
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Mechanics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
