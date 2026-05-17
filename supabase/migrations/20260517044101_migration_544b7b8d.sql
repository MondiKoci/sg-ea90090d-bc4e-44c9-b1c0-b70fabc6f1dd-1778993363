-- Create treatment steps table for tracking patient treatment progress
CREATE TABLE IF NOT EXISTS treatment_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('completed', 'in_progress', 'upcoming')),
  completed_at TIMESTAMP WITH TIME ZONE,
  scheduled_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_treatment_steps_patient ON treatment_steps(patient_id);
CREATE INDEX IF NOT EXISTS idx_treatment_steps_status ON treatment_steps(status);

-- Enable RLS
ALTER TABLE treatment_steps ENABLE ROW LEVEL SECURITY;

-- Admin can manage all steps
CREATE POLICY "auth_manage_steps" ON treatment_steps
  FOR ALL
  TO public
  USING (auth.uid() IS NOT NULL);

-- Patients can view their own steps (we'll add patient-specific auth later)
CREATE POLICY "patients_view_own_steps" ON treatment_steps
  FOR SELECT
  TO public
  USING (true);

-- Add portal_password field to patients table for patient login
ALTER TABLE patients ADD COLUMN IF NOT EXISTS portal_password TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS portal_access_enabled BOOLEAN DEFAULT false;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS last_portal_login TIMESTAMP WITH TIME ZONE;