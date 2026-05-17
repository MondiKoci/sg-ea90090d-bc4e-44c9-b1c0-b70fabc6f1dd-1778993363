import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { treatmentService } from "@/services/treatmentService";
import type { Treatment } from "@/services/treatmentService";

export function Treatments() {
  const { t } = useLanguage();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTreatments() {
      try {
        const data = await treatmentService.getPublishedTreatments();
        setTreatments(data);
      } catch (error) {
        console.error("Failed to load treatments:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTreatments();
  }, []);

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

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-muted-foreground">Loading treatments...</div>
          </div>
        ) : treatments.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-muted-foreground">No treatments available at the moment.</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {treatments.map((treatment) => {
              const IconComponent = treatment.icon_name && (Icons as any)[treatment.icon_name] 
                ? (Icons as any)[treatment.icon_name] 
                : Icons.Sparkles;

              return (
                <Card 
                  key={treatment.id} 
                  className="border-border bg-card hover:border-accent/50 hover:shadow-2xl transition-all duration-300 group overflow-hidden flex flex-col"
                >
                  {/* Treatment Image Placeholder */}
                  <div className="relative aspect-video bg-muted overflow-hidden">
                    {treatment.featured_image_url ? (
                      <img src={treatment.featured_image_url} alt={treatment.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 flex items-center justify-center">
                        <div className="text-center space-y-2 p-6">
                          <IconComponent className="w-12 h-12 text-primary/40 mx-auto" />
                          <p className="text-xs text-muted-foreground font-medium">
                            {treatment.title} image
                          </p>
                        </div>
                      </div>
                    )}
                    {/* Overlay gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <CardHeader className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0">
                        <IconComponent className="w-6 h-6 text-accent" />
                      </div>
                      <CardTitle className="font-sans text-xl group-hover:text-primary transition-colors line-clamp-2">
                        {treatment.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {treatment.short_description || treatment.overview}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 mt-auto">
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center gap-2 mb-2 bg-accent/10 p-3 rounded-lg">
                        <Icons.Shield className="w-5 h-5 text-accent" />
                        <span className="font-sans text-lg font-bold text-foreground">
                          Save up to {treatment.savings_percentage || 70}%
                        </span>
                      </div>
                    </div>
                    <Link href={`/treatments/${treatment.slug}`} className="block">
                      <Button 
                        variant="ghost" 
                        className="w-full border border-border hover:border-accent hover:bg-accent/5 group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-all"
                      >
                        {t("treatments.learnMore")}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}