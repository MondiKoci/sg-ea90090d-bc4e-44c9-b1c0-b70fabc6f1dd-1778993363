import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    country: "United States",
    procedure: "Full Mouth Reconstruction",
    rating: 5,
    text: "I saved over $30,000 compared to US prices and received exceptional care. The doctors were incredibly skilled and the facility was spotless. The entire experience exceeded my expectations."
  },
  {
    name: "James Rodriguez",
    country: "Canada",
    procedure: "Dental Implants",
    rating: 5,
    text: "From consultation to recovery, everything was seamless. The team coordinated my travel, accommodation, and treatment perfectly. My implants look and feel completely natural."
  },
  {
    name: "Emma Thompson",
    country: "United Kingdom",
    procedure: "Porcelain Veneers",
    rating: 5,
    text: "The transformation is incredible! I finally have the confidence to smile freely. The attention to detail and personalized care made all the difference. Highly recommend for anyone considering dental tourism."
  }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 md:py-24 bg-card">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-sans text-3xl md:text-5xl font-bold text-foreground mb-4">
            Patient Stories
          </h2>
          <p className="text-lg text-muted-foreground">
            Real experiences from patients who transformed their smiles with us
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border bg-background">
              <CardContent className="pt-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed italic">"{testimonial.text}"</p>
                <div className="pt-4 border-t border-border">
                  <div className="font-sans font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.country}</div>
                  <div className="text-xs text-accent font-medium mt-1">{testimonial.procedure}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}