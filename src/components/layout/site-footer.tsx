import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 bg-neutral-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] lg:px-10">
        <div>
          <p className="text-lg font-semibold tracking-tight">Catálogo Karate-Do</p>

          <p className="mt-3 max-w-md text-sm leading-6 text-white/65">
            Equipamiento para entrenamiento y competición, con atención personalizada y envíos a
            nivel nacional.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-white/45 uppercase">
            Navegación
          </p>

          <div className="mt-4 grid gap-3">
            <Link
              href="/catalogo"
              className="text-sm text-white/75 transition-colors hover:text-white"
            >
              Catálogo
            </Link>

            <Link
              href="/como-comprar"
              className="text-sm text-white/75 transition-colors hover:text-white"
            >
              Cómo comprar
            </Link>

            <Link
              href="/entregas"
              className="text-sm text-white/75 transition-colors hover:text-white"
            >
              Entregas
            </Link>

            <Link
              href="/contacto"
              className="text-sm text-white/75 transition-colors hover:text-white"
            >
              Contacto
            </Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-white/45 uppercase">
            Atención
          </p>

          <p className="mt-4 text-sm leading-6 text-white/75">
            Consulta disponibilidad, variantes, precios y condiciones antes de realizar tu compra.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-5 text-xs text-white/45 sm:px-8 lg:px-10">
          © {new Date().getFullYear()} Catálogo Karate-Do. Información sujeta a confirmación.
        </div>
      </div>
    </footer>
  );
}
