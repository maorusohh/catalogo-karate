import { expect, test } from "@playwright/test";

test("una variante verificada de talla y color puede seleccionarse", async ({ page }) => {
  const response = await page.goto("/producto/mallems-guantes-karate-do-07/", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(200);

  await expect(page.getByRole("button", { name: "Selecciona una variante" })).toBeDisabled();

  await page.getByRole("button", { name: "Talla: XS" }).click();
  await page.getByRole("button", { name: "Color Ao, azul" }).click();

  await expect(page.getByText("XS · Ao (Azul)", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Agregar al carrito" })).toBeEnabled();
});

test("un cinturón 2 Pack expone únicamente la longitud verificada", async ({ page }) => {
  const response = await page.goto("/producto/mallems-cinturones-competencia-2-pack-19/", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(200);

  await expect(page.getByText("Longitud", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Longitud: 2.40 m" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Color/ })).toHaveCount(0);
});

test("un karategi con precio por talla actualiza el precio al cambiar la talla", async ({ page }) => {
  const response = await page.goto("/producto/mallems-karategi-liviano-entrenamiento-21/", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(200);

  await expect(page.getByText("Selecciona una talla para ver el precio.")).toBeVisible();
  await expect(page.getByRole("button", { name: "50 USD / Divisas" })).toHaveCount(0);

  await page.getByRole("button", { name: "Talla: Talla 0 · 1.00–1.05 m" }).click();

  await expect(page.getByRole("button", { name: "50 USD / Divisas" })).toBeVisible();
  await expect(page.getByRole("button", { name: "55 EUR / BCV" })).toBeVisible();

  await page.getByRole("button", { name: "Talla: Talla 4 · 1.40–1.45 m" }).click();

  await expect(page.getByRole("button", { name: "60 USD / Divisas" })).toBeVisible();
  await expect(page.getByRole("button", { name: "65 EUR / BCV" })).toBeVisible();
});

test("un karategi de precio fijo conserva el precio al cambiar de talla", async ({ page }) => {
  const response = await page.goto("/producto/mallems-kata-gi-22/", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(200);

  await expect(page.getByRole("button", { name: "155 USD / Divisas" })).toBeVisible();

  await page.getByRole("button", { name: "Talla: 1.30 m" }).click();
  await expect(page.getByRole("button", { name: "155 USD / Divisas" })).toBeVisible();

  await page.getByRole("button", { name: "Talla: 2.00 m" }).click();
  await expect(page.getByRole("button", { name: "155 USD / Divisas" })).toBeVisible();
});
