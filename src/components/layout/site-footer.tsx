import Link from "next/link";

import { Container } from "@/components/ui/container";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/8 bg-[#111111] text-white">
      <Container>
        <div className="grid gap-10 py-14 sm:py-16 md:grid-cols-[1.5fr_1fr_1fr] lg:py-20">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-[var(--ck-red)] text-xs font-black tracking-[0.08em] text-white">
                KD
              </span>

              <div>
                <p className="text-base font-semibold tracking-tight">Catálogo Karate-Do</p>

                <p className="mt-0.5 text-[10px] font-semibold tracking-[0.16em] text-white/30 uppercase">
                  Equipamiento · Venezuela
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/56">
              Equipamiento para entrenamiento, kata y kumite, con atención personalizada y
              coordinación de envíos a nivel nacional.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-white/35 uppercase">
              Navegación
            </p>

            <div className="mt-5 grid gap-3">
              <Link
                href="/catalogo"
                className="text-sm text-white/64 transition-colors hover:text-white"
              >
                Catálogo
              </Link>

              <Link
                href="/marcas"
                className="text-sm text-white/64 transition-colors hover:text-white"
              >
                Explorar marcas
              </Link>

              <Link
                href="/como-comprar"
                className="text-sm text-white/64 transition-colors hover:text-white"
              >
                Cómo comprar
              </Link>

              <Link
                href="/entregas"
                className="text-sm text-white/64 transition-colors hover:text-white"
              >
                Envíos
              </Link>

              <Link
                href="/contacto"
                className="text-sm text-white/64 transition-colors hover:text-white"
              >
                Contacto
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-white/35 uppercase">
              Atención
            </p>

            <p className="mt-5 text-sm leading-7 text-white/56">
              Consulta disponibilidad, variantes, precios y condiciones antes de concretar tu
              compra.
            </p>

            <div className="mt-5 grid gap-3">
              <Link
                href="/preguntas-frecuentes"
                className="text-sm font-semibold text-white transition-colors hover:text-[#25d366]"
              >
                Preguntas frecuentes
                <span aria-hidden="true"> →</span>
              </Link>

              <Link
                href="/catalogo"
                className="text-sm font-semibold text-white transition-colors hover:text-[#25d366]"
              >
                Explorar catálogo
                <span aria-hidden="true"> →</span>
              </Link>
            </div>
          </div>
        </div>
      </Container>

      <div className="border-t border-white/8">
        <Container>
          <div className="flex flex-col gap-2 py-5 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Catálogo Karate-Do.</p>

            <p>Información comercial sujeta a confirmación.</p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
