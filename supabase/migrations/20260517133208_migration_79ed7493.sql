-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_type TEXT NOT NULL CHECK (user_type IN ('patient', 'admin')),
  user_email TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('invoice', 'booking', 'payment', 'treatment', 'general')),
  related_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_type, user_email, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies for patients to see their own notifications
CREATE POLICY "patients_read_own" ON notifications
  FOR SELECT
  TO public
  USING (user_type = 'patient' AND user_email = (
    SELECT email FROM patients WHERE id IN (
      SELECT patient_id FROM treatment_steps WHERE patient_id IS NOT NULL
    )
  ));

-- Policies for admins to see admin notifications
CREATE POLICY "admin_read_all" ON notifications
  FOR SELECT
  TO public
  USING (auth.uid() IS NOT NULL);

-- Policy to create notifications
CREATE POLICY "authenticated_create" ON notifications
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy to update notifications (mark as read)
CREATE POLICY "authenticated_update" ON notifications
  FOR UPDATE
  TO public
  USING (true);

-- Add updated_at column and trigger
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS notifications_updated_at ON notifications;
CREATE TRIGGER notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notifications_updated_at();