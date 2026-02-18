/**
 * NFT type definition
 * This interface represents the core NFT structure used throughout the app.
 * When blockchain integration is added, blockchain-specific fields can extend this base type.
 */

/** NFT tier enum - toilet-specific property */
export type NFTTier = 'cruise-seat' | 'turbo-flush' | 'zen-fortress';

/** NFT rarity enum - applies to all NFT types (toilets, lootboxes, etc.) */
export type NFTRarity = 'common' | 'rare' | 'legendary' | 'transcendent';

export interface NFT {
  id: string;
  name: string;
  image: string;         // Updated: always URL from Supabase Storage (no longer local require())
  tier: NFTTier;         // Tier property (toilet-specific: cruise-seat/turbo-flush/zen-fortress)
  variant: string;       // Named variant (e.g., 'ancient-egyptian', 'dubai')
  rarity: NFTRarity;     // Rarity property (applies to all NFT types)
  efficiency: number;    // 0-100: Mining/earning efficiency
  resilience: number;    // 0-100: Durability
  comfort: number;       // 0-100: User comfort bonus
  luck: number;          // 0-100: Chance of bonus rewards
  energy: number;        // 0-100: Energy level (can be repaired)
  level: number;         // 0-20: NFT level
  isListed?: boolean;    // Derived from marketplace_listings table
  price?: string;        // Price if listed (e.g., "0.9 ETH")
  created_at?: string;   // ISO timestamp from database
  updated_at?: string;   // ISO timestamp from database
}

