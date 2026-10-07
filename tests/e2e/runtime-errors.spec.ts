import { expect, test } from "@playwright/test";

const routes = ["/", "/catalogo/", "/producto/best-sport-canilleras-karate-aprobadas-wkf-1128wkf/"];

test("las rutas principales no producen errores de runtime o hidratación", async ({ page }) => {
  const runtimeErrors: string[] = [];

  page.on("pageerror", (error) => {
    runtimeErrors.push(`pageerror: ${error.message}`);
  });

  page.on("console", (message) => {
    if (message.type() === "error") {
      runtimeErrors.push(`console.error: ${message.text()}`);
    }
  });

  for (const route of routes) {
    const response = await page.goto(route, {
      waitUntil: "domcontentloaded",
    });

    expect(response?.status(), `La ruta ${route} no respondió correctamente.`).toBe(200);
    await page.waitForTimeout(300);
  }

  expect(runtimeErrors, runtimeErrors.join("\n")).toEqual([]);
});
