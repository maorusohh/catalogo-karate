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
