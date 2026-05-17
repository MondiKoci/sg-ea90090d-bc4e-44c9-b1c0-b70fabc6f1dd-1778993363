import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Hotel, Plane, Palmtree } from "lucide-react";

export function Destination() {
  return (
    <section id="destination" className="py-24 md:py-32 bg-card">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-sans text-4xl md:text-5xl font-bold text-foreground mb-6">
            Your Treatment Destination
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Combine world-class dental care with a relaxing getaway in a beautiful location
          </p>
        </div>

        {/* Destination Hero Image */}
        <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-16 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10 flex items-center justify-center">
            <div className="text-center space-y-4 p-8">
              <Palmtree className="w-16 h-16 text-primary/50 mx-auto" />
              <p className="text-lg font-medium text-primary/70">
                Destination Panorama<br />
                <span className="text-sm">Beautiful cityscape or coastal view photo</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-border bg-background hover:shadow-xl transition-all duration-300 group">
            <CardContent className="pt-8 space-y-4">
              {/* Location Image */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/5 mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="w-10 h-10 text-primary/40" />
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-sans text-lg font-bold text-foreground">Prime Location</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Located in a modern medical district with easy access to attractions, restaurants, and beaches. Experience the perfect blend of healthcare and hospitality.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-background hover:shadow-xl transition-all duration-300 group">
            <CardContent className="pt-8 space-y-4">
              {/* Hotel Image */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-accent/10 to-primary/5 mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Hotel className="w-10 h-10 text-accent/40" />
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Hotel className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-sans text-lg font-bold text-foreground">Luxury Accommodation</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Partner hotels near our clinic offer comfort and convenience. Spacious rooms, modern amenities, and recovery-friendly environments included in treatment packages.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-background hover:shadow-xl transition-all duration-300 group">
            <CardContent className="pt-8 space-y-4">
              {/* Transport Image */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/5 mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Plane className="w-10 h-10 text-primary/40" />
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Plane className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-sans text-lg font-bold text-foreground">Travel Coordination</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Complimentary airport transfers, visa assistance, and local support throughout your stay. Our patient coordinators handle all logistics so you can focus on your treatment.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-accent/30 bg-gradient-to-br from-card to-muted/30 shadow-xl">
          <CardContent className="py-12 text-center space-y-6">
            <h3 className="font-sans text-2xl md:text-3xl font-bold text-foreground">
              Ready to Transform Your Smile?
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Get a personalized treatment plan and cost estimate. Our coordinators will answer all your questions and guide you through every step.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a 
                href="mailto:info@dentaldestination.com" 
                className="inline-flex items-center justify-center rounded-md bg-accent text-accent-foreground hover:bg-accent/90 h-11 px-8 font-sans font-semibold transition-colors shadow-md hover:shadow-lg"
              >
                Email Us Now
              </a>
              <a 
                href="tel:+1-800-DENTAL-1" 
                className="inline-flex items-center justify-center rounded-md border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground h-11 px-8 font-sans font-semibold transition-colors"
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