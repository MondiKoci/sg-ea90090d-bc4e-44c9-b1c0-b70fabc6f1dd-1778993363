import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Treatments } from "@/components/Treatments";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Testimonials } from "@/components/Testimonials";
import { BeforeAfterGallery } from "@/components/BeforeAfterGallery";
import { PackagesSection } from "@/components/PackagesSection";
import { Destination } from "@/components/Destination";
import { BookingForm } from "@/components/BookingForm";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

export default function Home() {
  return (
    <>
      <SEO
        title="Elite Dental Tourism - Premium Dental Care Abroad"
        description="Experience world-class dental care at up to 70% savings. Elite Dental Tourism offers premium dental treatments including implants, veneers, and full mouth reconstruction with complete travel support and luxury accommodations."
        image="/og-image.png"
        url="/"
        type="website"
        keywords="dental tourism, affordable dental implants, dental veneers abroad, cosmetic dentistry, medical tourism, international dental care, save on dental work"
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <Hero />
          <Treatments />
          <WhyChooseUs />
          <Testimonials />
          <BeforeAfterGallery />
          <PackagesSection />
          <Destination />
          
          {/* Booking Form Section */}
          <section className="py-20 bg-gradient-to-b from-background to-muted/20">
            <div className="container max-w-3xl">
              <BookingForm />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}