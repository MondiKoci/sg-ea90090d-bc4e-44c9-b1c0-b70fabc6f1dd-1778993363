import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Treatment = Tables<"treatments">;

export type CreateTreatmentInput = Omit<Treatment, "id" | "created_at" | "updated_at">;

export const treatmentService = {
  async getPublishedTreatments(): Promise<Treatment[]> {
    const { data, error } = await supabase
      .from("treatments")
      .select("*")
      .eq("published", true)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getAllTreatments(): Promise<Treatment[]> {
    const { data, error } = await supabase
      .from("treatments")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getTreatmentBySlug(slug: string): Promise<Treatment | null> {
    const { data, error } = await supabase
      .from("treatments")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data;
  },

  async createTreatment(treatment: CreateTreatmentInput): Promise<Treatment> {
    const { data, error } = await supabase
      .from("treatments")
      .insert([treatment])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTreatment(id: string, updates: Partial<Treatment>): Promise<Treatment> {
    const { data, error } = await supabase
      .from("treatments")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTreatment(id: string): Promise<void> {
    const { error } = await supabase
      .from("treatments")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  },
};