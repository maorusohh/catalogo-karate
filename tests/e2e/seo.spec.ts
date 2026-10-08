import { expect, test } from "@playwright/test";

test("robots.txt permite indexación y publica el sitemap", async ({ request }) => {
  const response = await request.get("/robots.txt");

  expect(response.status()).toBe(200);

  const body = await response.text();

  expect(body).toContain("User-Agent: *");
  expect(body).toContain("Allow: /");
  expect(body).toContain("Sitemap: https://catalogo-karate.pages.dev/sitemap.xml");
});

test("sitemap.xml incluye rutas comerciales principales", async ({ request }) => {
  const response = await request.get("/sitemap.xml");

  expect(response.status()).toBe(200);

  const body = await response.text();

  expect(body).toContain("https://catalogo-karate.pages.dev/catalogo/");
  expect(body).toContain("https://catalogo-karate.pages.dev/marcas/");
  expect(body).toContain("https://catalogo-karate.pages.dev/preguntas-frecuentes/");
  expect(body).toContain("https://catalogo-karate.pages.dev/marcas/adidas/");
  expect(body).toContain("https://catalogo-karate.pages.dev/producto/adidas-661-22-20/");
});

test("páginas dinámicas publican canonical y Open Graph consistentes", async ({ page }) => {
  const cases = [
    {
      path: "/producto/adidas-661-22-20/",
      canonical: "https://catalogo-karate.pages.dev/producto/adidas-661-22-20/",
      expectsImage: true,
    },
    {
      path: "/marcas/best-sport/",
      canonical: "https://catalogo-karate.pages.dev/marcas/best-sport/",
      expectsImage: true,
    },
    {
      path: "/categoria/guantines/",
      canonical: "https://catalogo-karate.pages.dev/categoria/guantines/",
      expectsImage: false,
    },
  ];

  for (const item of cases) {
    await page.goto(item.path);

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", item.canonical);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", item.canonical);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /.+/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", /summary/);

    if (item.expectsImage) {
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /^https:\/\//);
    }
  }
});
