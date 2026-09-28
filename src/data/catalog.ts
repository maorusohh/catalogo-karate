import { catalogSourceGoogle } from "@/data/catalog-source.google.generated";
import { buildCatalogFromTables } from "@/lib/catalog/source/tabular";

export const catalog = buildCatalogFromTables(catalogSourceGoogle);
