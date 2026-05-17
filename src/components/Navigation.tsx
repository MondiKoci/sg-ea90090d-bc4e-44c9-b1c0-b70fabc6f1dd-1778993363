import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <nav className="container flex items-center justify-between py-4">
        <Link href="/" className="font-sans text-xl font-bold text-primary">
          Elite Dental Tourism
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link href="/#treatments" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Treatments
          </Link>
          <Link href="/#why-choose" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Why Choose Us
          </Link>
          <Link href="/#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Testimonials
          </Link>
          <Link href="/#destination" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Destination
          </Link>
          <Link href="/#book">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-sans">
              Book Appointment
            </Button>
          </Link>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </nav>
    </header>
  );
}