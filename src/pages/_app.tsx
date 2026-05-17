import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "@/components/ui/toaster";
import { LiveChat } from "@/components/LiveChat";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Component {...pageProps} />
        <Toaster />
        <LiveChat />
        <WhatsAppButton 
          phoneNumber="1234567890"
          message="Hello! I'm interested in learning more about your dental tourism services."
        />
      </LanguageProvider>
    </ThemeProvider>
  );
}
