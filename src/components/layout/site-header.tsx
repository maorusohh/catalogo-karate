import Link from "next/link";
import { CartTrigger } from "@/components/cart/cart-trigger";

const navigation = [
  {
    label: "Catálogo",
    href: "/catalogo",
  },
  {
    label: "Cómo comprar",
    href: "/como-comprar",
  },
  {
    label: "Entregas",
    href: "/entregas",
  },
  {
    label: "Contacto",
    href: "/contacto",
  },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#faf9f6]/95 backdrop-blur">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3"
          aria-label="Catálogo Karate-Do, inicio"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-neutral-950 text-sm font-black tracking-tight text-white">
            KD
          </span>

          <span className="hidden sm:block">
            <span className="block text-sm font-semibold tracking-tight text-neutral-950">
              Catálogo Karate-Do
            </span>
            <span className="block text-[11px] font-medium tracking-[0.18em] text-neutral-500 uppercase">
              Equipamiento especializado
            </span>
          </span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-7 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CartTrigger />

          <Link
            href="/catalogo"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#b31322] px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    </header>
  );
}
