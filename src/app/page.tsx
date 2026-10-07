import fs from "node:fs";
import path from "node:path";

import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";

import { ProductCard } from "@/components/catalog/product-card";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Surface } from "@/components/ui/surface";
import { catalogRepository } from "@/lib/catalog/static-repository";
import { buildWhatsAppUrl } from "@/lib/whatsapp/url";

export const metadata: Metadata = {
  title: "Equipamiento de Karate-Do en Venezuela",
  description:
    "Catálogo de equipamiento de Karate-Do para entrenamiento, kata y kumite, con atención personalizada y coordinación de envíos a nivel nacional.",
};

const categoryHighlights = [
  {
    title: "Karategis",
    href: "/categoria/karategis",
    description: "Opciones para entrenamiento, Kata y Kumite, desde iniciación hasta competición.",
  },
  {
    title: "Protecciones",
    href: "/categoria/protecciones",
    description: "Guantines, empeineras, espinilleras, petos y otras protecciones para la práctica.",
  },
  {
    title: "Cinturones",
    href: "/categoria/cinturones",
    description: "Cinturones de grado y competición en distintas referencias y presentaciones.",
  },
  {
    title: "Accesorios",
    href: "/categoria/accesorios",
    description: "Bolsos y complementos para acompañar entrenamiento, competición y traslado.",
  },
];

const trustItems = [
  {
    number: "01",
    title: "Múltiples marcas",
    description: "Un catálogo preparado para reunir distintas marcas y categorías de equipamiento.",
  },
  {
    number: "02",
    title: "Atención personalizada",
    description:
      "La confirmación final se realiza contigo según producto, variante y disponibilidad.",
  },
  {
    number: "03",
    title: "Consulta sin pago",
    description:
      "Selecciona lo que te interesa y prepara tu consulta antes de concretar la compra.",
  },
  {
    number: "04",
    title: "Envíos",
    description: "Coordinación de envíos a nivel nacional según producto y ubicación.",
  },
];

const purchaseSteps = [
  {
    number: "01",
    title: "Explora",
    description: "Busca por producto, marca, categoría o aprobación.",
  },
  {
    number: "02",
    title: "Selecciona",
    description: "Elige tus productos y las opciones disponibles para preparar la consulta.",
  },
  {
    number: "03",
    title: "Consulta",
    description: "Envía tu selección por WhatsApp y confirma precio, disponibilidad y entrega.",
  },
];

const products = catalogRepository.getProducts();
const activeProducts = products.filter((product) => product.active);

const featuredProducts = activeProducts.filter((product) => product.featured);
const selectedProducts = (featuredProducts.length > 0 ? featuredProducts : activeProducts).slice(0, 4);

const brands = catalogRepository.getBrands();
const categories = catalogRepository.getCategories();

const brandNames = Object.fromEntries(brands.map((brand) => [brand.id, brand.name]));

const categoryNames = Object.fromEntries(
  categories.map((category) => [category.id, category.name]),
);

const homeWhatsAppUrl = buildWhatsAppUrl(
  "Hola, quiero consultar sobre el equipamiento de Karate-Do disponible en el catálogo.",
);

