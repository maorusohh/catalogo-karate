# Catálogo Karate-Do — contexto canónico del proyecto

## 1. Objetivo

Construir un catálogo público nacional de implementos de Karate-Do para Venezuela, profesional pero deliberadamente sencillo, que permita consultar productos reales y preparar una solicitud comercial por WhatsApp.

La V1 no es un e-commerce transaccional. Es un catálogo de consulta.

## 2. Alcance funcional de la V1

La experiencia pública contempla:

- navegación de catálogo;
- búsqueda y filtros;
- categorías y marcas;
- fichas de producto;
- fotografías;
- variantes cuando exista información confiable;
- estado de aprobación deportiva;
- precio o modalidad de consulta;
- carrito local de consulta múltiple;
- generación de mensaje de WhatsApp con el resumen de la consulta.

Los envíos y la coordinación comercial ocurren fuera de la aplicación.

## 3. Fuera de alcance por ahora

No introducir en la V1, salvo cambio explícito de requisitos:

- login o registro;
- cuentas de clientes;
- checkout;
- cobro en línea;
- inventario transaccional;
- órdenes persistidas;
- backend propio;
- base de datos propia;
- panel administrativo propio;
- integración directa con MAORUSO CORE.

La arquitectura puede permitir una evolución futura, pero no debe implementarla anticipadamente.

## 4. Arquitectura aprobada

La separación estable es:

```text
Source -> Adapter -> Validation -> Catalog -> Repository -> Frontend
```

Fuente editorial actual:

```text
Google Sheets
```

Integración del repositorio:

```text
Google Sheets
  -> scripts/sync-catalog-from-google.ts
  -> src/data/catalog-source.google.generated.ts
  -> src/lib/catalog/source/*
  -> Catalog
  -> CatalogRepository
  -> UI
```

La UI no conoce la estructura de Google Sheets y nunca consulta la hoja desde el navegador.

## 5. Fuente de verdad y staging

Google Sheets es la fuente editorial canónica del catálogo comercial.

El runtime solo consume las pestañas canónicas:

- `meta`
- `brands`
- `categories`
- `products`
- `variants`
- `variant_options`
- `prices`
- `images`
- `features`

Las pestañas `catalog_intake` y `catalog_intake_*` son zonas de preparación, importación y normalización. Sus filas no son publicables hasta ser promovidas al contrato canónico.

El snapshot TypeScript generado se versiona para mantener un estado reproducible del catálogo, pero no se edita a mano.

## 6. Reglas de dominio relevantes

### Aprobación

Valores públicos admitidos:

- `WKF`
- `NATIONAL`
- `NON_APPROVED`
- `UNSPECIFIED`

No declarar una aprobación que no esté respaldada por información verificable.

### Disponibilidad

Valores admitidos:

- `AVAILABLE`
- `CONSULT`
- `OUT_OF_STOCK`
- `COMING_SOON`

### Precios

El catálogo soporta distintas bases comerciales sin almacenar costos internos:

- `DIRECT_USD`
- `BCV_RATE_USD`
- `EURO_RATE_USD`
- `USDT`
- `CONSULT`

La presentación al cliente debe respetar la semántica del dato fuente; no convertir silenciosamente una base de precio en otra.

### Variantes

Las variantes deben modelar combinaciones realmente seleccionables. No inventar talla, color o disponibilidad cuando la fuente no lo indique.

### Imágenes

Las imágenes publicadas se sirven desde assets locales del proyecto. La URL del proveedor puede conservarse como trazabilidad editorial, pero no sustituye el asset local de producción.

## 7. Separación de datos públicos y privados

El catálogo público no debe contener:

- costos de adquisición;
- márgenes;
- comisiones;
- condiciones privadas de proveedores;
- datos de clientes;
- credenciales;
- tokens;
- secretos;
- datos privados del ERP.

Esa información pertenece a otros sistemas.

## 8. Principios de trabajo

- Evitar sobreingeniería.
- Mantener la aplicación funcional en cada checkpoint.
- Resolver errores de raíz antes de avanzar.
- Favorecer datos verificables frente a completar campos por suposición.
- Mantener contratos explícitos entre fuente, dominio e interfaz.
- Tratar Google Sheets como CMS editorial, no como base de datos transaccional.
- Mantener abierta la posibilidad de cambiar la fuente futura sin acoplar la UI.

## 9. Documentación relacionada

- `README.md`: uso del repositorio y comandos.
- `docs/CURRENT_STATE.md`: estado vivo y próximo checkpoint.
- `docs/catalog-data-contract.md`: contrato técnico de datos.
- `AGENTS.md`: reglas operativas para trabajo asistido sobre el repositorio.
