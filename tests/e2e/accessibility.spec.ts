import { expect, test } from "@playwright/test";

test("la navegación puede saltar al contenido principal", async ({ page }, testInfo) => {
  const response = await page.goto("/", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(200);

  const skipLink = page.getByRole("link", { name: "Saltar al contenido principal" });
  const mainContent = page.locator("#main-content");

  await expect(skipLink).toHaveAttribute("href", "#main-content");
  await expect(mainContent).toHaveCount(1);

  if (testInfo.project.name === "desktop") {
    await page.keyboard.press("Tab");
    await expect(skipLink).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main-content$/);
    await expect(mainContent).toBeVisible();
  }
});

test("el carrito administra el foco como diálogo modal", async ({ page }, testInfo) => {
  const response = await page.goto("/", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(200);

  const trigger = page.getByRole("button", { name: /^Abrir carrito/ });
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Carrito de consulta" });
  const closeButton = dialog.getByRole("button", { name: "Cerrar carrito" });

  await expect(dialog).toBeVisible();
  await expect(closeButton).toBeFocused();

  if (testInfo.project.name === "desktop") {
    const continueButton = dialog.getByRole("button", { name: "Seguir explorando" });

    await page.keyboard.press("Shift+Tab");
    await expect(continueButton).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(closeButton).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  } else {
    await closeButton.click();
    await expect(dialog).toHaveCount(0);
  }
});

test("el carrito puede cerrarse al tocar fuera del panel", async ({ page }) => {
  const response = await page.goto("/", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(200);

  await page.getByRole("button", { name: /^Abrir carrito/ }).click();

  const dialog = page.getByRole("dialog", { name: "Carrito de consulta" });
  const backdrop = page.getByRole("button", { name: "Cerrar carrito al tocar fuera" });

  await expect(dialog).toBeVisible();
  await expect(backdrop).toBeVisible();

  const dialogBox = await dialog.boundingBox();
  const viewport = page.viewportSize();

  expect(dialogBox).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(dialogBox!.width).toBeLessThan(viewport!.width);

  await backdrop.click({
    position: {
      x: 8,
      y: 100,
    },
  });

  await expect(dialog).toHaveCount(0);
});
