-- Align profile roles with the Project Falcon Blueprint.

ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_role_check;

UPDATE public.profiles
SET role = 'customer'
WHERE role = 'vendor';

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_role_check
CHECK (role IN ('super_admin', 'admin', 'staff', 'customer', 'guest'));
