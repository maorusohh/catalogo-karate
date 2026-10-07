import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const host = "127.0.0.1";
const port = 3000;
const root = path.resolve(process.cwd(), "out");

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

function isInsideRoot(candidate) {
  const relative = path.relative(root, candidate);

  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

async function resolveFile(requestPath) {
  const decodedPath = decodeURIComponent(requestPath);
  let candidate = path.resolve(root, `.${decodedPath}`);

  if (!isInsideRoot(candidate)) {
    return null;
  }

  try {
    const candidateStat = await stat(candidate);

    if (candidateStat.isDirectory()) {
      candidate = path.join(candidate, "index.html");
    }
  } catch {
    if (!path.extname(candidate)) {
      candidate = path.join(candidate, "index.html");
    }
  }

  if (!isInsideRoot(candidate)) {
    return null;
  }

  try {
    const fileStat = await stat(candidate);

    return fileStat.isFile() ? candidate : null;
  } catch {
    return null;
  }
}

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url ?? "/", `http://${host}:${port}`);
  const filePath = await resolveFile(requestUrl.pathname);

  if (!filePath) {
    response.writeHead(404, {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
    });
    response.end("Not found");
    return;
  }

  const contentType = contentTypes.get(path.extname(filePath).toLowerCase()) ?? "application/octet-stream";

  response.writeHead(200, {
    "Cache-Control": "no-store",
    "Content-Type": contentType,
  });

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  const stream = createReadStream(filePath);

  stream.on("error", (error) => {
    console.error(error);

    if (!response.headersSent) {
      response.writeHead(500, {
        "Content-Type": "text/plain; charset=utf-8",
      });
    }

    response.end("Internal server error");
  });

  stream.pipe(response);
});

server.listen(port, host, () => {
  console.log(`Serving static export from ${fileURLToPath(new URL("../out/", import.meta.url))}`);
  console.log(`http://${host}:${port}`);
});
