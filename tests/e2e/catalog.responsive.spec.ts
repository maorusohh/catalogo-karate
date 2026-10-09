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

test("el catálogo inicia sin orden adicional y equipara karategi con karategui", async ({
  page,
}) => {
  await page.goto("/catalogo/", {
    waitUntil: "domcontentloaded",
  });

  const sort = page.getByLabel("Ordenar por");
  const searchbox = page.getByRole("searchbox", { name: "Buscar productos" });
  const resultCount = page.getByTestId("catalog-result-count");
  const productCards = page.locator("article");

  await expect(sort).toHaveValue("none");

  await searchbox.fill("karategi");
  await expect(resultCount).toContainText(/\d+ Productos Encontrados/);
  const withoutUCount = await productCards.count();

  await searchbox.fill("karategui");
  await expect(resultCount).toContainText(/\d+ Productos Encontrados/);
  await expect(productCards).toHaveCount(withoutUCount);
});

test("el buscador muestra un autosuggest breve con enlaces a productos", async ({ page }) => {
  await page.goto("/catalogo/", {
    waitUntil: "domcontentloaded",
  });

  const searchbox = page.getByRole("searchbox", { name: "Buscar productos" });
  await searchbox.fill("karategui");

  const suggestions = page.getByTestId("catalog-search-suggestions");
  await expect(suggestions).toBeVisible();

  const productLinks = suggestions.locator('a[href^="/producto/"]');
  const suggestionCount = await productLinks.count();

  expect(suggestionCount).toBeGreaterThan(0);
  expect(suggestionCount).toBeLessThanOrEqual(5);
  await expect(productLinks.first()).toHaveAttribute("href", /^\/producto\//);
});

test("seleccionar una marca aplica el filtro en el primer clic", async ({ page }) => {
  await page.goto("/catalogo/", {
    waitUntil: "domcontentloaded",
  });

  const compactFilters = page.locator("summary:visible").filter({ hasText: /^Filtros/ });

  if ((await compactFilters.count()) > 0) {
    await compactFilters.first().click();
  }

  const adidasSummary = page.locator("summary:visible").filter({ hasText: "Adidas" }).first();
  await expect(adidasSummary).toBeVisible();
  await adidasSummary.click();

  await expect(page.getByTestId("catalog-result-count")).toContainText(/\d+ Productos Encontrados/);
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
