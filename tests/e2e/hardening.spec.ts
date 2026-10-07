import { expect, test } from "@playwright/test";

test("una ruta inexistente responde 404 sin convertirse en error 500", async ({ page }) => {
  const response = await page.goto("/ruta-inexistente-hardening/", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(404);
  await expect(page.locator("body")).toBeVisible();
});

test("el carrito persiste una variante real después de recargar", async ({ page }) => {
  const response = await page.goto("/producto/mallems-guantes-karate-do-07/", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(200);

  await page.getByRole("button", { name: "Talla: XS" }).click();
  await page.getByRole("button", { name: "Color Ao, azul" }).click();
  await page.getByRole("button", { name: "Agregar al carrito" }).click();

  await expect(page.getByRole("button", { name: "Abrir carrito, 1 producto" })).toBeVisible();

  await page.reload({ waitUntil: "domcontentloaded" });

  await expect(page.getByRole("button", { name: "Abrir carrito, 1 producto" })).toBeVisible();
});

test("en pantalla compacta la compra aparece antes de la información secundaria", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });

  const response = await page.goto("/producto/mallems-guantes-karate-do-07/", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(200);

  const productHeading = page.getByRole("heading", {
    name: "Guantes de Karate-Do",
    level: 1,
  });
  const informationHeading = page.getByRole("heading", {
    name: "Información del producto",
    level: 2,
  });

  await expect(productHeading).toBeVisible();
  await expect(informationHeading).toBeVisible();

  const productBox = await productHeading.boundingBox();
  const informationBox = await informationHeading.boundingBox();

  expect(productBox).not.toBeNull();
  expect(informationBox).not.toBeNull();
  expect(productBox!.y).toBeLessThan(informationBox!.y);
});
