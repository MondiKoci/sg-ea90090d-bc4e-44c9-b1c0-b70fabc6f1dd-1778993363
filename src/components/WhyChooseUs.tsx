import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Award, Heart } from "lucide-react";

const reasons = [
  {
    icon: DollarSign,
    title: "Save 60-70% on Costs",
    description: "Premium dental care at a fraction of US/EU prices. Same quality materials and techniques, lower overhead costs.",
    highlight: "Average savings: $8,000-15,000 per treatment"
  },
  {
    icon: Award,
    title: "World-Class Expertise",
    description: "US/UK trained dentists with 15+ years experience. ISO certified facility with cutting-edge German technology.",
    highlight: "98% patient satisfaction rate"
  },
  {
    icon: Heart,
    title: "Complete Care Package",
    description: "Airport pickup, luxury accommodation, post-treatment support. We handle everything so you can focus on your smile.",
    highlight: "All-inclusive treatment packages"
  }
];

export function WhyChooseUs() {
  return (
    <section id="why-us" className="py-20 md:py-24 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-sans text-3xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-muted-foreground">
            The perfect combination of quality, affordability, and exceptional patient care
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <Card key={index} className="border-border bg-card hover:shadow-xl transition-shadow">
                <CardContent className="pt-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                    <Icon className="w-8 h-8 text-accent" />
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
      </div>
    </section>
  );
}