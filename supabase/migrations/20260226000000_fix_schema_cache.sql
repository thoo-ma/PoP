-- Force PostgREST to reload its schema cache.
--
-- Background: after the tier→type column rename in 20260223000000, PostgREST
-- can end up with a stale schema cache that still reports "tier" as a column.
-- This causes PGRST204 errors on any INSERT/SELECT against the nfts table,
-- including in the breed-nfts edge function.
--
-- The idempotent rename guard below also makes the migration safe to re-run if
-- the remote database somehow never received the rename.

DO $$
BEGIN
  -- Re-apply the rename only when the old column is still present.
  IF EXISTS (
    SELECT 1
    FROM   information_schema.columns
    WHERE  table_schema = 'public'
    AND    table_name   = 'nfts'
    AND    column_name  = 'tier'
  ) THEN
    ALTER TABLE public.nfts RENAME COLUMN tier TO type;
    RAISE NOTICE 'nfts.tier renamed to nfts.type';
  ELSE
    RAISE NOTICE 'nfts.type already present – skipping rename';
  END IF;
END;
$$;

-- Explicitly reload the PostgREST schema cache.
-- DDL statements normally trigger this automatically, but a manual NOTIFY is
-- needed when the cache is stale after a previous migration run.
NOTIFY pgrst, 'reload schema';
