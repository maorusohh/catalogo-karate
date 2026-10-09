# Catálogo Karate-Do

Catálogo público nacional de implementos de Karate-Do para Venezuela. La V1 está orientada a consulta comercial: permite explorar productos, buscar y filtrar el catálogo, revisar fichas y variantes, construir una consulta local y enviarla por WhatsApp.

El proyecto está diseñado deliberadamente sin login, base de datos propia ni backend comercial en esta etapa.

## Estado del proyecto

La **V1 técnica está publicada y estable en producción**.

Producción:

```text
https://catalogo-karate.pages.dev
```

SHA validado y publicado:

```text
3d2d363aa84064b345419e1ff1a36cdf231c4a41
```

Refs de release:

```text
main                -> 3d2d363aa84064b345419e1ff1a36cdf231c4a41
production-stable   -> 3d2d363aa84064b345419e1ff1a36cdf231c4a41
production-previous -> 33c1aecd4c58624f094ecc0cae0adddb39a93c79
```

El sitio se publica en Cloudflare Pages mediante exportación estática de Next.js desde `main`. El deployment utiliza el snapshot comercial versionado en el repositorio y no necesita credenciales de Google Sheets en producción.

`release-candidate` puede quedar por delante únicamente por documentación o por futuros checkpoints todavía no promovidos. Producción debe recibir siempre el mismo SHA que haya pasado la validación correspondiente.

El estado técnico vigente, los datos incorporados, las validaciones realizadas y el backlog están documentados en [`docs/CURRENT_STATE.md`](docs/CURRENT_STATE.md).

El contexto, alcance e invariantes del proyecto están en [`docs/PROJECT_CONTEXT.md`](docs/PROJECT_CONTEXT.md).

## Arquitectura

Flujo principal:

```text
Google Sheets (fuente editorial canónica)
  -> scripts/sync-catalog-from-google.ts
  -> src/data/catalog-source.google.generated.ts
  -> adapter tabular + validación
  -> Catalog
  -> CatalogRepository
  -> interfaz Next.js
```

La interfaz nunca consulta Google Sheets directamente.

Las pestañas `catalog_intake*` son staging editorial y no forman parte del contrato de lectura del sitio. Solo los datos promovidos a las pestañas canónicas pueden llegar al catálogo público.

El contrato de datos está definido en [`docs/catalog-data-contract.md`](docs/catalog-data-contract.md).

## Stack

- Next.js 16.3.6
- React 19.2.8
- TypeScript
- Tailwind CSS 4
- Zod 4
- Vitest 5
- Playwright 1.63
- Google Sheets API
- Cloudflare Pages

## Desarrollo local

```bash
npm install
npm run dev
```

Validaciones principales:

```bash
npm run format:check
npm run lint
npm run test:unit
npm run build
npm run test:e2e
npm run images:audit
```

Para sincronizar el catálogo desde Google Sheets se requieren variables de entorno de build; nunca se deben versionar credenciales.

Variables usadas por el sincronizador:

```text
GOOGLE_SHEETS_SPREADSHEET_ID
GOOGLE_SERVICE_ACCOUNT_JSON_FILE
```

Alternativamente, CI puede aportar las credenciales mediante:

```text
GOOGLE_SERVICE_ACCOUNT_JSON
```

Sincronización y validación del catálogo:

```bash
npm run catalog:sync
npm run catalog:report
npm run catalog:preflight
npm run build:catalog
```

`src/data/catalog-source.google.generated.ts` es un artefacto generado. No se edita manualmente.

## Alcance V1

Incluye:

- catálogo público de productos;
- búsqueda con equivalencias controladas y autosuggest;
- filtros de marca, categoría y aprobación;
- ordenación;
- páginas por categoría y marca;
- ficha de producto;
- variantes cuando existan datos confiables;
- aprobación WKF, nacional, no aprobada o no especificada;
- precios y notas de tasa según el contrato comercial;
- carrito de consulta local;
- generación de consulta por WhatsApp;
- imágenes locales auditadas;
- Google Sheets como CMS editorial;
- SEO dinámico para producto, marca y categoría;
- publicación estática en Cloudflare Pages.

No incluye en esta fase:

- autenticación;
- cuentas de clientes;
- checkout o pagos;
- inventario transaccional;
- backend propio;
- base de datos propia;
- datos privados de proveedores, costos, márgenes o credenciales.

## Validación final de V1

Release publicado:

- catálogo: **44 productos totales / 41 activos**;
- marcas: **7 totales / 5 activas**;
- categorías: **25 totales / 15 activas**;
- variantes: **255**;
- referencias canónicas de imagen: **109**;
- precios: **189 totales / 186 en productos activos**;
- preflight: **0 errores / 9 warnings editoriales**;
- unit tests: **38/38**;
- build estático: **73/73 páginas**;
- E2E completo: **171/171**;
- auditoría de imágenes: **0 bloqueadores >1 MiB**, 1 warning residual conocido;
- smoke público Cloudflare: **10/10 rutas críticas HTTP 200**;
- redirects históricos comprobados: **HTTP 301**.

Los warnings editoriales por características o imágenes todavía no suministradas no bloquean la integridad del runtime y no deben resolverse inventando información.

## Backlog no bloqueante

Queda fuera del cierre técnico de V1:

- imágenes canónicas de 8 productos todavía sin activo aprobado;
- características de la Maleta Viajera Mallems cuando el proveedor las confirme;
- logo Adidas;
- logo definitivo del Catálogo Karate-Do para reemplazar `KD`;
- nueva marca cuando exista nombre y material exacto;
- microestética/pulido visual adicional agrupado en una revisión futura;
- dominio propio, si se adopta posteriormente.

## Deploy estático

Configuración relevante:

```text
Next.js output: export
trailingSlash: true
Cloudflare build: npx next build
Cloudflare output: out
```

`public/_redirects` conserva compatibilidad para rutas históricas y `public/_headers` define headers básicos de seguridad y caché de assets.

## Reglas de contribución

Antes de modificar arquitectura, datos o código, leer:

1. [`AGENTS.md`](AGENTS.md)
2. [`docs/PROJECT_CONTEXT.md`](docs/PROJECT_CONTEXT.md)
3. [`docs/CURRENT_STATE.md`](docs/CURRENT_STATE.md)
4. [`docs/catalog-data-contract.md`](docs/catalog-data-contract.md)

Cada checkpoint debe dejar la aplicación en un estado coherente y validable. Los errores de integridad se corrigen antes de añadir nueva funcionalidad.

No usar `git add .`; los stages deben ser explícitos por archivo.
