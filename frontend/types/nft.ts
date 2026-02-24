import type { Tables, Enums } from './database.types';

/**
 * NFT type / rarity — aliased directly from the generated DB enums so they
 * stay in sync with the schema automatically after every `npm run gen:types`.
 */
export type NFTType = Enums<'nft_type'>;
export type NFTRarity = Enums<'nft_rarity'>;

/**
 * Core NFT type used throughout the app.
 * Derived from the `nfts` DB row (via generated types) with `user_id` omitted
 * (a private FK not needed in the UI) and two derived marketplace fields added.
 * `image_url` matches the DB column name directly — no reshape needed.
 */
export type NFT = Omit<Tables<'nfts'>, 'user_id'> & {
  /** True when the NFT has an active marketplace listing. */
  isListed?: boolean;
  /** Listing price string (e.g. "0.9 ETH"). Present only when `isListed` is true. */
  price?: string;
};

