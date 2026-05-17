import { supabase } from "@/integrations/supabase/client";

export interface PatientDocument {
  id: string;
  patient_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  document_type: "medical_record" | "id_document" | "insurance" | "other";
  uploaded_by: string;
  uploaded_at: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const fileService = {
  // Upload file to storage and create document record
  async uploadDocument(
    patientId: string,
    file: File,
    documentType: PatientDocument["document_type"],
    uploadedBy: string,
    notes?: string
  ): Promise<PatientDocument> {
    try {
      // Generate unique file path
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filePath = `${patientId}/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("patient-documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { data, error } = await supabase
        .from("patient_documents")
        .insert({
          patient_id: patientId,
          file_name: file.name,
          file_path: uploadData.path,
          file_size: file.size,
          file_type: file.type,
          document_type: documentType,
          uploaded_by: uploadedBy,
          notes,
        })
        .select()
        .single();

      if (error) throw error;
      return data as PatientDocument;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  },

  // Get all documents for a patient
  async getPatientDocuments(patientId: string): Promise<PatientDocument[]> {
    const { data, error } = await supabase
      .from("patient_documents")
      .select("*")
      .eq("patient_id", patientId)
      .order("uploaded_at", { ascending: false });

    if (error) throw error;
    return (data || []) as PatientDocument[];
  },

  // Get documents by email (for patient portal)
  async getDocumentsByEmail(email: string): Promise<PatientDocument[]> {
    // First get patient ID from email
    const { data: patient } = await supabase
      .from("patients")
      .select("id")
      .eq("email", email)
      .single();

    if (!patient) return [];

    return this.getPatientDocuments(patient.id);
  },

  // Download file from storage
  async downloadDocument(filePath: string): Promise<Blob> {
    const { data, error } = await supabase.storage
      .from("patient-documents")
      .download(filePath);

    if (error) throw error;
    return data;
  },

  // Get public URL for file preview
  async getFileUrl(filePath: string): Promise<string> {
    const { data } = supabase.storage
      .from("patient-documents")
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  // Delete document
  async deleteDocument(documentId: string, filePath: string): Promise<void> {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("patient-documents")
      .remove([filePath]);

    if (storageError) throw storageError;

    // Delete record
    const { error } = await supabase
      .from("patient_documents")
      .delete()
      .eq("id", documentId);

    if (error) throw error;
  },

  // Format file size for display
  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  },
};