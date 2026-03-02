-- Add POOP balance wallet to the users table.
-- Balance is always non-negative and changes only through Edge Functions
-- (use-nft, breed-nfts, repair-nft) which use the service-role key,
-- so normal users cannot update this column directly.
ALTER TABLE public.users
  ADD COLUMN poop_balance INTEGER NOT NULL DEFAULT 0
    CONSTRAINT poop_balance_non_negative CHECK (poop_balance >= 0);

-- Atomic increment helper used by the use-nft Edge Function.
-- Returns the new balance after adding `amount`.
CREATE OR REPLACE FUNCTION public.increment_poop_balance(
  user_id UUID,
  amount  INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_balance INTEGER;
BEGIN
  UPDATE public.users
     SET poop_balance = poop_balance + amount
   WHERE id = user_id
  RETURNING poop_balance INTO new_balance;
  RETURN new_balance;
END;
$$;
