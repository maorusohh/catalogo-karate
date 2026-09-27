# Catálogo Karate-Do — Contrato de datos comerciales

## 1. Objetivo

Este documento define el contrato que debe cumplir cualquier fuente de datos del catálogo público.

La interfaz no depende directamente de Google Sheets, CSV, JSON, API o base de datos.

Toda fuente debe transformarse al modelo Catalog antes de llegar al CatalogRepository.

Flujo:

Source -> Adapter -> Validation -> Catalog -> Repository -> Frontend

Un error de estructura, validación o integridad debe impedir la publicación.

## 2. Datos públicos e internos

La fuente pública solo contiene información que puede mostrarse al cliente.

No debe contener:

- costos de adquisición;
- proveedores internos;
- márgenes;
- comisiones;
- negociaciones;
- datos de clientes;
- credenciales;
- tokens;
- información privada del ERP.

Los datos internos pertenecen a sistemas separados.

## 3. Fuente tabular prevista

Google Sheets utilizará estas pestañas:

- meta
- brands
- categories
- products
- variants
- variant_options
- prices
- images
- features

Los nombres de las pestañas forman parte del contrato.

## 4. meta

Columnas:

- key
- value

Versión inicial:

schema_version = 1

El adapter debe rechazar versiones incompatibles.

## 5. brands

Columnas:

- id
- slug
- name
- description
- logo
- active

Reglas:

- id único y estable;
- slug único y estable;
- name obligatorio;
- logo opcional;
- active controla publicación.

## 6. categories

Columnas:

- id
- slug
- name
- description
- parent_id
- active

Reglas:

- id único y estable;
- slug único y estable;
- parent_id puede estar vacío;
- si existe parent_id debe referenciar una categoría válida;
- active controla publicación.

## 7. products

Columnas:

- id
- sku
- slug
- name
- brand_id
- category_id
- short_description
- description
- approval
- approval_note
- availability
- featured
- active

Approval permitido:

WKF
NATIONAL
NON_APPROVED
UNSPECIFIED

Availability permitido:

AVAILABLE
CONSULT
OUT_OF_STOCK
COMING_SOON

Reglas:

- id, sku y slug deben ser únicos;
- brand_id debe existir;
- category_id debe existir;
- slug debe ser estable;
- active=false impide publicación.

## 8. variants

Columnas:

- id
- product_id
- label
- available

Reglas:

- product_id debe existir;
- id debe identificar de forma única la variante;
- available=false impide selección;
- una variante no puede existir sin producto.

## 9. variant_options

Columnas:

- variant_id
- name
- value
- sort_order

Reglas:

- variant_id debe existir;
- name y value son obligatorios;
- sort_order determina el orden visual;
- las combinaciones válidas pertenecen a la variante.

## 10. prices

Columnas:

- product_id
- amount
- currency
- basis
- label
- note
- sort_order

Basis permitido:

DIRECT_USD
BCV_RATE_USD
EURO_RATE_USD
USDT
CONSULT

Currency permitido:

USD
USDT

Para CONSULT:

amount vacío
currency vacío
basis = CONSULT

Para cualquier precio monetario:

amount > 0
currency válida
basis distinta de CONSULT

No almacenar costos internos ni márgenes.

## 11. images

Columnas:

- product_id
- src
- alt
- source_type
- source_url
- sort_order

Source_type permitido:

OWN
MANUFACTURER
PROVIDER
OTHER

Reglas:

- product_id debe existir;
- src y alt son obligatorios;
- sort_order controla la galería;
- no publicar rutas privadas ni credenciales.

## 12. features

Columnas:

- product_id
- feature
- sort_order

Reglas:

- product_id debe existir;
- feature obligatorio;
- sort_order controla el orden.

## 13. Identificadores

Los IDs son claves estables.

No deben depender de:

- número de fila;
- posición del registro;
- nombre comercial;
- slug.

Las relaciones deben usar:

brand_id
category_id
product_id
variant_id

## 14. Slugs

Los slugs son identificadores públicos para URL.

Deben ser:

- únicos;
- legibles;
- estables;
- independientes del número de fila.

Cambiar un slug publicado puede romper URLs existentes.

## 15. Valores vacíos

Un campo opcional vacío representa ausencia.

No utilizar como sustitutos artificiales:

N/A
-

NULL
sin información
consultar

El adapter debe convertir correctamente los valores vacíos al modelo interno.

## 16. Booleanos y números

Los booleanos deben usar únicamente:

TRUE
FALSE

Los números deben ser valores numéricos reales.

No almacenar precios como:

$15
15 USD
15,00

La presentación del precio corresponde a la interfaz.

## 17. Modelo interno

La fuente tabular debe convertirse a:

Catalog

- brands[]
- categories[]
- products[]
  - variants[]
    - options[]
  - prices[]
  - images[]
  - features[]

La UI nunca debe conocer la estructura de las pestañas.

## 18. Orden de transformación

El adapter procesa lógicamente:

meta
brands
categories
products
variants
variant_options
prices
images
features

Después ejecuta:

catalogSchema
validateCatalogIntegrity

## 19. Validación

Debe existir validación en dos niveles.

Nivel fuente:

- columnas;
- tipos;
- valores;
- duplicados;
- referencias;
- filas incompletas;
- relaciones huérfanas.

Nivel dominio:

- catalogSchema;
- validateCatalogIntegrity.

Cualquier error debe detener el proceso.

## 20. Publicación

Solo llegan al sitio los registros que:

- tienen estructura válida;
- pasan Zod;
- pasan integridad;
- son publicables.

Los registros inactivos pueden permanecer en la fuente sin aparecer en el sitio.

## 21. Fuente actual

La fuente actual es:

src/data/catalog.ts

Se mantendrá durante la transición.

## 22. Fuente futura

La siguiente fuente será Google Sheets.

Google Sheets será consultado durante el build.

El navegador nunca consultará Google Sheets directamente.

La UI continuará utilizando CatalogRepository.

## 23. Seguridad

Las credenciales de la fuente no pertenecen al código público ni al bundle del navegador.

Las credenciales solo deben existir en el entorno de build.

## 24. Evolución

El mismo contrato debe permitir sustituir Google Sheets posteriormente por:

- REST API;
- GraphQL;
- PostgreSQL;
- MAORUSO CORE.

La interfaz pública no debe cambiar por sustituir la fuente.

## 25. Criterio de éxito

La integración será válida cuando una nueva fuente pueda producir el mismo Catalog válido que la fuente actual y todas las pruebas existentes continúen pasando sin modificar los componentes de presentación.

## 26. Estado

Este documento define la versión inicial del contrato comercial público.

La integración técnica de Google Sheets debe cumplir este contrato antes de considerarse completa.
