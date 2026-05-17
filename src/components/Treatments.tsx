import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Crown, Smile, Scissors, Activity, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const treatments = [
  {
    icon: Sparkles,
    title: "Dental Implants",
    description: "Permanent tooth replacement with titanium implants and custom crowns. Natural look and function.",
    priceRange: "$800-1,200",
    savings: "Save $3,000+",
    imageAlt: "Dental implant procedure"
  },
  {
    icon: Crown,
    title: "Porcelain Veneers",
    description: "Transform your smile with ultra-thin ceramic shells. Perfect for chips, gaps, and discoloration.",
    priceRange: "$250-400",
    savings: "Save $800+",
    imageAlt: "Porcelain veneers"
  },
  {
    icon: Smile,
    title: "Full Mouth Reconstruction",
    description: "Comprehensive smile makeover combining multiple procedures for complete dental restoration.",
    priceRange: "$8,000-15,000",
    savings: "Save $25,000+",
    imageAlt: "Full mouth reconstruction"
  },
  {
    icon: Activity,
    title: "Root Canal Treatment",
    description: "Pain-free endodontic therapy using advanced techniques. Save your natural tooth.",
    priceRange: "$180-300",
    savings: "Save $600+",
    imageAlt: "Root canal treatment"
  },
  {
    icon: Scissors,
    title: "Teeth Whitening",
    description: "Professional bleaching for a brighter smile. Results up to 8 shades lighter.",
    priceRange: "$150-250",
    savings: "Save $400+",
    imageAlt: "Teeth whitening"
  },
  {
    icon: Shield,
    title: "Dental Crowns & Bridges",
    description: "High-quality ceramic restorations. Restore function and aesthetics seamlessly.",
    priceRange: "$300-600",
    savings: "Save $900+",
    imageAlt: "Dental crowns"
  }
];

export function Treatments() {
  const { t } = useLanguage();
  
  return (
    <section id="treatments" className="py-24 md:py-32 bg-gradient-to-b from-background to-card">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-sans text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t("treatments.title")}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t("treatments.subtitle")}
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
                {/* Treatment Image Placeholder */}
                <div className="relative aspect-video bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-2 p-6">
                      <Icon className="w-12 h-12 text-primary/40 mx-auto" />
                      <p className="text-xs text-muted-foreground font-medium">
                        {treatment.imageAlt}
                      </p>
                    </div>
                  </div>
                  {/* Overlay gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <CardTitle className="font-sans text-xl group-hover:text-primary transition-colors">
                      {treatment.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                    {treatment.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">{t("treatments.from")}</span>
                      <span className="font-sans text-2xl font-bold text-primary">{treatment.priceRange}</span>
                    </div>
                    <div className="text-sm font-medium text-accent">{treatment.savings}</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full border border-border hover:border-accent hover:bg-accent/5 group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-all"
                  >
                    {t("treatments.learnMore")}
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