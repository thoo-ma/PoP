import type { Tables } from "@pop/shared";

/**
 * Core NFT type used throughout the app.
 * Derived from the `nfts` DB row (via generated types) with `user_id` omitted
 * (a private FK not needed in the UI) and two derived marketplace fields added.
 * `image_url` matches the DB column name directly — no reshape needed.
 */
export type NFT = Omit<Tables<"nfts">, "user_id"> & {
  /** True when the NFT has an active marketplace listing. */
  isListed?: boolean;
  /** Listing price string (e.g. "0.9 ETH"). Present only when `isListed` is true. */
  price?: string;
};
