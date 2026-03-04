import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { buildDefaults, buildGameConfig, type FullGameConfig } from '@shared/gameConfig'

export type { FullGameConfig }

interface GameConfigContextValue {
  config:  FullGameConfig
  loading: boolean
}

// ─── Context ──────────────────────────────────────────────────────────────────

const GameConfigContext = createContext<GameConfigContextValue>({
  config:  buildDefaults(),
  loading: true,
})

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * Fetches all `game_config` rows once on mount, validates each against its Zod
 * schema, and deep-merges DB values over in-code defaults.
 *
 * If the network is unavailable the context silently falls back to the
 * hard-coded defaults — no crash, no error state needed in the mobile app.
 */
export function GameConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<FullGameConfig>(buildDefaults)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from('game_config').select('key, value')
        const { config: merged } = buildGameConfig(data ?? [])
        setConfig(merged)
      } catch {
        // network unavailable → keep defaults silently
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  return (
    <GameConfigContext.Provider value={{ config, loading }}>
      {children}
    </GameConfigContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGameConfig(): GameConfigContextValue {
  return useContext(GameConfigContext)
}
