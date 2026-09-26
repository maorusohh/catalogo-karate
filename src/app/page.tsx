import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Surface } from "@/components/ui/surface";

export const metadata: Metadata = {
  title: "Equipamiento de Karate-Do en Venezuela",
  description:
    "Catálogo de equipamiento de Karate-Do para entrenamiento y competición, con atención personalizada y envíos a nivel nacional.",
};

const categories = [
  {
    number: "01",
    title: "Karategis",
    description: "Uniformes para entrenamiento y competición.",
    href: "/categoria/karategis",
  },
  {
    number: "02",
    title: "Protecciones",
    description: "Guantines, empeineras, espinilleras y otros elementos.",
    href: "/categoria/protecciones",
  },
  {
    number: "03",
    title: "Cinturones",
    description: "Opciones para diferentes niveles y necesidades.",
    href: "/categoria/cinturones",
  },
  {
    number: "04",
    title: "Accesorios",
    description: "Complementos para entrenamiento y práctica.",
    href: "/categoria/accesorios",
  },
];

const featuredProducts = [
  {
    eyebrow: "Karategi",
    title: "Karategi Demo",
    description: "Referencia preparada para la ficha de producto.",
    href: "/producto/karategi-demo-001",
    code: "01",
  },
  {
    eyebrow: "Protecciones",
    title: "Guantines Demo",
    description: "Consulta variantes de color y talla.",
    href: "/producto/guantines-demo-001",
    code: "02",
  },
  {
    eyebrow: "Cinturones",
    title: "Cinturón Demo",
    description: "Referencia preparada para selección.",
    href: "/producto/cinturon-demo-001",
    code: "03",
  },
];

