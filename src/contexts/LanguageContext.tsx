import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "it" | "fr";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.treatments": "Treatments",
    "nav.whyChoose": "Why Choose Us",
    "nav.testimonials": "Testimonials",
    "nav.beforeAfter": "Before & After",
    "nav.blog": "Blog",
    "nav.destination": "Destination",
    "nav.bookAppointment": "Book Appointment",
    
    // Hero
    "hero.title": "World-Class Dental Care",
    "hero.subtitle": "at 70% Lower Cost",
    "hero.description": "Experience premium dental treatments with internationally trained specialists. Cutting-edge technology, luxurious care, and exceptional savings in a beautiful Mediterranean destination.",
    "hero.ctaPrimary": "Get Free Consultation",
    "hero.ctaSecondary": "View Treatments",
    "hero.certifiedFacility": "ISO 9001 Certified Facility",
    "hero.happyPatients": "Happy Patients",
    "hero.yearsExperience": "Years Experience",
    "hero.successRate": "Success Rate",
    "hero.countriesServed": "Countries Served",
    
    // Treatments
    "treatments.title": "Premium Dental Treatments",
    "treatments.subtitle": "State-of-the-art procedures performed by internationally certified specialists using the latest technology",
    "treatments.learnMore": "Learn More",
    "treatments.from": "From",
    
    // Testimonials
    "testimonials.title": "Patient Success Stories",
    "testimonials.subtitle": "Real experiences from patients who transformed their smiles with us",
  },
  it: {
    // Navigation
    "nav.treatments": "Trattamenti",
    "nav.whyChoose": "Perché Noi",
    "nav.testimonials": "Testimonianze",
    "nav.beforeAfter": "Prima e Dopo",
    "nav.blog": "Blog",
    "nav.destination": "Destinazione",
    "nav.bookAppointment": "Prenota Appuntamento",
    
    // Hero
    "hero.title": "Cure Dentali di Classe Mondiale",
    "hero.subtitle": "al 70% di Costo Inferiore",
    "hero.description": "Sperimenta trattamenti dentali premium con specialisti formati a livello internazionale. Tecnologia all'avanguardia, cure lussuose e risparmi eccezionali in una splendida destinazione mediterranea.",
    "hero.ctaPrimary": "Consulenza Gratuita",
    "hero.ctaSecondary": "Vedi Trattamenti",
    "hero.certifiedFacility": "Struttura Certificata ISO 9001",
    "hero.happyPatients": "Pazienti Soddisfatti",
    "hero.yearsExperience": "Anni di Esperienza",
    "hero.successRate": "Tasso di Successo",
    "hero.countriesServed": "Paesi Serviti",
    
    // Treatments
    "treatments.title": "Trattamenti Dentali Premium",
    "treatments.subtitle": "Procedure all'avanguardia eseguite da specialisti certificati a livello internazionale utilizzando la tecnologia più recente",
    "treatments.learnMore": "Scopri di Più",
    "treatments.from": "Da",
    
    // Testimonials
    "testimonials.title": "Storie di Successo dei Pazienti",
    "testimonials.subtitle": "Esperienze reali di pazienti che hanno trasformato i loro sorrisi con noi",
  },
  fr: {
    // Navigation
    "nav.treatments": "Traitements",
    "nav.whyChoose": "Pourquoi Nous",
    "nav.testimonials": "Témoignages",
    "nav.beforeAfter": "Avant & Après",
    "nav.blog": "Blog",
    "nav.destination": "Destination",
    "nav.bookAppointment": "Réserver un Rendez-vous",
    
    // Hero
    "hero.title": "Soins Dentaires de Classe Mondiale",
    "hero.subtitle": "à 70% de Coût Inférieur",
    "hero.description": "Découvrez des traitements dentaires premium avec des spécialistes formés internationalement. Technologie de pointe, soins luxueux et économies exceptionnelles dans une magnifique destination méditerranéenne.",
    "hero.ctaPrimary": "Consultation Gratuite",
    "hero.ctaSecondary": "Voir les Traitements",
    "hero.certifiedFacility": "Installation Certifiée ISO 9001",
    "hero.happyPatients": "Patients Satisfaits",
    "hero.yearsExperience": "Années d'Expérience",
    "hero.successRate": "Taux de Réussite",
    "hero.countriesServed": "Pays Servis",
    
    // Treatments
    "treatments.title": "Traitements Dentaires Premium",
    "treatments.subtitle": "Procédures de pointe réalisées par des spécialistes certifiés internationalement utilisant la technologie la plus récente",
    "treatments.learnMore": "En Savoir Plus",
    "treatments.from": "À partir de",
    
    // Testimonials
    "testimonials.title": "Histoires de Succès des Patients",
    "testimonials.subtitle": "Expériences réelles de patients qui ont transformé leurs sourires avec nous",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved && ["en", "it", "fr"].includes(saved)) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}