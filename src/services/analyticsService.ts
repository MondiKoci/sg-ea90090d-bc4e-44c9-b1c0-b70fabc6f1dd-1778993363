import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsStats {
  totalPatients: number;
  activePatients: number;
  totalRevenue: number;
  pendingRevenue: number;
  averageBookingValue: number;
  bookingsByStatus: { status: string; count: number }[];
  revenueByMonth: { month: string; revenue: number }[];
  bookingsByMonth: { month: string; count: number }[];
  topTreatments: { treatment: string; count: number }[];
}

export const analyticsService = {
  // Get comprehensive analytics data
  async getAnalytics(startDate?: string, endDate?: string): Promise<AnalyticsStats> {
    const now = new Date();
    const defaultStart = new Date(now.getFullYear(), now.getMonth() - 6, 1).toISOString();
    const defaultEnd = now.toISOString();

    const start = startDate || defaultStart;
    const end = endDate || defaultEnd;

    // Fetch patients
    const { data: patients } = await supabase
      .from("patients")
      .select("*")
      .gte("created_at", start)
      .lte("created_at", end);

    // Fetch invoices
    const { data: invoices } = await supabase
      .from("invoices")
      .select("*")
      .gte("created_at", start)
      .lte("created_at", end);

    const totalPatients = patients?.length || 0;
    const activePatients = patients?.filter(p => 
      p.status === "confirmed" || p.status === "in_treatment"
    ).length || 0;

    const totalRevenue = invoices
      ?.filter(inv => inv.status === "paid")
      .reduce((sum, inv) => sum + Number(inv.total || 0), 0) || 0;

    const pendingRevenue = invoices
      ?.filter(inv => inv.status === "sent" || inv.status === "overdue")
      .reduce((sum, inv) => sum + Number(inv.total || 0), 0) || 0;

    const averageBookingValue = totalRevenue / (invoices?.filter(i => i.status === "paid").length || 1);

    // Bookings by status
    const statusCounts: Record<string, number> = {};
    patients?.forEach(p => {
      statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
    });
    const bookingsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));

    // Revenue by month
    const revenueByMonthMap: Record<string, number> = {};
    invoices?.filter(inv => inv.status === "paid" && inv.paid_at).forEach(inv => {
      const month = new Date(inv.paid_at!).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      revenueByMonthMap[month] = (revenueByMonthMap[month] || 0) + Number(inv.total || 0);
    });
    const revenueByMonth = Object.entries(revenueByMonthMap)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    // Bookings by month
    const bookingsByMonthMap: Record<string, number> = {};
    patients?.forEach(p => {
      const month = new Date(p.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      bookingsByMonthMap[month] = (bookingsByMonthMap[month] || 0) + 1;
    });
    const bookingsByMonth = Object.entries(bookingsByMonthMap)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    // Top treatments
    const treatmentCounts: Record<string, number> = {};
    patients?.forEach(p => {
      if (p.treatment_interest) {
        treatmentCounts[p.treatment_interest] = (treatmentCounts[p.treatment_interest] || 0) + 1;
      }
    });
    const topTreatments = Object.entries(treatmentCounts)
      .map(([treatment, count]) => ({ treatment, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalPatients,
      activePatients,
      totalRevenue,
      pendingRevenue,
      averageBookingValue,
      bookingsByStatus,
      revenueByMonth,
      bookingsByMonth,
      topTreatments,
    };
  },

  // Get recent activity
  async getRecentActivity(limit = 10) {
    const { data: patients } = await supabase
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    const { data: invoices } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    return {
      recentPatients: patients || [],
      recentInvoices: invoices || [],
    };
  },
};