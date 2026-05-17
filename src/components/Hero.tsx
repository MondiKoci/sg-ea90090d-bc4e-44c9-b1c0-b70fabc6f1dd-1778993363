import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Award, Users } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <Badge variant="secondary" className="px-4 py-1.5 font-sans">
              <Award className="w-3.5 h-3.5 mr-1.5" />
              ISO Certified Facility
            </Badge>
            <Badge variant="secondary" className="px-4 py-1.5 font-sans">
              <Users className="w-3.5 h-3.5 mr-1.5" />
              12,000+ Patients Treated
            </Badge>
          </div>

          <h1 className="font-sans text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
            World-Class Dental Care at
            <span className="text-primary"> 70% Lower Cost</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience premium dental treatments with internationally trained specialists. 
            We combine cutting-edge technology, luxurious care, and significant savings in a beautiful destination.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-sans font-semibold text-base px-8">
              Get Free Quote
            </Button>
            <Button size="lg" variant="outline" className="font-sans font-semibold text-base px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              View Treatments
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="space-y-1">
              <div className="flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-accent mr-2" />
                <div className="font-sans text-2xl md:text-3xl font-bold text-primary">15+</div>
              </div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-accent mr-2" />
                <div className="font-sans text-2xl md:text-3xl font-bold text-primary">98%</div>
              </div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-accent mr-2" />
                <div className="font-sans text-2xl md:text-3xl font-bold text-primary">45</div>
              </div>
              <div className="text-sm text-muted-foreground">Countries Served</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}