import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navigation() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <nav className="container flex items-center justify-between py-4">
        <Link href="/" className="font-sans text-xl md:text-2xl font-bold text-primary hover:text-primary/90 transition-colors">
          Elite Dental Tourism
        </Link>
        
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/#treatments" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t("nav.treatments")}
          </Link>
          <Link href="/#why-choose" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t("nav.whyChoose")}
          </Link>
          <Link href="/#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t("nav.testimonials")}
          </Link>
          <Link href="/#before-after" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t("nav.beforeAfter")}
          </Link>
          <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t("nav.blog")}
          </Link>
          <Link href="/#destination" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t("nav.destination")}
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Globe className="h-4 w-4" />
                <span className="uppercase text-xs font-semibold">{language}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("en")}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("it")}>
                Italiano
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("fr")}>
                Français
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link href="/#book">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-sans font-semibold shadow-md hover:shadow-lg transition-all">
              {t("nav.bookAppointment")}
            </Button>
          </Link>
        </div>

        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </nav>
    </header>
  );
}