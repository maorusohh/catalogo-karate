import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/catalogo/",
  "/marca/best-sport/",
  "/producto/best-sport-canilleras-karate-aprobadas-wkf-1128wkf/",
];

test("las rutas principales no producen errores de runtime o hidratación", async ({ page }) => {
  const runtimeErrors: string[] = [];
  const failedResources: string[] = [];

  page.on("pageerror", (error) => {
    runtimeErrors.push(`pageerror: ${error.message}`);
  });

  page.on("console", (message) => {
    if (message.type() !== "error") {
      return;
    }

    const text = message.text();

    // Los 404/5xx se registran con URL exacta mediante el evento response.
    if (text.startsWith("Failed to load resource:")) {
      return;
    }

    runtimeErrors.push(`console.error: ${text}`);
  });

  page.on("response", (response) => {
    if (response.status() < 400) {
      return;
    }

    const url = new URL(response.url());

    if (url.origin !== "http://127.0.0.1:3000") {
      return;
    }

    failedResources.push(
      `${response.status()} ${response.request().resourceType()} ${url.pathname}`,
    );
  });

  for (const route of routes) {
    const response = await page.goto(route, {
      waitUntil: "domcontentloaded",
    });

    expect(response?.status(), `La ruta ${route} no respondió correctamente.`).toBe(200);
    await page.waitForTimeout(300);
  }

  expect(runtimeErrors, runtimeErrors.join("\n")).toEqual([]);
  expect(failedResources, failedResources.join("\n")).toEqual([]);
});
