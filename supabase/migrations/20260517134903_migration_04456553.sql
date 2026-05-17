-- Create notification preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_email TEXT NOT NULL UNIQUE,
  email_notifications BOOLEAN DEFAULT true,
  invoice_notifications BOOLEAN DEFAULT true,
  treatment_update_notifications BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Policies for notification preferences
CREATE POLICY "Users can view own preferences"
  ON notification_preferences FOR SELECT
  USING (patient_email = current_setting('request.jwt.claims', true)::json->>'email' OR patient_email IN (
    SELECT email FROM patients WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
  ));

CREATE POLICY "Users can update own preferences"
  ON notification_preferences FOR UPDATE
  USING (patient_email = current_setting('request.jwt.claims', true)::json->>'email' OR patient_email IN (
    SELECT email FROM patients WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
  ));

CREATE POLICY "Users can insert own preferences"
  ON notification_preferences FOR INSERT
  WITH CHECK (patient_email = current_setting('request.jwt.claims', true)::json->>'email' OR patient_email IN (
    SELECT email FROM patients WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
  ));

-- Allow anonymous/public access for now (since we're using custom auth)
CREATE POLICY "Public can manage preferences"
  ON notification_preferences FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_notification_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notification_preferences_timestamp
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_preferences_updated_at();