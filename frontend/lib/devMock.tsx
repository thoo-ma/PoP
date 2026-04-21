import type { BustedDetails } from '@pop/shared'
import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import type { NFT } from '@/types'

// Inline the hook-specific error types to avoid circular imports.
// These must match the exported interfaces in their respective hook files exactly.
interface CooldownError {
  cooldown_ends_at: string
  cooldown_remaining_seconds: number
}

interface InsufficientPoopError {
  poop_balance: number
  poop_required: number
}

export interface DevMockContextValue {
  userNFTs?: {
    nfts: NFT[]
    loading: boolean
    error: string | null
    refetch: () => Promise<void>
  }
  wallet?: {
    poopBalance: number | null
    loading: boolean
    error: string | null
    refetch: () => Promise<void>
  }
  breedNFT?: {
    breedNFTs: (parent1Id: string, parent2Id: string, degenPercent?: number) => Promise<null>
    isPending: boolean
    error: string | null
    bustedResult: BustedDetails | null
  }
  repairNFT?: {
    repairNFT: (nftId: string, newEnergy: number, degenPercent?: number) => Promise<null>
    isPending: boolean
    error: string | null
    insufficientPoopError: InsufficientPoopError | null
    bustedResult: BustedDetails | null
  }
  poopNFT?: {
    poopNFT: (nftId: string) => Promise<null>
    isPending: boolean
    error: string | null
    cooldownError: CooldownError | null
  }
}

const DevMockContext = createContext<DevMockContextValue | null>(null)

export function useDevMock(): DevMockContextValue | null {
  return useContext(DevMockContext)
}

export function DevMockProvider({
  value,
  children,
}: {
  value: DevMockContextValue
  children: ReactNode
}) {
  return <DevMockContext.Provider value={value}>{children}</DevMockContext.Provider>
}
