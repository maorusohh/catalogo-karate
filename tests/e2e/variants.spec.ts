import { expect, test } from "@playwright/test";

test("una variante verificada de talla y color puede seleccionarse", async ({ page }) => {
  const response = await page.goto("/producto/mallems-guantes-karate-do-07/", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(200);

  await expect(page.getByText("Tallas:", { exact: true })).toBeVisible();
  await expect(page.getByText("Colores:", { exact: true })).toBeVisible();
  await expect(page.getByText("Ao / Aka", { exact: true })).toBeVisible();
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

  await expect(page.getByText("Longitud:", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Longitud: 2.40m" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Color/ })).toHaveCount(0);
});

test("un karategi con precio por variante actualiza el precio al cambiar la talla", async ({
  page,
}) => {
  const response = await page.goto("/producto/mallems-karategi-liviano-entrenamiento-21/", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(200);

  await expect(page.getByText("Tallas:", { exact: true })).toBeVisible();
  await expect(page.getByText("Precio y formas de pago:", { exact: true })).toBeVisible();
  await expect(page.getByText("Selecciona una variante para ver el precio.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Información del producto:" })).toBeVisible();
  await expect(page.getByRole("button", { name: "50 USD / Divisas" })).toHaveCount(0);

  await page.getByRole("button", { name: "Talla: Talla 0 · 1.00m - 1.05m" }).click();

  await expect(page.getByRole("button", { name: "50 USD / Divisas" })).toBeVisible();
  await expect(page.getByRole("button", { name: "55 EUR / BCV" })).toBeVisible();

  await page.getByRole("button", { name: "Talla: Talla 4 · 1.40m - 1.45m" }).click();

  await expect(page.getByRole("button", { name: "60 USD / Divisas" })).toBeVisible();
  await expect(page.getByRole("button", { name: "65 EUR / BCV" })).toBeVisible();
});

test("un karategi de precio fijo conserva el precio al cambiar de talla", async ({ page }) => {
  const response = await page.goto("/producto/mallems-kata-gi-22/", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(200);

  await expect(page.getByText("Tallas:", { exact: true })).toBeVisible();
  await expect(page.getByText("Formas de pago:", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "155 USD / Divisas" })).toBeVisible();

  await page.getByRole("button", { name: "Talla: 1.30m" }).click();
  await expect(page.getByRole("button", { name: "155 USD / Divisas" })).toBeVisible();

  await page.getByRole("button", { name: "Talla: 2.00m" }).click();
  await expect(page.getByRole("button", { name: "155 USD / Divisas" })).toBeVisible();
});

test("las canilleras Best Sport exponen talla y colores Ao/Aka verificados", async ({ page }) => {
  const response = await page.goto(
    "/producto/best-sport-canilleras-karate-aprobadas-wkf-1128wkf/",
    {
      waitUntil: "domcontentloaded",
    },
  );

  expect(response?.status()).toBe(200);

  await expect(page.getByText("Tallas:", { exact: true })).toBeVisible();
  await expect(page.getByText("Colores:", { exact: true })).toBeVisible();
  await expect(page.getByText("Ao / Aka", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Talla: XS" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Talla: L" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Color Ao, azul" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Color Aka, rojo" })).toBeVisible();

  await page.getByRole("button", { name: "Talla: M" }).click();
  await page.getByRole("button", { name: "Color Aka, rojo" }).click();

  await expect(page.getByText("M · Aka (Rojo)", { exact: true })).toBeVisible();
});

test("los cinturones de grado usan colores propios sin semántica Ao/Aka", async ({ page }) => {
  const response = await page.goto("/producto/mallems-cinturones-grado-etiqueta-16/", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(200);

  await expect(page.getByText("Colores:", { exact: true })).toBeVisible();
  await expect(page.getByText("Ao / Aka", { exact: true })).toHaveCount(0);

  const yellow = page.getByRole("button", { name: "Color Amarillo" });
  await yellow.click();
  await expect(yellow).toHaveAttribute("aria-pressed", "true");
  await expect(yellow).toHaveClass(/bg-yellow-100/);

  const orange = page.getByRole("button", { name: "Color Naranja" });
  await orange.click();
  await expect(orange).toHaveAttribute("aria-pressed", "true");
  await expect(orange).toHaveClass(/bg-orange-100/);

  const green = page.getByRole("button", { name: "Color Verde" });
  await green.click();
  await expect(green).toHaveAttribute("aria-pressed", "true");
  await expect(green).toHaveClass(/bg-green-100/);

  const blue = page.getByRole("button", { name: "Color Azul" });
  await blue.click();
  await expect(blue).toHaveAttribute("aria-pressed", "true");
  await expect(blue).toHaveClass(/bg-blue-100/);

  const brown = page.getByRole("button", { name: "Color Marrón" });
  await brown.click();
  await expect(brown).toHaveAttribute("aria-pressed", "true");
  await expect(brown).toHaveClass(/bg-amber-100/);

  const other = page.getByRole("button", { name: "Color Otro color a consultar" });
  await other.click();
  await expect(other).toHaveAttribute("aria-pressed", "true");
  await expect(other).toHaveClass(/bg-neutral-100/);
});
