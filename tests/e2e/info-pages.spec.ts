import { expect, test } from "@playwright/test";

test("cómo comprar guía al catálogo", async ({ page }) => {
  const response = await page.goto("/como-comprar/", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(200);

  await expect(
    page.getByRole("heading", { name: "Del catálogo a tu pedido, sin complicaciones." }),
  ).toBeVisible();

  const catalogLink = page
    .getByRole("main")
    .getByRole("link", { name: "Ver catálogo", exact: true });
  await expect(catalogLink).toBeVisible();
  await catalogLink.click();

  await expect(page).toHaveURL(/\/catalogo\/$/);
});

test("entregas dirige al canal de contacto", async ({ page }) => {
  const response = await page.goto("/entregas/", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(200);

  await expect(
    page.getByRole("heading", {
      name: "Coordinamos tu pedido para hacerlo llegar a donde estás.",
    }),
  ).toBeVisible();

  const contactLink = page.getByRole("link", { name: /Ir a contacto/ });
  await expect(contactLink).toBeVisible();
  await contactLink.click();

  await expect(page).toHaveURL(/\/contacto\/$/);
});

test("contacto ofrece consulta directa por WhatsApp", async ({ page }) => {
  const response = await page.goto("/contacto/", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(200);

  await expect(page.getByRole("heading", { name: "¿Necesitas ayuda para elegir?" })).toBeVisible();

  const whatsappLink = page.getByRole("link", { name: "Escribir por WhatsApp" });
  await expect(whatsappLink).toBeVisible();
  await expect(whatsappLink.locator("svg")).toHaveCount(1);
});
