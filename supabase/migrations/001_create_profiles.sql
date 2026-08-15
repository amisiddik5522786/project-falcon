-- 001_create_profiles.sql
-- Minimal profiles table and RLS for Project Falcon
-- Idempotent where possible; does not drop existing tables.

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'customer',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Set up updated_at trigger function
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'set_updated_at') THEN
    CREATE OR REPLACE FUNCTION public.set_updated_at()
    RETURNS trigger LANGUAGE plpgsql AS $set_updated_at$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $set_updated_at$;
  END IF;
END$$;

-- Create trigger to update updated_at on row updates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'profiles_set_updated_at'
  ) THEN
    CREATE TRIGGER profiles_set_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();
  END IF;
END$$;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies: allow users to SELECT their own profile
-- and UPDATE their own profile, but prevent changing role.
-- Also allow INSERT for the authenticated user (useful if clients create profiles),
-- but in normal flows the trigger below will create profiles server-side.

-- helper to avoid duplicate policy creation: drop if exists then create
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'profiles_select_own') THEN
    PERFORM 1;
  ELSE
    CREATE POLICY profiles_select_own ON public.profiles
      FOR SELECT
      USING (auth.uid() = id);
  END IF;
END$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'profiles_update_own') THEN
    PERFORM 1;
  ELSE
    CREATE POLICY profiles_update_own ON public.profiles
      FOR UPDATE
      USING (auth.uid() = id)
      WITH CHECK (
        auth.uid() = id
        AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
      );
  END IF;
END$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'profiles_insert_own') THEN
    PERFORM 1;
  ELSE
    CREATE POLICY profiles_insert_own ON public.profiles
      FOR INSERT
      WITH CHECK (auth.uid() = id);
  END IF;
END$$;

-- Create function to auto-create a profile when a new user is added to auth.users
-- This function runs as SECURITY DEFINER so it can bypass RLS when executed by the trigger.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user') THEN
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $handle_new_user$
    BEGIN
      -- Insert a profile row for the newly created auth user if one does not exist.
      INSERT INTO public.profiles (id, display_name, role)
      VALUES (NEW.id, COALESCE(NEW.email, ''), 'customer')
      ON CONFLICT (id) DO NOTHING;
      RETURN NEW;
    END;
    $handle_new_user$;
  END IF;
END$$;

-- Create trigger on auth.users to call the profile creation function
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'auth_users_after_insert_profiles'
  ) THEN
    CREATE TRIGGER auth_users_after_insert_profiles
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
  END IF;
END$$;

-- Note: The handle_new_user function is SECURITY DEFINER so it runs with the privileges
-- of the role that created it (the migration runner). This allows creating the
-- profile row even when RLS would prevent a client from inserting.

-- Ensure role values are constrained to expected set (optional safety)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'profiles_role_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_role_check CHECK (role IN ('customer','vendor','admin','super_admin'))
      ;
  END IF;
END$$;

-- End of migration
