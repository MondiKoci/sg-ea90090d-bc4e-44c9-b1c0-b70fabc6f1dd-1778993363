import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type PatientShare = Tables<"patient_shares">;

export const sharingService = {
  // Share patient data with specific email
  async sharePatientData(patientId: string, email: string) {
    const { data, error } = await supabase
      .from("patient_shares")
      .insert({
        patient_id: patientId,
        shared_with_email: email,
      })
      .select()
      .single();

    if (error) {
      // Handle unique constraint violation (already shared)
      if (error.code === "23505") {
        throw new Error("Patient data is already shared with this email");
      }
      throw error;
    }
    return data;
  },

  // Get all shares for a patient
  async getPatientShares(patientId: string) {
    const { data, error } = await supabase
      .from("patient_shares")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Remove share access
  async removeShare(shareId: string) {
    const { error } = await supabase
      .from("patient_shares")
      .delete()
      .eq("id", shareId);

    if (error) throw error;
  },

  // Check if patient data is shared with specific email
  async isSharedWith(patientId: string, email: string) {
    const { data, error } = await supabase
      .from("patient_shares")
      .select("id")
      .eq("patient_id", patientId)
      .eq("shared_with_email", email)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },
};