-- Create storage bucket for game assets (toilets, boxes, etc.)
-- This migration sets up the storage bucket and access policies for game assets

-- Create the assets bucket (public read access)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assets',
  'assets', 
  true,  -- Public read access
  5242880,  -- 5MB limit per file
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- Allow public read access to all images in the bucket
CREATE POLICY "Public read access for game assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'assets');

-- Allow authenticated admins to upload/update images
-- (Admin users can be identified by email or a custom role)
CREATE POLICY "Authenticated users can upload game assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'assets' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update game assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'assets'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete game assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'assets'
  AND auth.role() = 'authenticated'
);
