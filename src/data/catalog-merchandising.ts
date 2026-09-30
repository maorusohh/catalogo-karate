import type { Category } from "@/types/catalog";

export type MerchandisingGroupSlug = "entrenamiento" | "kumite" | "kata" | "accesorios";

export interface MerchandisingGroup {
  slug: MerchandisingGroupSlug;
  name: string;
  description: string;
  categorySlugs: string[];
}

/**
 * Las agrupaciones comerciales representan cómo queremos
 * presentar el catálogo al usuario.
 *
 * No sustituyen las categorías técnicas.
 *
 * Una categoría técnica puede aparecer en más de una
 * agrupación comercial cuando corresponda.
 */
export const merchandisingGroups: MerchandisingGroup[] = [
  {
    slug: "entrenamiento",
    name: "Entrenamiento",
    description: "Equipamiento para entrenar, practicar y preparar tu progresión en el dojo.",
    categorySlugs: [
      "entrenamiento",
      "karategis-entrenamiento",
      "cinturones-entrenamiento",

      // Compatibilidad temporal con el catálogo demo.
      "karategis",
      "cinturones",
    ],
  },
  {
    slug: "kumite",
    name: "Kumite",
    description: "Karate-gi y equipamiento de protección orientados al trabajo de combate.",
    categorySlugs: [
      "kumite",
      "karategis-kumite",
      "guantines",
      "espinilleras-empeineras",
      "petos-corporales",
      "protectores-inguinales",
      "cinturones-kumite",
      "cinturones-competicion",
      "protecciones",
      "empeineras-espinilleras",
      "cascos-deportivos",
    ],
  },
  {
    slug: "kata",
    name: "Kata",
    description: "Equipamiento orientado a la práctica técnica y preparación de kata.",
    categorySlugs: [
      "kata",
      "karategis-kata",
      "cinturones-kata",
      "cinturones-competicion",

      // Compatibilidad temporal con el catálogo demo.
      "karategis",
      "cinturones",
    ],
  },
  {
    slug: "accesorios",
    name: "Accesorios",
    description: "Complementos para entrenamiento, competición, viajes y uso diario.",
    categorySlugs: [
      "accesorios",
      "bucales",
      "cascos-deportivos",
      "bolsos",
      "camisas",
      "almohadillas-viaje",
      "otros-accesorios",
    ],
  },
];

export function getMerchandisingGroup(
  slug: MerchandisingGroupSlug,
): MerchandisingGroup | undefined {
  return merchandisingGroups.find((group) => group.slug === slug);
}

export function getMerchandisingGroupCategorySlugs(slug: MerchandisingGroupSlug): string[] {
  return getMerchandisingGroup(slug)?.categorySlugs ?? [];
}

export function categoryBelongsToMerchandisingGroup(
  category: Category,
  group: MerchandisingGroup,
): boolean {
  return group.categorySlugs.includes(category.slug);
}
