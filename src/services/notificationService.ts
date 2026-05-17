import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Notification = Tables<"notifications">;

export interface CreateNotificationData {
  user_type: "patient" | "admin";
  user_email: string;
  title: string;
  message: string;
  type: "invoice" | "booking" | "payment" | "treatment" | "general";
  related_id?: string;
}

export const notificationService = {
  // Create a new notification
  async createNotification(data: CreateNotificationData): Promise<Notification> {
    const { data: notification, error } = await supabase
      .from("notifications")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return notification;
  },

  // Get notifications for a user
  async getUserNotifications(
    userType: "patient" | "admin",
    userEmail: string,
    unreadOnly = false
  ): Promise<Notification[]> {
    let query = supabase
      .from("notifications")
      .select("*")
      .eq("user_type", userType)
      .eq("user_email", userEmail)
      .order("created_at", { ascending: false });

    if (unreadOnly) {
      query = query.eq("is_read", false);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Get unread count
  async getUnreadCount(userType: "patient" | "admin", userEmail: string): Promise<number> {
    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_type", userType)
      .eq("user_email", userEmail)
      .eq("is_read", false);

    if (error) throw error;
    return count || 0;
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .update({ 
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq("id", notificationId);

    if (error) throw error;
  },

  // Mark all notifications as read for a user
  async markAllAsRead(userType: "patient" | "admin", userEmail: string): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .update({ 
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq("user_type", userType)
      .eq("user_email", userEmail)
      .eq("is_read", false);

    if (error) throw error;
  },

  // Delete a notification
  async deleteNotification(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) throw error;
  },

  // Helper: Create invoice notification for patient
  async notifyPatientInvoice(patientEmail: string, invoiceNumber: string, invoiceId: string): Promise<void> {
    await this.createNotification({
      user_type: "patient",
      user_email: patientEmail,
      title: "New Invoice",
      message: `Invoice ${invoiceNumber} has been issued`,
      type: "invoice",
      related_id: invoiceId,
    });
  },

  // Helper: Create booking notification for admins
  async notifyAdminBooking(patientName: string, patientEmail: string, treatment: string): Promise<void> {
    // Notify all admins - you can configure admin emails here
    const adminEmails = ["admin@elitedental.com"]; // Configure your admin emails
    
    for (const adminEmail of adminEmails) {
      await this.createNotification({
        user_type: "admin",
        user_email: adminEmail,
        title: "New Booking Request",
        message: `${patientName} (${patientEmail}) submitted a booking for ${treatment}`,
        type: "booking",
      });
    }
  },
};