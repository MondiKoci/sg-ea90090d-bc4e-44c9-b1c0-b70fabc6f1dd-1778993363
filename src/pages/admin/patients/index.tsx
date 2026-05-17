import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AdminMenu } from "@/components/AdminMenu";
import { NotificationBell } from "@/components/NotificationBell";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { patientService, type Patient } from "@/services/patientService";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import { Eye, LogOut, Plus } from "lucide-react";

export default function AdminPatients() {
  const router = useRouter();
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadPatients();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/admin/login");
    }
  };

  const loadPatients = async () => {
    try {
      const data = await patientService.getAllPatients();
      setPatients(data);
    } catch (error) {
      toast({
        title: "Failed to load patients",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const getStatusColor = (status?: string | null) => {
    switch (status) {
      case "confirmed": return "bg-green-500/10 text-green-700 border-green-500/20";
      case "completed": return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "cancelled": return "bg-red-500/10 text-red-700 border-red-500/20";
      default: return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
    }
  };

  return (
    <>
      <SEO title="Patient Management - Admin Dashboard" />
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-10">
          <div className="container py-4 flex items-center justify-between">
            <div>
              <h1 className="font-sans text-2xl font-bold text-primary">Patient Management</h1>
              <p className="text-sm text-muted-foreground">Elite Dental Tourism Admin</p>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell userType="admin" userEmail="admin@elitedental.com" />
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="container py-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-sans text-xl font-semibold">All Patients</h2>
              <p className="text-sm text-muted-foreground">Manage patient records and appointments</p>
            </div>
            <Link href="/admin/patients/new">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading patients...</div>
          ) : patients.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No patients yet. New booking requests will appear here.
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Treatment</TableHead>
                    <TableHead>Arrival</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.full_name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{patient.email}</TableCell>
                      <TableCell className="text-sm">{patient.phone}</TableCell>
                      <TableCell className="text-sm">{patient.treatment_interest || "—"}</TableCell>
                      <TableCell className="text-sm">
                        {patient.arrival_date ? new Date(patient.arrival_date).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(patient.status)}>
                          {patient.status || "pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/patients/${patient.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </main>
      </div>
    </>
  );
}