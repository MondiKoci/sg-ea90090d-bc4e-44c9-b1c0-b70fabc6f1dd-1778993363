-- Create patients table with all required fields
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  treatment_interest TEXT,
  arrival_date TIMESTAMP WITH TIME ZONE,
  departure_date TIMESTAMP WITH TIME ZONE,
  accommodation_notes TEXT,
  work_notes TEXT,
  payment_total_notes TEXT,
  payment_first_notes TEXT,
  payment_second_notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_treatment', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create patient_files table for quotes and receipts
CREATE TABLE IF NOT EXISTS patient_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT CHECK (file_type IN ('quote', 'receipt', 'document', 'other')),
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create patient_reminders table
CREATE TABLE IF NOT EXISTS patient_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  reminder_text TEXT NOT NULL,
  reminder_date TIMESTAMP WITH TIME ZONE,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create patient_shares table for granular sharing
CREATE TABLE IF NOT EXISTS patient_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  shared_with_email TEXT NOT NULL,
  shared_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(patient_id, shared_with_email)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_patients_arrival_date ON patients(arrival_date);
CREATE INDEX IF NOT EXISTS idx_patient_files_patient_id ON patient_files(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_reminders_patient_id ON patient_reminders(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_reminders_date ON patient_reminders(reminder_date) WHERE is_completed = FALSE;
CREATE INDEX IF NOT EXISTS idx_patient_shares_patient_id ON patient_shares(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_shares_email ON patient_shares(shared_with_email);

-- Enable RLS on all tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patients table
-- Public can insert (booking form submissions)
CREATE POLICY "anon_insert_patients" ON patients
  FOR INSERT
  WITH CHECK (true);

-- Authenticated users can read all patients (admin access)
CREATE POLICY "auth_read_patients" ON patients
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Authenticated users can update patients
CREATE POLICY "auth_update_patients" ON patients
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Authenticated users can delete patients
CREATE POLICY "auth_delete_patients" ON patients
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- RLS Policies for patient_files table
CREATE POLICY "auth_all_patient_files" ON patient_files
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- RLS Policies for patient_reminders table
CREATE POLICY "auth_all_patient_reminders" ON patient_reminders
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- RLS Policies for patient_shares table
CREATE POLICY "auth_all_patient_shares" ON patient_shares
  FOR ALL
  USING (auth.uid() IS NOT NULL);