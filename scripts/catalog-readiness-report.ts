import { existsSync } from "node:fs";
import path from "node:path";

import { catalog } from "../src/data/catalog";

const publicRoot = path.join(process.cwd(), "public");

const activeProducts = catalog.products.filter((product) => product.active);

const featuredProducts = activeProducts.filter((product) => product.featured);

const productsWithImages = activeProducts.filter((product) => product.images.length > 0);

const productsWithoutImages = activeProducts.filter((product) => product.images.length === 0);

const featuredWithoutImages = featuredProducts.filter((product) => product.images.length === 0);

const imageReferences = activeProducts.flatMap((product) =>
  product.images.map((image) => ({
    product: product.name,
    slug: product.slug,
    src: image.src,
  })),
);

const missingImageFiles = imageReferences.filter((reference) => {
  if (!reference.src.startsWith("/images/")) {
    return true;
  }

  const relativePath = reference.src.replace(/^\/+/, "");
  const absolutePath = path.join(publicRoot, relativePath);

  return !existsSync(absolutePath);
});

const totalVariants = activeProducts.reduce((total, product) => total + product.variants.length, 0);

const totalPrices = activeProducts.reduce((total, product) => total + product.prices.length, 0);

const activeBrands = catalog.brands.filter((brand) => brand.active);
const activeCategories = catalog.categories.filter((category) => category.active);

const percentage = (part: number, total: number) =>
  total === 0 ? 0 : Math.round((part / total) * 100);

console.log("");
console.log("============================================================");
console.log(" CATÁLOGO KARATE-DO | REPORTE DE PREPARACIÓN");
console.log("============================================================");
console.log("");

console.log(`Marcas activas:              ${activeBrands.length}`);
console.log(`Categorías activas:          ${activeCategories.length}`);
console.log(`Productos activos:           ${activeProducts.length}`);
console.log(`Productos destacados:        ${featuredProducts.length}`);
console.log(
  `Productos con imágenes:      ${productsWithImages.length} (${percentage(productsWithImages.length, activeProducts.length)}%)`,
);
console.log(`Productos sin imágenes:      ${productsWithoutImages.length}`);
console.log(`Destacados sin imágenes:     ${featuredWithoutImages.length}`);
console.log(`Referencias de imágenes:     ${imageReferences.length}`);
console.log(`Imágenes inexistentes:        ${missingImageFiles.length}`);
console.log(`Variantes totales:            ${totalVariants}`);
console.log(`Registros de precios:         ${totalPrices}`);

console.log("");
console.log("------------------------------------------------------------");
console.log(" PRODUCTOS SIN IMAGEN");
console.log("------------------------------------------------------------");

if (productsWithoutImages.length === 0) {
  console.log("Ninguno.");
} else {
  for (const product of productsWithoutImages) {
    console.log(`- ${product.name} | ${product.slug}${product.featured ? " | DESTACADO" : ""}`);
  }
}

console.log("");
console.log("------------------------------------------------------------");
console.log(" IMÁGENES INEXISTENTES");
console.log("------------------------------------------------------------");

if (missingImageFiles.length === 0) {
  console.log("Ninguna.");
} else {
  for (const reference of missingImageFiles) {
    console.log(`- ${reference.slug} | ${reference.src}`);
  }
}

console.log("");
console.log("------------------------------------------------------------");
console.log(" PRODUCTOS DESTACADOS");
console.log("------------------------------------------------------------");

if (featuredProducts.length === 0) {
  console.log("No hay productos destacados.");
} else {
  for (const product of featuredProducts) {
    console.log(
      `- ${product.name} | imágenes: ${product.images.length} | variantes: ${product.variants.length}`,
    );
  }
}

console.log("");
console.log("============================================================");

if (missingImageFiles.length > 0) {
  console.log("ESTADO: HAY REFERENCIAS DE IMAGEN QUE REVISAR.");
} else {
  console.log("ESTADO: REFERENCIAS DE IMAGEN COHERENTES.");
}

if (featuredWithoutImages.length > 0) {
  console.log("NOTA: existen productos destacados sin fotografía.");
}

console.log("============================================================");
console.log("");
