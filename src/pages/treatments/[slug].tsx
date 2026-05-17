import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { treatmentService } from "@/services/treatmentService";
import type { Treatment } from "@/services/treatmentService";
import { CheckCircle2, Clock, Calendar, Shield, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Head from "next/head";

export default function TreatmentDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug && typeof slug === "string") {
      loadTreatment(slug);
    }
  }, [slug]);

  const loadTreatment = async (treatmentSlug: string) => {
    try {
      const data = await treatmentService.getTreatmentBySlug(treatmentSlug);
      setTreatment(data);
    } catch (error) {
      console.error("Failed to load treatment:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (!treatment) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <h1 className="text-2xl font-bold">Treatment not found</h1>
          <Link href="/#treatments">
            <Button>Back to Treatments</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "name": treatment.title,
    "description": treatment.meta_description || treatment.short_description,
    "image": treatment.featured_image_url,
  };

  return (
    <>
      <SEO 
        title={treatment.meta_title || `${treatment.title} - Elite Dental Tourism`}
        description={treatment.meta_description || treatment.short_description || `Learn about ${treatment.title} at Elite Dental Tourism.`}
        image={treatment.featured_image_url || undefined}
      />
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />
      </Head>
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden bg-card border-b border-border">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-accent/5 z-10" />
            
            {treatment.hero_image_url && (
              <div className="absolute inset-0 z-0">
                <img src={treatment.hero_image_url} alt={treatment.title} className="w-full h-full object-cover opacity-20" />
              </div>
            )}
            
            <div className="container relative z-20">
              <Link href="/#treatments">
                <Button variant="ghost" className="mb-8 gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Treatments
                </Button>
              </Link>
              
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  {treatment.category && (
                    <Badge variant="secondary" className="font-sans text-sm">{treatment.category}</Badge>
                  )}
                  <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                    {treatment.title}
                  </h1>
                  {treatment.short_description && (
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      {treatment.short_description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 pt-4">
                    {treatment.savings_percentage && (
                      <div className="flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-lg font-semibold">
                        <Shield className="w-5 h-5" />
                        Save up to {treatment.savings_percentage}%
                      </div>
                    )}
                    {treatment.duration_days && (
                      <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg text-foreground">
                        <Clock className="w-5 h-5" />
                        {treatment.duration_days} Days typical stay
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-6">
                    <Link href={`/#book`}>
                      <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-lg shadow-lg">
                        Book Free Consultation
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-muted hidden lg:block border border-border/50">
                  {treatment.featured_image_url ? (
                    <img src={treatment.featured_image_url} alt={treatment.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50">
                      <ImageIcon className="w-20 h-20 mb-4" />
                      <span>Treatment Image</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Content Sections */}
          <section className="py-20 bg-background">
            <div className="container max-w-4xl space-y-20">
              
              {/* Overview */}
              {treatment.overview && (
                <div className="space-y-6">
                  <h2 className="font-sans text-3xl font-bold">Overview</h2>
                  <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
                    <p>{treatment.overview}</p>
                  </div>
                </div>
              )}

              {/* Benefits */}
              {treatment.benefits && treatment.benefits.length > 0 && (
                <div className="space-y-6">
                  <h2 className="font-sans text-3xl font-bold">Key Benefits</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {treatment.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border shadow-sm">
                        <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                        <span className="text-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Procedure Steps */}
              {treatment.procedure_steps && treatment.procedure_steps.length > 0 && (
                <div className="space-y-6">
                  <h2 className="font-sans text-3xl font-bold">The Procedure</h2>
                  <div className="space-y-6">
                    {treatment.procedure_steps.map((step, i) => (
                      <div key={i} className="flex gap-6 relative">
                        {i !== treatment.procedure_steps!.length - 1 && (
                          <div className="absolute left-6 top-14 bottom-[-24px] w-0.5 bg-border" />
                        )}
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0 relative z-10">
                          {i + 1}
                        </div>
                        <div className="pt-2 pb-6">
                          <p className="text-lg text-foreground">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recovery */}
              {treatment.recovery_info && (
                <div className="space-y-6 bg-card p-8 rounded-2xl border border-border shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-accent/10 rounded-lg text-accent">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <h2 className="font-sans text-3xl font-bold m-0">Recovery & Care</h2>
                  </div>
                  <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
                    <p>{treatment.recovery_info}</p>
                  </div>
                </div>
              )}

              {/* FAQ */}
              {treatment.faq && Array.isArray(treatment.faq) && (treatment.faq as any[]).length > 0 && (
                <div className="space-y-6">
                  <h2 className="font-sans text-3xl font-bold">Frequently Asked Questions</h2>
                  <Accordion type="single" collapsible className="w-full bg-card rounded-xl border border-border px-4 py-2">
                    {(treatment.faq as any[]).map((item: any, i: number) => (
                      <AccordionItem key={i} value={`faq-${i}`} className={i === (treatment.faq as any[]).length - 1 ? "border-b-0" : ""}>
                        <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary transition-colors">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2 pb-4">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}

            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-card border-t border-border">
            <div className="container max-w-4xl text-center space-y-8">
              <h2 className="font-sans text-3xl md:text-4xl font-bold">Ready to Transform Your Smile?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Book a free consultation today and discover how we can help you achieve the smile you've always wanted at a fraction of the cost.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/#book">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-lg shadow-lg">
                    Book Free Consultation
                  </Button>
                </Link>
                <Link href="/#treatments">
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                    View All Treatments
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
}