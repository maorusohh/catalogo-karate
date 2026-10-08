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

test("preguntas frecuentes explica el catálogo y responde dudas comunes", async ({ page }) => {
  const response = await page.goto("/preguntas-frecuentes/", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(200);

  await expect(
    page.getByRole("heading", { name: "Respuestas claras antes de preparar tu consulta." }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Quiénes somos" })).toBeVisible();

  const purchaseQuestion = page.getByText("¿Puedo comprar directamente desde la página?", {
    exact: true,
  });
  await purchaseQuestion.click();

  await expect(page.getByText(/La web funciona como catálogo y carrito de consulta/)).toBeVisible();
});

test("header y footer usan la navegación comercial acordada", async ({ page }, testInfo) => {
  const response = await page.goto("/", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(200);

  const banner = page.getByRole("banner");
  const brandsLink = banner.getByRole("link", {
    name: "Explorar marcas",
    exact: true,
  });

  if (testInfo.project.name === "desktop") {
    await expect(brandsLink).toBeVisible();
  } else {
    await banner.locator('summary[aria-label="Abrir menú"]').click();
    await expect(brandsLink).toBeVisible();
  }

  const footer = page.getByRole("contentinfo");

  await expect(
    footer.getByRole("link", {
      name: "Explorar marcas",
      exact: true,
    }),
  ).toBeVisible();

  await expect(
    footer.getByRole("link", {
      name: "Preguntas frecuentes",
      exact: true,
    }),
  ).toBeVisible();
});
