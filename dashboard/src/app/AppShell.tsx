'use client'

import { useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { useGameConfigStore } from '@/store/gameConfigStore'

export function AppShell({ children }: { children: React.ReactNode }) {
  const fetch = useGameConfigStore((s) => s.fetch)

  useEffect(() => {
    fetch()
  }, [fetch])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
