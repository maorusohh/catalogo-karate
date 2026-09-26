import Link from "next/link";

import { CartTrigger } from "@/components/cart/cart-trigger";
import { Container } from "@/components/ui/container";

const navigation = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/como-comprar", label: "Cómo comprar" },
  { href: "/entregas", label: "Entregas" },
  { href: "/contacto", label: "Contacto" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[#faf9f6]/95 backdrop-blur-md">
      <Container>
        <div className="flex min-h-[76px] items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-3"
            aria-label="Catálogo Karate-Do, inicio"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-xs font-bold tracking-[0.08em] text-white transition-transform duration-200 group-hover:-rotate-2">
              KD
            </span>

            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold tracking-tight text-neutral-950">
                Catálogo Karate-Do
              </span>

              <span className="hidden text-[10px] font-medium tracking-[0.18em] text-neutral-400 uppercase sm:block">
                Equipamiento · Venezuela
              </span>
            </span>
          </Link>

          <nav aria-label="Navegación principal" className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-black/5 hover:text-neutral-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/catalogo"
              className="hidden min-h-11 items-center justify-center rounded-full bg-[#b31322] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#8d0f1b] sm:inline-flex"
            >
              Ver catálogo
            </Link>

            <CartTrigger />

            <details className="relative lg:hidden">
              <summary
                className="flex size-11 cursor-pointer list-none items-center justify-center rounded-full border border-black/10 bg-white text-neutral-950 transition-colors hover:border-neutral-950 [&::-webkit-details-marker]:hidden"
                aria-label="Abrir menú"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </summary>

              <div className="absolute top-[calc(100%+10px)] right-0 w-72 overflow-hidden rounded-3xl border border-black/10 bg-[#faf9f6] p-2 shadow-2xl">
                <div className="border-b border-black/5 px-4 py-3">
                  <p className="text-[10px] font-semibold tracking-[0.18em] text-neutral-400 uppercase">
                    Navegación
                  </p>

                  <p className="mt-1 text-sm font-medium text-neutral-950">Explora el catálogo</p>
                </div>

                <div className="py-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-white hover:text-neutral-950"
                    >
                      {item.label}

                      <span aria-hidden="true" className="text-neutral-300">
                        →
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="border-t border-black/5 p-2">
                  <Link
                    href="/catalogo"
                    className="flex min-h-11 items-center justify-center rounded-2xl bg-neutral-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
                  >
                    Ver catálogo
                  </Link>
                </div>
              </div>
            </details>
          </div>
        </div>
      </Container>
    </header>
  );
}
