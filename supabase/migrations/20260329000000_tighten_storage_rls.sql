-- Tighten storage bucket RLS to per-user ownership (Fixes #94)
--
-- Previously any authenticated user could INSERT / UPDATE / DELETE any object
-- in the 'assets' bucket. This migration replaces those policies with
-- ownership-scoped rules:
--   INSERT — users may only upload under their own uid prefix ({uid}/…)
--   UPDATE — only the original uploader (owner) may modify
--   DELETE — only the original uploader (owner) may remove
--
-- The service-role key (used by edge functions) bypasses RLS entirely,
-- so backend-managed game assets (toilets/, mystery-boxes/) are unaffected.
-- Public SELECT remains unchanged.

-- ── Drop the old overly-permissive policies ─────────────────────────────────

DROP POLICY IF EXISTS "Authenticated users can upload game assets"  ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update game assets"  ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete game assets"  ON storage.objects;

-- ── INSERT: authenticated users may only upload under their own uid folder ──

CREATE POLICY "Users can upload to own folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'assets'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ── UPDATE: only the original uploader may modify their objects ─────────────

CREATE POLICY "Users can update own objects"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'assets'
  AND auth.uid() = owner_id
);

-- ── DELETE: only the original uploader may remove their objects ─────────────

CREATE POLICY "Users can delete own objects"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'assets'
  AND auth.uid() = owner_id
);
