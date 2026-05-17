import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Crown, Smile, Scissors, Activity, Shield } from "lucide-react";

const treatments = [
  {
    icon: Sparkles,
    title: "Dental Implants",
    description: "Permanent tooth replacement with titanium implants and custom crowns. Natural look and function.",
    priceRange: "$800-1,200"
  },
  {
    icon: Crown,
    title: "Porcelain Veneers",
    description: "Transform your smile with ultra-thin ceramic shells. Perfect for chips, gaps, and discoloration.",
    priceRange: "$250-400"
  },
  {
    icon: Smile,
    title: "Full Mouth Reconstruction",
    description: "Comprehensive smile makeover combining multiple procedures for complete dental restoration.",
    priceRange: "$8,000-15,000"
  },
  {
    icon: Activity,
    title: "Root Canal Treatment",
    description: "Pain-free endodontic therapy using advanced techniques. Save your natural tooth.",
    priceRange: "$180-300"
  },
  {
    icon: Scissors,
    title: "Teeth Whitening",
    description: "Professional bleaching for a brighter smile. Results up to 8 shades lighter.",
    priceRange: "$150-250"
  },
  {
    icon: Shield,
    title: "Dental Crowns & Bridges",
    description: "High-quality ceramic restorations. Restore function and aesthetics seamlessly.",
    priceRange: "$300-600"
  }
];

export function Treatments() {
  return (
    <section id="treatments" className="py-20 md:py-24 bg-card">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-sans text-3xl md:text-5xl font-bold text-foreground mb-4">
            Premium Dental Treatments
          </h2>
          <p className="text-lg text-muted-foreground">
            State-of-the-art procedures performed by internationally certified specialists
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treatments.map((treatment, index) => {
            const Icon = treatment.icon;
            return (
              <Card key={index} className="border-border hover:border-accent/50 transition-all hover:shadow-lg group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle className="font-sans text-xl">{treatment.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {treatment.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-muted-foreground">From</span>
                    <span className="font-sans text-lg font-semibold text-primary">{treatment.priceRange}</span>
                    <span className="text-xs text-muted-foreground">per tooth</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}