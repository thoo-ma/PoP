CREATE TABLE public.degen_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,           -- 'repair' or 'breed'
  degen_percent INTEGER NOT NULL CHECK (degen_percent BETWEEN 1 AND 100),
  busted BOOLEAN NOT NULL,
  base_cost INTEGER NOT NULL,
  charged_amount INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_degen_outcomes_user_id ON public.degen_outcomes(user_id);
CREATE INDEX idx_degen_outcomes_created_at ON public.degen_outcomes(created_at);

-- RLS: players can read their own history, INSERT via service role only (edge functions)
ALTER TABLE public.degen_outcomes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own degen outcomes"
  ON public.degen_outcomes
  FOR SELECT
  USING (auth.uid() = user_id);
