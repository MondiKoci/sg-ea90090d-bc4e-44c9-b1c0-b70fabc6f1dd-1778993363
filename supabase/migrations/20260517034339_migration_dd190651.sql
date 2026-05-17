-- Create storage buckets for case images and blog images
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('case-images', 'case-images', true),
  ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for case-images bucket
CREATE POLICY "public_read_case_images" ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'case-images');

CREATE POLICY "auth_upload_case_images" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'case-images');

CREATE POLICY "auth_update_case_images" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'case-images');

CREATE POLICY "auth_delete_case_images" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'case-images');

-- RLS policies for blog-images bucket
CREATE POLICY "public_read_blog_images" ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'blog-images');

CREATE POLICY "auth_upload_blog_images" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "auth_update_blog_images" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'blog-images');

CREATE POLICY "auth_delete_blog_images" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'blog-images');