import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { patientService } from "@/services/patientService";
import { notificationService } from "@/services/notificationService";
import { emailService } from "@/services/emailService";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Mail, Phone, User, MessageSquare, CheckCircle2, Loader2 } from "lucide-react";

export function BookingForm() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    treatment_interest: "",
    arrival_date: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      console.log("Submitting booking form:", formData);

      // Create patient record
      const patient = await patientService.createPatient({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        treatment_interest: formData.treatment_interest,
        arrival_date: formData.arrival_date || undefined,
        work_notes: formData.message || undefined,
      });

      console.log("Patient created:", patient);

      // Notify admins about new booking
      try {
        await notificationService.notifyAdminBooking(
          formData.full_name,
          formData.email || "No email provided",
          formData.treatment_interest || "Not specified"
        );
        console.log("Admin notification sent");
      } catch (notifError) {
        console.warn("Admin notification failed (non-critical):", notifError);
      }

      // Send booking confirmation email to patient
      if (formData.email) {
        try {
          await emailService.sendBookingConfirmation({
            to: formData.email,
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone || "Not provided",
            treatment_interest: formData.treatment_interest || "Not specified",
            arrival_date: formData.arrival_date,
          });
          console.log("Confirmation email sent");
        } catch (emailError) {
          console.warn("Email sending failed (non-critical):", emailError);
        }
      }

      toast({
        title: "Booking submitted successfully!",
        description: "We'll contact you soon to confirm your appointment.",
      });

      setSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          treatment_interest: "",
          arrival_date: "",
          message: "",
        });
        setSubmitted(false);
      }, 3000);
    } catch (error: any) {
      console.error("Booking submission error:", error);
      const errorMessage = error?.message || "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      toast({
        title: "Submission failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card id="book" className="scroll-mt-20 border-2 border-green-500/20 bg-green-50 dark:bg-green-950/20">
        <CardContent className="pt-12 pb-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
          <p className="text-muted-foreground">
            Your consultation request has been submitted successfully. 
            We'll get back to you within 24 hours.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id="book" className="scroll-mt-20 shadow-xl">
      <CardHeader className="text-center pb-6">
        <CardTitle className="font-sans text-3xl md:text-4xl font-bold mb-3">
          Book Your Free Consultation
        </CardTitle>
        <CardDescription className="text-base">
          Fill out the form below and we'll get back to you within 24 hours to discuss your dental care journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-base font-semibold">
              <User className="w-4 h-4 inline mr-2" />
              Full Name *
            </Label>
            <Input
              id="full_name"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="John Doe"
              className="h-12 text-base"
              disabled={submitting}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold">
                <Mail className="w-4 h-4 inline mr-2" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="h-12 text-base"
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base font-semibold">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="h-12 text-base"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment_interest" className="text-base font-semibold">
              Treatment of Interest
            </Label>
            <Input
              id="treatment_interest"
              value={formData.treatment_interest}
              onChange={(e) => setFormData({ ...formData, treatment_interest: e.target.value })}
              placeholder="e.g., Dental Implants, Veneers, Full Mouth Reconstruction"
              className="h-12 text-base"
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="arrival_date" className="text-base font-semibold">
              <Calendar className="w-4 h-4 inline mr-2" />
              Preferred Arrival Date
            </Label>
            <Input
              id="arrival_date"
              type="date"
              value={formData.arrival_date}
              onChange={(e) => setFormData({ ...formData, arrival_date: e.target.value })}
              className="h-12 text-base"
              disabled={submitting}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-base font-semibold">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Additional Information
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us more about your dental needs, concerns, or questions..."
              rows={5}
              className="text-base resize-none"
              disabled={submitting}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-7 text-lg shadow-lg hover:shadow-xl transition-all"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Book Free Consultation"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            * Required fields. Your information is secure and confidential.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}