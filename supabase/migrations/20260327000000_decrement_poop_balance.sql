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
