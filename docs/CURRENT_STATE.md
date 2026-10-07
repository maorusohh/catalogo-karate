# Catálogo Karate-Do — estado actual

Última revisión canónica: **7 de octubre de 2026**.

Este documento describe el estado comprobado del repositorio, la fuente editorial, el cierre técnico de la V1 y los checkpoints posteriores ya integrados en `main`.

## 1. Estado de ramas

Rama estable por defecto:

```text
main
```

`main` contiene el checkpoint de imágenes publicado en el commit:

```text
3343f73 feat: complete catalog product images checkpoint
```

La rama `feature/catalog-ux-main-rebuild` permanece separada. Al cierre de esta revisión contiene 7 commits propios y está 1 commit por detrás de `main`. No debe fusionarse automáticamente: sus cambios de índices de navegación deben revisarse como checkpoint independiente.

## 2. Alcance V1 cerrado

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

## 4. Estado canónico de Google Sheets y snapshot

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

Estado comprobado por el preflight actual:

- 7 marcas registradas;
- 5 marcas activas;
- 25 categorías;
- 44 productos totales;
- 41 productos comerciales activos;
- 3 productos demo inactivos;
- 158 variantes;
- 105 referencias canónicas de imágenes;
- 177 precios.

El snapshot generado `src/data/catalog-source.google.generated.ts` representa este estado y no debe editarse manualmente.

## 5. Variantes y precios — checkpoint integrado

La etapa anterior que mantenía variantes diferidas ya fue superada con datos comerciales verificados.

El catálogo actual soporta:

- 158 variantes en el estado validado;
- precios a nivel de producto;
- precios específicos por variante cuando corresponda;
- resolución de precio según la variante seleccionada;
- bloqueo de adición al carrito cuando no existe un precio resoluble;
- tarjetas de catálogo conservando el resumen de precio a nivel de producto.

Los commits de `main` incluyen cobertura unitaria y E2E para tallaje, protecciones, precios dependientes de talla y referencias de precio por variante.

La regla de dominio se mantiene: no inventar tallas, colores, combinaciones ni precios que no estén respaldados por información comercial verificable.

## 6. Assets de producto — checkpoint actualizado

El catálogo dispone actualmente de **105 referencias canónicas de imágenes**.

El checkpoint más reciente incorporó exactamente **28 nuevos archivos WebP** bajo:

```text
public/images/catalogo/products/
```

La validación ejecutada después del sync confirmó:

```text
Catalog image validation passed. References checked: 105.
```

Quedan exactamente 3 productos activos sin imagen:

- `mallems-cinturones-grado-bordado-17`;
- `generica-cinturon-blanco-principiantes-20`;
- `adidas-k200dnakit`.

El caso `adidas-k200dnakit` está bloqueado deliberadamente: las fotografías suministradas muestran identificación **K220 DNA / K220DNAKIT**, mientras el producto canónico actual es **K200 DNA / ADIDAS-K200DNAKIT**. No se deben publicar esas fotografías bajo K200 hasta confirmar o corregir la identidad comercial del producto.

La fotografía Mallems no identificada que se separó durante el intake permanece descartada y sin asignar.

## 7. Features — pendiente editorial mínimo

El preflight actual solo detecta un producto activo sin características:

```text
mallems-maleta-viajera-28
```

No debe completarse con información inventada. Se cerrará cuando exista una fuente comercial confiable para sus características.

## 8. Logos de marca

El contrato runtime ya enlaza logos locales para:

- Best Sport -> `/images/brands/best-sport.webp`;
- Mallems -> `/images/brands/mallems.webp`;
- No Kashi -> `/images/brands/no-kashi.png`.

`Generica` y `Adidas` continúan con `brands.logo` vacío.

La carpeta local no rastreada `public/images/catalogo/brands/` no forma parte del contrato runtime actual y no debe agregarse al repositorio sin una auditoría específica de su contenido.

## 9. Validación integral del estado actual

Cadena ejecutada y aprobada sobre `main`:

```text
npm run catalog:preflight
npm run format:check
npm run lint
npm run test:unit
npm run build
npm run test:e2e
```

