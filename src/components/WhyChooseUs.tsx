import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Award, Heart } from "lucide-react";

const reasons = [
  {
    icon: DollarSign,
    title: "Save 60-70% on Costs",
    description: "Premium dental care at a fraction of US/EU prices. Same quality materials and techniques, lower overhead costs.",
    highlight: "Average savings: $8,000-15,000 per treatment",
    imageAlt: "Cost comparison chart"
  },
  {
    icon: Award,
    title: "World-Class Expertise",
    description: "US/UK trained dentists with 15+ years experience. ISO certified facility with cutting-edge German technology.",
    highlight: "98% patient satisfaction rate",
    imageAlt: "Dentist with patient"
  },
  {
    icon: Heart,
    title: "Complete Care Package",
    description: "Airport pickup, luxury accommodation, post-treatment support. We handle everything so you can focus on your smile.",
    highlight: "All-inclusive treatment packages",
    imageAlt: "Luxury hotel accommodation"
  }
];

export function WhyChooseUs() {
  return (
    <section id="why-us" className="py-24 md:py-32 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-sans text-4xl md:text-5xl font-bold text-foreground mb-6">
            Why Choose Us
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            The perfect combination of quality, affordability, and exceptional patient care
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <Card key={index} className="border-border bg-card hover:shadow-xl transition-all duration-300 group overflow-hidden">
                {/* Feature Image Placeholder */}
                <div className="relative aspect-video bg-gradient-to-br from-accent/10 via-primary/5 to-accent/5">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Icon className="w-10 h-10 text-primary/40 mx-auto" />
                      <p className="text-xs text-muted-foreground px-4">
                        {reason.imageAlt}
                      </p>
                    </div>
                  </div>
                </div>
                
                <CardContent className="pt-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-sans text-xl font-bold text-foreground">{reason.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{reason.description}</p>
                  <div className="pt-2">
                    <span className="inline-block px-4 py-2 bg-accent/10 rounded-full text-sm font-sans font-semibold text-accent">
                      {reason.highlight}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Clinic Facility Showcase */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/15 via-accent/10 to-primary/5">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2 p-8">
                <Award className="w-12 h-12 text-primary/40 mx-auto" />
                <p className="text-sm font-medium text-primary/70">
                  State-of-the-Art Facility<br />
                  <span className="text-xs">Modern treatment room photo</span>
                </p>
              </div>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-accent/15 via-primary/10 to-accent/5">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2 p-8">
                <Heart className="w-12 h-12 text-accent/40 mx-auto" />
                <p className="text-sm font-medium text-accent/70">
                  Expert Medical Team<br />
                  <span className="text-xs">Dentists and staff photo</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}