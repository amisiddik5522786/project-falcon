-- Project Falcon Blueprint
-- Secure private avatar storage

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM storage.buckets
    WHERE id = 'avatars'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('avatars', 'avatars', false);
  ELSE
    UPDATE storage.buckets
    SET public = false
    WHERE id = 'avatars';
  END IF;
END
$$;

DROP POLICY IF EXISTS avatars_storage_select ON storage.objects;
DROP POLICY IF EXISTS avatars_storage_insert ON storage.objects;
DROP POLICY IF EXISTS avatars_storage_update ON storage.objects;
DROP POLICY IF EXISTS avatars_storage_delete ON storage.objects;

CREATE POLICY avatars_storage_select
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY avatars_storage_insert
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY avatars_storage_update
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY avatars_storage_delete
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
