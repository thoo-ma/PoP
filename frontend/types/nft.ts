/**
 * NFT type definition
 * This interface represents the core NFT structure used throughout the app.
 * When blockchain integration is added, blockchain-specific fields can extend this base type.
 */
export interface NFT {
  id: string;
  name: string;
  image: string | number;
  efficiency: number;    // 0-100: Mining/earning efficiency
  resilience: number;    // 0-100: Durability
  comfort: number;       // 0-100: User comfort bonus
  luck: number;          // 0-100: Chance of bonus rewards
  energy: number;        // 0-100: Energy level (can be repaired)
  level: number;         // 0-20: NFT level
  isListed?: boolean;
  price?: string;
}
