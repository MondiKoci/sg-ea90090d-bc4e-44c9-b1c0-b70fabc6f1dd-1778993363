import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Hotel, Plane } from "lucide-react";

export function Destination() {
  return (
    <section id="destination" className="py-20 md:py-24 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-sans text-3xl md:text-5xl font-bold text-foreground mb-4">
            Your Treatment Destination
          </h2>
          <p className="text-lg text-muted-foreground">
            Combine world-class dental care with a relaxing getaway in a beautiful location
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="border-border bg-card">
            <CardContent className="pt-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <MapPin className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-sans text-lg font-bold text-foreground">Prime Location</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Located in a modern medical district with easy access to attractions, restaurants, and beaches. Experience the perfect blend of healthcare and hospitality.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="pt-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Hotel className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-sans text-lg font-bold text-foreground">Luxury Accommodation</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Partner hotels near our clinic offer comfort and convenience. Spacious rooms, modern amenities, and recovery-friendly environments included in treatment packages.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="pt-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Plane className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-sans text-lg font-bold text-foreground">Travel Coordination</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Complimentary airport transfers, visa assistance, and local support throughout your stay. Our patient coordinators handle all logistics so you can focus on your treatment.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-accent/30 bg-gradient-to-br from-card to-muted/30">
          <CardContent className="py-12 text-center space-y-6">
            <h3 className="font-sans text-2xl md:text-3xl font-bold text-foreground">
              Ready to Transform Your Smile?
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get a personalized treatment plan and cost estimate. Our coordinators will answer all your questions and guide you through every step.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a 
                href="mailto:info@dentaldestination.com" 
                className="inline-flex items-center justify-center rounded-md bg-accent text-accent-foreground hover:bg-accent/90 h-11 px-8 font-sans font-semibold transition-colors"
              >
                Email Us Now
              </a>
              <a 
                href="tel:+1-800-DENTAL-1" 
                className="inline-flex items-center justify-center rounded-md border border-primary text-primary hover:bg-primary hover:text-primary-foreground h-11 px-8 font-sans font-semibold transition-colors"
              >
                Call +1-800-DENTAL-1
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}