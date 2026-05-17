import { useEffect, useState } from "react";
import { AdminMenu } from "@/components/AdminMenu";
import { NotificationBell } from "@/components/NotificationBell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { analyticsService } from "@/services/analyticsService";
import type { AnalyticsStats } from "@/services/analyticsService";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Calendar,
  BarChart3,
  PieChart
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async (start?: string, end?: string) => {
    try {
      setLoading(true);
      const data = await analyticsService.getAnalytics(start, end);
      setStats(data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyDateRange = () => {
    loadAnalytics(startDate, endDate);
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-background flex">
        <AdminMenu />
        <div className="flex-1 flex items-center justify-center">Loading analytics...</div>
      </div>
    );
  }

  const maxBookings = Math.max(...stats.bookingsByMonth.map(m => m.count), 1);
  const maxRevenue = Math.max(...stats.revenueByMonth.map(m => m.revenue), 1);

  return (
    <div className="min-h-screen bg-background flex">
      <AdminMenu />
      
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-sans text-4xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track booking trends and revenue statistics</p>
          </div>
          <NotificationBell userType="admin" userEmail="admin@elitedental.com" />
        </div>

        {/* Date Range Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-end gap-4">
              <div className="flex-1 max-w-xs">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex-1 max-w-xs">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <Button onClick={handleApplyDateRange} className="gap-2">
                <Calendar className="w-4 h-4" />
                Apply Range
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalPatients}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.activePatients} active treatments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                ${stats.pendingRevenue.toFixed(2)} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Booking</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${stats.averageBookingValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Per completed treatment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats.totalPatients > 0 
                  ? Math.round((stats.activePatients / stats.totalPatients) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Patients in treatment
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Bookings by Month Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Booking Trends
              </CardTitle>
              <CardDescription>New patient bookings per month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.bookingsByMonth.length > 0 ? (
                  stats.bookingsByMonth.map((item) => (
                    <div key={item.month}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{item.month}</span>
                        <span className="text-sm text-muted-foreground">{item.count} bookings</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-accent h-2 rounded-full transition-all"
                          style={{ width: `${(item.count / maxBookings) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No booking data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Revenue by Month Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Revenue Trends
              </CardTitle>
              <CardDescription>Monthly revenue from paid invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.revenueByMonth.length > 0 ? (
                  stats.revenueByMonth.map((item) => (
                    <div key={item.month}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{item.month}</span>
                        <span className="text-sm text-muted-foreground">${item.revenue.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No revenue data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Treatments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Top Treatments
              </CardTitle>
              <CardDescription>Most requested dental procedures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topTreatments.length > 0 ? (
                  stats.topTreatments.map((item, index) => (
                    <div key={item.treatment} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-medium">{item.treatment}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.count} bookings</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No treatment data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bookings by Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Bookings by Status
              </CardTitle>
              <CardDescription>Current patient status distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.bookingsByStatus.length > 0 ? (
                  stats.bookingsByStatus.map((item) => {
                    const percentage = stats.totalPatients > 0 
                      ? Math.round((item.count / stats.totalPatients) * 100)
                      : 0;
                    return (
                      <div key={item.status} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="font-medium capitalize">{item.status.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">{percentage}%</span>
                          <span className="text-sm font-semibold">{item.count}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No status data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}