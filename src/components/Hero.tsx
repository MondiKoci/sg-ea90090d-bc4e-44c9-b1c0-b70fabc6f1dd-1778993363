import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Award, Users } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />
      
      <div className="container relative">
        <div className="mx-auto max-w-5xl text-center space-y-10">
          <div className="flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Badge variant="secondary" className="px-5 py-2 font-sans text-sm shadow-sm">
              <Award className="w-4 h-4 mr-2" />
              ISO 9001 Certified Facility
            </Badge>
            <Badge variant="secondary" className="px-5 py-2 font-sans text-sm shadow-sm">
              <Users className="w-4 h-4 mr-2" />
              12,000+ Happy Patients
            </Badge>
          </div>

          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150">
            <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight">
              World-Class Dental Care
              <br />
              <span className="text-primary">at 70% Lower Cost</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Experience premium dental treatments with internationally trained specialists. 
              Cutting-edge technology, luxurious care, and exceptional savings in a beautiful Mediterranean destination.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            <Button 
              size="lg" 
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-sans font-semibold text-base px-10 py-6 shadow-lg hover:shadow-xl transition-all"
            >
              Get Free Consultation
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="font-sans font-semibold text-base px-10 py-6 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
            >
              View Treatments
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-7 duration-1000 delay-500">
            <div className="space-y-2 group">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
                <div className="font-sans text-3xl md:text-4xl font-bold text-primary">15+</div>
              </div>
              <div className="text-sm md:text-base text-muted-foreground font-medium">Years Experience</div>
            </div>
            <div className="space-y-2 group">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
                <div className="font-sans text-3xl md:text-4xl font-bold text-primary">98%</div>
              </div>
              <div className="text-sm md:text-base text-muted-foreground font-medium">Success Rate</div>
            </div>
            <div className="space-y-2 group">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
                <div className="font-sans text-3xl md:text-4xl font-bold text-primary">45</div>
              </div>
              <div className="text-sm md:text-base text-muted-foreground font-medium">Countries Served</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}