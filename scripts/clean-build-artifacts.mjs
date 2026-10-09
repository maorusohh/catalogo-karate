import { rm } from "node:fs/promises";
import path from "node:path";

const buildArtifacts = [".next", "out"];

for (const artifact of buildArtifacts) {
  await rm(path.join(process.cwd(), artifact), {
    recursive: true,
    force: true,
  });
}

console.log("Cleaned stale Next.js build artifacts: .next, out");
