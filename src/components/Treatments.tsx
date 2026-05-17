import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Crown, Smile, Scissors, Activity, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const treatments = [
  {
    icon: Sparkles,
    title: "Dental Implants",
    description: "Permanent tooth replacement with titanium implants and custom crowns. Natural look and function.",
    priceRange: "$800-1,200",
    savings: "Save $3,000+"
  },
  {
    icon: Crown,
    title: "Porcelain Veneers",
    description: "Transform your smile with ultra-thin ceramic shells. Perfect for chips, gaps, and discoloration.",
    priceRange: "$250-400",
    savings: "Save $800+"
  },
  {
    icon: Smile,
    title: "Full Mouth Reconstruction",
    description: "Comprehensive smile makeover combining multiple procedures for complete dental restoration.",
    priceRange: "$8,000-15,000",
    savings: "Save $25,000+"
  },
  {
    icon: Activity,
    title: "Root Canal Treatment",
    description: "Pain-free endodontic therapy using advanced techniques. Save your natural tooth.",
    priceRange: "$180-300",
    savings: "Save $600+"
  },
  {
    icon: Scissors,
    title: "Teeth Whitening",
    description: "Professional bleaching for a brighter smile. Results up to 8 shades lighter.",
    priceRange: "$150-250",
    savings: "Save $400+"
  },
  {
    icon: Shield,
    title: "Dental Crowns & Bridges",
    description: "High-quality ceramic restorations. Restore function and aesthetics seamlessly.",
    priceRange: "$300-600",
    savings: "Save $900+"
  }
];

export function Treatments() {
  return (
    <section id="treatments" className="py-24 md:py-32 bg-gradient-to-b from-background to-card">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-sans text-4xl md:text-5xl font-bold text-foreground mb-6">
            Premium Dental Treatments
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            State-of-the-art procedures performed by internationally certified specialists using the latest technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {treatments.map((treatment, index) => {
            const Icon = treatment.icon;
            return (
              <Card 
                key={index} 
                className="border-border bg-card hover:border-accent/50 hover:shadow-2xl transition-all duration-300 group overflow-hidden"
              >
                <CardHeader className="space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Icon className="w-7 h-7 text-accent" />
                  </div>
                  <CardTitle className="font-sans text-2xl group-hover:text-primary transition-colors">
                    {treatment.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                    {treatment.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">From</span>
                      <span className="font-sans text-2xl font-bold text-primary">{treatment.priceRange}</span>
                    </div>
                    <div className="text-sm font-medium text-accent">{treatment.savings}</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full border border-border hover:border-accent hover:bg-accent/5 group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-all"
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}