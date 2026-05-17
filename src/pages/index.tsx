import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Treatments } from "@/components/Treatments";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Testimonials } from "@/components/Testimonials";
import { Destination } from "@/components/Destination";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

export default function Home() {
  return (
    <>
      <SEO 
        title="DentalDestination - Premium Dental Tourism at 70% Lower Cost"
        description="World-class dental implants, veneers, and treatments abroad. Save 60-70% with internationally trained specialists. ISO certified facility with comprehensive care packages."
        image="/og-image.png"
      />
      <div className="min-h-screen">
        <Navigation />
        <main>
          <Hero />
          <Treatments />
          <WhyChooseUs />
          <Testimonials />
          <Destination />
        </main>
        <Footer />
      </div>
    </>
  );
}