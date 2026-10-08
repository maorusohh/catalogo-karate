# Catálogo Karate-Do — estado actual

Última revisión canónica: **8 de octubre de 2026**.

Este documento describe el estado comprobado del repositorio, la fuente editorial, el cierre técnico de la V1 y los checkpoints posteriores ya integrados en `main`.

## 1. Rama estable y checkpoint actual

Rama estable por defecto:

```text
main
```

Checkpoint funcional de catálogo publicado:

```text
6be539a feat: sync catalog variants prices and image ordering
```

Los commits inmediatamente anteriores de este bloque son:

```text
26e3dc7 test: align variant e2e expectations with metric formatting
d872063 test: align generated catalog expectations
2606522 test: cover brand in WhatsApp cart message
2bf83de fix: include brand in WhatsApp cart message
47707c1 feat: update catalog product images
```

Todo trabajo nuevo debe partir de `main` y preservar este estado funcional.

## 2. Alcance V1

La V1 es un catálogo público nacional de implementos de Karate-Do para Venezuela orientado a consulta comercial.

Incluye:

- catálogo público de productos;
- búsqueda y filtros;
- páginas por categoría y marca;
- ficha de producto;
- aprobación WKF, nacional, no aprobada o no especificada;
- precios y notas de tasa según contrato comercial;
- variantes y precios por variante cuando existen datos verificados;
- carrito de consulta local;
- generación de consulta por WhatsApp;
- imágenes locales auditadas;
- Google Sheets como CMS editorial;
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

## 4. Fuente editorial canónica

Google Sheet:

```text
Catálogo Karate-Do — Data Source
```

ID:

