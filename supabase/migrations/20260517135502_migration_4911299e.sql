-- Create patient_documents table
CREATE TABLE IF NOT EXISTS patient_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('medical_record', 'id_document', 'insurance', 'other')),
  uploaded_by TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_patient_documents_patient_id ON patient_documents(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_documents_document_type ON patient_documents(document_type);

-- Enable RLS
ALTER TABLE patient_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patient_documents
-- Patients can view their own documents
CREATE POLICY "select_own_documents" ON patient_documents
  FOR SELECT
  USING (
    patient_id IN (
      SELECT id FROM patients WHERE email = auth.jwt()->>'email'
    )
  );

-- Patients can upload their own documents
CREATE POLICY "insert_own_documents" ON patient_documents
  FOR INSERT
  WITH CHECK (
    patient_id IN (
      SELECT id FROM patients WHERE email = auth.jwt()->>'email'
    )
  );

-- Patients can delete their own documents
CREATE POLICY "delete_own_documents" ON patient_documents
  FOR DELETE
  USING (
    patient_id IN (
      SELECT id FROM patients WHERE email = auth.jwt()->>'email'
    )
  );

-- Admins can view all documents (authenticated users)
CREATE POLICY "admins_select_all" ON patient_documents
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Admins can insert documents
CREATE POLICY "admins_insert_all" ON patient_documents
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Admins can delete documents
CREATE POLICY "admins_delete_all" ON patient_documents
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_patient_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER patient_documents_updated_at
  BEFORE UPDATE ON patient_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_patient_documents_updated_at();

-- Create storage bucket for patient documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('patient-documents', 'patient-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for patient-documents bucket
-- Authenticated users can upload files
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'patient-documents');

-- Users can view their own documents or all if admin
CREATE POLICY "Users can view documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'patient-documents');

-- Users can delete their own documents
CREATE POLICY "Users can delete documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'patient-documents');