const heroImagePath = path.join(process.cwd(), "public", "images", "branding", "hero-karate.jpg");
const hasHeroImage = fs.existsSync(heroImagePath);
const heroImageSrc = hasHeroImage
  ? "/images/branding/hero-karate.jpg"
  : "https://images.pexels.com/photos/7045554/pexels-photo-7045554.jpeg?auto=compress&cs=tinysrgb&w=1600";

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0" fill="currentColor">
      <path d="M12 2.25a9.75 9.75 0 0 0-8.42 14.67L2.5 21.5l4.74-1.04A9.75 9.75 0 1 0 12 2.25Zm0 17.77a7.98 7.98 0 0 1-4.08-1.12l-.29-.17-2.81.62.63-2.74-.19-.3A7.97 7.97 0 1 1 12 20.02Zm4.35-5.97c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.18-.7-.62-1.17-1.38-1.31-1.62-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.79-.19-.46-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.11.16 1.53.1.47-.07 1.42-.58 1.62-1.15.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main>
      <section className="hero-dojo">
        <Container>
          <div className="grid items-center gap-8 py-10 sm:py-12 lg:grid-cols-[1.03fr_0.97fr] lg:gap-12 lg:py-14">
            <div className="max-w-3xl">
              <p className="eyebrow text-[#ef5a68]">Karate-Do — Venezuela</p>

              <h1 className="mt-5 max-w-4xl text-4xl leading-[1.01] font-bold tracking-[-0.025em] text-white sm:text-5xl lg:text-[3.65rem]">
                Equípate para entrenar. Prepárate para competir.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-white/64 sm:text-lg">
                Encuentra equipamiento para entrenamiento, Kata y Kumite, revisa tus opciones y
                prepara la consulta antes de comprar.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink
                  href="/catalogo"
                  size="lg"
                  className="group shadow-[0_12px_30px_rgb(179_19_34_/_0.25)]"
                >
                  Ver catálogo
                  <span
                    aria-hidden="true"
                    className="flex size-7 items-center justify-center rounded-full bg-white/12 text-white transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </ButtonLink>

                <ButtonLink
                  href="/como-comprar"
                  variant="secondary"
                  size="lg"
                  className="action-secondary-dark group bg-white/6 shadow-lg shadow-black/15 hover:bg-white/12"
                >
                  Cómo comprar
                  <span
                    aria-hidden="true"
                    className="text-white/45 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-white/75"
                  >
                    →
                  </span>
                </ButtonLink>
              </div>
            </div>

            <div className="relative min-h-[17rem] overflow-hidden rounded-[28px] border border-white/10 bg-[#1b1b1b] shadow-[0_24px_60px_rgb(0_0_0_/_0.30)] sm:min-h-[19rem] lg:min-h-[19rem]">
              <Image
                src={heroImageSrc}
                alt={hasHeroImage ? "Karatekas entrenando en un dojo" : "Clase de Karate-Do en un dojo"}
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 48vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.2)_42%,rgba(0,0,0,0.82)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.30)_0%,transparent_58%)]" />

              <div className="relative z-10 flex min-h-[inherit] flex-col justify-between p-6 sm:p-7">
                <span className="hero-stage-badge w-fit">Karate-Do · Equipamiento</span>

                <div className="max-w-md">
                  <p className="text-[11px] font-semibold tracking-[0.16em] text-white/56 uppercase">
                    Preparación y competencia
                  </p>
                  <p className="mt-3 text-2xl leading-[1.04] font-semibold tracking-[-0.02em] text-white sm:text-3xl">
                    Disciplina, precisión y equipamiento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="site-section">
        <Container>
          <SectionHeading
            eyebrow="Explorar"
            title="Empieza por el tipo de equipamiento que necesitas."
            description="Cuatro familias principales para llegar rápidamente a los productos que buscas."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryHighlights.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                aria-label={`Explorar ${category.title}`}
                className="group"
              >
                <Surface className="relative h-full overflow-hidden p-6 transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[var(--ck-shadow-md)] sm:p-7">
                  <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-[var(--ck-red)]/5 blur-2xl transition-transform duration-300 group-hover:scale-125" />

                  <div className="relative flex h-full flex-col">
                    <div className="flex justify-end">
                      <span
                        aria-hidden="true"
                        className="flex size-9 items-center justify-center rounded-full border border-black/8 text-neutral-400 transition-all duration-200 group-hover:border-[var(--ck-red)] group-hover:bg-[var(--ck-red)] group-hover:text-white"
                      >
                        ↗
                      </span>
                    </div>

                    <div className="mt-10">
                      <h2 className="text-xl font-semibold tracking-[-0.01em] text-neutral-950">
                        {category.title}
                      </h2>

                      <p className="mt-3 text-sm leading-6 text-neutral-500">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Surface>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-black/6 bg-[#ebe7de]">
        <Container>
          <div className="grid gap-px overflow-hidden bg-black/8 md:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item) => (
              <div key={item.number} className="bg-[#ebe7de] px-6 py-7 sm:px-7">
                <p className="text-[10px] font-semibold tracking-[0.14em] text-[var(--ck-red)]">
                  {item.number}
                </p>

                <h2 className="mt-4 text-base font-semibold tracking-[-0.01em] text-neutral-950">
                  {item.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-neutral-600">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="site-section">
        <Container>
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Selección"
              title="Algunas referencias del catálogo."
              description="Una muestra del catálogo actual para comenzar a explorar marcas, categorías y precios."
            />

            <ButtonLink
              href="/catalogo"
              variant="ghost"
              size="md"
              className="shrink-0 font-semibold"
            >
              Ver todo el catálogo
              <span aria-hidden="true">→</span>
            </ButtonLink>
          </div>

          {selectedProducts.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {selectedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  brandName={brandNames[product.brandId] ?? "Marca"}
                  categoryName={categoryNames[product.categoryId] ?? "Categoría"}
                />
              ))}
            </div>
          ) : (
            <Surface variant="soft" className="mt-10 p-8">
              <p className="text-sm leading-6 text-neutral-600">
                El catálogo está preparado. Los productos aparecerán aquí a medida que se incorporen
                al origen de datos.
              </p>
            </Surface>
          )}
        </Container>
      </section>

      <section className="site-section-tight bg-neutral-950 text-white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="eyebrow text-[#ef5a68]">Cómo funciona</p>

              <h2 className="mt-5 max-w-lg text-3xl leading-tight font-semibold tracking-[-0.02em] text-white sm:text-4xl">
                Una compra acompañada, sin complicar el proceso.
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-white/56 sm:text-base">
                La web organiza la búsqueda. La confirmación final se realiza contigo antes de
                concretar el pedido.
              </p>
            </div>

            <div className="grid gap-px overflow-hidden rounded-[24px] border border-white/8 bg-white/8 md:grid-cols-3">
              {purchaseSteps.map((step) => (
                <div key={step.number} className="bg-[#181818] p-6 sm:p-7">
                  <p className="text-xs font-semibold tracking-[0.12em] text-[#ef5a68]">
                    {step.number}
                  </p>

                  <h3 className="mt-8 text-lg font-semibold tracking-[-0.01em] text-white">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/48">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="site-section">
        <Container>
          <div className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#141414,#202020)] p-7 text-white shadow-[var(--ck-shadow-lg)] sm:p-10 lg:p-14">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-3xl">
                <p className="eyebrow text-[#ef5a68]">Tu próxima compra</p>

                <h2 className="mt-5 text-3xl leading-tight font-semibold tracking-[-0.02em] text-white sm:text-4xl lg:text-5xl">
                  Encuentra el equipamiento que necesitas y prepara tu consulta.
                </h2>

                <p className="mt-6 max-w-2xl text-sm leading-7 text-white/54 sm:text-base">
                  Revisa productos, compara opciones y reúne tu selección antes de escribirnos.
                </p>
              </div>

              {homeWhatsAppUrl ? (
                <a
                  href={homeWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-whatsapp w-full sm:w-auto"
                >
                  <WhatsAppIcon />
                  Consultar por WhatsApp
                </a>
              ) : (
                <ButtonLink href="/contacto" variant="secondary" size="lg">
                  Ir a contacto
                </ButtonLink>
              )}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
