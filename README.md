# Catálogo Karate-Do

Catálogo público nacional de implementos de Karate-Do para Venezuela. La V1 está orientada a consulta comercial: permite explorar productos, buscar y filtrar el catálogo, revisar fichas y variantes, construir una consulta local y enviarla por WhatsApp.

El proyecto está diseñado deliberadamente sin login, base de datos propia ni backend comercial en esta etapa.

## Estado del proyecto

La V1 funcional está avanzada y actualmente se encuentra en **release candidate**, todavía no promovido a producción.

Producción estable actual:

```text
https://catalogo-karate.pages.dev
```

El sitio se publica en Cloudflare Pages mediante exportación estática de Next.js desde `main`. El deployment utiliza el snapshot comercial versionado en el repositorio y no necesita credenciales de Google Sheets en producción.

Flujo de release:

```text
release-candidate
  -> production-stable
  -> main
  -> Cloudflare Pages
```

El mismo SHA validado debe promoverse sin introducir commits entre la validación final y producción. `production-previous` conserva el checkpoint estable anterior.

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

## Estado de validación del candidato

Último estado comprobado antes del freeze final:

- catálogo comercial: **44 productos totales / 41 activos**;
- variantes: **255**;
- referencias canónicas de imagen: **109**;
- precios: **189**;
- preflight: **0 errores / 9 warnings editoriales**;
- unit tests del último pase funcional: **38/38**;
- build estático: **73/73 páginas**;
- responsive + accesibilidad dirigido: **108/108 E2E**;
- auditoría de imágenes: **0 bloqueadores >1 MiB**, 1 warning residual deliberado;
- últimos ajustes visuales del catálogo: format, lint y build comprobados.

Estas cifras no sustituyen la **validación integral final**, que debe ejecutarse sobre el SHA definitivo después de cerrar contenido/branding pendiente y el pulido visual global.

Los warnings editoriales por características o imágenes todavía no suministradas no bloquean la integridad del runtime y no deben resolverse inventando información.

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
