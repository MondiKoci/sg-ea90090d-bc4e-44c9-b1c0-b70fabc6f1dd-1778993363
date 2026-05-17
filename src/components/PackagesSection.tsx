import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { packageService } from "@/services/packageService";
import type { Package, PackageInclusion } from "@/services/packageService";
import { CheckCircle2, MapPin, Calendar, DollarSign, ChevronDown, ChevronUp, Palmtree } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const categoryLabels: Record<string, string> = {
  dental: "Dental Services",
  accommodation: "Accommodation",
  transport: "Transportation",
  translation: "Translation & Assistance",
  activities: "Activities & Tours",
  meals: "Meals",
  warranty: "Warranty & Guarantees",
  support: "Follow-up Support",
  other: "Other Services",
};

export function PackagesSection() {
  const { t } = useLanguage();
  const [packages, setPackages] = useState<Package[]>([]);
  const [packageInclusions, setPackageInclusions] = useState<Record<string, PackageInclusion[]>>({});
  const [expandedPackage, setExpandedPackage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const data = await packageService.getPublishedPackages();
      setPackages(data);
      
      // Load inclusions for all packages
      for (const pkg of data) {
        const inclusions = await packageService.getPackageInclusions(pkg.id);
        setPackageInclusions(prev => ({ ...prev, [pkg.id]: inclusions }));
      }
    } catch (error) {
      console.error("Failed to load packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (packageId: string) => {
    setExpandedPackage(expandedPackage === packageId ? null : packageId);
  };

  if (loading || packages.length === 0) return null;

  return (
    <section id="packages" className="py-24 md:py-32 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-sans text-4xl md:text-5xl font-bold text-foreground mb-6">
            All-Inclusive Packages
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Complete dental tourism packages designed for your comfort and convenience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => {
            const inclusions = packageInclusions[pkg.id] || [];
            const isExpanded = expandedPackage === pkg.id;
            
            // Group inclusions by category
            const groupedInclusions = inclusions.reduce((acc, inc) => {
              if (!acc[inc.category]) acc[inc.category] = [];
              acc[inc.category].push(inc);
              return acc;
            }, {} as Record<string, PackageInclusion[]>);

            const categoriesCount = Object.keys(groupedInclusions).length;
            const premiumCount = inclusions.filter(inc => inc.is_premium).length;

            return (
              <Card 
                key={pkg.id} 
                className="border-border hover:border-accent/50 hover:shadow-2xl transition-all duration-300 group overflow-hidden flex flex-col bg-card"
              >
                {/* Destination Image Placeholder */}
                <div className="relative aspect-[16/9] bg-gradient-to-br from-primary/15 via-accent/10 to-primary/5">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-2 p-6">
                      <Palmtree className="w-10 h-10 text-primary/40 mx-auto" />
                      <p className="text-xs font-medium text-muted-foreground">
                        {pkg.destination} destination photo
                      </p>
                    </div>
                  </div>
                  {/* Destination badge overlay */}
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="font-sans text-xs bg-card/95 backdrop-blur-sm shadow-lg">
                      <MapPin className="w-3 h-3 mr-1" />
                      {pkg.destination}
                    </Badge>
                  </div>
                  {premiumCount > 0 && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-accent/95 text-accent-foreground border-accent/30 backdrop-blur-sm shadow-lg">
                        Premium
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="space-y-4">
                  <CardTitle className="font-sans text-2xl group-hover:text-primary transition-colors">
                    {pkg.name}
                  </CardTitle>

                  {pkg.description && (
                    <CardDescription className="leading-relaxed">
                      {pkg.description}
                    </CardDescription>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border">
                    {pkg.duration_days && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{pkg.duration_days} days</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{inclusions.length} inclusions</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                  {pkg.price_from && pkg.price_to ? (
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <DollarSign className="w-5 h-5 text-accent" />
                        <span className="font-sans text-3xl font-bold text-primary">
                          ${pkg.price_from.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">- ${pkg.price_to.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">All-inclusive package</p>
                    </div>
                  ) : pkg.price_from ? (
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm text-muted-foreground">From</span>
                        <span className="font-sans text-3xl font-bold text-primary">
                          ${pkg.price_from.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ) : null}

                  {/* Collapsible inclusions */}
                  <div className="space-y-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(pkg.id)}
                      className="w-full justify-between hover:bg-accent/5"
                    >
                      <span className="font-semibold">
                        {isExpanded ? "Hide" : "Show"} Package Details
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>

                    {isExpanded && (
                      <div className="space-y-4 pt-2 border-t border-border animate-in fade-in slide-in-from-top-2 duration-300">
                        {Object.entries(groupedInclusions).map(([category, items]) => (
                          <div key={category}>
                            <h5 className="font-sans font-semibold text-sm text-primary mb-2">
                              {categoryLabels[category] || category}
                            </h5>
                            <ul className="space-y-1.5">
                              {items.map((item) => (
                                <li key={item.id} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${item.is_premium ? 'text-accent' : 'text-muted-foreground'}`} />
                                  <span className={item.is_premium ? "font-medium" : ""}>
                                    {item.item_text}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button 
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-sans font-semibold mt-4 shadow-md hover:shadow-lg transition-all"
                    onClick={() => {
                      const bookingSection = document.getElementById('book');
                      bookingSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Select Package
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}