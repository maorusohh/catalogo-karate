const fs = require("node:fs");
const path = require("node:path");

/** @type {import("next").NextAdapter} */
const adapter = {
  name: "fix-next-16-static-export-rsc-paths",

  async onBuildComplete({ outputs }) {
    for (const file of outputs.staticFiles) {
      const targetPath = getFlatRscPath(file.filePath);

      if (!targetPath) {
        continue;
      }

      await fs.promises.rename(file.filePath, targetPath);
    }
  },
};

function getFlatRscPath(filePath) {
  const components = filePath.split(path.sep);
  const nextSegmentIndex = components.findIndex((component) => component.startsWith("__next."));

  if (nextSegmentIndex < 0 || nextSegmentIndex === components.length - 1) {
    return null;
  }

  const targetComponents = components.slice(0, nextSegmentIndex);
  targetComponents.push(components.slice(nextSegmentIndex).join("."));

  return targetComponents.join(path.sep);
}

module.exports = adapter;
