import { existsSync } from "node:fs";
import path from "node:path";

import { catalog } from "../src/data/catalog";

const projectRoot = process.cwd();
const publicRoot = path.join(projectRoot, "public");

const productsWithImages = catalog.products.filter(
  (product) => product.active && product.images.length > 0,
);

const imageReferences = productsWithImages.flatMap((product) =>
  product.images.map((image) => ({
    product: product.name,
    slug: product.slug,
    src: image.src,
  })),
);

const errors: string[] = [];

for (const reference of imageReferences) {
  if (!reference.src.startsWith("/images/")) {
    errors.push(`Invalid local image path for "${reference.slug}": ${reference.src}`);
    continue;
  }

  const relativePath = reference.src.replace(/^\/+/, "");
  const absolutePath = path.join(publicRoot, relativePath);

  if (!existsSync(absolutePath)) {
    errors.push(`Missing image for "${reference.slug}": ${reference.src}`);
  }
}

if (errors.length > 0) {
  console.error("Catalog image validation failed.");

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log(`Catalog image validation passed. References checked: ${imageReferences.length}.`);
