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
  expect(body).toContain("https://catalogo-karate.pages.dev/marcas/adidas/");
  expect(body).toContain("https://catalogo-karate.pages.dev/producto/adidas-661-22-20/");
});
