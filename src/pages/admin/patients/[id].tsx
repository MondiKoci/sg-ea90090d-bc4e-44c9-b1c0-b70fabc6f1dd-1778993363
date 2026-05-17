import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { patientService, type Patient, type PatientUpdate } from "@/services/patientService";
import { fileService, type PatientFile } from "@/services/fileService";
import { reminderService, type PatientReminder } from "@/services/reminderService";
import { sharingService, type PatientShare } from "@/services/sharingService";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import { 
  ArrowLeft, Save, Upload, FileText, Download, Trash2, 
  Bell, Calendar, DollarSign, Home, Share2, Plus, Check 
} from "lucide-react";

export default function PatientDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { toast } = useToast();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<PatientUpdate>({});
  
  // Files
  const [files, setFiles] = useState<PatientFile[]>([]);
  const [uploading, setUploading] = useState(false);

  // Reminders
  const [reminders, setReminders] = useState<PatientReminder[]>([]);
  const [newReminder, setNewReminder] = useState({ title: "", due_date: "" });

  // Sharing
  const [shares, setShares] = useState<PatientShare[]>([]);
  const [newShare, setNewShare] = useState({ email: "" });

  useEffect(() => {
    checkAuth();
    if (id && typeof id === "string") {
      loadPatient(id);
      loadFiles(id);
      loadReminders(id);
      loadShares(id);
    }
  }, [id]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/admin/login");
    }
  };

  const loadPatient = async (patientId: string) => {
    try {
      const data = await patientService.getPatientById(patientId);
      setPatient(data);
      setFormData(data);
    } catch (error) {
      toast({
        title: "Failed to load patient",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFiles = async (patientId: string) => {
    try {
      const data = await fileService.getPatientFiles(patientId);
      setFiles(data);
    } catch (error) {
      console.error("Failed to load files:", error);
    }
  };

  const loadReminders = async (patientId: string) => {
    try {
      const data = await reminderService.getPatientReminders(patientId);
      setReminders(data);
    } catch (error) {
      console.error("Failed to load reminders:", error);
    }
  };

  const loadShares = async (patientId: string) => {
    try {
      const data = await sharingService.getPatientShares(patientId);
      setShares(data);
    } catch (error) {
      console.error("Failed to load shares:", error);
    }
  };

  const handleSave = async () => {
    if (!patient) return;

    try {
      await patientService.updatePatient(patient.id, formData);
      toast({
        title: "Patient updated",
        description: "Changes saved successfully.",
      });
      setEditing(false);
      loadPatient(patient.id);
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: "quote" | "receipt" | "document" | "other") => {
    if (!patient || !e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setUploading(true);

    try {
      await fileService.uploadFile(patient.id, file, fileType);
      toast({
        title: "File uploaded",
        description: "File uploaded successfully.",
      });
      loadFiles(patient.id);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: string, filePath: string) => {
    if (!patient) return;

    try {
      await fileService.deleteFile(fileId, filePath);
      toast({
        title: "File deleted",
        description: "File removed successfully.",
      });
      loadFiles(patient.id);
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleDownloadFile = async (filePath: string, fileName: string) => {
    try {
      const url = await fileService.getFileUrl(filePath);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download file.",
        variant: "destructive",
      });
    }
  };

  const handleAddReminder = async () => {
    if (!patient || !newReminder.title) return;

    try {
      await reminderService.createReminder(
        patient.id,
        newReminder.title,
        newReminder.due_date || undefined
      );
      toast({
        title: "Reminder added",
        description: "Reminder created successfully.",
      });
      setNewReminder({ title: "", due_date: "" });
      loadReminders(patient.id);
    } catch (error) {
      toast({
        title: "Failed to add reminder",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleCompleteReminder = async (reminderId: string) => {
    if (!patient) return;

    try {
      await reminderService.completeReminder(reminderId);
      loadReminders(patient.id);
    } catch (error) {
      toast({
        title: "Failed to complete reminder",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleAddShare = async () => {
    if (!patient || !newShare.email) return;

    try {
      await sharingService.sharePatientData(patient.id, newShare.email);
      toast({
        title: "Access granted",
        description: `Patient data shared with ${newShare.email}`,
      });
      setNewShare({ email: "" });
      loadShares(patient.id);
    } catch (error) {
      toast({
        title: "Failed to share",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleRevokeShare = async (shareId: string) => {
    if (!patient) return;

    try {
      await sharingService.removeShare(shareId);
      toast({
        title: "Access revoked",
        description: "Sharing access removed.",
      });
      loadShares(patient.id);
    } catch (error) {
      toast({
        title: "Failed to revoke",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!patient) {
    return <div className="min-h-screen flex items-center justify-center">Patient not found</div>;
  }

  return (
    <>
      <SEO title={`${patient.full_name} - Patient Management`} />
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-10">
          <div className="container py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/patients">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="font-sans text-xl font-bold text-primary">{patient.full_name}</h1>
                <p className="text-sm text-muted-foreground">{patient.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {editing ? (
                <>
                  <Button onClick={() => setEditing(false)} variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} size="sm" className="bg-accent hover:bg-accent/90">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditing(true)} size="sm">
                  Edit Patient
                </Button>
              )}
            </div>
          </div>
        </header>

        <main className="container py-8">
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList>
              <TabsTrigger value="details">Patient Details</TabsTrigger>
              <TabsTrigger value="files">Files & Documents</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
              <TabsTrigger value="sharing">Sharing</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-sans">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    {editing ? (
                      <Input
                        value={formData.full_name || ""}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{patient.full_name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    {editing ? (
                      <Input
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{patient.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Phone</Label>
                    {editing ? (
                      <Input
                        value={formData.phone || ""}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{patient.phone || "—"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    {editing ? (
                      <Select
                        value={formData.status || "pending"}
                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline">{patient.status || "pending"}</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-sans flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Travel Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Arrival Date</Label>
                    {editing ? (
                      <Input
                        type="date"
                        value={formData.arrival_date || ""}
                        onChange={(e) => setFormData({ ...formData, arrival_date: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">
                        {patient.arrival_date ? new Date(patient.arrival_date).toLocaleDateString() : "—"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Departure Date</Label>
                    {editing ? (
                      <Input
                        type="date"
                        value={formData.departure_date || ""}
                        onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">
                        {patient.departure_date ? new Date(patient.departure_date).toLocaleDateString() : "—"}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-sans">Treatment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Treatment Interest</Label>
                    {editing ? (
                      <Input
                        value={formData.treatment_interest || ""}
                        onChange={(e) => setFormData({ ...formData, treatment_interest: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{patient.treatment_interest || "—"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Work Notes</Label>
                    {editing ? (
                      <Textarea
                        value={formData.work_notes || ""}
                        onChange={(e) => setFormData({ ...formData, work_notes: e.target.value })}
                        rows={4}
                        placeholder="Detailed notes about the work to be done..."
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{patient.work_notes || "—"}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-sans flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Accommodation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>Accommodation Details</Label>
                    {editing ? (
                      <Textarea
                        value={formData.accommodation_notes || ""}
                        onChange={(e) => setFormData({ ...formData, accommodation_notes: e.target.value })}
                        rows={3}
                        placeholder="Hotel name, address, booking reference..."
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{patient.accommodation_notes || "—"}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-sans text-base">Upload Quote/Estimate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Label htmlFor="quote-upload" className="cursor-pointer">
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-colors">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload quote</p>
                      </div>
                      <Input
                        id="quote-upload"
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "quote")}
                        disabled={uploading}
                      />
                    </Label>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-sans text-base">Upload Receipt/Ticket</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Label htmlFor="receipt-upload" className="cursor-pointer">
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-colors">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload receipt</p>
                      </div>
                      <Input
                        id="receipt-upload"
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "receipt")}
                        disabled={uploading}
                      />
                    </Label>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="font-sans">All Files</CardTitle>
                  <CardDescription>{files.length} file(s) uploaded</CardDescription>
                </CardHeader>
                <CardContent>
                  {files.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No files uploaded yet</p>
                  ) : (
                    <div className="space-y-2">
                      {files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{file.file_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {file.file_type} • {new Date(file.uploaded_at!).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadFile(file.file_path!, file.file_name!)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteFile(file.id, file.file_path!)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-sans flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Payment Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Total Payment Notes</Label>
                    {editing ? (
                      <Textarea
                        value={formData.payment_total_notes || ""}
                        onChange={(e) => setFormData({ ...formData, payment_total_notes: e.target.value })}
                        placeholder="Total amount, currency, breakdown..."
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{patient.payment_total_notes || "—"}</p>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>First Payment Notes</Label>
                    {editing ? (
                      <Textarea
                        value={formData.payment_first_notes || ""}
                        onChange={(e) => setFormData({ ...formData, payment_first_notes: e.target.value })}
                        placeholder="Amount, date paid, payment method..."
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{patient.payment_first_notes || "—"}</p>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Second Payment Notes</Label>
                    {editing ? (
                      <Textarea
                        value={formData.payment_second_notes || ""}
                        onChange={(e) => setFormData({ ...formData, payment_second_notes: e.target.value })}
                        placeholder="Amount, date paid, payment method..."
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{patient.payment_second_notes || "—"}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reminders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-sans flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Reminder
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Reminder Note</Label>
                      <Input
                        value={newReminder.title}
                        onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                        placeholder="Follow-up appointment"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Input
                        type="date"
                        value={newReminder.due_date}
                        onChange={(e) => setNewReminder({ ...newReminder, due_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddReminder} className="bg-accent hover:bg-accent/90">
                    <Bell className="h-4 w-4 mr-2" />
                    Add Reminder
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-sans">Active Reminders</CardTitle>
                  <CardDescription>{reminders.filter(r => !r.is_completed).length} active reminder(s)</CardDescription>
                </CardHeader>
                <CardContent>
                  {reminders.filter(r => !r.is_completed).length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No active reminders</p>
                  ) : (
                    <div className="space-y-2">
                      {reminders.filter(r => !r.is_completed).map((reminder) => (
                        <div key={reminder.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Bell className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{reminder.reminder_text}</p>
                              <p className="text-xs text-muted-foreground">
                                Due: {reminder.reminder_date ? new Date(reminder.reminder_date).toLocaleDateString() : "No date"}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCompleteReminder(reminder.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sharing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-sans flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Share Patient Data
                  </CardTitle>
                  <CardDescription>
                    Grant specific people access to this patient's information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      value={newShare.email}
                      onChange={(e) => setNewShare({ ...newShare, email: e.target.value })}
                      placeholder="colleague@example.com"
                    />
                  </div>
                  <Button onClick={handleAddShare} className="bg-accent hover:bg-accent/90">
                    <Share2 className="h-4 w-4 mr-2" />
                    Grant Access
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-sans">Current Shares</CardTitle>
                  <CardDescription>
                    {shares.length} person(s) have access to this patient
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {shares.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Patient data not shared with anyone yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {shares.map((share) => (
                        <div key={share.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Share2 className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{share.shared_with_email}</p>
                              <p className="text-xs text-muted-foreground">
                                Shared: {new Date(share.created_at!).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRevokeShare(share.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}