Resultados comprobados:

- preflight: 0 errores;
- warnings editoriales: 4;
- imágenes: 105 referencias;
- variantes: 158;
- precios: 177;
- Prettier: PASSED;
- ESLint: PASSED;
- unit tests: 31/31;
- production build: PASSED;
- páginas estáticas generadas: 69/69;
- E2E Playwright: 99/99.

Los 4 warnings actuales son:

1. imagen faltante: `mallems-cinturones-grado-bordado-17`;
2. imagen faltante: `generica-cinturon-blanco-principiantes-20`;
3. features faltantes: `mallems-maleta-viajera-28`;
4. imagen faltante: `adidas-k200dnakit`.

No son errores de integridad y no deben resolverse inventando datos.

## 10. Integración Git

El checkpoint de imágenes quedó publicado en `main` como fast-forward desde el estado anterior:

```text
436cca7 -> 3343f73
```

El push HTTPS devolvió errores internos de GitHub incluso con un commit vacío de diagnóstico. El mismo commit se publicó correctamente por SSH.

La configuración local del proyecto puede usar:

```text
git@github.com:maorusohh/catalogo-karate.git
```

como URL de `origin` para fetch y push.

La rama temporal local `push-diagnostic` fue eliminada después de la prueba.

## 11. Deployment

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
- variables de entorno del catálogo en producción: ninguna requerida para el deployment ordinario.

La V1 ya estaba publicada y auditada antes del último checkpoint. Tras el commit `3343f73`, el push a `main` quedó confirmado; corresponde realizar un smoke check de producción para verificar que Cloudflare haya desplegado también las nuevas imágenes.

La herramienta web externa usada en esta sesión no puede resolver temporalmente el subdominio `pages.dev`, por lo que esa comprobación debe hacerse desde el entorno local o desde el panel de Cloudflare.

## 12. Backlog editorial y de assets

Además de los 4 warnings activos, existe material que no debe mezclarse con el catálogo vigente sin una decisión explícita:

- fotografías K220 bloqueadas hasta resolver K200/K220;
- fotografías de productos Adidas y Senshi que actualmente no corresponden a productos canónicos activos;
- la fotografía Mallems no identificada descartada;
- assets locales dentro de `recursos/`, que permanecen fuera del repositorio por diseño;
- `public/images/catalogo/brands/`, carpeta local no rastreada pendiente de auditoría antes de cualquier posible uso.

## 13. Pendientes posteriores a V1 — orden recomendado

Prioridad operativa:

1. ejecutar smoke check del deployment posterior a `3343f73`;
2. cerrar la documentación canónica con este estado actualizado;
3. conseguir o verificar imágenes para `mallems-cinturones-grado-bordado-17`;
4. conseguir o verificar imagen para `generica-cinturon-blanco-principiantes-20`;
5. resolver comercialmente la discrepancia Adidas K200/K220 antes de publicar fotografías;
6. completar features de `mallems-maleta-viajera-28` cuando exista información confiable;
7. decidir si Adidas y/o Generica requieren logo propio en `brands.logo`;
8. auditar y decidir el destino de `public/images/catalogo/brands/` y del material futuro en `recursos/`;
9. revisar por separado los 7 commits de `feature/catalog-ux-main-rebuild` y decidir si se integran, se rehacen sobre `main` o se archivan;
10. optimizar warnings de rendimiento LCP de imágenes above-the-fold si siguen presentes en mediciones actuales;
11. repetir una auditoría externa desde otro punto de red cuando resulte útil;
12. evaluar un dominio personalizado solo si existe necesidad comercial real.

## 14. Regla de continuidad

La V1 permanece cerrada y publicada. No reabrir arquitectura, backend, autenticación, pagos ni inventario para este alcance.

Todo trabajo nuevo debe partir de `main`, preservar el contrato de datos existente y tratar cada mejora editorial, de assets, UX, rendimiento, branding o dominio como un checkpoint independiente.

Cuando un dato comercial no sea verificable, debe permanecer pendiente antes que ser completado por suposición.
