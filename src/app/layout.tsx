import type { Metadata } from "next";
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
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
