-- Create storage bucket for patient documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('patient-documents', 'patient-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for authenticated users only
CREATE POLICY "auth_upload_patient_docs" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'patient-documents');

CREATE POLICY "auth_read_patient_docs" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'patient-documents');

CREATE POLICY "auth_delete_patient_docs" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'patient-documents');