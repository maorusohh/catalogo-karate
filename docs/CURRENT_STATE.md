# Catálogo Karate-Do — estado actual

Última revisión canónica: **7 de octubre de 2026**.

Este documento describe el estado comprobado del repositorio, la fuente editorial, el cierre técnico de la V1 y su publicación en producción.

## 1. Estado de ramas

Rama estable por defecto:

```text
main
```

La rama `feature/profesionalizacion` quedó integrada y se mantiene sincronizada con `main` al cierre de los checkpoints de V1.

## 2. Alcance V1 cerrado

La V1 es un catálogo público nacional de implementos de Karate-Do para Venezuela orientado a consulta comercial.

Incluye:

- catálogo público de productos;
- búsqueda y filtros;
- páginas por categoría y marca;
- ficha de producto;
- aprobación WKF, nacional, no aprobada o no especificada;
- precios y notas de tasa según contrato comercial;
- carrito de consulta local;
- generación de consulta por WhatsApp;
- imágenes locales auditadas;
- Google Sheets como CMS editorial;
- variantes únicamente cuando existan datos comerciales verificables;
- publicación estática en Cloudflare Pages.

No incluye:

- autenticación;
- cuentas de clientes;
- checkout o pagos;
- inventario transaccional;
- backend propio;
- base de datos propia;
- datos privados de proveedores, costos, márgenes o credenciales.

## 3. Base técnica implementada

Stack verificado:

- Next.js 16.3.6;
- React 19.2.8;
- TypeScript;
- Tailwind CSS 4;
- Zod 4.6.x;
- Vitest 5;
- Playwright 1.63.x;
- Google Sheets API;
- Cloudflare Pages.

Arquitectura de datos:

```text
Google Sheets
  -> scripts/sync-catalog-from-google.ts
  -> src/data/catalog-source.google.generated.ts
  -> adapter tabular + validación
  -> Catalog
  -> CatalogRepository
  -> interfaz Next.js
```

La UI no consulta Google Sheets directamente. Las pestañas `catalog_intake*` son staging editorial y no forman parte del contrato runtime.

El deployment de producción consume el snapshot comercial versionado. No requiere acceso directo a Google Sheets ni credenciales del service account durante el build público ordinario.

## 4. Estado canónico de Google Sheets

Fuente editorial:

```text
Catálogo Karate-Do — Data Source
```

Pestañas canónicas:

- `meta`
- `brands`
- `categories`
- `products`
- `variants`
- `variant_options`
- `prices`
- `images`
- `features`

Staging editorial:

- `catalog_intake`
- `catalog_intake_variants`
- `catalog_intake_prices`
- `catalog_intake_images`
- `catalog_intake_features`

Estado comprobado:

- 7 marcas registradas;
- 5 marcas activas;
- 25 categorías activas;
- 44 productos totales;
- 41 productos comerciales activos;
- 3 productos demo inactivos;
- 77 referencias canónicas de imágenes;
- 123 precios comerciales;
- 126 precios totales incluyendo 3 filas demo `CONSULT`;
- 134 features comerciales;
- 142 features totales incluyendo 8 filas demo;
- 0 variantes comerciales canónicas.

Las dos marcas demo permanecen como datos históricos pero están inactivas. Los tres productos demo también están inactivos y no generan rutas públicas.

## 5. Checkpoint de features — cerrado

Resultado verificado:

- 134/134 filas comerciales promovidas;
- 0 referencias huérfanas;
- 134 combinaciones `product_id + feature` únicas;
- 134 combinaciones `product_id + sort_order` únicas;
- `sort_order` conservado;
- datos canónicos materializados como valores estáticos.

## 6. Checkpoint de precios — cerrado

Resultado verificado:

- 123/123 precios comerciales promovidos;
- 41 productos comerciales cubiertos;
- 41 `DIRECT_USD`;
- 41 `USDT`;
- 41 `EURO_RATE_USD`;
- 0 referencias huérfanas;
- 0 combinaciones `product_id + basis` duplicadas;
- 0 combinaciones `product_id + sort_order` duplicadas;
- 0 montos no positivos;
- 0 monedas fuera de `USD`/`USDT`;
- 0 menciones internas de costo, instructor o margen en las notas canónicas.

## 7. Variantes — diferidas correctamente

`variants` y `variant_options` no contienen datos comerciales reales.

No se inventaron tallas, colores ni combinaciones. La carga de variantes queda diferida hasta disponer de información comercial verificable.

## 8. Assets de producto — checkpoint cerrado

Se incorporaron y versionaron exactamente **77 archivos WebP comerciales** bajo:

```text
public/images/catalogo/products/
```

Resultado verificado:

- 77/77 referencias de `images.src` resuelven a archivos locales;
- 0 rutas faltantes;
- 0 errores de casing;
- 0 hotlinks usados como sustituto de producción;
- los assets de logos locales permanecen fuera del contrato runtime porque `brands.logo` continúa vacío;
- `recursos/` permanece fuera del repositorio por diseño.

