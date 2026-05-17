import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { patientService } from "@/services/patientService";
import { Calendar, Mail, Phone, User, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function BookingForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    treatment_interest: "",
    preferred_arrival_date: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await patientService.createPatient({
        ...formData,
        status: "inquiry",
        arrival_date: formData.preferred_arrival_date || null,
      });

      setSubmitted(true);
      toast({
        title: "Booking request received!",
        description: "We'll contact you within 24 hours to confirm your appointment.",
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="bg-card shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-accent" />
          </div>
          <CardTitle className="font-sans text-2xl">Thank You!</CardTitle>
          <CardDescription className="text-base">
            Your booking request has been received. Our team will contact you within 24 hours to discuss your treatment plan and confirm your appointment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setSubmitted(false)} variant="outline" className="w-full">
            Submit Another Request
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card shadow-lg">
      <CardHeader>
        <CardTitle className="font-sans text-2xl">Book Your Consultation</CardTitle>
        <CardDescription>
          Fill out the form below and we'll contact you within 24 hours to discuss your treatment plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
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

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
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
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone *
            </Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment">Treatment Interest *</Label>
            <Select
              required
              value={formData.treatment_interest}
              onValueChange={(value) => setFormData({ ...formData, treatment_interest: value })}
            >
              <SelectTrigger id="treatment">
                <SelectValue placeholder="Select a treatment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dental-implants">Dental Implants</SelectItem>
                <SelectItem value="veneers">Porcelain Veneers</SelectItem>
                <SelectItem value="full-mouth">Full Mouth Reconstruction</SelectItem>
                <SelectItem value="root-canal">Root Canal Treatment</SelectItem>
                <SelectItem value="whitening">Teeth Whitening</SelectItem>
                <SelectItem value="crowns">Dental Crowns</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="arrival_date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Preferred Arrival Date
            </Label>
            <Input
              id="arrival_date"
              type="date"
              value={formData.preferred_arrival_date}
              onChange={(e) => setFormData({ ...formData, preferred_arrival_date: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Additional Information</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about your dental needs, any specific concerns, or questions you have..."
              rows={4}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-sans">
            {loading ? "Submitting..." : "Request Consultation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}