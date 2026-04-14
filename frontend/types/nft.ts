import type { Tables } from '@pop/shared'
import type { SORT_OPTIONS } from '@/constants'

/**
 * Core NFT type used throughout the app.
 * Derived from the `nfts` DB row (via generated types) with `user_id` omitted
 * (a private FK not needed in the UI) and two derived marketplace fields added.
 * `image_url` matches the DB column name directly — no reshape needed.
 */
export type NFT = Omit<Tables<'nfts'>, 'user_id'> & {
  /** True when the NFT has an active marketplace listing. */
  isListed?: boolean
  /** Listing price string (e.g. "0.9 ETH"). Present only when `isListed` is true. */
  price?: string
}

export type SortOption = (typeof SORT_OPTIONS)[number]

export interface StatDeltas {
  efficiency: number
  resilience: number
  comfort: number
  luck: number
}

export interface AllocateResult {
  id: string
  efficiency: number
  resilience: number
  comfort: number
  luck: number
  stat_points: number
}
