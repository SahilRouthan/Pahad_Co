-- ==============================================================================
-- PAHAD.co Admin User Bootstrap Script
-- ==============================================================================
-- To create an admin account for PAHAD.co:
-- 
-- Method 1 (Recommended via Supabase Dashboard):
-- 1. Go to your Supabase Dashboard -> Authentication -> Users -> Add User -> Create User
-- 2. Enter email: admin@pahad.co (or your own email)
-- 3. Enter a strong password
-- 4. Check "Auto Confirm User?" so no email verification is needed
-- 5. Copy the newly created User's UUID, and run this SQL:
--
-- INSERT INTO public.admin_users (id, email, role, full_name)
-- VALUES ('PASTE_USER_UUID_HERE', 'admin@pahad.co', 'admin', 'Lead Event Producer')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Method 2 (Automatic trigger):
-- Alternatively, if you want any specific email domain or specific email to automatically
-- receive admin status upon registration in auth.users:

CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Automatically grant admin privileges if the user email matches your administrative email
  IF NEW.email IN ('admin@pahad.co', 'sahil@pahad.co', 'events@pahad.co') THEN
    INSERT INTO public.admin_users (id, email, role, full_name)
    VALUES (NEW.id, NEW.email, 'admin', COALESCE(NEW.raw_user_meta_data->>'full_name', 'PAHAD Administrator'))
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_admin_user();
