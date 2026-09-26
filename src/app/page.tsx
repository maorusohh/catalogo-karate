import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-black/10">
        <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_right,rgba(179,19,34,0.12),transparent_35%)]" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-10 lg:py-28">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-[#b31322] uppercase">
              Karate-Do · Venezuela
            </p>

            <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-6xl lg:text-7xl">
              Equipamiento para entrenar y competir con criterio.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
              Explora productos, marcas, variantes y condiciones de compra en un catálogo pensado
              para practicantes, atletas y representantes.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/catalogo"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Explorar catálogo
              </Link>

              <Link
                href="/como-comprar"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-300 bg-white px-6 text-sm font-semibold text-neutral-950 transition-colors hover:border-neutral-950"
              >
                Cómo comprar
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/10 bg-neutral-950 p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.14)] sm:p-8">
            <p className="text-xs font-semibold tracking-[0.2em] text-white/45 uppercase">
              Compra acompañada
            </p>

            <div className="mt-8 space-y-6">
              <div className="border-b border-white/10 pb-6">
                <p className="text-lg font-semibold">1. Elige</p>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Encuentra el producto, marca y variante que necesitas.
                </p>
              </div>

              <div className="border-b border-white/10 pb-6">
                <p className="text-lg font-semibold">2. Consulta</p>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Envía tu selección y confirma precio y disponibilidad.
                </p>
              </div>

              <div>
                <p className="text-lg font-semibold">3. Coordina</p>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Define pago, preparación y envío de tu pedido.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.18em] text-neutral-500 uppercase">
            Pensado para Karate-Do
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
            Una forma más clara de encontrar tu equipamiento.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Multimarca",
              text: "Diferentes marcas y líneas de productos reunidas en un solo lugar.",
            },
            {
              title: "Variantes claras",
              text: "Tallas, colores, modelos y presentaciones organizados por producto.",
            },
            {
              title: "Atención personalizada",
              text: "La consulta final se realiza directamente para confirmar las condiciones.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-3xl border border-black/10 bg-white p-7">
              <h3 className="text-lg font-semibold text-neutral-950">{item.title}</h3>

              <p className="mt-3 text-sm leading-6 text-neutral-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
