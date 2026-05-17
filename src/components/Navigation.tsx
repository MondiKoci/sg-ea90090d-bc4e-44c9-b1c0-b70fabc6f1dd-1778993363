import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-sans text-xl font-bold text-primary">DentalDestination</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link href="#treatments" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Treatments
          </Link>
          <Link href="#why-us" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Why Choose Us
          </Link>
          <Link href="#testimonials" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Testimonials
          </Link>
          <Link href="#destination" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Destination
          </Link>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-sans font-semibold">
            Free Consultation
          </Button>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </nav>
    </header>
  );
}