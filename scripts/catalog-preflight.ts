import { catalog } from "../src/data/catalog";

type Problem = {
  level: "ERROR" | "WARNING";
  area: string;
  message: string;
};

const problems: Problem[] = [];

function addError(area: string, message: string) {
  problems.push({
    level: "ERROR",
    area,
    message,
  });
}

function addWarning(area: string, message: string) {
  problems.push({
    level: "WARNING",
    area,
    message,
  });
}

function findDuplicates(values: string[]): string[] {
  const counts = new Map<string, number>();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts.entries()].filter(([, count]) => count > 1).map(([value]) => value);
}

const brandIds = catalog.brands.map((brand) => brand.id);
const categoryIds = catalog.categories.map((category) => category.id);
const productIds = catalog.products.map((product) => product.id);

const brandSlugs = catalog.brands.map((brand) => brand.slug);
const categorySlugs = catalog.categories.map((category) => category.slug);
const productSlugs = catalog.products.map((product) => product.slug);
const productSkus = catalog.products.map((product) => product.sku);

for (const id of findDuplicates(brandIds)) {
  addError("brands", `ID duplicado: ${id}`);
}

for (const id of findDuplicates(categoryIds)) {
  addError("categories", `ID duplicado: ${id}`);
}

for (const id of findDuplicates(productIds)) {
  addError("products", `ID duplicado: ${id}`);
}

for (const slug of findDuplicates(brandSlugs)) {
  addError("brands", `Slug duplicado: ${slug}`);
}

for (const slug of findDuplicates(categorySlugs)) {
  addError("categories", `Slug duplicado: ${slug}`);
}

for (const slug of findDuplicates(productSlugs)) {
  addError("products", `Slug duplicado: ${slug}`);
}

for (const sku of findDuplicates(productSkus)) {
  addError("products", `SKU duplicado: ${sku}`);
}

const brandById = new Map(catalog.brands.map((brand) => [brand.id, brand]));

const categoryById = new Map(catalog.categories.map((category) => [category.id, category]));

const productById = new Map(catalog.products.map((product) => [product.id, product]));

for (const category of catalog.categories) {
  if (category.parentId === null) {
    continue;
  }

  if (!categoryById.has(category.parentId)) {
    addError(
      "categories",
      `La categoría "${category.id}" apunta a parent_id inexistente: ${category.parentId}`,
    );
  }

  if (category.parentId === category.id) {
    addError("categories", `La categoría "${category.id}" no puede ser su propio parent_id.`);
  }
}

for (const product of catalog.products) {
  const brand = brandById.get(product.brandId);
  const category = categoryById.get(product.categoryId);

  if (!brand) {
    addError(
      "products",
      `El producto "${product.slug}" referencia brand_id inexistente: ${product.brandId}`,
    );
  }

  if (!category) {
    addError(
      "products",
      `El producto "${product.slug}" referencia category_id inexistente: ${product.categoryId}`,
    );
  }

  if (product.active && brand && !brand.active) {
    addError(
      "products",
      `El producto activo "${product.slug}" pertenece a una marca inactiva: ${product.brandId}`,
    );
  }

  if (product.active && category && !category.active) {
    addError(
      "products",
      `El producto activo "${product.slug}" pertenece a una categoría inactiva: ${product.categoryId}`,
    );
  }

  if (product.active && product.name.trim().length === 0) {
    addError("products", `Producto activo sin nombre: ${product.id}`);
  }

  if (product.active && product.slug.trim().length === 0) {
    addError("products", `Producto activo sin slug: ${product.id}`);
  }

  if (product.active && product.sku.trim().length === 0) {
    addWarning("products", `Producto activo sin SKU: ${product.slug}`);
  }

  if (product.active && product.shortDescription.trim().length === 0) {
    addWarning("products", `Producto activo sin short_description: ${product.slug}`);
  }

  if (product.active && product.description.trim().length === 0) {
    addWarning("products", `Producto activo sin description: ${product.slug}`);
  }

  if (product.active && product.features.length === 0) {
    addWarning("features", `Producto activo sin características: ${product.slug}`);
  }

  if (product.active && product.images.length === 0) {
    addWarning("images", `Producto activo sin imágenes: ${product.slug}`);
  }

  if (product.active && product.prices.length === 0) {
    addWarning("prices", `Producto activo sin precios: ${product.slug}`);
  }
}

const variantIds: string[] = [];
const variantMap = new Map<
  string,
  {
    productId: string;
  }
>();

