import { siteConfig } from "@/config/site";

export function normalizeWhatsAppNumber(value: string): string {
  return value.replace(/\D/g, "");
}

export function buildWhatsAppUrl(message: string): string | null {
  const phoneNumber = normalizeWhatsAppNumber(siteConfig.whatsappNumber);

  if (!phoneNumber) {
    return null;
  }

  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}
