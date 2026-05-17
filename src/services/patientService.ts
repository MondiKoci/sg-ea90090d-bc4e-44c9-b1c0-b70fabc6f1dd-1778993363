import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Patient = Tables<"patients">;
export type PatientInsert = Omit<Patient, "id" | "created_at" | "updated_at" | "created_by">;
export type PatientUpdate = Partial<PatientInsert>;

export const patientService = {
  // Create new patient (public booking form)
  async createPatient(data: PatientInsert) {
    const { data: patient, error } = await supabase
      .from("patients")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return patient;
  },

  // Get all patients (admin only)
  async getAllPatients() {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get patient by ID
  async getPatientById(id: string) {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update patient
  async updatePatient(id: string, updates: PatientUpdate) {
    const { data, error } = await supabase
      .from("patients")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete patient
  async deletePatient(id: string) {
    const { error } = await supabase
      .from("patients")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  // Get patients by status
  async getPatientsByStatus(status: string) {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("status", status)
      .order("arrival_date", { ascending: true });

    if (error) throw error;
    return data || [];
  },
};