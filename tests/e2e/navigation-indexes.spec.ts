import { expect, test } from "@playwright/test";

test("los índices de marcas y categorías están disponibles", async ({ page }) => {
  let response = await page.goto("/marca/", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "Explora por marca.", level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /Mallems/ })).toHaveAttribute(
    "href",
    "/marca/mallems",
  );

  response = await page.goto("/categoria/", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { name: "Explora por tipo de equipamiento.", level: 1 }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Karategis", exact: true }).first()).toHaveAttribute(
    "href",
    "/categoria/karategis",
  );
});

test("el catálogo enlaza a los índices de marcas y categorías", async ({ page }) => {
  const response = await page.goto("/catalogo/", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(200);

  await expect(page.getByRole("link", { name: "Ver marcas" })).toHaveAttribute("href", "/marca");
  await expect(page.getByRole("link", { name: "Ver categorías" })).toHaveAttribute(
    "href",
    "/categoria",
  );
});

test("los nuevos índices no producen overflow horizontal", async ({ page }) => {
  for (const route of ["/marca/", "/categoria/"]) {
    const response = await page.goto(route, {
      waitUntil: "domcontentloaded",
    });

    expect(response?.status()).toBe(200);

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );

    expect(hasOverflow).toBe(false);
  }
});
