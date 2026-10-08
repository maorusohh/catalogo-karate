import { expect, test } from "@playwright/test";

test("la navegación por teclado puede saltar al contenido principal", async ({ page }) => {
  const response = await page.goto("/", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(200);

  const skipLink = page.getByRole("link", { name: "Saltar al contenido principal" });

  await page.keyboard.press("Tab");
  await expect(skipLink).toBeFocused();

  await page.keyboard.press("Enter");

  await expect(page.locator("#main-content")).toBeFocused();
});
