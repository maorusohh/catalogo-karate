# Catálogo Karate-Do

Catálogo público nacional de implementos de Karate-Do para Venezuela. La V1 está orientada a consulta comercial: permite explorar productos, filtrar el catálogo, revisar fichas y variantes, construir una consulta local y enviarla por WhatsApp.

El proyecto está diseñado deliberadamente sin login, base de datos propia ni backend comercial en esta etapa.

## Estado del proyecto

La rama de trabajo actual es `feature/profesionalizacion`.

El estado técnico vigente, los datos ya incorporados y el próximo checkpoint están documentados en [`docs/CURRENT_STATE.md`](docs/CURRENT_STATE.md).

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
- Vitest
- Playwright
- Google Sheets API

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
- búsqueda y filtros;
- páginas por categoría y marca;
- ficha de producto;
- variantes cuando existan datos confiables;
- aprobación WKF, nacional, no aprobada o no especificada;
- precios y notas de tasa según el contrato comercial;
- carrito de consulta local;
- generación de consulta por WhatsApp;
- imágenes locales auditadas;
- Google Sheets como CMS editorial.

No incluye en esta fase:

- autenticación;
- cuentas de clientes;
- checkout o pagos;
- inventario transaccional;
- backend propio;
- base de datos propia;
- datos privados de proveedores, costos, márgenes o credenciales.

## Reglas de contribución

Antes de modificar arquitectura, datos o código, leer:

1. [`AGENTS.md`](AGENTS.md)
2. [`docs/PROJECT_CONTEXT.md`](docs/PROJECT_CONTEXT.md)
3. [`docs/CURRENT_STATE.md`](docs/CURRENT_STATE.md)
4. [`docs/catalog-data-contract.md`](docs/catalog-data-contract.md)

Cada checkpoint debe dejar la aplicación en un estado coherente y validable. Los errores de integridad se corrigen antes de añadir nueva funcionalidad.
