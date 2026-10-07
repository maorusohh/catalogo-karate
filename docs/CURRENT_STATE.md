# Catálogo Karate-Do — estado actual

Última revisión canónica: **6 de octubre de 2026**.

Este documento describe el estado comprobado del repositorio y de la fuente editorial. Debe actualizarse al cerrar checkpoints relevantes.

## 1. Rama activa

Rama de trabajo:

```text
feature/profesionalizacion
```

`main` no contiene todavía todos los commits de profesionalización. Hasta que la rama se revise y se integre, el trabajo nuevo debe partir de `feature/profesionalizacion`.

## 2. Base técnica ya implementada

En la rama activa están implementados, entre otros:

- catálogo funcional y ficha de producto;
- páginas por categoría y marca;
- carrito local;
- flujo de consulta por WhatsApp;
- sistema visual reutilizable;
- base SEO;
- adapter tabular y validación del dominio;
- lectura de Google Sheets mediante service account;
- generación de `src/data/catalog-source.google.generated.ts`;
- validación de encoding de texto;
- validación de referencias de imágenes locales;
- reporte de readiness;
- preflight de integridad del catálogo;
- pruebas unitarias con Vitest y E2E con Playwright.

Stack verificado en `package.json`:

- Next.js 16.3.6;
- React 19.2.8;
- Zod 4.6.x;
- Vitest 5;
- Playwright 1.63.x;
- Tailwind CSS 4.

## 3. Estado del snapshot versionado en GitHub

El archivo generado actualmente versionado todavía representa el dataset demo anterior:

- 2 marcas demo;
- 6 categorías;
- 3 productos demo;
- 5 variantes demo;
- 3 precios `CONSULT`;
- 0 imágenes;
- 8 features demo.

Este snapshot no representa aún el contenido comercial actual de Google Sheets.

## 4. Estado comprobado de Google Sheets

Fuente editorial:

```text
Catálogo Karate-Do — Data Source
```

Pestañas canónicas presentes:

- `meta`
- `brands`
- `categories`
- `products`
- `variants`
- `variant_options`
- `prices`
- `images`
- `features`

Staging editorial presente:

- `catalog_intake`
- `catalog_intake_variants`
- `catalog_intake_prices`
- `catalog_intake_images`
- `catalog_intake_features`

### Datos canónicos ya promovidos

`products` contiene 44 productos:

- 41 productos comerciales activos;
- 3 productos demo inactivos.

`images` contiene 77 referencias comerciales promovidas.

### Datos todavía pendientes de promoción completa

- `variants`: sin variantes comerciales canónicas.
- `variant_options`: sin opciones comerciales canónicas.
- `prices`: mantiene únicamente las 3 filas demo `CONSULT` en el bloque canónico.
- `features`: mantiene únicamente 8 filas demo en el bloque canónico.
- `catalog_intake_variants`: no contiene datos comerciales reales que promover actualmente.
- `catalog_intake_prices`: contiene staging comercial y todavía requiere normalización/promoción controlada.
- `catalog_intake_features`: contiene **134 filas `READY`**. Las referencias que antes impedían la promoción ya aparecen normalizadas hacia los identificadores canónicos de producto.

## 5. Assets de imágenes

El Sheet ya contiene 77 referencias canónicas de imágenes, pero en la rama remota `public/images/products/` solo está versionado `.gitkeep`.

Por tanto, un sync contra el Sheet comercial actual no puede considerarse publicable hasta incorporar los archivos locales correspondientes y superar `validate-catalog-images.ts`.

No sustituir este pendiente con hotlinks de proveedores.

## 6. Último bloqueo resuelto

El checkpoint anterior se detuvo porque `catalog_intake_features.product_ref` usaba referencias heterogéneas de proveedor como `MALLEMS-07` o `ADIDAS-661_22_20`, mientras la promoción esperaba el identificador canónico del producto.

La revisión actual confirma que `catalog_intake_features` ya usa referencias normalizadas, por ejemplo:

```text
best-sport-guantes-rojo-azul-aprobados-wkf-1303wkf
ADIDAS-K200DNAKIT
ADIDAS-K200E
```

La causa que bloqueaba la promoción de features ya no está presente en ese staging.

## 7. Próximo checkpoint técnico exacto

### Checkpoint: promover features comerciales al contrato canónico

Objetivo inmediato:

1. promover las 134 filas `READY` de `catalog_intake_features` a `features`;
2. resolver cada `product_ref` contra un producto canónico existente;
3. no crear relaciones huérfanas;
4. conservar el orden editorial mediante `sort_order`;
5. evitar duplicados producto + feature;
6. verificar el resultado antes de continuar con precios.

Criterio de cierre:

- 134/134 filas comerciales promovibles resueltas correctamente;
- 0 referencias huérfanas;
- 0 duplicados introducidos;
- las 8 filas demo pueden permanecer asociadas a los 3 productos demo inactivos hasta la limpieza final;
- no avanzar a la promoción de precios si este checkpoint falla.

## 8. Secuencia posterior

Una vez cerrado el checkpoint de features:

1. normalizar y promover `catalog_intake_prices`;
2. definir/cargar variantes reales solo cuando exista información comercial verificable;
3. incorporar los 77 assets de imágenes locales;
4. ejecutar `npm run catalog:sync`;
5. ejecutar `npm run catalog:preflight` y las validaciones del repositorio;
6. actualizar el snapshot generado;
7. ejecutar build y pruebas antes de integrar la rama.

## 9. Regla de continuidad

El siguiente trabajo debe comenzar por la sección **7. Próximo checkpoint técnico exacto**. No iniciar funcionalidades nuevas de interfaz mientras la normalización y promoción del catálogo comercial siga incompleta.
