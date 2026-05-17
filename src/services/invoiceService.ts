import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Invoice = Tables<"invoices">;
export type InvoiceItem = Tables<"invoice_items">;

export interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[];
  patient?: {
    full_name: string;
    email: string;
  };
}

export const invoiceService = {
  // Generate next invoice number
  async generateInvoiceNumber(): Promise<string> {
    const { data, error } = await supabase
      .from("invoices")
      .select("invoice_number")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    if (!data) {
      return "INV-0001";
    }

    const lastNumber = parseInt(data.invoice_number.split("-")[1] || "0");
    const nextNumber = lastNumber + 1;
    return `INV-${nextNumber.toString().padStart(4, "0")}`;
  },

  // Create invoice with items
  async createInvoice(
    patientId: string,
    items: Array<{ description: string; quantity: number; unit_price: number }>,
    data: {
      due_date?: string;
      tax_rate?: number;
      discount_amount?: number;
      notes?: string;
    }
  ): Promise<InvoiceWithItems> {
    const invoiceNumber = await this.generateInvoiceNumber();

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
    const taxAmount = (subtotal * (data.tax_rate || 0)) / 100;
    const total = subtotal + taxAmount - (data.discount_amount || 0);

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        patient_id: patientId,
        invoice_number: invoiceNumber,
        due_date: data.due_date || null,
        subtotal,
        tax_rate: data.tax_rate || 0,
        tax_amount: taxAmount,
        discount_amount: data.discount_amount || 0,
        total,
        notes: data.notes,
        status: "draft",
      })
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    // Create invoice items
    const itemsToInsert = items.map((item) => ({
      invoice_id: invoice.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total: item.quantity * item.unit_price,
    }));

    const { data: createdItems, error: itemsError } = await supabase
      .from("invoice_items")
      .insert(itemsToInsert)
      .select();

    if (itemsError) throw itemsError;

    return { ...invoice, items: createdItems || [] };
  },

  // Get all invoices with patient info
  async getAllInvoices(): Promise<InvoiceWithItems[]> {
    const { data, error } = await supabase
      .from("invoices")
      .select(`
        *,
        patient:patients(full_name, email),
        items:invoice_items(*)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []) as any;
  },

  // Get patient invoices
  async getPatientInvoices(patientId: string): Promise<InvoiceWithItems[]> {
    const { data, error } = await supabase
      .from("invoices")
      .select(`
        *,
        items:invoice_items(*)
      `)
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []) as any;
  },

  // Get invoice by ID
  async getInvoice(invoiceId: string): Promise<InvoiceWithItems> {
    const { data, error } = await supabase
      .from("invoices")
      .select(`
        *,
        patient:patients(full_name, email),
        items:invoice_items(*)
      `)
      .eq("id", invoiceId)
      .single();

    if (error) throw error;
    return data as any;
  },

  // Update invoice
  async updateInvoice(
    invoiceId: string,
    updates: Partial<Invoice>
  ): Promise<void> {
    const { error } = await supabase
      .from("invoices")
      .update(updates)
      .eq("id", invoiceId);

    if (error) throw error;
  },

  // Send invoice to patient
  async sendInvoice(invoiceId: string): Promise<void> {
    const { error } = await supabase
      .from("invoices")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
      })
      .eq("id", invoiceId);

    if (error) throw error;
  },

  // Mark invoice as paid
  async markAsPaid(invoiceId: string): Promise<void> {
    const { error } = await supabase
      .from("invoices")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
      })
      .eq("id", invoiceId);

    if (error) throw error;
  },

  // Delete invoice
  async deleteInvoice(invoiceId: string): Promise<void> {
    const { error } = await supabase
      .from("invoices")
      .delete()
      .eq("id", invoiceId);

    if (error) throw error;
  },

  // Get invoices for patient portal (by email)
  async getPatientInvoicesByEmail(email: string): Promise<InvoiceWithItems[]> {
    const { data, error } = await supabase
      .from("invoices")
      .select(`
        *,
        patient:patients!inner(full_name, email),
        items:invoice_items(*)
      `)
      .eq("patient.email", email)
      .in("status", ["sent", "paid", "overdue"])
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []) as any;
  },
};