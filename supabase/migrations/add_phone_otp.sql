-- ============================================================
-- MSG91 Phone OTP Auth — Supabase Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Add phone column to users table (unique per account)
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS phone TEXT UNIQUE;

-- 2. RPC: check if a phone number is already registered
CREATE OR REPLACE FUNCTION public.check_phone_exists(p_phone TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE phone = p_phone
  );
$$;

-- 3. RPC: save verified phone to a user record
CREATE OR REPLACE FUNCTION public.save_user_phone(p_user_id UUID, p_phone TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.users
  SET phone = p_phone
  WHERE id = p_user_id;
END;
$$;

-- 4. Grant RPC execute rights to authenticated users
GRANT EXECUTE ON FUNCTION public.check_phone_exists(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.save_user_phone(UUID, TEXT) TO authenticated;

-- Done. Verify with:
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'users' AND column_name = 'phone';
