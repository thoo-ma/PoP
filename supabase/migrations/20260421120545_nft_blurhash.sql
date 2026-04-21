-- ============================================================================
-- Add nullable `blurhash` column to NFT and mystery-box tables
--
-- Powers expo-image's `placeholder={{ blurhash }}` so images fade in from a
-- colour-accurate blurred preview instead of a blank rectangle.
--
-- Hashes are computed offline by `scripts/generate-blurhashes.ts` and stored
-- in `shared/src/blurhashes.ts`; edge functions read them from there at insert
-- time. Existing rows can be backfilled by pasting the UPDATE statements from
-- `supabase/migrations/_data/nft_blurhash_backfill.sql` into a follow-up
-- migration once that file has been generated against production assets.
--
-- The column is nullable on purpose: if the lookup table has no entry for an
-- asset (e.g. brand-new artwork shipped before the script was rerun) the
-- frontend falls back to the existing solid placeholder background.
-- See issue #422.
-- ============================================================================

ALTER TABLE public.nfts          ADD COLUMN IF NOT EXISTS blurhash TEXT;
ALTER TABLE public.mystery_boxes ADD COLUMN IF NOT EXISTS blurhash TEXT;

COMMENT ON COLUMN public.nfts.blurhash IS
  'Blurhash placeholder string for the NFT image. Populated at insert time '
  'from shared/src/blurhashes.ts. Nullable — frontend falls back to a solid '
  'background when missing.';

COMMENT ON COLUMN public.mystery_boxes.blurhash IS
  'Blurhash placeholder string for the mystery-box image. Populated at insert '
  'time from shared/src/blurhashes.ts. Nullable.';
