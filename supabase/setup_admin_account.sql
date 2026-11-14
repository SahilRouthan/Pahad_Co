-- ==============================================================================
-- PAHAD.co Admin Account Instant Setup Script
-- Run this in your Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Ensure required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Add INSERT & UPDATE policies to admin_users so RLS never blocks admin management
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
  USING (public.is_admin() OR auth.uid() = id);

-- 3. Create or Update the Admin Account in auth.users and public.admin_users
DO $$
DECLARE
  target_user_id UUID := gen_random_uuid();
  admin_email TEXT := 'admin@pahad.co';
  admin_pwd TEXT := 'PahadAdmin@2026';
BEGIN
  -- If user already exists in auth.users, fetch their UUID and update password & confirmation
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email) THEN
    SELECT id INTO target_user_id FROM auth.users WHERE email = admin_email;
    
    UPDATE auth.users
    SET encrypted_password = crypt(admin_pwd, gen_salt('bf', 10)),
        email_confirmed_at = now(),
        updated_at = now(),
        raw_app_meta_data = '{"provider":"email","providers":["email"]}',
        raw_user_meta_data = '{"full_name":"Lead Event Producer"}'
    WHERE id = target_user_id;

  ELSE
    -- User doesn't exist yet, insert directly into auth.users as auto-confirmed
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud,
      confirmation_token
    )
    VALUES (
      target_user_id,
      '00000000-0000-0000-0000-000000000000',
      admin_email,
      crypt(admin_pwd, gen_salt('bf', 10)),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Lead Event Producer"}',
      now(),
      now(),
      'authenticated',
      'authenticated',
      encode(gen_random_bytes(32), 'hex')
    );
  END IF;

  -- Ensure record exists in public.admin_users table
  INSERT INTO public.admin_users (id, email, role, full_name)
  VALUES (target_user_id, admin_email, 'admin', 'Lead Event Producer')
  ON CONFLICT (id) DO UPDATE 
    SET email = admin_email,
        role = 'admin',
        full_name = 'Lead Event Producer';

  RAISE NOTICE 'Admin user % successfully configured with ID %', admin_email, target_user_id;
END $$;
