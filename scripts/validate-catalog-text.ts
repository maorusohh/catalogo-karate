import { readFileSync } from "node:fs";

const filePath = "src/data/catalog-source.google.generated.ts";

const content = readFileSync(filePath, "utf8");

const forbiddenMarkers = ["Ã", "Â", "â", "ð", "�"];

const detected = forbiddenMarkers.filter((marker) => content.includes(marker));

if (detected.length > 0) {
  console.error(`Catalog text validation failed. Detected markers: ${detected.join(", ")}`);

  process.exit(1);
}

console.log("Catalog text validation passed.");
