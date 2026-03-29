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
  Activity,
  ChevronRight,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

type NavItem = { label: string; href: string; icon: LucideIcon }

const GAME_MECHANICS: NavItem[] = [
  { label: 'XP & Leveling', href: '/xp', icon: TrendingUp },
  { label: 'Cooldown', href: '/cooldown', icon: Timer },
  { label: 'Stat Points', href: '/stat-points', icon: BarChart3 },
  { label: 'Sensors', href: '/sensors', icon: Smartphone },
  { label: 'Energy Drain', href: '/energy', icon: Battery },
  { label: 'Cloud Run', href: '/cloud-run', icon: Cloud },
]

const ECONOMY_ROI: NavItem[] = [
  { label: 'Currency (POOP)', href: '/currency', icon: Coins },
  { label: 'Breeding', href: '/breed', icon: Dna },
  { label: 'Minting', href: '/minting', icon: Layers },
  { label: 'Loot Roll', href: '/loot', icon: Dices },
  { label: 'Degen Bar', href: '/degen-bar', icon: Activity },
]

const NAV_GROUPS: { label: string; icon: LucideIcon; items: NavItem[] }[] = [
  { label: 'Game Mechanics', icon: Dices, items: GAME_MECHANICS },
  { label: 'Economy & ROI', icon: Coins, items: ECONOMY_ROI },
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
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_GROUPS.map((group) => {
                const isOpen = group.items.some((item) => item.href === pathname)
                return (
                  <Collapsible
                    key={group.label}
                    asChild
                    defaultOpen={isOpen}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={group.label}>
                          <group.icon />
                          <span>{group.label}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {group.items.map((item) => (
                            <SidebarMenuSubItem key={item.href}>
                              <SidebarMenuSubButton asChild isActive={pathname === item.href}>
                                <Link href={item.href}>
                                  <item.icon />
                                  <span>{item.label}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
