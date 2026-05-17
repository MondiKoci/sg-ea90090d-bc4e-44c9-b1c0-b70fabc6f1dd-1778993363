import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AdminMenu } from "@/components/AdminMenu";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { patientService } from "@/services/patientService";
import { reminderService } from "@/services/reminderService";
import { sharingService } from "@/services/sharingService";
import { treatmentStepService } from "@/services/treatmentStepService";
import { FileUpload } from "@/components/FileUpload";
import type { Patient } from "@/services/patientService";
import type { PatientReminder } from "@/services/reminderService";
import type { PatientShare } from "@/services/sharingService";
import type { TreatmentStep } from "@/services/treatmentStepService";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  Trash2, 
  Plus, 
  Calendar,
  Share2,
  Bell,
  FileText,
  User,
  DollarSign,
  Plane,
  Hotel,
  CheckCircle2,
  Clock,
  ArrowRight,
  Edit,
  Save
} from "lucide-react";

export default function PatientDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { toast } = useToast();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [reminders, setReminders] = useState<PatientReminder[]>([]);
  const [shares, setShares] = useState<PatientShare[]>([]);
  const [treatmentSteps, setTreatmentSteps] = useState<TreatmentStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // File upload state
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<string>("document");

  // Reminder state
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [reminderText, setReminderText] = useState("");
  const [reminderDate, setReminderDate] = useState("");

  // Share state
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");

  // Treatment step state
  const [stepDialogOpen, setStepDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<TreatmentStep | null>(null);
  const [stepData, setStepData] = useState({
    step_number: 1,
    title: "",
    description: "",
    instructions: "",
    status: "upcoming" as "completed" | "in_progress" | "upcoming",
    scheduled_date: "",
  });

  // Portal access state
  const [portalPassword, setPortalPassword] = useState("");
  const [portalAccessEnabled, setPortalAccessEnabled] = useState(false);

  // Patient form data
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    treatment_interest: "",
    arrival_date: "",
    departure_date: "",
    accommodation_notes: "",
    work_notes: "",
    payment_total_notes: "",
    payment_first_notes: "",
    payment_second_notes: "",
    status: "pending",
  });

  useEffect(() => {
    if (id && typeof id === "string") {
      loadPatientData(id);
    }
  }, [id]);

  const loadPatientData = async (patientId: string) => {
    try {
      const [patientData, remindersData, sharesData, stepsData] = await Promise.all([
        patientService.getPatientById(patientId),
        reminderService.getPatientReminders(patientId),
        sharingService.getPatientShares(patientId),
        treatmentStepService.getPatientSteps(patientId),
      ]);

      setPatient(patientData);
      setReminders(remindersData);
      setShares(sharesData);
      setTreatmentSteps(stepsData);

      setFormData({
        full_name: patientData.full_name,
        email: patientData.email || "",
        phone: patientData.phone || "",
        treatment_interest: patientData.treatment_interest || "",
        arrival_date: patientData.arrival_date ? new Date(patientData.arrival_date).toISOString().split('T')[0] : "",
        departure_date: patientData.departure_date ? new Date(patientData.departure_date).toISOString().split('T')[0] : "",
        accommodation_notes: patientData.accommodation_notes || "",
        work_notes: patientData.work_notes || "",
        payment_total_notes: patientData.payment_total_notes || "",
        payment_first_notes: patientData.payment_first_notes || "",
        payment_second_notes: patientData.payment_second_notes || "",
        status: patientData.status,
      });

      // Check if portal access is enabled (we'll need to add these fields to the patient)
      const portalEnabled = (patientData as any).portal_access_enabled || false;
      setPortalAccessEnabled(portalEnabled);
    } catch (error) {
      toast({
        title: "Failed to load patient",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!patient) return;
    setSaving(true);

    try {
      // Ensure all formData fields are included in the update
      await patientService.updatePatient(patient.id, {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        treatment_interest: formData.treatment_interest,
        arrival_date: formData.arrival_date || null,
        departure_date: formData.departure_date || null,
        accommodation_notes: formData.accommodation_notes,
        work_notes: formData.work_notes,
        payment_total_notes: formData.payment_total_notes,
        payment_first_notes: formData.payment_first_notes,
        payment_second_notes: formData.payment_second_notes,
        status: formData.status, // Explicitly include status
      } as any);
      toast({ title: "Patient updated successfully" });
      loadPatientData(patient.id);
    } catch (error) {
      toast({
        title: "Failed to update patient",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddReminder = async () => {
    if (!patient) return;

    try {
      await reminderService.createReminder(
        patient.id,
        reminderText,
        reminderDate ? new Date(reminderDate).toISOString() : undefined
      );
      toast({ title: "Reminder created" });
      setReminderDialogOpen(false);
      setReminderText("");
      setReminderDate("");
      loadPatientData(patient.id);
    } catch (error) {
      toast({
        title: "Failed to create reminder",
        variant: "destructive",
      });
    }
  };

  const handleToggleReminder = async (reminderId: string, completed: boolean) => {
    if (!patient) return;

    try {
      await reminderService.updateReminder(reminderId, {
        is_completed: completed,
        completed_at: completed ? new Date().toISOString() : null,
      } as any);
      loadPatientData(patient.id);
    } catch (error) {
      toast({
        title: "Failed to update reminder",
        variant: "destructive",
      });
    }
  };

  const handleSharePatient = async () => {
    if (!patient) return;

    try {
      await sharingService.sharePatientData(patient.id, shareEmail);
      toast({ title: `Patient record shared with ${shareEmail}` });
      setShareDialogOpen(false);
      setShareEmail("");
      loadPatientData(patient.id);
    } catch (error) {
      toast({
        title: "Failed to share",
        variant: "destructive",
      });
    }
  };

  const handleDeleteShare = async (shareId: string) => {
    if (!patient) return;

    try {
      await sharingService.removeShare(shareId);
      toast({ title: "Access revoked" });
      loadPatientData(patient.id);
    } catch (error) {
      toast({
        title: "Failed to revoke access",
        variant: "destructive",
      });
    }
  };

  // Treatment step handlers
  const handleOpenStepDialog = (step?: TreatmentStep) => {
    if (step) {
      setEditingStep(step);
      setStepData({
        step_number: step.step_number,
        title: step.title,
        description: step.description || "",
        instructions: step.instructions || "",
        status: step.status as "completed" | "in_progress" | "upcoming",
        scheduled_date: step.scheduled_date ? new Date(step.scheduled_date).toISOString().split('T')[0] : "",
      });
    } else {
      setEditingStep(null);
      const nextStepNumber = treatmentSteps.length > 0 
        ? Math.max(...treatmentSteps.map(s => s.step_number)) + 1 
        : 1;
      setStepData({
        step_number: nextStepNumber,
        title: "",
        description: "",
        instructions: "",
        status: "upcoming",
        scheduled_date: "",
      });
    }
    setStepDialogOpen(true);
  };

  const handleSaveStep = async () => {
    if (!patient) return;

    try {
      if (editingStep) {
        await treatmentStepService.updateStep(editingStep.id, {
          ...stepData,
          scheduled_date: stepData.scheduled_date || null,
        });
        toast({ title: "Treatment step updated" });
      } else {
        await treatmentStepService.createStep({
          patient_id: patient.id,
          ...stepData,
          scheduled_date: stepData.scheduled_date || undefined,
        });
        toast({ title: "Treatment step created" });
      }
      setStepDialogOpen(false);
      loadPatientData(patient.id);
    } catch (error) {
      toast({
        title: "Failed to save step",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStep = async (stepId: string) => {
    if (!patient || !confirm("Delete this treatment step?")) return;

    try {
      await treatmentStepService.deleteStep(stepId);
      toast({ title: "Treatment step deleted" });
      loadPatientData(patient.id);
    } catch (error) {
      toast({
        title: "Failed to delete step",
        variant: "destructive",
      });
    }
  };

  const handleEnablePortalAccess = async () => {
    if (!patient || !portalPassword) {
      toast({
        title: "Password required",
        description: "Please enter a portal password",
        variant: "destructive",
      });
      return;
    }

    try {
      await patientService.updatePatient(patient.id, {
        portal_password: portalPassword,
        portal_access_enabled: true,
      } as any);
      toast({ title: "Portal access enabled" });
      setPortalAccessEnabled(true);
      loadPatientData(patient.id);
    } catch (error) {
      toast({
        title: "Failed to enable portal access",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/10 text-green-700 border-green-500/20";
      case "in_progress": return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "upcoming": return "bg-muted text-muted-foreground border-border";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">Loading...</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <h1 className="text-2xl font-bold">Patient not found</h1>
          <Link href="/admin/patients">
            <Button>Back to Patients</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminMenu />
      
      <main className="flex-1 p-8">
        <Link href="/admin/patients">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Patients
          </Button>
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-sans text-4xl font-bold mb-2">{patient.full_name}</h1>
            <Badge variant="outline">{patient.status}</Badge>
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="details">
              <User className="w-4 h-4 mr-2" />
              Details
            </TabsTrigger>
            <TabsTrigger value="work">
              <FileText className="w-4 h-4 mr-2" />
              Work
            </TabsTrigger>
            <TabsTrigger value="payment">
              <DollarSign className="w-4 h-4 mr-2" />
              Payment
            </TabsTrigger>
            <TabsTrigger value="travel">
              <Plane className="w-4 h-4 mr-2" />
              Travel
            </TabsTrigger>
            <TabsTrigger value="files">
              <FileText className="w-4 h-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="steps">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Treatment Steps ({treatmentSteps.length})
            </TabsTrigger>
          </TabsList>

          {/* Existing tabs content... */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Treatment Interest</Label>
                    <Input
                      value={formData.treatment_interest}
                      onChange={(e) => setFormData({ ...formData, treatment_interest: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="in_treatment">In Treatment</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Portal Access Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Patient Portal Access</CardTitle>
                <CardDescription>
                  Enable portal access so the patient can track their treatment progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {portalAccessEnabled ? (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-green-700 font-semibold mb-2">✓ Portal access is enabled</p>
                    <p className="text-sm text-muted-foreground">
                      Patient can log in at <code className="bg-muted px-2 py-1 rounded">/portal/login</code>
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Email: <strong>{patient.email}</strong>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Set Portal Password</Label>
                      <Input
                        type="text"
                        placeholder="Create a password for the patient"
                        value={portalPassword}
                        onChange={(e) => setPortalPassword(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Share this password with the patient so they can access their portal
                      </p>
                    </div>
                    <Button onClick={handleEnablePortalAccess} className="gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Enable Portal Access
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Keep existing tabs: work, payment, travel, files... */}

          <TabsContent value="files">
            <FileUpload patientId={patient.id} uploadedBy="Admin" />
          </TabsContent>

          {/* Treatment Steps Tab */}
          <TabsContent value="steps">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Treatment Steps Timeline</CardTitle>
                    <CardDescription>
                      Manage the patient's treatment journey with detailed steps and instructions
                    </CardDescription>
                  </div>
                  <Button onClick={() => handleOpenStepDialog()} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Step
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {treatmentSteps.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No treatment steps yet. Add the first step to begin tracking.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {treatmentSteps.map((step, index) => (
                      <div key={step.id} className="relative">
                        {index !== treatmentSteps.length - 1 && (
                          <div className="absolute left-6 top-14 bottom-[-16px] w-0.5 bg-border" />
                        )}

                        <div className="flex gap-4">
                          <div className={`
                            w-12 h-12 rounded-full flex items-center justify-center shrink-0 relative z-10 border-2
                            ${step.status === 'completed' ? 'bg-green-500 border-green-500' : 
                              step.status === 'in_progress' ? 'bg-blue-500 border-blue-500' : 
                              'bg-muted border-border'}
                          `}>
                            {step.status === 'completed' ? (
                              <CheckCircle2 className="w-6 h-6 text-white" />
                            ) : step.status === 'in_progress' ? (
                              <Clock className="w-6 h-6 text-white" />
                            ) : (
                              <ArrowRight className="w-6 h-6 text-muted-foreground" />
                            )}
                          </div>

                          <div className="flex-1 pb-4">
                            <div className="bg-card border border-border rounded-lg p-4">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1">
                                    <span className="font-semibold text-sm text-muted-foreground">
                                      Step {step.step_number}
                                    </span>
                                    <Badge variant="outline" className={getStatusColor(step.status)}>
                                      {step.status.replace('_', ' ')}
                                    </Badge>
                                  </div>
                                  <h4 className="font-sans text-lg font-semibold">
                                    {step.title}
                                  </h4>
                                  {step.scheduled_date && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      <Calendar className="w-3 h-3 inline mr-1" />
                                      {new Date(step.scheduled_date).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleOpenStepDialog(step)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteStep(step.id)}
                                  >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </div>
                              </div>

                              {step.description && (
                                <p className="text-sm text-muted-foreground mb-3">
                                  {step.description}
                                </p>
                              )}

                              {step.instructions && (
                                <div className="mt-3 p-3 bg-accent/5 border border-accent/20 rounded">
                                  <p className="text-xs font-semibold text-accent mb-1">
                                    Doctor's Instructions:
                                  </p>
                                  <p className="text-sm whitespace-pre-wrap">
                                    {step.instructions}
                                  </p>
                                </div>
                              )}

                              {step.status === 'completed' && step.completed_at && (
                                <p className="text-xs text-green-600 mt-3">
                                  ✓ Completed on {new Date(step.completed_at).toLocaleDateString()}
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
          </TabsContent>

          {/* Other existing tabs remain unchanged... */}
        </Tabs>

        {/* Treatment Step Dialog */}
        <Dialog open={stepDialogOpen} onOpenChange={setStepDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingStep ? "Edit Treatment Step" : "Add Treatment Step"}
              </DialogTitle>
              <DialogDescription>
                Define a step in the patient's treatment journey with instructions
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Step Number *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={stepData.step_number}
                    onChange={(e) => setStepData({ ...stepData, step_number: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status *</Label>
                  <Select
                    value={stepData.status}
                    onValueChange={(value: "completed" | "in_progress" | "upcoming") => 
                      setStepData({ ...stepData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  placeholder="e.g., Initial Consultation"
                  value={stepData.title}
                  onChange={(e) => setStepData({ ...stepData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Brief description of this step"
                  rows={2}
                  value={stepData.description}
                  onChange={(e) => setStepData({ ...stepData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Doctor's Instructions</Label>
                <Textarea
                  placeholder="Detailed instructions for the patient (visible in their portal for upcoming/in-progress steps)"
                  rows={4}
                  value={stepData.instructions}
                  onChange={(e) => setStepData({ ...stepData, instructions: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  These instructions will be visible to the patient in their portal
                </p>
              </div>

              <div className="space-y-2">
                <Label>Scheduled Date</Label>
                <Input
                  type="date"
                  value={stepData.scheduled_date}
                  onChange={(e) => setStepData({ ...stepData, scheduled_date: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStepDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveStep} disabled={!stepData.title}>
                {editingStep ? "Update Step" : "Create Step"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Other existing dialogs remain unchanged... */}
      </main>
    </div>
  );
}