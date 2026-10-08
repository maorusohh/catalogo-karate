import { expect, test } from "@playwright/test";

const productsWithoutVariants = [
  {
    slug: "adidas-661-22-20",
    name: "Guante de Karate WKF 2.0",
  },
  {
    slug: "adidas-661-35-20",
    name: "Protector de Empeine y Espinillera Removible de Karate",
  },
  {
    slug: "adidas-adip03",
    name: "Protector de Pecho de Karate",
  },
];

for (const product of productsWithoutVariants) {
  test(`${product.name} se compra sin selector de variante`, async ({ page }) => {
    const response = await page.goto(`/producto/${product.slug}/`, {
      waitUntil: "domcontentloaded",
    });

    expect(response?.status()).toBe(200);

    await expect(page.getByRole("heading", { name: product.name })).toBeVisible();
    await expect(page.getByText("Variantes por confirmar")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Selecciona una variante" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Agregar al carrito" })).toBeEnabled();
  });
}
