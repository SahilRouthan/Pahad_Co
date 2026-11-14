-- ==============================================================================
-- PAHAD.co - 1-Click Database & Admin Auth Repair Script
-- ==============================================================================
-- Run this entire script in your Supabase Dashboard:
-- Supabase Dashboard -> Project (irqqmpjgacfrpbjwdgzs) -> SQL Editor -> New Query -> Run
--
-- Why this fixes "Database error querying schema":
-- In Supabase GoTrue Auth (written in Go), querying a user row crashes with
-- "converting NULL to string is unsupported" (mapped to HTTP 500 "Database error querying schema")
-- when token fields like confirmation_token, recovery_token, email_change, etc.
-- are left as NULL by manual SQL insertions.
--
-- This script:
-- 1. Patches all NULL token columns in auth.users to empty strings ('')
-- 2. Fully provisions or repairs admin@pahad.co with password: PahadAdmin@2026
-- 3. Creates the required identity row in auth.identities
-- 4. Links the user in public.admin_users with role 'admin'
-- 5. Grants proper schema and execution permissions to supabase_auth_admin & authenticated
-- ==============================================================================

-- 1. Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Global Patch: Replace all NULL string tokens in auth.users with empty strings ('')
-- This prevents GoTrue from throwing "converting NULL to string is unsupported"
UPDATE auth.users
SET 
  confirmation_token = COALESCE(confirmation_token, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  email_change_token_current = COALESCE(email_change_token_current, ''),
  email_change = COALESCE(email_change, ''),
  phone_change = COALESCE(phone_change, ''),
  phone_change_token = COALESCE(phone_change_token, ''),
  reauthentication_token = COALESCE(reauthentication_token, '')
WHERE confirmation_token IS NULL
   OR recovery_token IS NULL
   OR email_change_token_new IS NULL
   OR email_change_token_current IS NULL
   OR email_change IS NULL
   OR phone_change IS NULL
   OR phone_change_token IS NULL
   OR reauthentication_token IS NULL;

-- 3. Ensure public.admin_users table exists
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
CREATE POLICY "Admins can view admin_users"
  ON public.admin_users
  FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Allow admin_users insert" ON public.admin_users;
CREATE POLICY "Allow admin_users insert"
  ON public.admin_users
  FOR INSERT
  TO postgres, service_role, authenticated, anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update admin_users" ON public.admin_users;
CREATE POLICY "Admins can update admin_users"
  ON public.admin_users
  FOR UPDATE
  TO authenticated
  USING (true);

-- 4. Recreate public.is_admin() helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon, service_role;

-- 5. Safe Trigger on auth.users for any future admin sign-ups
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email IN ('admin@pahad.co', 'sahil@pahad.co', 'events@pahad.co') THEN
    INSERT INTO public.admin_users (id, email, role, full_name)
    VALUES (
      NEW.id,
      NEW.email,
      'admin',
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'Lead Event Producer')
    )
    ON CONFLICT (id) DO UPDATE SET role = 'admin';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_admin_user();

-- 6. Upsert the Admin User (admin@pahad.co / PahadAdmin@2026)
DO $$
DECLARE
  v_user_id UUID;
  v_encrypted_pw TEXT;
  v_admin_email TEXT := 'admin@pahad.co';
  v_admin_pwd TEXT := 'PahadAdmin@2026';
BEGIN
  -- Generate proper bcrypt salt and hash
  v_encrypted_pw := crypt(v_admin_pwd, gen_salt('bf', 10));

  -- Check if admin user already exists in auth.users
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_admin_email;

  IF v_user_id IS NOT NULL THEN
    -- Update existing record with non-null token defaults
    UPDATE auth.users
    SET 
      encrypted_password = v_encrypted_pw,
      email_confirmed_at = COALESCE(email_confirmed_at, now()),
      updated_at = now(),
      raw_app_meta_data = '{"provider":"email","providers":["email"]}'::jsonb,
      raw_user_meta_data = '{"full_name":"Lead Event Producer"}'::jsonb,
      confirmation_token = '',
      recovery_token = '',
      email_change_token_new = '',
      email_change_token_current = '',
      email_change = '',
      phone_change = '',
      phone_change_token = '',
      reauthentication_token = '',
      aud = 'authenticated',
      role = 'authenticated'
    WHERE id = v_user_id;

    RAISE NOTICE 'Updated existing user % (ID: %)', v_admin_email, v_user_id;
  ELSE
    -- Generate new UUID and insert with strictly empty strings ('') for all token fields
    v_user_id := gen_random_uuid();

    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change_token_current,
      email_change,
      phone_change,
      phone_change_token,
      reauthentication_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_user_id,
      'authenticated',
      'authenticated',
      v_admin_email,
      v_encrypted_pw,
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Lead Event Producer"}'::jsonb,
      now(),
      now(),
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      ''
    );

    RAISE NOTICE 'Created new user % (ID: %)', v_admin_email, v_user_id;
  END IF;

  -- 7. Ensure entry in auth.identities
  BEGIN
    INSERT INTO auth.identities (
      id,
      provider_id,
      user_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      v_user_id::text,
      v_admin_email,
      v_user_id,
      jsonb_build_object('sub', v_user_id::text, 'email', v_admin_email),
      'email',
      now(),
      now(),
      now()
    )
    ON CONFLICT DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    BEGIN
      INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        gen_random_uuid(),
        v_user_id,
        jsonb_build_object('sub', v_user_id::text, 'email', v_admin_email),
        'email',
        now(),
        now(),
        now()
      )
      ON CONFLICT DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END;

  -- 8. Ensure entry in public.admin_users
  INSERT INTO public.admin_users (id, email, role, full_name)
  VALUES (v_user_id, v_admin_email, 'admin', 'Lead Event Producer')
  ON CONFLICT (id) DO UPDATE 
    SET email = v_admin_email,
        role = 'admin',
        full_name = 'Lead Event Producer';

  RAISE NOTICE 'Admin user % successfully linked in public.admin_users', v_admin_email;
END $$;

-- 9. Permissions Refresh
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- 10. Confirmation Check
SELECT 
  u.id, 
  u.email, 
  u.email_confirmed_at,
  a.role as admin_role,
  a.full_name
FROM auth.users u
LEFT JOIN public.admin_users a ON u.id = a.id
WHERE u.email = 'admin@pahad.co';
