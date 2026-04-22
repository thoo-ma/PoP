import type { BustedDetails, CooldownDetails, InsufficientPoopDetails } from '@pop/shared'
import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import type { NFT } from '@/types'

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
    insufficientPoopError: InsufficientPoopDetails | null
    bustedResult: BustedDetails | null
  }
  poopNFT?: {
    poopNFT: (nftId: string) => Promise<null>
    isPending: boolean
    error: string | null
    cooldownError: CooldownDetails | null
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
