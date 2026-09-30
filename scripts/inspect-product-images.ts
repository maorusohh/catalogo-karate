import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const materialsRoot = path.resolve(
  root,
  "..",
  "catalogo-karate-materiales",
  "02-productos",
  "originales",
);

const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

console.log("");
console.log("============================================================");
console.log(" CATÁLOGO KARATE-DO | INSPECCIÓN DE IMÁGENES");
console.log("============================================================");
console.log("");

console.log("Directorio:");
console.log(materialsRoot);
console.log("");

if (!fs.existsSync(materialsRoot)) {
  console.error("[ERROR] No existe el directorio de imágenes originales.");
  process.exit(1);
}

const entries = fs
  .readdirSync(materialsRoot, {
    withFileTypes: true,
  })
  .filter((entry) => entry.isFile());

const images = entries.filter((entry) =>
  supportedExtensions.has(path.extname(entry.name).toLowerCase()),
);

const unsupported = entries.filter(
  (entry) => !supportedExtensions.has(path.extname(entry.name).toLowerCase()),
);

console.log(`Archivos encontrados: ${entries.length}`);
console.log(`Imágenes reconocidas: ${images.length}`);
console.log(`Otros archivos:       ${unsupported.length}`);
console.log("");

if (images.length === 0) {
  console.log("[INFO] Todavía no hay fotografías originales.");
} else {
  console.log("IMÁGENES:");
  console.log("");

  images
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    )
    .forEach((image, index) => {
      const fullPath = path.join(materialsRoot, image.name);

      const sizeBytes = fs.statSync(fullPath).size;
      const sizeMB = (sizeBytes / 1024 / 1024).toFixed(2);

      console.log(`${String(index + 1).padStart(3, "0")} | ${image.name} | ${sizeMB} MB`);
    });
}

if (unsupported.length > 0) {
  console.log("");
  console.log("ARCHIVOS NO RECONOCIDOS:");
  console.log("");

  unsupported.forEach((file) => {
    console.log(`- ${file.name}`);
  });
}

console.log("");
console.log("============================================================");
console.log(" INSPECCIÓN COMPLETADA");
console.log("============================================================");
console.log("");
