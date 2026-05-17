import { supabase } from "@/integrations/supabase/client";

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content: string | null;
  variables: string[];
}

export const emailService = {
  // Get all email templates
  async getTemplates(): Promise<EmailTemplate[]> {
    const { data, error } = await supabase
      .from("email_templates")
      .select("*")
      .order("name");

    if (error) throw error;
    return data as EmailTemplate[];
  },

  // Get template by name
  async getTemplateByName(name: string): Promise<EmailTemplate | null> {
    const { data, error } = await supabase
      .from("email_templates")
      .select("*")
      .eq("name", name)
      .single();

    if (error) return null;
    return data as EmailTemplate;
  },

  // Render template with variables (simple Mustache-style replacement)
  renderTemplate(template: string, variables: Record<string, string>): string {
    let rendered = template;
    
    // Replace {{variable}} with actual values
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      rendered = rendered.replace(regex, variables[key] || '');
    });

    // Handle conditional sections {{#variable}}...{{/variable}}
    Object.keys(variables).forEach(key => {
      const conditionalRegex = new RegExp(`{{#${key}}}([\\s\\S]*?){{/${key}}}`, 'g');
      if (variables[key]) {
        // Keep the content inside
        rendered = rendered.replace(conditionalRegex, '$1');
      } else {
        // Remove the conditional section
        rendered = rendered.replace(conditionalRegex, '');
      }
    });

    return rendered;
  },

  // Send booking confirmation email
  async sendBookingConfirmation(data: {
    to: string;
    full_name: string;
    email: string;
    phone: string;
    treatment_interest: string;
    arrival_date?: string;
  }) {
    const template = await this.getTemplateByName('booking_confirmation');
    if (!template) {
      console.error('Booking confirmation template not found');
      return;
    }

    const variables = {
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      treatment_interest: data.treatment_interest,
      arrival_date: data.arrival_date || '',
    };

    const htmlContent = this.renderTemplate(template.html_content, variables);
    const subject = this.renderTemplate(template.subject, variables);

    // In production, integrate with your email provider (SendGrid, AWS SES, etc.)
    console.log('📧 Sending booking confirmation email to:', data.to);
    console.log('Subject:', subject);
    console.log('HTML Preview:', htmlContent.substring(0, 200));
    
    // For now, just log (replace with actual email sending in production)
    // await fetch('/api/send-email', {
    //   method: 'POST',
    //   body: JSON.stringify({ to: data.to, subject, html: htmlContent })
    // });
    
    return { success: true, message: 'Email sent (simulated)' };
  },

  // Send invoice notification email
  async sendInvoiceNotification(data: {
    to: string;
    patient_name: string;
    invoice_number: string;
    total: string;
    due_date: string;
  }) {
    const template = await this.getTemplateByName('invoice_notification');
    if (!template) {
      console.error('Invoice notification template not found');
      return;
    }

    const variables = {
      patient_name: data.patient_name,
      invoice_number: data.invoice_number,
      total: data.total,
      due_date: data.due_date,
      portal_url: `${window.location.origin}/portal/login`,
    };

    const htmlContent = this.renderTemplate(template.html_content, variables);
    const subject = this.renderTemplate(template.subject, variables);

    console.log('📧 Sending invoice notification to:', data.to);
    console.log('Subject:', subject);
    console.log('HTML Preview:', htmlContent.substring(0, 200));
    
    return { success: true, message: 'Email sent (simulated)' };
  },

  // Update template (admin only)
  async updateTemplate(id: string, updates: Partial<EmailTemplate>) {
    const { data, error } = await supabase
      .from("email_templates")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as EmailTemplate;
  },
};