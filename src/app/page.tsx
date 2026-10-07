import fs from "node:fs";
import path from "node:path";

import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";

import { catalogRepository } from "@/lib/catalog/static-repository";
import { buildWhatsAppUrl } from "@/lib/whatsapp/url";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Surface } from "@/components/ui/surface";

export const metadata: Metadata = {
  title: "Equipamiento de Karate-Do en Venezuela",
  description:
    "Catálogo de equipamiento de Karate-Do para entrenamiento, kata y kumite, con atención personalizada y coordinación de envíos a nivel nacional.",
};

const categoryHighlights = [
  {
    number: "01",
    title: "Karategis",
    href: "/categoria/karategis",
    description: "Opciones para entrenamiento, kata y kumite, desde iniciación hasta competición.",
  },
  {
    number: "02",
    title: "Protecciones",
    href: "/categoria/protecciones",
    description:
      "Guantines, empeineras, espinilleras, petos y otras protecciones para la práctica.",
  },
  {
    number: "03",
    title: "Cinturones",
    href: "/categoria/cinturones",
    description: "Cinturones de grado y competición en distintas referencias y presentaciones.",
  },
  {
    number: "04",
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

const approvalLabels: Record<string, string> = {
  WKF: "WKF",
  NATIONAL: "FVKD",
  NON_APPROVED: "No aprobado",
  UNSPECIFIED: "Sin aprobación",
};

const products = catalogRepository.getProducts();

const selectedProducts = (
  products.filter((product) => product.featured).length > 0
    ? products.filter((product) => product.featured)
    : products
).slice(0, 4);

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

function getLocalImage(product: (typeof selectedProducts)[number]) {
  return product.images.find((item) => item.src.startsWith("/"));
}

function getProductArtLabel(product: (typeof selectedProducts)[number]) {
  const categoryName = categoryNames[product.categoryId]?.toLowerCase() ?? "";

  if (categoryName.includes("prote")) {
    return "Protección";
  }

  if (categoryName.includes("cintur")) {
    return "Cinturón";
  }

  if (categoryName.includes("karateg")) {
    return "Karategi";
  }

  return "Equipamiento";
}

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
          <div className="grid items-center gap-12 py-12 sm:py-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:py-16">
            <div className="max-w-3xl">
              <p className="eyebrow text-[#ef5a68]">Karate-Do · Venezuela</p>

              <h1 className="heading-display heading-display-on-dark mt-6 max-w-4xl">
                Equípate para entrenar. Prepárate para competir.
              </h1>

              <p className="text-lead text-lead-on-dark mt-9 max-w-2xl">
                Encuentra equipamiento para entrenamiento, kata y kumite, revisa variantes y prepara
                tu consulta antes de comprar.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
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

              <div className="mt-12 grid max-w-2xl gap-5 sm:grid-cols-3">
                <div className="hero-stat">
                  <p className="hero-stat-label">Catálogo</p>
                  <p className="hero-stat-copy">Productos, marcas y categorías especializadas.</p>
                </div>

                <div className="hero-stat">
                  <p className="hero-stat-label">Consulta</p>
                  <p className="hero-stat-copy">Selecciona y consulta sin pago en línea.</p>
                </div>

                <div className="hero-stat">
                  <p className="hero-stat-label">Envíos</p>
                  <p className="hero-stat-copy">Coordinación a nivel nacional.</p>
                </div>
              </div>
            </div>

            <div className="hero-stage">
              {hasHeroImage ? (
                <div className="hero-stage-media">
                  <Image
                    src="/images/branding/hero-karate.jpg"
                    alt="Karatekas entrenando en un dojo"
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="hero-stage-placeholder" />
              )}

              <div className="hero-stage-grid" />
              <div className="hero-stage-floor" />
              <div className="hero-stage-line" />

              <div className="relative z-10 flex h-full min-h-[inherit] flex-col justify-between p-6 sm:p-8 lg:p-10">
                <div className="flex items-center justify-between gap-4">
                  <span className="hero-stage-badge">Equipamiento especializado</span>

                  <span className="text-[10px] font-semibold tracking-[0.16em] text-white/28 uppercase">
                    2026 / INDEX
                  </span>
                </div>

                <div className="max-w-md py-16 sm:py-20">
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-white/36 uppercase">
                    Selección
                  </p>

                  <p className="mt-5 text-3xl leading-[1.02] font-semibold tracking-[-0.035em] text-white sm:text-5xl">
                    Disciplina, precisión y equipamiento.
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-4">
                    {["Karategis", "Protecciones", "Cinturones", "Accesorios"].map(
                      (item, index) => (
                        <div
                          key={item}
                          className="flex items-center gap-3 border-t border-white/10 pt-3"
                        >
                          <span className="text-[10px] font-semibold tracking-[0.12em] text-[#ef5a68] tabular-nums">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <span className="text-xs font-medium text-white/72 sm:text-sm">
                            {item}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="flex items-end justify-between gap-5">
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.18em] text-white/30 uppercase">
                      Karate-Do · Venezuela
                    </p>

                    <p className="mt-2 max-w-sm text-xs leading-5 text-white/52">
                      Equipamiento para entrenamiento, kata y kumite.
                    </p>
                  </div>

                  <span className="hidden text-xs font-semibold tracking-[0.2em] text-white/20 uppercase sm:block">
                    KD
                  </span>
                </div>
              </div>

              <div className="hero-wordmark">KARATE</div>
            </div>
          </div>
        </Container>
      </section>

      <section className="site-section">
        <Container>
          <SectionHeading
            eyebrow="Explorar"
            title="Empieza por el tipo de equipamiento que necesitas."
            description="Cuatro caminos sencillos para comenzar tu búsqueda y llegar rápidamente al catálogo."
          />

          <div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryHighlights.map((category) => (
              <Link
                key={category.number}
                href={category.href}
                aria-label={`Explorar ${category.title}`}
                className="group"
              >
                <Surface className="relative h-full overflow-hidden p-6 transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[var(--ck-shadow-md)] sm:p-7">
                  <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-[var(--ck-red)]/5 blur-2xl transition-transform duration-300 group-hover:scale-125" />

                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-semibold tracking-[0.12em] text-[var(--ck-red)]">
                        {category.number}
                      </span>

                      <span
                        aria-hidden="true"
                        className="flex size-9 items-center justify-center rounded-full border border-black/8 text-neutral-400 transition-all duration-200 group-hover:border-[var(--ck-red)] group-hover:bg-[var(--ck-red)] group-hover:text-white"
                      >
                        ↗
                      </span>
                    </div>

                    <div className="mt-16">
                      <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
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
              <div key={item.number} className="bg-[#ebe7de] px-6 py-8 sm:px-7">
                <p className="text-[10px] font-semibold tracking-[0.16em] text-[var(--ck-red)]">
                  {item.number}
                </p>

                <h2 className="mt-5 text-base font-semibold tracking-tight text-neutral-950">
                  {item.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-neutral-600">{item.description}</p>
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
              description="Estas tarjetas ya consumen el catálogo real. Cuando incorporemos las fotografías, ocuparán automáticamente esta superficie."
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
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {selectedProducts.map((product, index) => {
                const localImage = getLocalImage(product);
                const brandName = brandNames[product.brandId] ?? "Marca";
                const categoryName = categoryNames[product.categoryId] ?? "Equipamiento";
                const primaryPrice = product.prices[0];

                return (
                  <article
                    key={product.id}
                    className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-black/8 bg-white shadow-[var(--ck-shadow-sm)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--ck-shadow-md)]"
                  >
                    <Link href={`/producto/${product.slug}`} aria-label={`Ver ${product.name}`}>
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#e8e3da]">
                        {localImage ? (
                          <Image
                            src={localImage.src}
                            alt={localImage.alt}
                            fill
                            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                          />
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(179,19,34,0.10),transparent_38%),linear-gradient(135deg,#f3f0e9,#ddd7cc)]" />

                            <div className="absolute inset-6 rounded-[20px] border border-black/6" />

                            <div className="absolute top-5 left-5 rounded-full border border-black/8 bg-white/72 px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] text-neutral-600 uppercase backdrop-blur-sm">
                              {getProductArtLabel(product)}
                            </div>

                            <div className="absolute right-5 bottom-5 flex size-12 items-center justify-center rounded-2xl bg-neutral-950 text-xs font-black tracking-[0.08em] text-white shadow-lg">
                              {String(index + 1).padStart(2, "0")}
                            </div>

                            <div className="absolute inset-x-0 bottom-0 p-6">
                              <p className="text-[10px] font-semibold tracking-[0.18em] text-neutral-500 uppercase">
                                Fotografía preparada
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </Link>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="flex flex-wrap gap-2">
                        <span className="status-badge">{categoryName}</span>

                        <span className="status-badge status-badge-accent">
                          {approvalLabels[product.approval]}
                        </span>
                      </div>

                      <p className="mt-4 text-[10px] font-semibold tracking-[0.15em] text-neutral-400 uppercase">
                        {brandName}
                      </p>

                      <h2 className="mt-2 text-lg leading-tight font-semibold tracking-tight text-neutral-950">
                        <Link
                          href={`/producto/${product.slug}`}
                          className="transition-colors hover:text-[var(--ck-red)]"
                        >
                          {product.name}
                        </Link>
                      </h2>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-500">
                        {product.shortDescription}
                      </p>

                      <div className="mt-auto pt-6">
                        <div className="border-t border-black/7 pt-4">
                          <p className="text-sm font-semibold text-neutral-950">
                            {primaryPrice?.label ?? "Consultar precio"}
                          </p>

                          <p className="mt-1 text-xs text-neutral-400">
                            {product.availability === "AVAILABLE"
                              ? "Disponible"
                              : product.availability === "OUT_OF_STOCK"
                                ? "Agotado"
                                : product.availability === "COMING_SOON"
                                  ? "Próximamente"
                                  : "Consultar disponibilidad"}
                          </p>
                        </div>

                        <Link
                          href={`/producto/${product.slug}`}
                          className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:bg-[var(--ck-red)]"
                        >
                          Ver producto
                          <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
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

              <h2 className="mt-5 max-w-lg text-3xl leading-tight font-semibold tracking-[-0.035em] text-white sm:text-4xl">
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
                  <p className="text-xs font-semibold tracking-[0.14em] text-[#ef5a68]">
                    {step.number}
                  </p>

                  <h3 className="mt-8 text-lg font-semibold tracking-tight text-white">
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

                <h2 className="mt-5 text-3xl leading-tight font-semibold tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
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
