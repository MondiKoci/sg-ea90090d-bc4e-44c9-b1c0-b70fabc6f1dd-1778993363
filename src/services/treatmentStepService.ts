import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type TreatmentStep = Tables<"treatment_steps">;

export interface CreateTreatmentStepData {
  patient_id: string;
  step_number: number;
  title: string;
  description?: string;
  instructions?: string;
  status?: "completed" | "in_progress" | "upcoming";
  scheduled_date?: string;
}

export interface UpdateTreatmentStepData {
  step_number?: number;
  title?: string;
  description?: string;
  instructions?: string;
  status?: "completed" | "in_progress" | "upcoming";
  completed_at?: string | null;
  scheduled_date?: string | null;
}

export const treatmentStepService = {
  // Get all steps for a patient
  async getPatientSteps(patientId: string): Promise<TreatmentStep[]> {
    const { data, error } = await supabase
      .from("treatment_steps")
      .select("*")
      .eq("patient_id", patientId)
      .order("step_number", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Create a new treatment step
  async createStep(stepData: CreateTreatmentStepData): Promise<TreatmentStep> {
    const { data, error } = await supabase
      .from("treatment_steps")
      .insert([stepData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a treatment step
  async updateStep(stepId: string, updates: UpdateTreatmentStepData): Promise<TreatmentStep> {
    // If marking as completed, set completed_at timestamp
    if (updates.status === "completed" && !updates.completed_at) {
      updates.completed_at = new Date().toISOString();
    }
    
    // If changing from completed to other status, clear completed_at
    if (updates.status && updates.status !== "completed") {
      updates.completed_at = null;
    }

    const { data, error } = await supabase
      .from("treatment_steps")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", stepId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a treatment step
  async deleteStep(stepId: string): Promise<void> {
    const { error } = await supabase
      .from("treatment_steps")
      .delete()
      .eq("id", stepId);

    if (error) throw error;
  },

  // Get step statistics for a patient
  async getPatientProgress(patientId: string): Promise<{
    total: number;
    completed: number;
    inProgress: number;
    upcoming: number;
    percentComplete: number;
  }> {
    const steps = await this.getPatientSteps(patientId);
    
    const completed = steps.filter(s => s.status === "completed").length;
    const inProgress = steps.filter(s => s.status === "in_progress").length;
    const upcoming = steps.filter(s => s.status === "upcoming").length;
    const total = steps.length;
    const percentComplete = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      upcoming,
      percentComplete,
    };
  },
};