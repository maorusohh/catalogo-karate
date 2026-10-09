import { approvalPresentation } from "@/lib/catalog/approval";
import { getCategoryTreeIds } from "@/lib/catalog/scoped";
import type { ApprovalLevel, Category, Product } from "@/types/catalog";

export type CatalogSort =
  | "none"
  | "featured"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc";

export type CatalogFilters = {
  search: string;
  brandId: string;
  categoryId: string;
  approval: ApprovalLevel | "ALL";
};

type CatalogReferenceMap = Record<string, string>;

type SearchAliasGroup = {
  minPrefixLength: number;
  terms: readonly string[];
};

const searchAliasGroups: readonly SearchAliasGroup[] = [
  {
    minPrefixLength: 7,
    terms: [
      "karategi",
      "karategis",
      "karategui",
      "karateguis",
      "kimono",
      "kimonos",
      "uniforme",
      "uniformes",
    ],
  },
  {
    minPrefixLength: 5,
    terms: ["guantin", "guantines", "guante", "guantes"],
  },
  {
    minPrefixLength: 6,
    terms: ["espinillera", "espinilleras", "canillera", "canilleras"],
  },
  {
    minPrefixLength: 6,
    terms: ["empeinera", "empeineras", "empeine", "empeines"],
  },
  {
    minPrefixLength: 4,
    terms: ["peto", "petos", "pechera", "pecheras"],
  },
  {
    minPrefixLength: 5,
    terms: ["casco", "cascos", "cabezal", "cabezales"],
  },
  {
    minPrefixLength: 5,
    terms: ["cinturon", "cinturones", "cinto", "cintos", "obi"],
  },
  {
    minPrefixLength: 5,
    terms: ["bolso", "bolsos", "maleta", "maletas", "mochila", "mochilas"],
  },
];

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getSearchCandidates(token: string): readonly string[] {
  const aliasGroup = searchAliasGroups.find(
    ({ minPrefixLength, terms }) =>
      terms.includes(token) ||
      (token.length >= minPrefixLength && terms.some((term) => term.startsWith(token))),
  );

  return aliasGroup?.terms ?? [token];
}

function matchesSearch(searchableText: string, normalizedSearch: string): boolean {
  const tokens = normalizedSearch.split(/\s+/).filter(Boolean);

  return tokens.every((token) =>
    getSearchCandidates(token).some((candidate) => searchableText.includes(candidate)),
  );
}

export function filterProducts(
  products: Product[],
  filters: CatalogFilters,
  brandNames: CatalogReferenceMap,
  categoryNames: CatalogReferenceMap,
  categories: Category[],
): Product[] {
  const normalizedSearch = normalize(filters.search);
  const selectedCategoryIds =
    filters.categoryId === "ALL"
      ? null
      : new Set(
          getCategoryTreeIds(
            filters.categoryId,
            categories.filter((category) => category.active),
          ),
        );

  return products.filter((product) => {
    if (!product.active) {
      return false;
    }

    if (filters.brandId !== "ALL" && product.brandId !== filters.brandId) {
      return false;
    }

    if (selectedCategoryIds && !selectedCategoryIds.has(product.categoryId)) {
      return false;
    }

    if (filters.approval !== "ALL" && product.approval !== filters.approval) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    const approval = approvalPresentation[product.approval];
    const variantText = product.variants.flatMap((variant) => [
      variant.label,
      ...variant.options.flatMap((option) => [option.name, option.value]),
    ]);
    const priceText = product.prices.flatMap((price) => [price.label, price.note ?? ""]);

    const searchableText = normalize(
      [
        product.name,
        product.sku,
        product.shortDescription,
        product.description,
        ...product.features,
        ...variantText,
        ...priceText,
        brandNames[product.brandId] ?? "",
        categoryNames[product.categoryId] ?? "",
        approval.shortLabel,
        approval.cardLabel,
        approval.badgeLabel,
        approval.detail ?? "",
      ].join(" "),
    );

    return matchesSearch(searchableText, normalizedSearch);
  });
}

export function getComparablePrice(product: Product): number | null {
  const fixedPrice = product.prices.find((price) => price.amount !== null);

  return fixedPrice?.amount ?? null;
}

export function sortProducts(products: Product[], sort: CatalogSort): Product[] {
  const sorted = [...products];

  switch (sort) {
    case "none":
      return sorted;

    case "name-asc":
      return sorted.sort((a, b) =>
        a.name.localeCompare(b.name, "es", {
          sensitivity: "base",
        }),
      );

    case "name-desc":
      return sorted.sort((a, b) =>
        b.name.localeCompare(a.name, "es", {
          sensitivity: "base",
        }),
      );

    case "price-asc":
      return sorted.sort((a, b) => {
        const priceA = getComparablePrice(a);
        const priceB = getComparablePrice(b);

        if (priceA === null && priceB === null) {
          return a.name.localeCompare(b.name, "es");
        }

        if (priceA === null) {
          return 1;
        }

        if (priceB === null) {
          return -1;
        }

        return priceA - priceB;
      });

    case "price-desc":
      return sorted.sort((a, b) => {
        const priceA = getComparablePrice(a);
        const priceB = getComparablePrice(b);

        if (priceA === null && priceB === null) {
          return a.name.localeCompare(b.name, "es");
        }

        if (priceA === null) {
          return 1;
        }

        if (priceB === null) {
          return -1;
        }

        return priceB - priceA;
      });

    case "featured":
    default:
      return sorted.sort((a, b) => {
        if (a.featured !== b.featured) {
          return Number(b.featured) - Number(a.featured);
        }

        return a.name.localeCompare(b.name, "es");
      });
  }
}
