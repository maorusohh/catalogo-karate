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

`prices` contiene:

- 3 filas demo `CONSULT` asociadas a productos demo inactivos;
- 123 precios comerciales promovidos;
- 126 filas de datos canónicos en total.

Los 41 productos comerciales tienen exactamente tres modalidades de precio publicables:

- `DIRECT_USD`;
- `USDT`;
- `EURO_RATE_USD`.

### Variantes

- `variants`: sin variantes comerciales canónicas.
- `variant_options`: sin opciones comerciales canónicas.
- `catalog_intake_variants`: no contiene datos comerciales verificables; solo filas estructuralmente vacías con `available=false`.

No se deben inventar tallas, colores ni combinaciones. La carga de variantes queda diferida hasta disponer de información comercial verificable.

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

## 6. Checkpoint de precios — cerrado

`catalog_intake_prices` mezcla un bloque histórico sin `status` con un bloque editorial publicable marcado como `READY`.

La clasificación comprobada fue:

- 127 filas con `status = READY`;
- 123 filas `READY` completas con `product_ref` y `basis`;
- 4 filas `READY` estructuralmente vacías usadas como separadores;
- 0 referencias huérfanas después de normalizar los SKUs hacia `products.id`.

Solo las 123 filas completas se promovieron. El histórico sin `status` quedó fuera por diseño.

`sort_order` se normalizó de forma determinista:

```text
DIRECT_USD = 1
USDT = 2
EURO_RATE_USD = 3
BCV_RATE_USD = 4
CONSULT = 5
```

Antes de cerrar la promoción se eliminaron de las notas canónicas referencias internas como costos, precio de instructor y margen. Los detalles públicos de talla, composición del pack o condición provisional se conservaron cuando eran relevantes.

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
- 0 menciones de `Instructor`, `Costo` o `margen` en las notas canónicas;
- datos materializados como valores estáticos, no fórmulas;
- las celdas temporales de validación fueron limpiadas.

El staging conserva material editorial e histórico no publicable. No debe copiarse de forma indiscriminada al contrato canónico.

## 7. Assets de imágenes

El Sheet contiene 77 referencias canónicas de imágenes con rutas locales bajo `/images/catalogo/products/...`.

La rama remota todavía no contiene el directorio comercial correspondiente `public/images/catalogo/products/`.

Se comprobó además que una búsqueda en el Google Drive conectado por un nombre representativo (`BESTSPORT-1303WKF__01`) no encontró el asset; solo apareció la referencia dentro del Sheet.

Por tanto, el catálogo comercial todavía no puede superar `validate-catalog-images.ts` ni considerarse publicable.

No sustituir este pendiente con hotlinks de proveedores.

## 8. Próximo checkpoint técnico exacto

### Checkpoint: incorporar y auditar los 77 assets locales de producto

Objetivo inmediato:

1. obtener los 77 archivos `.webp` que corresponden a las rutas ya registradas en `images`;
2. ubicarlos bajo `public/images/catalogo/products/` respetando exactamente nombres y mayúsculas/minúsculas;
3. verificar que cada `images.src` resuelva a un archivo local existente;
4. comprobar que todos los productos con imágenes tengan una imagen principal coherente;
5. detectar archivos huérfanos, duplicados o referencias faltantes;
6. no modificar las URLs canónicas del Sheet salvo que exista una discrepancia real con el asset auditado.

Criterio de cierre:

- 77/77 referencias canónicas resuelven a archivos locales;
- 0 rutas faltantes;
- 0 hotlinks usados como sustituto de producción;
- `npm run catalog:sync` puede avanzar más allá de `validate-catalog-images.ts`.

## 9. Secuencia posterior

Una vez incorporados los assets:

1. ejecutar `npm run catalog:sync`;
2. ejecutar `npm run catalog:report` y `npm run catalog:preflight`;
3. revisar el snapshot generado completo;
4. ejecutar `npm run format:check`, `npm run lint`, `npm run test:unit` y `npm run build`;
5. ejecutar E2E cuando el entorno lo permita;
6. actualizar esta documentación con el resultado real;
7. revisar la integración de `feature/profesionalizacion` hacia `main`.

## 10. Regla de continuidad

El siguiente trabajo debe comenzar por la sección **8. Próximo checkpoint técnico exacto**. No iniciar funcionalidades nuevas de interfaz mientras los assets comerciales y la validación integral del catálogo sigan incompletos.
