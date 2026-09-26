import { catalogSchema } from "@/lib/validation/catalog.schema";
import { validateCatalogIntegrity } from "@/lib/catalog/integrity";
import type { Catalog } from "@/types/catalog";

const rawCatalog: Catalog = {
  brands: [
    {
      id: "demo-brand-a",
      slug: "marca-demo-a",
      name: "Marca Demo A",
      description: "Marca de demostración para validar la estructura del catálogo.",
      active: true,
    },
    {
      id: "demo-brand-b",
      slug: "marca-demo-b",
      name: "Marca Demo B",
      description: "Segunda marca de demostración para probar el catálogo multimarca.",
      active: true,
    },
  ],

  categories: [
    {
      id: "karategis",
      slug: "karategis",
      name: "Karategis",
      description: "Karategis para entrenamiento y competición.",
      parentId: null,
      active: true,
    },
    {
      id: "protecciones",
      slug: "protecciones",
      name: "Protecciones",
      description: "Equipamiento de protección para la práctica del Karate-Do.",
      parentId: null,
      active: true,
    },
    {
      id: "guantines",
      slug: "guantines",
      name: "Guantines",
      description: "Guantines y protecciones para manos.",
      parentId: "protecciones",
      active: true,
    },
    {
      id: "empeineras-espinilleras",
      slug: "empeineras-espinilleras",
      name: "Empeineras y espinilleras",
      description: "Protección para pies y piernas.",
      parentId: "protecciones",
      active: true,
    },
    {
      id: "cinturones",
      slug: "cinturones",
      name: "Cinturones",
      description: "Cinturones para la práctica del Karate-Do.",
      parentId: null,
      active: true,
    },
    {
      id: "accesorios",
      slug: "accesorios",
      name: "Accesorios",
      description: "Accesorios relacionados con la práctica del Karate-Do.",
      parentId: null,
      active: true,
    },
  ],

  products: [
    {
      id: "demo-product-001",
      sku: "DEMO-KARATEGI-001",
      slug: "karategi-demo-001",
      name: "Karategi de demostración 001",
      brandId: "demo-brand-a",
      categoryId: "karategis",
      shortDescription: "Producto de prueba para validar el modelo de datos del catálogo.",
      description:
        "Producto de demostración. Será sustituido posteriormente por información comercial real.",
      features: [
        "Modelo de demostración",
        "Datos preparados para variantes",
        "Sin certificación comercial declarada",
      ],
      approval: "UNSPECIFIED",
      approvalNote:
        "La certificación se incorporará únicamente cuando exista información verificable.",
      variants: [
        {
          id: "demo-product-001-v1",
          label: "Talla de demostración",
          options: [
            {
              name: "Talla",
              value: "Demo",
            },
          ],
          available: true,
        },
      ],
      prices: [
        {
          amount: null,
          currency: null,
          basis: "CONSULT",
          label: "Consultar precio",
          note: "Precio pendiente de información comercial real.",
        },
      ],
      images: [],
      availability: "CONSULT",
      featured: true,
      active: true,
    },

    {
      id: "demo-product-002",
      sku: "DEMO-GUANTINES-001",
      slug: "guantines-demo-001",
      name: "Guantines de demostración 001",
      brandId: "demo-brand-b",
      categoryId: "guantines",
      shortDescription: "Producto de prueba para validar categorías y variantes.",
      description: "Producto de demostración. No representa una oferta comercial real.",
      features: [
        "Modelo de demostración",
        "Categoría de protección",
        "Variantes preparadas para el catálogo",
      ],
      approval: "UNSPECIFIED",
      variants: [
        {
          id: "demo-product-002-v1",
          label: "Rojo · S",
          options: [
            {
              name: "Color",
              value: "Rojo",
            },
            {
              name: "Talla",
              value: "S",
            },
          ],
          available: true,
        },
        {
          id: "demo-product-002-v2",
          label: "Rojo · M",
          options: [
            {
              name: "Color",
              value: "Rojo",
            },
            {
              name: "Talla",
              value: "M",
            },
          ],
          available: true,
        },
        {
          id: "demo-product-002-v3",
          label: "Azul · M",
          options: [
            {
              name: "Color",
              value: "Azul",
            },
            {
              name: "Talla",
              value: "M",
            },
          ],
          available: true,
        },
      ],
      prices: [
        {
          amount: null,
          currency: null,
          basis: "CONSULT",
          label: "Consultar precio",
        },
      ],
      images: [],
      availability: "CONSULT",
      featured: false,
      active: true,
    },

    {
      id: "demo-product-003",
      sku: "DEMO-CINTURON-001",
      slug: "cinturon-demo-001",
      name: "Cinturón de demostración 001",
      brandId: "demo-brand-a",
      categoryId: "cinturones",
      shortDescription: "Producto de prueba para validar filtros y categorías.",
      description: "Producto de demostración para la primera versión técnica del catálogo.",
      features: ["Modelo de demostración", "Estructura preparada para variantes"],
      approval: "UNSPECIFIED",
      variants: [
        {
          id: "demo-product-003-v1",
          label: "Demostración",
          options: [
            {
              name: "Presentación",
              value: "Demo",
            },
          ],
          available: true,
        },
      ],
      prices: [
        {
          amount: null,
          currency: null,
          basis: "CONSULT",
          label: "Consultar precio",
        },
      ],
      images: [],
      availability: "CONSULT",
      featured: false,
      active: true,
    },
  ],
};

export const catalog = catalogSchema.parse(rawCatalog);

validateCatalogIntegrity(catalog);
