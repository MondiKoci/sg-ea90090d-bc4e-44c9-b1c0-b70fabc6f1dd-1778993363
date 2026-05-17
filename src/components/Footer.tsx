import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 border-t border-primary-foreground/10">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="font-sans text-lg font-bold">DentalDestination</h3>
            <p className="text-sm text-primary-foreground/80">
              Premium dental tourism services combining world-class care with significant cost savings.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-sans font-semibold text-sm uppercase tracking-wide">Quick Links</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link href="#treatments" className="text-primary-foreground/80 hover:text-accent transition-colors">
                Treatments
              </Link>
              <Link href="#why-us" className="text-primary-foreground/80 hover:text-accent transition-colors">
                Why Choose Us
              </Link>
              <Link href="#testimonials" className="text-primary-foreground/80 hover:text-accent transition-colors">
                Testimonials
              </Link>
              <Link href="#destination" className="text-primary-foreground/80 hover:text-accent transition-colors">
                Destination
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-sans font-semibold text-sm uppercase tracking-wide">Treatments</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <span className="text-primary-foreground/80">Dental Implants</span>
              <span className="text-primary-foreground/80">Porcelain Veneers</span>
              <span className="text-primary-foreground/80">Full Reconstruction</span>
              <span className="text-primary-foreground/80">Teeth Whitening</span>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-sans font-semibold text-sm uppercase tracking-wide">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                <span className="text-primary-foreground/80">Medical District, City Center</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <a href="tel:+1-800-DENTAL-1" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  +1-800-DENTAL-1
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <a href="mailto:info@dentaldestination.com" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  info@dentaldestination.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} DentalDestination. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-accent transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}