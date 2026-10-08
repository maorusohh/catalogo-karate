import Link from "next/link";

import { CartTrigger } from "@/components/cart/cart-trigger";
import { Container } from "@/components/ui/container";

const navigation = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/marcas", label: "Marcas" },
  { href: "/como-comprar", label: "Cómo comprar" },
  { href: "/entregas", label: "Envíos" },
  { href: "/contacto", label: "Contacto" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#151515]/96 text-white shadow-[0_8px_30px_rgb(0_0_0_/_0.18)] backdrop-blur-xl">
      <Container>
        <div className="flex min-h-[76px] items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-3"
            aria-label="Catálogo Karate-Do, inicio"
          >
            <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[var(--ck-red)] text-xs font-black tracking-[0.08em] text-white shadow-lg shadow-red-950/20 transition-transform duration-200 group-hover:-rotate-2">
              <span className="absolute inset-x-0 bottom-0 h-1/2 bg-black/10" />
              <span className="relative">KD</span>
            </span>

            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold tracking-tight text-white">
                Catálogo Karate-Do
              </span>

              <span className="hidden text-[10px] font-medium tracking-[0.14em] text-white/42 uppercase sm:block">
                Dojo Naha Te · Uchiage Kai de Venezuela
              </span>
            </span>
          </Link>

          <nav aria-label="Navegación principal" className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2.5 text-sm font-medium text-white/62 transition-colors hover:bg-white/7 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/catalogo"
              className="hidden min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--ck-red)] px-5 text-sm font-semibold text-white shadow-lg shadow-red-950/20 transition-all hover:-translate-y-px hover:bg-[var(--ck-red-dark)] sm:inline-flex"
            >
              Ver catálogo
              <span
                aria-hidden="true"
                className="text-white/65 transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>

            <CartTrigger />

            <details className="relative lg:hidden">
              <summary
                className="flex size-11 cursor-pointer list-none items-center justify-center rounded-full border border-white/12 bg-white/6 text-white transition-colors hover:bg-white/10 [&::-webkit-details-marker]:hidden"
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

              <div className="absolute top-[calc(100%+10px)] right-0 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-white/10 bg-[#191919] p-2 shadow-2xl">
                <div className="border-b border-white/8 px-4 py-3">
                  <p className="text-[10px] font-semibold tracking-[0.18em] text-white/35 uppercase">
                    Navegación
                  </p>

                  <p className="mt-1 text-sm font-medium text-white">Explora el catálogo</p>
                </div>

                <div className="py-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-white/72 transition-colors hover:bg-white/7 hover:text-white"
                    >
                      {item.label}

                      <span aria-hidden="true" className="text-white/25">
                        →
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="border-t border-white/8 p-2">
                  <Link
                    href="/catalogo"
                    className="flex min-h-11 items-center justify-center rounded-2xl bg-white px-4 text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-200"
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
