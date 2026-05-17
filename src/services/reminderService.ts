import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type PatientReminder = Tables<"patient_reminders">;

export const reminderService = {
  // Create reminder
  async createReminder(patientId: string, reminderText: string, reminderDate?: string) {
    const { data, error } = await supabase
      .from("patient_reminders")
      .insert({
        patient_id: patientId,
        reminder_text: reminderText,
        reminder_date: reminderDate || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all reminders for a patient
  async getPatientReminders(patientId: string) {
    const { data, error } = await supabase
      .from("patient_reminders")
      .select("*")
      .eq("patient_id", patientId)
      .order("reminder_date", { ascending: true, nullsFirst: false });

    if (error) throw error;
    return data || [];
  },

  // Mark reminder as completed
  async completeReminder(reminderId: string) {
    const { data, error } = await supabase
      .from("patient_reminders")
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq("id", reminderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update reminder
  async updateReminder(reminderId: string, updates: { reminder_text?: string; reminder_date?: string }) {
    const { data, error } = await supabase
      .from("patient_reminders")
      .update(updates)
      .eq("id", reminderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete reminder
  async deleteReminder(reminderId: string) {
    const { error } = await supabase
      .from("patient_reminders")
      .delete()
      .eq("id", reminderId);

    if (error) throw error;
  },

  // Get upcoming reminders (not completed)
  async getUpcomingReminders() {
    const { data, error } = await supabase
      .from("patient_reminders")
      .select("*")
      .eq("is_completed", false)
      .order("reminder_date", { ascending: true, nullsFirst: false });

    if (error) throw error;
    return data || [];
  },
};