const purchaseSteps = [
  {
    number: "01",
    title: "Explora",
    description: "Encuentra productos por categoría, marca o búsqueda.",
  },
  {
    number: "02",
    title: "Selecciona",
    description: "Define las variantes y reúne todo en tu carrito.",
  },
  {
    number: "03",
    title: "Consulta",
    description: "Envíanos la selección por WhatsApp y confirma los detalles.",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="overflow-hidden border-b border-black/5">
        <Container>
          <div className="grid min-h-[calc(100vh-76px)] items-center gap-12 py-14 sm:py-18 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-20">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#b31322] uppercase">
                Karate-Do · Venezuela
              </p>

              <h1 className="mt-5 max-w-4xl text-5xl leading-[0.98] font-semibold tracking-[-0.04em] text-neutral-950 sm:text-6xl lg:text-7xl">
                Equipamiento para entrenar y competir con criterio.
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
                Explora un catálogo especializado de equipamiento para Karate-Do, revisa variantes y
                prepara tu consulta antes de comprar.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/catalogo"
                  className="inline-flex min-h-13 items-center justify-center rounded-full bg-[#b31322] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#8d0f1b]"
                >
                  Explorar catálogo
                </Link>

                <Link
                  href="/como-comprar"
                  className="inline-flex min-h-13 items-center justify-center rounded-full border border-black/10 bg-white px-6 text-sm font-semibold text-neutral-950 transition-colors hover:border-neutral-950"
                >
                  Cómo comprar
                </Link>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 border-t border-black/10 pt-5">
                <div className="pr-4">
                  <p className="text-sm font-semibold text-neutral-950">Catálogo</p>
                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    Varias categorías y marcas.
                  </p>
                </div>

                <div className="border-l border-black/10 px-4">
                  <p className="text-sm font-semibold text-neutral-950">Consulta</p>
                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    Sin pago en línea en esta versión.
                  </p>
                </div>

                <div className="border-l border-black/10 pl-4">
                  <p className="text-sm font-semibold text-neutral-950">Nacional</p>
                  <p className="mt-1 text-xs leading-5 text-neutral-500">Coordinación de envíos.</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <Surface variant="dark" className="overflow-hidden p-6 sm:p-8 lg:p-10">
                <div className="absolute -top-16 -right-16 size-48 rounded-full border border-white/10" />
                <div className="absolute -bottom-20 -left-20 size-64 rounded-full border border-white/10" />

                <div className="relative">
                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-neutral-400 uppercase">
                      Catálogo / Index
                    </p>

                    <span className="text-xs text-neutral-500">2026</span>
                  </div>

                  <div className="py-10">
                    <p className="text-xs font-semibold tracking-[0.18em] text-neutral-500 uppercase">
                      Equipamiento
                    </p>

                    <p className="mt-4 max-w-sm text-3xl leading-tight font-semibold tracking-tight text-white sm:text-4xl">
                      Lo que necesitas para la práctica empieza aquí.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {["Entrenamiento", "Kumite", "Competición", "Accesorios"].map((item, index) => (
                      <div
                        key={item}
                        className="flex items-center justify-between border-t border-white/10 py-3"
                      >
                        <span className="text-sm font-medium text-neutral-200">{item}</span>

                        <span className="text-xs text-neutral-500 tabular-nums">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 inline-flex min-h-10 items-center rounded-full bg-[#b31322] px-4 text-xs font-semibold tracking-[0.1em] text-white uppercase">
                    Selección especializada
                  </div>
                </div>
              </Surface>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Explorar"
            title="Empieza por lo que estás buscando."
            description="Una estructura sencilla para encontrar rápidamente el tipo de equipamiento que necesitas."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link key={category.number} href={category.href} className="group">
                <Surface
                  variant="default"
                  className="h-full p-6 transition-transform duration-200 group-hover:-translate-y-1 sm:p-7"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-semibold text-[#b31322]">{category.number}</span>

                    <span
                      aria-hidden="true"
                      className="text-neutral-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-neutral-950"
                    >
                      ↗
                    </span>
                  </div>

                  <h3 className="mt-16 text-xl font-semibold tracking-tight text-neutral-950">
                    {category.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-neutral-500">{category.description}</p>
                </Surface>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-black/5 bg-[#f3f1ec] py-20 sm:py-24">
        <Container>
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Selección"
              title="Algunas referencias del catálogo."
              description="La estructura está preparada para crecer cuando incorporemos productos y fotografías reales."
            />

            <Link
              href="/catalogo"
              className="shrink-0 text-sm font-semibold text-neutral-950 underline decoration-black/20 underline-offset-4 transition-colors hover:decoration-[#b31322]"
            >
              Ver todo el catálogo →
            </Link>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <Link key={product.code} href={product.href} className="group">
                <Surface className="overflow-hidden">
                  <div className="relative aspect-[4/3] bg-[#e9e6df]">
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_49%,rgba(23,23,23,0.05)_50%,transparent_51%)]" />

                    <div className="absolute top-5 left-5 flex min-h-8 items-center rounded-full bg-white/80 px-3 text-[10px] font-semibold tracking-[0.12em] text-neutral-600 uppercase backdrop-blur-sm">
                      {product.eyebrow}
                    </div>

                    <div className="absolute bottom-5 left-5 text-6xl font-semibold tracking-[-0.06em] text-neutral-950/10 sm:text-7xl">
                      {product.code}
                    </div>

                    <div className="absolute right-5 bottom-5 flex size-11 items-center justify-center rounded-full bg-neutral-950 text-white transition-transform duration-200 group-hover:-rotate-6">
                      ↗
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-lg font-semibold tracking-tight text-neutral-950">
                      {product.title}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-neutral-500">{product.description}</p>
                  </div>
                </Surface>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Cómo funciona"
            title="Una compra acompañada, no un proceso complicado."
            description="El sitio organiza tu búsqueda. La confirmación final se realiza contigo."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {purchaseSteps.map((step) => (
              <Surface key={step.number} variant="soft" className="p-6 sm:p-7">
                <p className="text-xs font-semibold text-[#b31322]">{step.number}</p>

                <h3 className="mt-8 text-xl font-semibold tracking-tight text-neutral-950">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-neutral-600">{step.description}</p>
              </Surface>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-20 sm:pb-24">
        <Container>
          <div className="overflow-hidden rounded-[2rem] bg-neutral-950 px-6 py-12 text-white sm:px-10 sm:py-14 lg:px-14">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase">
                  Tu próxima compra
                </p>

                <h2 className="mt-4 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                  Encuentra el equipamiento que necesitas y prepara tu consulta.
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-400 sm:text-base">
                  Revisa productos, compara variantes y reúne tu selección antes de escribirnos.
                </p>
              </div>

              <Link
                href="/catalogo"
                className="inline-flex min-h-13 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-200"
              >
                Ir al catálogo
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
