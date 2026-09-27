export type SourceCell = string | number | boolean | null;

export type SourceRow = readonly SourceCell[];

export type SourceTable = readonly SourceRow[];

export interface CatalogSourceTables {
  meta: SourceTable;
  brands: SourceTable;
  categories: SourceTable;
  products: SourceTable;
  variants: SourceTable;
  variant_options: SourceTable;
  prices: SourceTable;
  images: SourceTable;
  features: SourceTable;
}
