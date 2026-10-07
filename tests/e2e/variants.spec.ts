import { expect, test } from "@playwright/test";

test("una variante verificada de talla y color puede seleccionarse", async ({ page }) => {
  const response = await page.goto("/producto/mallems-guantes-karate-do-07/", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(200);

  const addButton = page.getByRole("button", { name: "Agregar al carrito" });

  await expect(addButton).toBeDisabled();

  await page.getByRole("button", { name: "Talla: XS" }).click();
  await page.getByRole("button", { name: "Color Ao, azul" }).click();

  await expect(page.getByText("XS · Ao (Azul)", { exact: true })).toBeVisible();
  await expect(addButton).toBeEnabled();
});

test("un cinturón 2 Pack expone únicamente la longitud verificada", async ({ page }) => {
  const response = await page.goto("/producto/mallems-cinturones-competencia-2-pack-19/", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(200);

  await expect(page.getByRole("group", { name: "Longitud" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Longitud: 2.40 m" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Color/ })).toHaveCount(0);
});
