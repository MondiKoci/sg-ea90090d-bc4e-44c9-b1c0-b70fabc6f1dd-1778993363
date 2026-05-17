import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { NotificationBell } from "@/components/NotificationBell";
import { patientAuthService } from "@/services/patientAuthService";
import { treatmentStepService } from "@/services/treatmentStepService";
import { invoiceService } from "@/services/invoiceService";
import type { TreatmentStep } from "@/services/treatmentStepService";
import type { InvoiceWithItems } from "@/services/invoiceService";
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  LogOut, 
  User, 
  FileText,
  AlertCircle,
  ArrowRight,
  Loader2,
  DollarSign
} from "lucide-react";

export default function PatientDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [steps, setSteps] = useState<TreatmentStep[]>([]);
  const [invoices, setInvoices] = useState<InvoiceWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentSession = patientAuthService.getSession();
    if (!currentSession) {
      router.push("/portal/login");
      return;
    }
    setSession(currentSession);
    loadData(currentSession.email);
  }, [router]);

  const loadData = async (email: string) => {
    try {
      const [stepsData, invoicesData] = await Promise.all([
        treatmentStepService.getPatientStepsByEmail(email),
        invoiceService.getPatientInvoicesByEmail(email),
      ]);
      setSteps(stepsData);
      setInvoices(invoicesData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    patientAuthService.logout();
    router.push("/portal/login");
  };

  const stats = treatmentStepService.getProgressStats(steps);
  const completedSteps = steps.filter(s => s.status === "completed");
  const inProgressSteps = steps.filter(s => s.status === "in_progress");
  const upcomingSteps = steps.filter(s => s.status === "upcoming");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-700 border-green-500/20";
      case "in_progress":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "upcoming":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/10 text-green-700 border-green-500/20";
      case "sent":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "overdue":
        return "bg-red-500/10 text-red-700 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">Loading...</div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="My Treatment Progress - Patient Portal"
        description="Track your dental treatment progress and view upcoming appointments."
      />
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        
        <main className="flex-1 py-12 px-4">
          <div className="container max-w-5xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div>
                <h1 className="font-sans text-3xl md:text-4xl font-bold mb-2">
                  Welcome back, {session?.fullName}
                </h1>
                <p className="text-muted-foreground">Track your treatment journey and stay informed</p>
              </div>
              <div className="flex items-center gap-2">
                <NotificationBell userType="patient" userEmail={session?.email || ""} />
                <Button onClick={handleLogout} variant="outline" className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Progress Overview */}
            <Card className="mb-8 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-accent" />
                  Treatment Progress
                </CardTitle>
                <CardDescription>Track your dental tourism journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm font-semibold text-accent">{stats.percentComplete}%</span>
                  </div>
                  <Progress value={stats.percentComplete} className="h-3" />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm text-green-700 mb-1">Completed</p>
                    <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
                  </div>
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-sm text-blue-700 mb-1">In Progress</p>
                    <p className="text-2xl font-bold text-blue-700">{stats.inProgress}</p>
                  </div>
                  <div className="p-4 bg-muted border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Upcoming</p>
                    <p className="text-2xl font-bold text-foreground">{stats.upcoming}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Invoices Section */}
            {invoices.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <DollarSign className="w-6 h-6 text-accent" />
                    Invoices
                  </CardTitle>
                  <CardDescription>View and track your payment invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {invoices.map((invoice) => (
                      <div key={invoice.id} className="p-4 border border-border rounded-lg hover:border-accent/50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-mono font-semibold text-sm">
                                {invoice.invoice_number}
                              </span>
                              <Badge variant="outline" className={getInvoiceStatusColor(invoice.status)}>
                                {invoice.status}
                              </Badge>
                            </div>
                            <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                              <p>
                                <FileText className="w-3 h-3 inline mr-1" />
                                Issue Date: {new Date(invoice.issue_date).toLocaleDateString()}
                              </p>
                              {invoice.due_date && (
                                <p>
                                  <Calendar className="w-3 h-3 inline mr-1" />
                                  Due Date: {new Date(invoice.due_date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            {invoice.notes && (
                              <p className="text-sm text-muted-foreground mt-2">{invoice.notes}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">${Number(invoice.total).toFixed(2)}</p>
                            {invoice.status === "paid" && invoice.paid_at && (
                              <p className="text-xs text-green-600 mt-1">
                                ✓ Paid on {new Date(invoice.paid_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Invoice Items */}
                        <div className="mt-4 pt-4 border-t border-border space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">Items:</p>
                          {invoice.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{item.description} (x{Number(item.quantity)})</span>
                              <span className="font-semibold">${Number(item.total).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Treatment Steps Timeline */}
            <Card className="shadow-lg border-border/50">
              <CardHeader>
                <CardTitle className="font-sans text-2xl">Treatment Timeline</CardTitle>
                <CardDescription>
                  Your personalized treatment journey with detailed instructions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {steps.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No treatment steps scheduled yet.</p>
                    <p className="text-sm mt-2">Your doctor will add steps to your treatment plan soon.</p>
                  </div>
                ) : (
                  <Accordion type="multiple" defaultValue={inProgressSteps.map(s => s.id).concat(upcomingSteps.map(s => s.id))} className="space-y-4">
                    {/* Completed Steps - Collapsed by default */}
                    {completedSteps.map((step) => (
                      <AccordionItem key={step.id} value={step.id} className="border border-green-500/20 rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-4 w-full">
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-sm text-muted-foreground">Step {step.step_number}</span>
                                <Badge variant="outline" className={getStatusColor(step.status)}>
                                  Completed
                                </Badge>
                              </div>
                              <h4 className="font-sans text-lg font-semibold mt-1">{step.title}</h4>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-14 pt-4">
                          {step.description && <p className="text-sm text-muted-foreground mb-3">{step.description}</p>}
                          {step.completed_at && (
                            <p className="text-xs text-green-600">
                              ✓ Completed on {new Date(step.completed_at).toLocaleDateString()}
                            </p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}

                    {/* In Progress Steps - Expanded by default */}
                    {inProgressSteps.map((step) => (
                      <AccordionItem key={step.id} value={step.id} className="border border-blue-500/20 rounded-lg px-4 bg-blue-500/5">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-4 w-full">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                              <Clock className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-sm text-muted-foreground">Step {step.step_number}</span>
                                <Badge variant="outline" className={getStatusColor(step.status)}>
                                  In Progress
                                </Badge>
                              </div>
                              <h4 className="font-sans text-lg font-semibold mt-1">{step.title}</h4>
                              {step.scheduled_date && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  <Calendar className="w-3 h-3 inline mr-1" />
                                  {new Date(step.scheduled_date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-14 pt-4 space-y-3">
                          {step.description && <p className="text-sm text-muted-foreground">{step.description}</p>}
                          {step.instructions && (
                            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                              <p className="text-xs font-semibold text-accent mb-2">Doctor's Instructions:</p>
                              <p className="text-sm whitespace-pre-wrap">{step.instructions}</p>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}

                    {/* Upcoming Steps - Expanded by default */}
                    {upcomingSteps.map((step) => (
                      <AccordionItem key={step.id} value={step.id} className="border border-border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-4 w-full">
                            <div className="w-10 h-10 rounded-full bg-muted border-2 border-border flex items-center justify-center shrink-0">
                              <ArrowRight className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-sm text-muted-foreground">Step {step.step_number}</span>
                                <Badge variant="outline" className={getStatusColor(step.status)}>
                                  Upcoming
                                </Badge>
                              </div>
                              <h4 className="font-sans text-lg font-semibold mt-1">{step.title}</h4>
                              {step.scheduled_date && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  <Calendar className="w-3 h-3 inline mr-1" />
                                  {new Date(step.scheduled_date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-14 pt-4 space-y-3">
                          {step.description && <p className="text-sm text-muted-foreground">{step.description}</p>}
                          {step.instructions && (
                            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                              <p className="text-xs font-semibold text-accent mb-2">Preparation Instructions:</p>
                              <p className="text-sm whitespace-pre-wrap">{step.instructions}</p>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}