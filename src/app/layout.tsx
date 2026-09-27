import type { Metadata } from "next";

import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-provider";
import { SiteShell } from "@/components/layout/site-shell";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Catálogo Karate-Do",
    template: "%s | Catálogo Karate-Do",
  },
  description:
    "Catálogo de equipamiento de Karate-Do para entrenamiento y competición, con atención personalizada y envíos a nivel nacional.",
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
      "Catálogo de equipamiento de Karate-Do para entrenamiento y competición, con atención personalizada y envíos a nivel nacional.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Catálogo Karate-Do",
    description:
      "Catálogo de equipamiento de Karate-Do para entrenamiento y competición, con atención personalizada y envíos a nivel nacional.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body>
        <CartProvider>
          <SiteShell>{children}</SiteShell>

          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
