import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type PatientFile = Tables<"patient_files">;

export const fileService = {
  // Upload file to storage
  async uploadFile(patientId: string, file: File, fileType: "quote" | "receipt" | "document" | "other") {
    const fileExt = file.name.split(".").pop();
    const fileName = `${patientId}/${Date.now()}.${fileExt}`;
    
    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from("patient-documents")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Create file record in database
    const { data, error } = await supabase
      .from("patient_files")
      .insert({
        patient_id: patientId,
        file_name: file.name,
        file_path: fileName,
        file_type: fileType,
        file_size: file.size,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all files for a patient
  async getPatientFiles(patientId: string) {
    const { data, error } = await supabase
      .from("patient_files")
      .select("*")
      .eq("patient_id", patientId)
      .order("uploaded_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Download file URL
  async getFileUrl(filePath: string) {
    const { data } = supabase.storage
      .from("patient-documents")
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  // Get signed URL for private file access
  async getSignedFileUrl(filePath: string, expiresIn = 3600) {
    const { data, error } = await supabase.storage
      .from("patient-documents")
      .createSignedUrl(filePath, expiresIn);

    if (error) throw error;
    return data.signedUrl;
  },

  // Delete file
  async deleteFile(fileId: string, filePath: string) {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("patient-documents")
      .remove([filePath]);

    if (storageError) throw storageError;

    // Delete database record
    const { error } = await supabase
      .from("patient_files")
      .delete()
      .eq("id", fileId);

    if (error) throw error;
  },
};