/**
 * POOP currency constants — single source of truth for frontend and
 * Supabase Edge Functions.
 *
 * Supabase imports via:   ../../../shared/currency.ts
 * Frontend imports via:   @shared  (tsconfig path alias)
 */

/** POOP earned each time a user successfully uses (poops) an NFT. */
export const POOP_PER_USE = 10;

/**
 * POOP charged each time a user repairs an NFT (flat fee, regardless
 * of how much energy is restored).
 */
export const POOP_REPAIR_COST = 2;

/** POOP charged each time a user breeds two NFTs. */
export const POOP_BREED_COST = 5;
