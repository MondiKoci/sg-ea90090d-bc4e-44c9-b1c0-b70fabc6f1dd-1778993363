import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const testimonials = [
  {
    name: "Sarah Mitchell",
    country: "United States",
    procedure: "Full Mouth Reconstruction",
    rating: 5,
    text: "I saved over $30,000 compared to US prices and received exceptional care. The doctors were incredibly skilled and the facility was spotless. The entire experience exceeded my expectations.",
    avatar: "SM"
  },
  {
    name: "James Rodriguez",
    country: "Canada",
    procedure: "Dental Implants",
    rating: 5,
    text: "From consultation to recovery, everything was seamless. The team coordinated my travel, accommodation, and treatment perfectly. My implants look and feel completely natural.",
    avatar: "JR"
  },
  {
    name: "Emma Thompson",
    country: "United Kingdom",
    procedure: "Porcelain Veneers",
    rating: 5,
    text: "The transformation is incredible! I finally have the confidence to smile freely. The attention to detail and personalized care made all the difference. Highly recommend for anyone considering dental tourism.",
    avatar: "ET"
  }
];

export function Testimonials() {
  const { t } = useLanguage();
  
  return (
    <section id="testimonials" className="py-24 md:py-32 bg-card">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-sans text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t("testimonials.title")}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t("testimonials.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="border-border bg-background hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-20 h-20 text-accent" />
              </div>
              
              <CardContent className="pt-8 space-y-6 relative">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                
                <p className="text-foreground leading-relaxed text-base">
                  "{testimonial.text}"
                </p>
                
                <div className="pt-6 border-t border-border flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-sans font-bold text-accent text-sm">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-sans font-semibold text-foreground text-lg">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.country}
                    </div>
                    <div className="text-xs text-accent font-medium mt-1 uppercase tracking-wide">
                      {testimonial.procedure}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}