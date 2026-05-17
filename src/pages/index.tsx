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
        title="Premium Dental Tourism - World-Class Care, Exceptional Savings"
        description="Experience world-class dental treatments at up to 70% savings. ISO-certified facility, expert dentists, complete care package with accommodation and travel support."
      />
      <div className="min-h-screen">
        <Navigation />
        <main>
          <Hero />
          <Treatments />
          <WhyChooseUs />
          <Testimonials />
          <BeforeAfterGallery />
          <PackagesSection />
          <Destination />
          
          <section id="book" className="py-24 px-4">
            <div className="container">
              <div className="max-w-2xl mx-auto">
                <BookingForm />
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}