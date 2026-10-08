import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const PRODUCTS_DIR = path.resolve(process.cwd(), "public/images/catalogo/products");
const WARNING_BYTES = 300 * 1024;
const ERROR_BYTES = 1024 * 1024;

type ImageEntry = {
  name: string;
  bytes: number;
};

function formatKiB(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

async function main() {
  const names = await readdir(PRODUCTS_DIR);
  const images: ImageEntry[] = [];

  for (const name of names) {
    if (!/\.(avif|jpe?g|png|webp)$/i.test(name)) {
      continue;
    }

    const fileStat = await stat(path.join(PRODUCTS_DIR, name));
    images.push({ name, bytes: fileStat.size });
  }

  images.sort((a, b) => b.bytes - a.bytes);

  const warnings = images.filter((image) => image.bytes > WARNING_BYTES);
  const errors = images.filter((image) => image.bytes > ERROR_BYTES);

  console.log(`Catalog product images checked: ${images.length}`);
  console.log(`Warning threshold: ${formatKiB(WARNING_BYTES)}`);
  console.log(`Blocking threshold: ${formatKiB(ERROR_BYTES)}`);

  if (warnings.length > 0) {
    console.log("\nImages above the warning threshold:");

    for (const image of warnings) {
      const severity = image.bytes > ERROR_BYTES ? "ERROR" : "WARN";
      console.log(`- [${severity}] ${image.name}: ${formatKiB(image.bytes)}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `${errors.length} catalog image(s) exceed the ${formatKiB(ERROR_BYTES)} blocking threshold.`,
    );
  }

  console.log("\nCatalog image size audit: PASSED");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
