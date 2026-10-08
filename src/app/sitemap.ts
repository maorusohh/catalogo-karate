import type { MetadataRoute } from "next";

import { catalogRepository } from "@/lib/catalog/static-repository";

const baseUrl = "https://catalogo-karate.pages.dev";

function url(pathname: string) {
  return `${baseUrl}${pathname}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    { url: url("/catalogo/"), changeFrequency: "daily", priority: 0.9 },
    { url: url("/marcas/"), changeFrequency: "weekly", priority: 0.8 },
    { url: url("/como-comprar/"), changeFrequency: "monthly", priority: 0.6 },
    { url: url("/entregas/"), changeFrequency: "monthly", priority: 0.6 },
    { url: url("/contacto/"), changeFrequency: "monthly", priority: 0.6 },
  ];

  const brandRoutes: MetadataRoute.Sitemap = catalogRepository.getBrands().map((brand) => ({
    url: url(`/marca/${brand.slug}/`),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = catalogRepository
    .getCategories()
    .map((category) => ({
      url: url(`/categoria/${category.slug}/`),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  const productRoutes: MetadataRoute.Sitemap = catalogRepository.getProducts().map((product) => ({
    url: url(`/producto/${product.slug}/`),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...brandRoutes, ...categoryRoutes, ...productRoutes];
}
