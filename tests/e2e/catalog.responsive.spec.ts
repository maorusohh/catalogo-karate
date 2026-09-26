import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/catalogo/",
  "/categoria/karategis/",
  "/categoria/protecciones/",
  "/categoria/empeineras-espinilleras/",
  "/categoria/cinturones/",
  "/categoria/guantines/",
  "/categoria/accesorios/",
  "/marca/marca-demo-a/",
  "/marca/marca-demo-b/",
  "/producto/karategi-demo-001/",
  "/producto/guantines-demo-001/",
  "/producto/cinturon-demo-001/",
  "/como-comprar/",
  "/entregas/",
  "/contacto/",
];

for (const route of routes) {
  test(`${route} carga correctamente`, async ({ page }) => {
    const response = await page.goto(route, {
      waitUntil: "domcontentloaded",
    });

    expect(response?.status()).toBe(200);
  });

  test(`${route} no produce overflow horizontal`, async ({ page }) => {
    await page.goto(route, {
      waitUntil: "domcontentloaded",
    });

    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }));

    expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
  });
}

test("la navegación principal mantiene enlaces internos válidos", async ({ page }) => {
  await page.goto("/", {
    waitUntil: "domcontentloaded",
  });

  const links = await page
    .locator("a[href]")
    .evaluateAll((anchors) =>
      anchors
        .map((anchor) => anchor.getAttribute("href"))
        .filter(
          (href): href is string =>
            typeof href === "string" && href.startsWith("/") && !href.startsWith("//"),
        ),
    );

  expect(links.length).toBeGreaterThan(0);

  for (const href of [...new Set(links)]) {
    const response = await page.goto(href, {
      waitUntil: "domcontentloaded",
    });

    expect(response?.status(), `La ruta ${href} no respondió correctamente.`).toBe(200);
  }
});
