import { expect, test } from "@playwright/test";

const staticRoutes = [
  "/",
  "/catalogo/",
  "/categoria/karategis/",
  "/categoria/protecciones/",
  "/categoria/espinilleras-empeineras/",
  "/categoria/cinturones/",
  "/categoria/guantines/",
  "/categoria/accesorios/",
  "/marcas/",
  "/como-comprar/",
  "/entregas/",
  "/contacto/",
  "/preguntas-frecuentes/",
];

for (const route of staticRoutes) {
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

test("productos reales del catálogo cargan correctamente y sin overflow", async ({ page }) => {
  const catalogResponse = await page.goto("/catalogo/", {
    waitUntil: "domcontentloaded",
  });

  expect(catalogResponse?.status()).toBe(200);

  const productRoutes = await page
    .locator('a[href^="/producto/"]')
    .evaluateAll((anchors) =>
      [
        ...new Set(
          anchors
            .map((anchor) => anchor.getAttribute("href"))
            .filter(
              (href): href is string =>
                typeof href === "string" &&
                href.startsWith("/producto/") &&
                href.length > "/producto/".length,
            ),
        ),
      ].slice(0, 3),
    );

  expect(
    productRoutes.length,
    "El catálogo debe exponer al menos tres enlaces a productos activos.",
  ).toBeGreaterThanOrEqual(3);

  for (const route of productRoutes) {
    const response = await page.goto(route, {
      waitUntil: "domcontentloaded",
    });

    expect(response?.status(), `El producto ${route} no respondió correctamente.`).toBe(200);

    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }));

    expect(
      dimensions.documentWidth,
      `El producto ${route} produce overflow horizontal.`,
    ).toBeLessThanOrEqual(dimensions.viewportWidth);
  }
});

test("el CTA Ver producto navega desde el catálogo a la ficha", async ({ page }) => {
  await page.goto("/catalogo/", {
    waitUntil: "domcontentloaded",
  });

  const productLink = page.getByRole("link", { name: /^Ver producto:/ }).first();
  const href = await productLink.getAttribute("href");

  expect(href).toBeTruthy();

  await productLink.click();
  await page.waitForURL("**/producto/**");

  const pathname = new URL(page.url()).pathname;

  expect([href, `${href}/`]).toContain(pathname);
});

test("el catálogo diferencia productos totales de resultados filtrados", async ({ page }) => {
  await page.goto("/catalogo/", {
    waitUntil: "domcontentloaded",
  });

  const resultCount = page.getByTestId("catalog-result-count");
  const searchbox = page.getByRole("searchbox", { name: "Buscar productos" });

  await expect(resultCount).toContainText(/\d+ Productos Totales/);

  await searchbox.click();
  await searchbox.pressSequentially("karategi");
  await expect(searchbox).toHaveValue("karategi");

  await expect(resultCount).toContainText(/\d+ Productos Encontrados/);
  await expect(resultCount).not.toContainText("Productos Totales");
});

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
