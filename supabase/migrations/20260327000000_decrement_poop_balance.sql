CREATE OR REPLACE FUNCTION public.decrement_poop_balance(
  p_user_id UUID,
  p_amount  INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_balance INTEGER;
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'p_amount must be a positive integer, got %', p_amount;
  END IF;

  UPDATE public.users
     SET poop_balance = poop_balance - p_amount
   WHERE id = p_user_id
     AND poop_balance >= p_amount          -- row-level guard
  RETURNING poop_balance INTO new_balance;

  IF NOT FOUND THEN
    RETURN NULL;                            -- signals insufficient balance
  END IF;

  RETURN new_balance;
END;
$$;

-- Restrict execution to service_role only (edge functions); prevent
-- direct calls from anon/authenticated PostgREST clients.
REVOKE EXECUTE ON FUNCTION public.decrement_poop_balance(UUID, INTEGER) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.decrement_poop_balance(UUID, INTEGER) TO service_role;
