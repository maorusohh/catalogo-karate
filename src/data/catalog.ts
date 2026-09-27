import { catalogSourceFixture } from "@/data/catalog-source.fixture";
import { buildCatalogFromTables } from "@/lib/catalog/source/tabular";

export const catalog = buildCatalogFromTables(catalogSourceFixture);
