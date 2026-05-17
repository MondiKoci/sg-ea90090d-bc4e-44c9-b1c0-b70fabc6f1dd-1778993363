-- Add email templates table for storing customizable templates
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  variables JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Admin can manage templates
CREATE POLICY "admin_all_email_templates" ON email_templates
  FOR ALL
  TO public
  USING (auth.uid() IS NOT NULL);

-- Create updated_at trigger
CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default templates
INSERT INTO email_templates (name, subject, html_content, text_content, variables) VALUES
(
  'booking_confirmation',
  'Booking Confirmation - Elite Dental Tourism',
  '<html><body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;"><div style="background: linear-gradient(135deg, #243444 0%, #E8C468 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;"><h1 style="color: white; margin: 0;">Elite Dental Tourism</h1></div><div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;"><h2 style="color: #243444;">Booking Confirmation</h2><p>Dear {{full_name}},</p><p>Thank you for your interest in our dental tourism services! We have received your booking request for <strong>{{treatment_interest}}</strong>.</p><div style="background: #F7F5F0; padding: 20px; border-radius: 8px; margin: 20px 0;"><h3 style="color: #243444; margin-top: 0;">Booking Details:</h3><p><strong>Name:</strong> {{full_name}}</p><p><strong>Email:</strong> {{email}}</p><p><strong>Phone:</strong> {{phone}}</p><p><strong>Treatment Interest:</strong> {{treatment_interest}}</p>{{#arrival_date}}<p><strong>Preferred Arrival:</strong> {{arrival_date}}</p>{{/arrival_date}}</div><p>Our team will review your request and contact you within 24-48 hours to confirm your appointment and discuss next steps.</p><p>If you have any questions, please don''t hesitate to reach out.</p><p style="margin-top: 40px;">Best regards,<br><strong>Elite Dental Tourism Team</strong></p></div><div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">© 2026 Elite Dental Tourism. All rights reserved.</div></body></html>',
  'Dear {{full_name}},\n\nThank you for your interest in our dental tourism services! We have received your booking request for {{treatment_interest}}.\n\nBooking Details:\nName: {{full_name}}\nEmail: {{email}}\nPhone: {{phone}}\nTreatment Interest: {{treatment_interest}}\n\nOur team will review your request and contact you within 24-48 hours.\n\nBest regards,\nElite Dental Tourism Team',
  '["full_name", "email", "phone", "treatment_interest", "arrival_date"]'::jsonb
),
(
  'invoice_notification',
  'New Invoice from Elite Dental Tourism',
  '<html><body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;"><div style="background: linear-gradient(135deg, #243444 0%, #E8C468 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;"><h1 style="color: white; margin: 0;">Elite Dental Tourism</h1></div><div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;"><h2 style="color: #243444;">New Invoice</h2><p>Dear {{patient_name}},</p><p>A new invoice has been issued for your treatment.</p><div style="background: #F7F5F0; padding: 20px; border-radius: 8px; margin: 20px 0;"><h3 style="color: #243444; margin-top: 0;">Invoice Details:</h3><p><strong>Invoice Number:</strong> {{invoice_number}}</p><p><strong>Amount:</strong> ${{total}}</p><p><strong>Due Date:</strong> {{due_date}}</p></div><p>You can view and manage your invoice by logging into your patient portal.</p><a href="{{portal_url}}" style="display: inline-block; background: #E8C468; color: #243444; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">View Invoice</a><p style="margin-top: 40px;">Best regards,<br><strong>Elite Dental Tourism Team</strong></p></div><div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">© 2026 Elite Dental Tourism. All rights reserved.</div></body></html>',
  'Dear {{patient_name}},\n\nA new invoice has been issued for your treatment.\n\nInvoice Details:\nInvoice Number: {{invoice_number}}\nAmount: ${{total}}\nDue Date: {{due_date}}\n\nYou can view your invoice by logging into your patient portal.\n\nBest regards,\nElite Dental Tourism Team',
  '["patient_name", "invoice_number", "total", "due_date", "portal_url"]'::jsonb
);