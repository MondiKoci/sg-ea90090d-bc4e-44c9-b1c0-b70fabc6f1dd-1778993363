import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { galleryService } from "@/services/galleryService";
import type { Tables } from "@/integrations/supabase/types";
import { useLanguage } from "@/contexts/LanguageContext";

type BeforeAfterCase = Tables<"before_after_cases">;

export function BeforeAfterGallery() {
  const [cases, setCases] = useState<BeforeAfterCase[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const data = await galleryService.getPublishedCases();
      setCases(data);
    } catch (error) {
      console.error("Failed to load cases:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || cases.length === 0) {
    return null;
  }

  return (
    <section id="before-after" className="py-24 md:py-32 bg-gradient-to-b from-card to-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-sans text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t("beforeAfter.title") || "Before & After Transformations"}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t("beforeAfter.subtitle") || "Real results from our patients showcasing the quality of our dental work"}
          </p>
        </div>

        <Carousel className="max-w-6xl mx-auto">
          <CarouselContent>
            {cases.map((caseItem) => (
              <CarouselItem key={caseItem.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden border-border hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-2">
                      <div className="relative aspect-square bg-muted">
                        <img
                          src={caseItem.before_image_url || ""}
                          alt={`Before - ${caseItem.treatment_type}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-sans font-semibold">
                          Before
                        </div>
                      </div>
                      <div className="relative aspect-square bg-muted">
                        <img
                          src={caseItem.after_image_url || ""}
                          alt={`After - ${caseItem.treatment_type}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-accent/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-sans font-semibold text-accent-foreground">
                          After
                        </div>
                      </div>
                    </div>
                    <div className="p-6 space-y-2">
                      <div className="font-sans font-semibold text-lg text-foreground">
                        {caseItem.treatment_type}
                      </div>
                      {caseItem.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {caseItem.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-12" />
          <CarouselNext className="-right-12" />
        </Carousel>
      </div>
    </section>
  );
}