```text
1ib6Wd5Nt8Hpn7oHBQJPDNuE2GsskJq-Lcdid3uWeJpw
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

Estado comprobado por preflight el 8 de octubre de 2026:

- 7 marcas registradas;
- 25 categorías;
- 44 productos totales;
- 41 productos comerciales activos;
- 170 variantes;
- 109 referencias canónicas de imágenes;
- 189 precios;
- 0 errores;
- 9 warnings editoriales.

El snapshot `src/data/catalog-source.google.generated.ts` representa este estado y **no debe editarse manualmente**.

Los filtros visibles de Google Sheets quedaron ajustados para cubrir todas las filas actuales de `prices` e `images`, incluidas las altas recientes.

## 5. Variantes y formato comercial

El catálogo soporta:

- precios a nivel de producto;
- precios específicos por variante cuando corresponda;
- resolución de precio según la variante seleccionada;
- bloqueo de adición al carrito cuando no existe un precio resoluble;
- tarjetas conservando el resumen de precio a nivel de producto.

Formato métrico canónico:

```text
2.40m
1.30m
1.00m - 1.05m
```

Se eliminó el formato anterior con espacio antes de `m` y guion largo en rangos.

Se añadieron variantes de color para:

- `mallems-cinturones-grado-etiqueta-16`;
- `mallems-cinturones-grado-bordado-17`.

Colores actualmente respaldados:

- Amarillo;
- Naranja;
- Verde;
- Azul;
- Marrón;
- Otro color a consultar.

La regla de dominio se mantiene: no inventar tallas, colores, combinaciones ni precios que no estén respaldados por información comercial verificable.

## 6. Precios Adidas y formas de pago

Los productos Adidas actuales disponen de tres formas comerciales cuando corresponda:

1. `USD / Divisas`;
2. `USD / Zelle`;
3. `EUR / BCV`.

No se ofrece USDT/Binance para Adidas en este contrato comercial.

La mención histórica `CL` en conversación se interpreta como un error de dictado de voz referido a **Zelle**; no existe una forma de pago independiente llamada `CL`.

La misma regla podrá aplicarse a futuros productos Tenxin/Tenshin Gear del mismo proveedor cuando sus datos sean incorporados y verificados.

## 7. WhatsApp y carrito

El mensaje generado desde el carrito incluye por producto:

- nombre;
- marca;
- variante, si aplica;
- forma de pago preferida, si aplica;
- cantidad;
- SKU.

La variante artificial `Sin variante` no se muestra en el mensaje final.

## 8. Imágenes — estado actual

El catálogo dispone de **109 referencias canónicas de imágenes**.

Regla operativa para nuevas imágenes:

- se pueden utilizar imágenes obtenidas en Internet si corresponden exactamente al mismo producto/modelo;
- se debe evitar usar imágenes de productos meramente parecidos;
- se priorizan fabricante, marca, distribuidor autorizado o proveedor;
- se registra la procedencia en `source_type` y `source_url` cuando exista una URL útil;
- la presentación debe ser profesional y coherente con el catálogo.

Orden principal actualizado:

- Best Sport `Karategi NIWA Blanco` (`best-sport-karategi-niwa-blanco-2652`): `BESTSPORT-2652__02.webp` es ahora la imagen principal;
- Mallems `Kata Gi Tricolor` (`mallems-kata-gi-tricolor-24`): `MALLEMS-24__02.webp` es ahora la imagen principal.

El orden se controla mediante `images.sort_order`; no es necesario renombrar físicamente los archivos para cambiar la imagen principal.

La imagen principal del Kata Gi Tricolor todavía puede mejorarse si se consigue una fotografía equivalente con mejor fondo y presentación.

## 9. Warnings editoriales actuales

El preflight actual reporta exactamente 9 warnings y 0 errores.

Productos activos sin imagen:

1. `mallems-peto-corporal-karate-do-u14-11`;
2. `mallems-cinturones-grado-bordado-17`;
3. `generica-cinturon-blanco-principiantes-20`;
4. `adidas-k999kit`;
5. `adidas-k999hwt`;
6. `adidas-k192dnakit-v`;
7. `adidas-k200dnakit`;
8. `adidas-k200e`.

Producto activo sin características:

9. `mallems-maleta-viajera-28`.

No son errores de integridad y no deben resolverse inventando datos.

El caso `adidas-k200dnakit` sigue requiriendo cuidado: fotografías identificadas como K220 no deben publicarse bajo K200 mientras no se confirme que corresponden exactamente al producto canónico.

## 10. Validación integral del checkpoint

Cadena ejecutada y aprobada sobre el snapshot publicado:

```text
npm run catalog:sync
npm run catalog:preflight
npm run format:check
npm run lint
npm run test:unit
npm run build
npx playwright test tests/e2e/variants.spec.ts
npm run test:e2e
```

Resultados comprobados:

- sync Google Sheets: PASSED;
- validación de texto: PASSED;
- validación de imágenes: 109 referencias comprobadas;
- preflight: 0 errores / 9 warnings;
- variantes: 170;
- precios: 189;
- Prettier: PASSED;
- ESLint: PASSED;
- unit tests: 31/31;
- production build: PASSED;
- páginas estáticas generadas: 69/69;
- E2E focalizado de variantes: 15/15;
- E2E Playwright completo: 99/99.

## 11. Integración Git

El checkpoint comercial quedó integrado por fast-forward de los cambios de código/tests y posteriormente por el commit del snapshot generado:

```text
26e3dc7 -> 6be539a
```

Commit principal del snapshot:

```text
6be539a feat: sync catalog variants prices and image ordering
```

Ese commit contiene únicamente `src/data/catalog-source.google.generated.ts` y no arrastra assets locales pendientes.

## 12. Estado local deliberadamente fuera de Git

En el entorno local permanecen, por diseño, fuera del checkpoint:

```text
M public/images/catalogo/products/MALLEMS-22__01.webp
?? public/images/catalogo/brands/
?? recursos/
```

`MALLEMS-22__01.webp` es una modificación local del asset existente y debe revisarse como checkpoint de imagen independiente antes de publicarse.

`public/images/catalogo/brands/` y `recursos/` no deben agregarse con `git add .`; requieren revisión explícita de contenido y destino.

## 13. Logos de marca

El contrato runtime enlaza logos locales para:

- Best Sport -> `/images/brands/best-sport.webp`;
- Mallems -> `/images/brands/mallems.webp`;
- No Kashi -> `/images/brands/no-kashi.png`.

`Generica` y `Adidas` continúan con `brands.logo` vacío.

La carpeta local no rastreada `public/images/catalogo/brands/` no forma parte del contrato runtime actual.

## 14. Deployment

Proveedor:

```text
Cloudflare Pages
```

Producción:

```text
https://catalogo-karate.pages.dev
```

Configuración:

- repositorio: `maorusohh/catalogo-karate`;
- rama de producción: `main`;
- estrategia: Next.js Static Export;
- build: `npx next build`;
- directorio publicado: `out`;
- `next.config.ts`: `output: "export"`, `trailingSlash: true`, imágenes `unoptimized`;
- variables de entorno del catálogo en producción: ninguna requerida para el deployment ordinario.

El checkpoint local/build está validado. El estado de despliegue público posterior a `6be539a` debe considerarse una comprobación operativa separada del build local.

## 15. Backlog inmediato recomendado

1. verificar el deployment público correspondiente al checkpoint `6be539a`;
2. revisar y decidir si se publica la optimización local `MALLEMS-22__01.webp`;
3. mejorar la imagen principal del Mallems Kata Gi Tricolor si se consigue una fotografía exacta y superior;
4. conseguir o verificar imágenes para los 8 productos activos actualmente sin imagen;
5. resolver comercialmente la discrepancia Adidas K200/K220 antes de publicar fotografías bajo K200;
6. completar features de `mallems-maleta-viajera-28` cuando exista información confiable;
7. auditar `public/images/catalogo/brands/`;
8. mantener `recursos/` fuera del repositorio salvo decisión explícita;
9. decidir si Adidas y/o Generica requieren logo propio en `brands.logo`;
10. continuar mejoras UX/rendimiento solo como checkpoints independientes y verificables.

## 16. Regla de continuidad

La V1 permanece deliberadamente simple: catálogo público, fuente editorial en Google Sheets, snapshot versionado, carrito local y consulta por WhatsApp.

No reabrir arquitectura, backend, autenticación, pagos ni inventario para este alcance salvo una necesidad nueva y explícita.

Todo trabajo nuevo debe partir de `main`, preservar el contrato de datos existente y mantener la aplicación funcional en cada checkpoint.

Cuando un dato comercial, una variante, una fotografía o una característica no sea verificable, debe permanecer pendiente antes que ser completado por suposición.
