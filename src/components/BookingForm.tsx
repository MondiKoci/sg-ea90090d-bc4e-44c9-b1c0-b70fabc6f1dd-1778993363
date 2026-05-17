import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { patientService } from "@/services/patientService";
import { notificationService } from "@/services/notificationService";
import { emailService } from "@/services/emailService";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Mail, Phone, User, MessageSquare } from "lucide-react";

export function BookingForm() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
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

    try {
      // Create patient record
      await patientService.createPatient({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        treatment_interest: formData.treatment_interest,
        arrival_date: formData.arrival_date || undefined,
        work_notes: formData.message || undefined,
      });

      // Notify admins about new booking
      await notificationService.notifyAdminBooking(
        formData.full_name,
        formData.email || "No email provided",
        formData.treatment_interest || "Not specified"
      );

      // Send booking confirmation email to patient
      if (formData.email) {
        await emailService.sendBookingConfirmation({
          to: formData.email,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone || "Not provided",
          treatment_interest: formData.treatment_interest || "Not specified",
          arrival_date: formData.arrival_date,
        });
      }

      toast({
        title: "Booking submitted successfully!",
        description: "We'll contact you soon to confirm your appointment. Check your email for confirmation.",
      });

      // Reset form
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        treatment_interest: "",
        arrival_date: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Failed to submit booking",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card id="book" className="scroll-mt-20">
      <CardHeader>
        <CardTitle className="font-sans text-2xl">Book Your Free Consultation</CardTitle>
        <CardDescription>
          Fill out the form below and we'll get back to you within 24 hours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">
              <User className="w-4 h-4 inline mr-2" />
              Full Name *
            </Label>
            <Input
              id="full_name"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment_interest">Treatment Interest</Label>
            <Input
              id="treatment_interest"
              value={formData.treatment_interest}
              onChange={(e) => setFormData({ ...formData, treatment_interest: e.target.value })}
              placeholder="e.g., Dental Implants, Veneers"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="arrival_date">
              <Calendar className="w-4 h-4 inline mr-2" />
              Preferred Arrival Date
            </Label>
            <Input
              id="arrival_date"
              type="date"
              value={formData.arrival_date}
              onChange={(e) => setFormData({ ...formData, arrival_date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Additional Information
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us more about your needs..."
              rows={4}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 text-lg"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Book Free Consultation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}