# Catálogo Karate-Do — contrato de datos comerciales

## 1. Objetivo

Este documento define el contrato que debe cumplir cualquier fuente de datos del catálogo público.

La interfaz no depende directamente de Google Sheets, CSV, JSON, API o base de datos.

Toda fuente debe transformarse al modelo `Catalog` antes de llegar al `CatalogRepository`.

```text
Source -> Adapter -> Validation -> Catalog -> Repository -> Frontend
```

Un error de estructura o integridad debe impedir la publicación.

## 2. Datos públicos e internos

La fuente pública solo contiene información que puede mostrarse al cliente.

No debe contener:

- costos de adquisición;
- proveedores internos o condiciones privadas;
- márgenes;
- comisiones;
- negociaciones;
- datos de clientes;
- credenciales;
- tokens;
- información privada del ERP.

Los datos internos pertenecen a sistemas separados.

## 3. Pestañas canónicas

Google Sheets utiliza estas pestañas como contrato publicable:

- `meta`
- `brands`
- `categories`
- `products`
- `variants`
- `variant_options`
- `prices`
- `images`
- `features`

Los nombres y columnas de estas pestañas forman parte del contrato.

Las pestañas `catalog_intake*` son staging editorial y no son consumidas por el adapter del sitio.

## 4. meta

Columnas:

- `key`
- `value`

Versión actual:

```text
schema_version = 1
```

El adapter debe rechazar versiones incompatibles.

## 5. brands

Columnas:

- `id`
- `slug`
- `name`
- `description`
- `logo`
- `active`

Reglas:

- `id` único y estable;
- `slug` único y estable;
- `name` obligatorio;
- `logo` opcional;
- `active` controla publicación.

## 6. categories

Columnas:

- `id`
- `slug`
- `name`
- `description`
- `parent_id`
- `active`

Reglas:

- `id` único y estable;
- `slug` único y estable;
- `parent_id` puede estar vacío;
- si existe `parent_id`, debe referenciar una categoría válida;
- `active` controla publicación.

## 7. products

Columnas:

- `id`
- `sku`
- `slug`
- `name`
- `brand_id`
- `category_id`
- `short_description`
- `description`
- `approval`
- `approval_note`
- `availability`
- `featured`
- `active`

`approval` permitido:

- `WKF`
- `NATIONAL`
- `NON_APPROVED`
- `UNSPECIFIED`

`availability` permitido:

- `AVAILABLE`
- `CONSULT`
- `OUT_OF_STOCK`
- `COMING_SOON`

Reglas:

- `id`, `sku` y `slug` deben ser únicos;
- `brand_id` debe existir;
- `category_id` debe existir;
- `slug` debe ser estable;
- `active=false` impide publicación.

## 8. variants

Columnas:

- `id`
- `product_id`
- `label`
- `available`

Reglas:

- `product_id` debe existir;
- `id` identifica de forma única la variante;
- `available=false` impide selección;
- una variante no puede existir sin producto.

## 9. variant_options

Columnas:

- `variant_id`
- `name`
- `value`
- `sort_order`

Reglas:

- `variant_id` debe existir;
- `name` y `value` son obligatorios;
- `sort_order` determina el orden visual;
- las combinaciones válidas pertenecen a una variante existente.

## 10. prices

Columnas:

- `product_id`
- `amount`
- `currency`
- `basis`
- `label`
- `note`
- `sort_order`

`basis` permitido:

- `DIRECT_USD`
- `BCV_RATE_USD`
- `EURO_RATE_USD`
- `USDT`
- `CONSULT`

`currency` permitida:

- `USD`
- `USDT`

Para `CONSULT`:

- `amount` vacío;
- `currency` vacía;
- `basis = CONSULT`.

Para cualquier precio monetario:

- `amount > 0`;
- `currency` válida;
- `basis` distinta de `CONSULT`.

No almacenar costos internos ni márgenes.

## 11. images

Columnas:

- `product_id`
- `src`
- `alt`
- `source_type`
- `source_url`
- `sort_order`

`source_type` permitido:

- `OWN`
- `MANUFACTURER`
- `PROVIDER`
- `OTHER`

Reglas:

- `product_id` debe existir;
- `src` y `alt` son obligatorios;
- `src` debe apuntar al asset local publicable;
- `sort_order` controla la galería;
- `source_url` conserva trazabilidad editorial cuando aplica;
- no publicar rutas privadas ni credenciales.

