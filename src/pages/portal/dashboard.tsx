import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { patientAuthService } from "@/services/patientAuthService";
import { treatmentStepService } from "@/services/treatmentStepService";
import type { TreatmentStep } from "@/services/treatmentStepService";
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  LogOut, 
  User, 
  FileText,
  AlertCircle,
  ArrowRight,
  Loader2
} from "lucide-react";

export default function PatientDashboard() {
  const router = useRouter();
  const [session, setSession] = useState(patientAuthService.getSession());
  const [steps, setSteps] = useState<TreatmentStep[]>([]);
  const [progress, setProgress] = useState({ total: 0, completed: 0, inProgress: 0, upcoming: 0, percentComplete: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push("/portal/login");
      return;
    }

    loadTreatmentProgress();
  }, [session, router]);

  const loadTreatmentProgress = async () => {
    if (!session) return;

    try {
      const [stepsData, progressData] = await Promise.all([
        treatmentStepService.getPatientSteps(session.patientId),
        treatmentStepService.getPatientProgress(session.patientId),
      ]);

      setSteps(stepsData);
      setProgress(progressData);
    } catch (error) {
      console.error("Failed to load treatment progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    patientAuthService.logout();
    router.push("/portal/login");
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "upcoming":
        return <ArrowRight className="w-5 h-5 text-muted-foreground" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!session) {
    return null;
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
                  Welcome back, {session.fullName}
                </h1>
                <p className="text-muted-foreground">Track your treatment journey and stay informed</p>
              </div>
              <Button onClick={handleLogout} variant="outline" className="gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Progress Overview */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                  <Card className="bg-card border-border/50 shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{progress.total}</p>
                          <p className="text-xs text-muted-foreground">Total Steps</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border/50 shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{progress.completed}</p>
                          <p className="text-xs text-muted-foreground">Completed</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border/50 shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{progress.inProgress}</p>
                          <p className="text-xs text-muted-foreground">In Progress</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border/50 shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-muted rounded-lg">
                          <ArrowRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{progress.upcoming}</p>
                          <p className="text-xs text-muted-foreground">Upcoming</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Overall Progress */}
                <Card className="mb-8 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-sans text-lg font-semibold">Overall Progress</h3>
                      <span className="text-2xl font-bold text-primary">{progress.percentComplete}%</span>
                    </div>
                    <Progress value={progress.percentComplete} className="h-3" />
                    <p className="text-sm text-muted-foreground mt-2">
                      {progress.completed} of {progress.total} steps completed
                    </p>
                  </CardContent>
                </Card>

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
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Your treatment plan is being prepared. Check back soon for updates.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-6">
                        {steps.map((step, index) => (
                          <div key={step.id} className="relative">
                            {/* Timeline connector */}
                            {index !== steps.length - 1 && (
                              <div className="absolute left-6 top-14 bottom-[-24px] w-0.5 bg-border" />
                            )}

                            <div className="flex gap-4">
                              {/* Step number circle */}
                              <div className={`
                                w-12 h-12 rounded-full flex items-center justify-center shrink-0 relative z-10 border-2
                                ${step.status === 'completed' ? 'bg-green-500 border-green-500' : 
                                  step.status === 'in_progress' ? 'bg-blue-500 border-blue-500' : 
                                  'bg-muted border-border'}
                              `}>
                                {step.status === 'completed' ? (
                                  <CheckCircle2 className="w-6 h-6 text-white" />
                                ) : (
                                  <span className={`font-bold ${
                                    step.status === 'in_progress' ? 'text-white' : 'text-muted-foreground'
                                  }`}>
                                    {step.step_number}
                                  </span>
                                )}
                              </div>

                              {/* Step content */}
                              <div className="flex-1 pb-6">
                                <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                  <div className="flex items-start justify-between gap-4 mb-3">
                                    <div className="flex-1">
                                      <h4 className="font-sans text-xl font-semibold mb-1">
                                        {step.title}
                                      </h4>
                                      {step.scheduled_date && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                          <Calendar className="w-4 h-4" />
                                          {formatDate(step.scheduled_date)}
                                        </div>
                                      )}
                                    </div>
                                    <Badge variant="outline" className={getStatusColor(step.status)}>
                                      <span className="flex items-center gap-1.5">
                                        {getStatusIcon(step.status)}
                                        {step.status.replace('_', ' ')}
                                      </span>
                                    </Badge>
                                  </div>

                                  {step.description && (
                                    <p className="text-muted-foreground mb-4 leading-relaxed">
                                      {step.description}
                                    </p>
                                  )}

                                  {/* Instructions for upcoming and in-progress steps */}
                                  {step.instructions && (step.status === 'upcoming' || step.status === 'in_progress') && (
                                    <div className="mt-4 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                                      <div className="flex items-start gap-2 mb-2">
                                        <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                                        <h5 className="font-semibold text-accent">Instructions from Your Doctor</h5>
                                      </div>
                                      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap pl-7">
                                        {step.instructions}
                                      </p>
                                    </div>
                                  )}

                                  {step.status === 'completed' && step.completed_at && (
                                    <p className="text-sm text-green-600 mt-4">
                                      ✓ Completed on {formatDate(step.completed_at)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}