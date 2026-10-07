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

Este snapshot no representa aún el contenido comercial actual de Google Sheets. No debe actualizarse hasta que los datos comerciales y los assets locales permitan superar la cadena completa de validación.

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

`features` contiene:

- 8 filas demo asociadas a productos demo inactivos;
- 134 features comerciales promovidas;
- 142 filas de datos canónicos en total.

### Datos todavía pendientes de promoción completa

- `variants`: sin variantes comerciales canónicas.
- `variant_options`: sin opciones comerciales canónicas.
- `prices`: mantiene únicamente las 3 filas demo `CONSULT` en el bloque canónico.
- `catalog_intake_variants`: no contiene datos comerciales reales que promover actualmente.
- `catalog_intake_prices`: contiene staging comercial y requiere normalización/promoción controlada.

## 5. Checkpoint de features — cerrado

El staging `catalog_intake_features` contiene 134 filas `READY`.

Al iniciar el checkpoint se confirmó que las referencias todavía eran heterogéneas:

- Best Sport ya usaba `products.id` canónico;
- Mallems usaba SKUs como `MALLEMS-07`;
- Adidas usaba SKUs como `ADIDAS-661_22_20`.

Se normalizó `product_ref` resolviendo cada SKU contra la columna `products.sku` y sustituyéndolo por su `products.id` correspondiente.

La promoción a `features` conserva toda la información editorial mediante esta transformación:

```text
feature = feature_name + ": " + feature_value
```

`feature_ref` permanece como trazabilidad de staging y no forma parte del contrato canónico.

Resultado verificado:

- 134/134 filas comerciales promovidas;
- 0 referencias huérfanas;
- 134 combinaciones `product_id + feature` únicas;
- 134 combinaciones `product_id + sort_order` únicas;
- `sort_order` conservado;
- datos canónicos materializados como valores estáticos, no fórmulas;
- las celdas temporales usadas para validar fueron limpiadas después de la comprobación.

## 6. Assets de imágenes

El Sheet contiene 77 referencias canónicas de imágenes con rutas locales previstas bajo `/images/...`, pero la rama remota todavía no contiene los archivos comerciales correspondientes bajo `public/`.

Por tanto, un sync contra el Sheet comercial actual no puede considerarse publicable hasta incorporar los assets locales y superar `validate-catalog-images.ts`.

No sustituir este pendiente con hotlinks de proveedores.

## 7. Próximo checkpoint técnico exacto

### Checkpoint: normalizar y promover precios comerciales

Objetivo inmediato:

1. inspeccionar las 470 filas con contenido de `catalog_intake_prices` y separar filas reales de filas estructuralmente vacías o heredadas;
2. resolver `product_ref` contra `products.id`, usando `products.sku` únicamente como clave de normalización cuando corresponda;
3. transformar cada fila publicable al contrato `prices(product_id, amount, currency, basis, label, note, sort_order)`;
4. conservar todas las modalidades comerciales válidas sin mezclar `DIRECT_USD`, `USDT`, `EURO_RATE_USD`, `BCV_RATE_USD` y `CONSULT`;
5. asignar `sort_order` estable por producto;
6. evitar duplicados y relaciones huérfanas;
7. validar el resultado antes de avanzar a variantes o al sync completo.

Criterio de cierre:

- todas las filas `READY` publicables resueltas o justificadamente descartadas;
- 0 referencias huérfanas;
- 0 combinaciones comerciales duplicadas introducidas;
- `amount`, `currency` y `basis` cumplen el contrato;
- `sort_order` es determinista dentro de cada producto;
- las 3 filas demo pueden permanecer asociadas a los productos demo inactivos hasta la limpieza final.

## 8. Secuencia posterior

Una vez cerrado el checkpoint de precios:

1. definir/cargar variantes reales solo cuando exista información comercial verificable;
2. incorporar los 77 assets de imágenes locales;
3. ejecutar `npm run catalog:sync`;
4. ejecutar `npm run catalog:preflight` y las validaciones del repositorio;
5. actualizar el snapshot generado;
6. ejecutar build y pruebas antes de integrar la rama.

## 9. Regla de continuidad

El siguiente trabajo debe comenzar por la sección **7. Próximo checkpoint técnico exacto**. No iniciar funcionalidades nuevas de interfaz mientras la normalización y promoción del catálogo comercial siga incompleta.
