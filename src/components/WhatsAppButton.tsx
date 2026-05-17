import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export function WhatsAppButton({ 
  phoneNumber = "1234567890", // Replace with actual WhatsApp number
  message = "Hello! I'm interested in learning more about your dental tourism services."
}: WhatsAppButtonProps) {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Button
      onClick={handleClick}
      size="lg"
      className="fixed bottom-6 left-6 z-50 h-14 rounded-full shadow-2xl bg-[#25D366] hover:bg-[#20BA5A] text-white px-6 gap-3 group"
    >
      <div className="relative">
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white animate-pulse" />
      </div>
      <span className="font-semibold hidden sm:inline">WhatsApp Us</span>
      <span className="sr-only sm:not-sr-only">Chat on WhatsApp</span>
    </Button>
  );
}