for (const product of catalog.products) {
  for (const variant of product.variants) {
    if (variantIds.includes(variant.id)) {
      addError("variants", `ID de variante duplicado: ${variant.id}`);
    }

    variantIds.push(variant.id);
    variantMap.set(variant.id, {
      productId: product.id,
    });

    if (!variant.label.trim()) {
      addWarning("variants", `Variante sin label: ${variant.id}`);
    }

    if (variant.options.length === 0) {
      addWarning("variant_options", `Variante sin opciones: ${variant.id}`);
    }

    const optionKeys = variant.options.map((option) => `${option.name}=${option.value}`);

    for (const duplicate of findDuplicates(optionKeys)) {
      addError(
        "variant_options",
        `Opción duplicada dentro de la variante "${variant.id}": ${duplicate}`,
      );
    }
  }
}

const optionCounts = new Map<string, number>();

for (const product of catalog.products) {
  for (const variant of product.variants) {
    for (const option of variant.options) {
      const key = `${variant.id}|${option.name}|${option.value}`;
      optionCounts.set(key, (optionCounts.get(key) ?? 0) + 1);
    }
  }
}

for (const [key, count] of optionCounts.entries()) {
  if (count > 1) {
    addError("variant_options", `Combinación de opción duplicada: ${key}`);
  }
}

for (const product of catalog.products) {
  for (const price of product.prices) {
    if (price.basis === "CONSULT") {
      if (price.amount !== null || price.currency !== null) {
        addError("prices", `Precio CONSULT con amount/currency definidos en "${product.slug}".`);
      }

      continue;
    }

    if (price.amount === null) {
      addError("prices", `Precio sin amount para "${product.slug}" con basis ${price.basis}.`);
    }

    if (price.currency === null) {
      addError("prices", `Precio sin currency para "${product.slug}" con basis ${price.basis}.`);
    }

    if (price.amount !== null && price.amount < 0) {
      addError("prices", `Precio negativo para "${product.slug}".`);
    }

    if (price.basis !== "USDT" && price.currency !== null && price.currency !== "USD") {
      addError("prices", `Currency incompatible con basis "${price.basis}" en "${product.slug}".`);
    }

    if (price.basis === "USDT" && price.currency !== null && price.currency !== "USDT") {
      addError("prices", `USDT debe usar currency USDT en "${product.slug}".`);
    }
  }
}

for (const product of catalog.products) {
  for (const image of product.images) {
    if (!image.src.startsWith("/images/")) {
      addError("images", `Ruta de imagen no local para "${product.slug}": ${image.src}`);
    }

    if (!image.alt.trim()) {
      addWarning("images", `Imagen sin alt descriptivo en "${product.slug}": ${image.src}`);
    }
  }
}

const referencedProducts = new Set<string>();

for (const product of catalog.products) {
  referencedProducts.add(product.id);
}

for (const [variantId, variant] of variantMap.entries()) {
  if (!productById.has(variant.productId)) {
    addError(
      "variants",
      `La variante "${variantId}" apunta a un producto inexistente: ${variant.productId}`,
    );
  }
}

console.log("");
console.log("============================================================");
console.log(" CATÁLOGO KARATE-DO | PREFLIGHT");
console.log("============================================================");
console.log("");

console.log(`Brands:             ${catalog.brands.length}`);
console.log(`Categories:         ${catalog.categories.length}`);
console.log(`Products:           ${catalog.products.length}`);
console.log(`Active products:    ${catalog.products.filter((product) => product.active).length}`);
console.log(
  `Variants:           ${catalog.products.reduce((sum, product) => sum + product.variants.length, 0)}`,
);
console.log(
  `Images:             ${catalog.products.reduce((sum, product) => sum + product.images.length, 0)}`,
);
console.log(
  `Prices:             ${catalog.products.reduce((sum, product) => sum + product.prices.length, 0)}`,
);

console.log("");
console.log(
  `Errors:             ${problems.filter((problem) => problem.level === "ERROR").length}`,
);
console.log(
  `Warnings:           ${problems.filter((problem) => problem.level === "WARNING").length}`,
);

if (problems.length > 0) {
  console.log("");
  console.log("------------------------------------------------------------");
  console.log(" RESULTADOS");
  console.log("------------------------------------------------------------");

  for (const problem of problems) {
    console.log(`[${problem.level}] [${problem.area}] ${problem.message}`);
  }
}

console.log("");
console.log("============================================================");

if (problems.some((problem) => problem.level === "ERROR")) {
  console.log("PREFLIGHT: FAILED");
  console.log("============================================================");
  console.log("");

  process.exit(1);
}

console.log("PREFLIGHT: PASSED");
console.log("============================================================");
console.log("");
