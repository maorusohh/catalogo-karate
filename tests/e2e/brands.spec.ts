import { expect, test } from "@playwright/test";

test(
  "el directorio de marcas expone las marcas activas con productos",
  async ({ page }) => {
    const response = await page.goto("/marcas/", {
      waitUntil: "domcontentloaded",
    });

    expect(response?.status()).toBe(200);

    await expect(
      page.getByRole("heading", { name: "Explora el catálogo por marca." }),
    ).toBeVisible();

    await expect(page.getByRole("link", { name: /Best Sport/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Mallems/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Adidas/ })).toBeVisible();

    await page.getByRole("link", { name: /Mallems/ }).click();

    await expect(page).toHaveURL(/\/marcas\/mallems\/$/);
    await expect(
      page.getByRole("heading", { name: "Mallems", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Volver a marcas/ }),
    ).toBeVisible();
  },
);

test("inicio permite abrir el directorio completo de marcas", async ({ page }) => {
  const response = await page.goto("/", { waitUntil: "domcontentloaded" });

  expect(response?.status()).toBe(200);

  await expect(
    page.getByRole("heading", { name: "Encuentra el equipamiento por la marca que prefieres." }),
  ).toBeVisible();

  const allBrandsLink = page.getByRole("link", {
    name: /Ver todas las marcas/,
  });
  await expect(allBrandsLink).toBeVisible();
  await allBrandsLink.click();

  await expect(page).toHaveURL(/\/marcas\/$/);
});
