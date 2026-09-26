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
