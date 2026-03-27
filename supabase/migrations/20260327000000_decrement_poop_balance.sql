CREATE OR REPLACE FUNCTION public.decrement_poop_balance(
  p_user_id UUID,
  p_amount  INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_balance INTEGER;
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'p_amount must be positive, got %', p_amount;
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

-- Lock down execution: only service_role (edge functions) may call this.
REVOKE EXECUTE ON FUNCTION public.decrement_poop_balance(UUID, INTEGER) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.decrement_poop_balance(UUID, INTEGER) TO service_role;
