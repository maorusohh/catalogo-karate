import type { Metadata } from "next";
import { Barlow } from "next/font/google";

import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-provider";
import { SiteShell } from "@/components/layout/site-shell";

import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Catálogo Karate-Do",
    template: "%s | Catálogo Karate-Do",
  },
  description:
    "Catálogo de equipamiento de Karate-Do para entrenamiento, kata y kumite, con atención personalizada y coordinación de envíos a nivel nacional.",
  applicationName: "Catálogo Karate-Do",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "es_VE",
    siteName: "Catálogo Karate-Do",
    title: "Catálogo Karate-Do",
    description:
      "Equipamiento de Karate-Do para entrenamiento, kata y kumite, con atención personalizada y coordinación de envíos.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Catálogo Karate-Do",
    description:
      "Equipamiento de Karate-Do para entrenamiento, kata y kumite, con atención personalizada y coordinación de envíos.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className={barlow.className}>
        <CartProvider>
          <SiteShell>{children}</SiteShell>

          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
