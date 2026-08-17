-- 005_create_products.sql
-- Core products table for Project Falcon.

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,

  sku text UNIQUE,

  price numeric(12,2) NOT NULL DEFAULT 0
    CHECK (price >= 0),

  sale_price numeric(12,2)
    CHECK (sale_price IS NULL OR sale_price >= 0),

  stock integer NOT NULL DEFAULT 0
    CHECK (stock >= 0),

  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'draft', 'archived')),

  image_url text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'products_set_updated_at'
  ) THEN
    CREATE TRIGGER products_set_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();
  END IF;
END
$$;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY products_select_authenticated
ON public.products
FOR SELECT
TO authenticated
USING (
  status = 'active'
  OR EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'staff')
  )
);

CREATE POLICY products_insert_staff
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'staff')
  )
);

CREATE POLICY products_update_staff
ON public.products
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'staff')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'staff')
  )
);

CREATE POLICY products_delete_staff
ON public.products
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'staff')
  )
);

CREATE INDEX IF NOT EXISTS products_status_idx
ON public.products(status);

CREATE INDEX IF NOT EXISTS products_created_at_idx
ON public.products(created_at DESC);
