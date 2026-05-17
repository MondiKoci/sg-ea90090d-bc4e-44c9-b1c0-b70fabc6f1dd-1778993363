import { supabase } from "@/integrations/supabase/client";
import { patientService } from "./patientService";

export interface NotificationPreferences {
  id: string;
  patient_email: string;
  email_notifications: boolean;
  invoice_notifications: boolean;
  treatment_update_notifications: boolean;
  marketing_emails: boolean;
  created_at: string;
  updated_at: string;
}

export const settingsService = {
  // Get notification preferences for a patient
  async getPreferences(email: string): Promise<NotificationPreferences | null> {
    const { data, error } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("patient_email", email)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching preferences:", error);
      return null;
    }

    return data as NotificationPreferences | null;
  },

  // Create or update notification preferences
  async updatePreferences(
    email: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<void> {
    // Check if preferences exist
    const existing = await this.getPreferences(email);

    if (existing) {
      // Update existing preferences
      const { error } = await supabase
        .from("notification_preferences")
        .update(preferences)
        .eq("patient_email", email);

      if (error) throw error;
    } else {
      // Create new preferences
      const { error } = await supabase
        .from("notification_preferences")
        .insert({
          patient_email: email,
          ...preferences,
        });

      if (error) throw error;
    }
  },

  // Update patient profile information
  async updateProfile(
    email: string,
    profileData: {
      full_name?: string;
      phone?: string;
    }
  ): Promise<void> {
    // Find patient by email
    const { data: patients, error: searchError } = await supabase
      .from("patients")
      .select("id")
      .eq("email", email)
      .limit(1);

    if (searchError) throw searchError;
    if (!patients || patients.length === 0) {
      throw new Error("Patient not found");
    }

    const patientId = patients[0].id;

    // Update patient record
    await patientService.updatePatient(patientId, profileData as any);
  },

  // Get patient profile by email
  async getProfile(email: string) {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("email", email)
      .single();

    if (error) throw error;
    return data;
  },
};