## 12. features

Columnas:

- `product_id`
- `feature`
- `sort_order`

Reglas:

- `product_id` debe existir;
- `feature` obligatorio;
- `sort_order` controla el orden;
- no introducir duplicados equivalentes para el mismo producto.

## 13. Identificadores

Los IDs son claves estables.

No deben depender de:

- número de fila;
- posición del registro;
- nombre comercial mutable.

Las relaciones usan:

- `brand_id`
- `category_id`
- `product_id`
- `variant_id`

Los slugs son identificadores públicos de URL y no sustituyen el contrato de relaciones internas salvo cuando el propio `id` canónico se haya definido explícitamente con el mismo valor.

## 14. Slugs

Los slugs deben ser:

- únicos;
- legibles;
- estables;
- independientes del número de fila.

Cambiar un slug publicado puede romper URLs existentes.

## 15. Valores vacíos

Un campo opcional vacío representa ausencia.

No utilizar sustitutos artificiales como:

- `N/A`
- `-`
- `NULL`
- `sin información`

El adapter convierte los valores vacíos al modelo interno correspondiente.

## 16. Booleanos y números

Los booleanos de la fuente deben representar únicamente verdadero o falso.

Los números deben ser valores numéricos reales. La presentación monetaria pertenece a la interfaz o a los campos editoriales `label`/`note`, no al campo `amount`.

## 17. Modelo interno

La fuente tabular se convierte a:

```text
Catalog
- brands[]
- categories[]
- products[]
  - variants[]
    - options[]
  - prices[]
  - images[]
  - features[]
```

La UI nunca conoce la estructura de las pestañas.

## 18. Orden lógico de transformación

El adapter procesa:

1. `meta`
2. `brands`
3. `categories`
4. `products`
5. `variants`
6. `variant_options`
7. `prices`
8. `images`
9. `features`

Después aplica validación de esquema e integridad del dominio.

## 19. Validación

Debe existir validación en dos niveles.

Nivel fuente:

- encabezados y columnas;
- tipos;
- valores permitidos;
- duplicados;
- referencias;
- filas incompletas;
- relaciones huérfanas.

Nivel dominio:

- esquema Zod;
- integridad relacional y reglas de publicación.

Cualquier error bloqueante debe detener el proceso.

## 20. Publicación

Solo llegan al sitio los registros que:

- tienen estructura válida;
- pasan el adapter y Zod;
- pasan integridad;
- cumplen las reglas de publicación.

Los registros inactivos pueden permanecer en la fuente sin aparecer en el sitio.

## 21. Fuente actual y snapshot reproducible

La fuente editorial actual es Google Sheets.

El script:

```text
scripts/sync-catalog-from-google.ts
```

lee las nueve pestañas canónicas y genera:

```text
src/data/catalog-source.google.generated.ts
```

El navegador nunca consulta Google Sheets directamente.

El archivo generado se versiona como snapshot reproducible, pero no se edita manualmente.

## 22. Staging editorial

Las pestañas `catalog_intake` y `catalog_intake_*` pueden contener datos importados, normalizados o pendientes de revisión.

No forman parte del runtime contract.

Una fila solo puede llegar al sitio después de ser promovida a la pestaña canónica correspondiente y superar las validaciones.

## 23. Seguridad

Las credenciales de Google Sheets no pertenecen al código público ni al bundle del navegador.

Solo deben existir en el entorno de build o CI.

Nunca versionar service-account JSON, private keys, tokens o secretos.

## 24. Evolución

El mismo límite `Source -> Adapter -> Catalog` debe permitir sustituir Google Sheets en el futuro por otra fuente —por ejemplo una API, PostgreSQL o MAORUSO CORE— sin reescribir la interfaz pública.

Esa migración no forma parte de la V1 actual.

## 25. Criterio de éxito

La integración es válida cuando la fuente produce un `Catalog` íntegro, reproducible y publicable, y las pruebas y el build continúan pasando sin acoplar los componentes de presentación a la fuente tabular.

## 26. Estado

Este documento describe el contrato comercial público vigente (`schema_version = 1`).

Cualquier cambio incompatible exige actualizar la versión del esquema y la documentación canónica antes de modificar consumidores.