## 9. Snapshot comercial — cerrado

`src/data/catalog-source.google.generated.ts` fue regenerado desde Google Sheets y ya representa el catálogo comercial vigente.

El snapshot contiene:

- 7 marcas registradas;
- 25 categorías;
- 44 productos;
- 41 productos activos;
- 77 imágenes;
- 126 precios totales;
- 0 variantes comerciales.

El archivo es generado y no debe editarse manualmente.

## 10. Validación integral de cierre técnico

Cadena ejecutada y aprobada:

```text
npm run catalog:sync
npm run catalog:report
npm run catalog:preflight
npm run format:check
npm run lint
npm run test:unit
npm run build
npm run test:e2e
```

Resultados finales comprobados:

- validación textual: PASSED;
- validación de imágenes: 77/77;
- preflight: 0 errores;
- warnings editoriales: 28;
- Prettier: PASSED;
- ESLint: PASSED;
- unit tests: 24/24;
- production build: PASSED;
- páginas estáticas generadas: 79/79;
- rutas demo exportadas: 0;
- E2E Playwright: 72/72.

Los 28 warnings no son errores de integridad. Corresponden a contenido editorial todavía no suministrado:

- 11 productos activos sin features completas;
- 17 productos activos sin imágenes verificadas.

Estos pendientes no bloquean la V1 y no deben resolverse inventando datos.

## 11. Integración y normalización Git — cerradas

La profesionalización quedó integrada en `main` y la rama `feature/profesionalizacion` se mantiene alineada con la rama estable.

Se añadió `.gitattributes` para fijar `LF` en archivos de texto y evitar inconsistencias de checkout en Windows. La certificación final confirmó:

- working tree tracked limpio;
- `main` local/remoto sincronizados;
- `feature/profesionalizacion` local/remota sincronizadas;
- sin `reset`, `force push` ni pérdida de commits.

## 12. Deployment V1 — cerrado

Proveedor:

```text
Cloudflare Pages
```

Producción:

```text
https://catalogo-karate.pages.dev
```

Configuración de publicación:

- repositorio: `maorusohh/catalogo-karate`;
- rama de producción: `main`;
- estrategia: Next.js Static Export;
- build: `npx next build`;
- directorio publicado: `out`;
- `next.config.ts`: `output: "export"`, `trailingSlash: true`, imágenes `unoptimized`;
- variables de entorno del catálogo en producción: ninguna requerida para el deployment ordinario;
- el sitio publica el snapshot comercial ya versionado en GitHub.

Auditoría pública básica ejecutada sobre la URL de producción:

- `/`: HTTP 200;
- `/catalogo/`: HTTP 200;
- categorías críticas: HTTP 200;
- marcas Best Sport y Mallems: HTTP 200;
- productos representativos Best Sport y Mallems: HTTP 200;
- `/como-comprar/`: HTTP 200;
- `/entregas/`: HTTP 200;
- `/contacto/`: HTTP 200;
- WebP comercial representativo: HTTP 200 con contenido de imagen;
- enlace público a WhatsApp: presente;
- enlaces a productos comerciales: presentes;
- contenido demo público: no detectado.

Resultado:

```text
AUDITORÍA PÚBLICA BÁSICA: PASSED
```

La V1 se considera **técnicamente cerrada y publicada**.

Una comprobación adicional desde herramientas externas de esta sesión no pudo resolver temporalmente el subdominio `pages.dev`; por integridad documental, ese intento no se registra como una segunda auditoría aprobada. La auditoría pública realizada desde el entorno del proyecto sí respondió correctamente por HTTPS y constituye la evidencia de cierre del checkpoint.

## 13. Pendientes posteriores a V1

Los siguientes puntos quedan fuera del cierre de V1 y solo deben abordarse cuando exista información o necesidad real:

1. completar imágenes faltantes de productos activos cuando se disponga de assets verificables;
2. completar features editoriales faltantes cuando el proveedor suministre información confiable;
3. incorporar variantes reales cuando existan tallas, colores o combinaciones verificadas;
4. decidir formalmente si los logos de marca locales entran al contrato `brands.logo`;
5. optimizar warnings de rendimiento LCP de imágenes above-the-fold;
6. repetir una auditoría externa desde otro punto de red cuando resulte útil;
7. evaluar un dominio personalizado solo si existe necesidad comercial real.

## 14. Regla de continuidad

La V1 queda cerrada y publicada. No reabrir arquitectura, backend, autenticación, pagos ni inventario para este alcance.

Cualquier trabajo nuevo debe partir de `main`, preservar el contrato de datos existente y tratar las mejoras editoriales, de rendimiento, branding, dominio o UX como checkpoints independientes.
