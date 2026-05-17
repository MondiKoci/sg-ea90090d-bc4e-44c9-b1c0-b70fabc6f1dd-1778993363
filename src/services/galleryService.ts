import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type BeforeAfterCase = Tables<"before_after_cases">;
export type CaseInsert = Omit<BeforeAfterCase, "id" | "created_at" | "created_by">;
export type CaseUpdate = Partial<CaseInsert>;

export const galleryService = {
  // Get all published cases for public display
  async getPublishedCases(): Promise<BeforeAfterCase[]> {
    const { data, error } = await supabase
      .from("before_after_cases")
      .select("*")
      .eq("published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get all cases for admin
  async getAllCases(): Promise<BeforeAfterCase[]> {
    const { data, error } = await supabase
      .from("before_after_cases")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get single case
  async getCaseById(id: string): Promise<BeforeAfterCase | null> {
    const { data, error } = await supabase
      .from("before_after_cases")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // Create case
  async createCase(caseData: CaseInsert): Promise<BeforeAfterCase> {
    const { data, error } = await supabase
      .from("before_after_cases")
      .insert(caseData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update case
  async updateCase(id: string, updates: CaseUpdate): Promise<BeforeAfterCase> {
    const { data, error } = await supabase
      .from("before_after_cases")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete case
  async deleteCase(id: string): Promise<void> {
    const { error } = await supabase
      .from("before_after_cases")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  // Upload case image
  async uploadCaseImage(file: File, type: "before" | "after"): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${type}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("case-images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("case-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  // Delete case image
  async deleteCaseImage(url: string): Promise<void> {
    const path = url.split("/case-images/")[1];
    if (!path) return;

    const { error } = await supabase.storage
      .from("case-images")
      .remove([path]);

    if (error) throw error;
  },
};