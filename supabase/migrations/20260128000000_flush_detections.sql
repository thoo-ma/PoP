-- Create flush_detections table
CREATE TABLE IF NOT EXISTS public.flush_detections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    detected BOOLEAN NOT NULL,
    confidence FLOAT NOT NULL,
    duration_seconds FLOAT,
    model_version TEXT DEFAULT 'yamnet-v1',
    audio_size_kb INTEGER
);

-- Create app_config table for dynamic configuration
CREATE TABLE IF NOT EXISTS public.app_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default rate limit configuration
INSERT INTO public.app_config (key, value)
VALUES ('rate_limits', '{"detections_per_day": 10}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Create index for efficient user queries
CREATE INDEX IF NOT EXISTS idx_user_detections 
ON public.flush_detections(user_id, created_at DESC);

-- Create index for recent detections queries
CREATE INDEX IF NOT EXISTS idx_recent_detections 
ON public.flush_detections(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.flush_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read their own detections
CREATE POLICY "Users can read own detections" 
ON public.flush_detections
FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policy: Service role can insert detections (for Edge Function)
CREATE POLICY "Service role can insert detections" 
ON public.flush_detections
FOR INSERT
WITH CHECK (true);

-- RLS Policy: Service role can read app_config
CREATE POLICY "Service role can read app_config" 
ON public.app_config
FOR SELECT
USING (true);

-- RLS Policy: Only admins can update app_config (via SQL editor)
CREATE POLICY "Admins can update app_config" 
ON public.app_config
FOR UPDATE
USING (false);
