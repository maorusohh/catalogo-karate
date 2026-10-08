# Catálogo Karate-Do — estado actual

Última revisión canónica: **8 de octubre de 2026**.

Este documento es la referencia operativa del proyecto. Resume el estado comprobado de `main`, la fuente editorial, las decisiones vigentes y el backlog inmediato. Si una conversación histórica contradice este archivo, debe revisarse primero el estado actual del repositorio y de Google Sheets.

## 1. Estado estable actual

Repositorio:

```text
maorusohh/catalogo-karate
```

Rama estable:

```text
main
```

Checkpoint comercial y de datos validado:

```text
ff8807d feat: standardize Adidas karategi size labels
```

Checkpoint posterior de home:

```text
435c14d refine: remove obsolete home index label
```

El catálogo se mantiene funcional en cada checkpoint y todo trabajo nuevo debe preservar ese criterio.

## 2. Alcance V1

La V1 es un catálogo público nacional de implementos de Karate-Do para Venezuela, orientado a consulta comercial.

Incluye:

- catálogo público;
- búsqueda y filtros;
- navegación por categorías y marcas;
- fichas de producto;
- variantes verificadas;
- precios y formas de pago;
- carrito local;
- consulta por WhatsApp;
- Google Sheets como CMS editorial;
- exportación estática;
- publicación en Cloudflare Pages.

No incluye:

- login;
- cuentas de clientes;
- checkout;
- pagos en línea;
- inventario transaccional;
- backend propio;
- base de datos propia;
- información privada de proveedores, costos, márgenes o credenciales.

La V1 debe seguir siendo deliberadamente sencilla y profesional. No reabrir arquitectura, autenticación, pagos o inventario salvo necesidad nueva y explícita.

## 3. Stack y arquitectura

Stack verificado:

- Next.js 16.3.6;
- React 19.2.8;
- TypeScript;
- Tailwind CSS 4;
- Zod 4.6.x;
- Vitest 5.0.2;
- Playwright 1.63.x;
- Google Sheets API;
- Cloudflare Pages.

Flujo de datos canónico:

```text
Google Sheets
  -> scripts/sync-catalog-from-google.ts
  -> src/data/catalog-source.google.generated.ts
  -> adapter tabular + validación
  -> Catalog
  -> CatalogRepository
  -> interfaz Next.js
```

La UI no consulta Google Sheets directamente.

`src/data/catalog-source.google.generated.ts` es generado y **no debe editarse manualmente**.

Las pestañas `catalog_intake*` son staging editorial y no forman parte del contrato runtime.

## 4. Google Sheets — fuente editorial canónica

Documento:

```text
Catálogo Karate-Do — Data Source
```

Spreadsheet ID:

```text
1ib6Wd5Nt8Hpn7oHBQJPDNuE2GsskJq-Lcdid3uWeJpw
```

Pestañas runtime:

- `meta`;
- `brands`;
- `categories`;
- `products`;
- `variants`;
- `variant_options`;
- `prices`;
- `images`;
- `features`.

Staging editorial:

- `catalog_intake`;
- `catalog_intake_variants`;
- `catalog_intake_prices`;
- `catalog_intake_images`;
- `catalog_intake_features`.

Estado comprobado por sync/preflight el 8 de octubre de 2026:

- **7** marcas registradas;
- **5** marcas activas;
- **25** categorías;
- **44** productos totales;
- **41** productos activos;
- **255** variantes;
- **109** referencias de imágenes;
- **189** precios;
- **0** errores;
- **9** warnings editoriales.

## 5. Marcas y navegación

Marcas activas actuales:

- Best Sport;
- Mallems;
- No Kashi;
- Generica;
- Adidas.

Rutas canónicas:

```text
/marcas/
/marcas/[slug]/
```

La antigua ruta singular se eliminó del App Router. Cloudflare conserva redirección de compatibilidad:

```text
/marca/* -> /marcas/:splat 301
```

La home incluye una sección reutilizable de marcas y solo deben exponerse filtros de marcas que tengan productos activos.

`Generica` y `Adidas` todavía no tienen logo runtime asignado en `brands.logo`.

Una nueva marca del mismo proveedor está pendiente de alta. No crearla hasta confirmar el **nombre comercial exacto** y recibir/validar su material comercial.

## 6. Adidas — estado corregido

Adidas quedó integrado con variantes reales y verificadas.

Productos con variantes actuales:

- `adidas-661-22-20`: XS/S/M/L/XL × Rojo/Azul;
- `adidas-661-35-20`: XS/S/M/L/XL × Rojo/Azul;
- `adidas-adip03`: XS/S/M/L/XL;
- `adidas-adithgm01k`: XS/S/M;
- `adidas-adipkid`: S/M/L/XL;
- `adidas-adibp06wkf`: S/M/L/XL;
- `adidas-adibp12`: XS/S/M/L;
- `adidas-k999kit`: 8 tallas;
- `adidas-k999hwt`: 8 tallas;
- `adidas-k192dnakit-v`: 12 tallas;
- `adidas-k220dnakit`: 11 tallas;
- `adidas-k200e`: 6 rangos de talla.

El producto antes identificado erróneamente como K200 DNA fue corregido a:

```text
adidas-k220dnakit
ADIDAS-K220DNAKIT
Kit Karategi Kumite K220 DNA
```

`K200E` sigue siendo un producto separado y válido.

No debe reaparecer `adidas-k200dnakit` como producto canónico.

## 7. Formato métrico y semántica de variantes

Formato visible canónico:

```text
1.40m
1.50m
2.05m
1.00m - 1.10m
Talla 0 · 1.00m - 1.05m
```

Las **45 variantes de karategui Adidas** fueron normalizadas tanto en `variants.label` como en `variant_options.value`.

Los IDs técnicos no cambian por ajustes de presentación.

La interfaz usa singular/plural según la cantidad real de opciones:

- `Talla:` / `Tallas:`;
- `Color:` / `Colores:`;
- `Longitud:` / `Longitudes:`.

Productos sin ese tipo de opción no muestran una sección artificial.

Ao/Aka solo se muestra cuando el conjunto real de colores es exclusivamente competitivo azul/rojo.

Los cinturones de grado usan sus nombres de color normales:

- Amarillo;
- Naranja;
- Verde;
- Azul;
- Marrón;
- Otro color a consultar.

El estado seleccionado de esos colores utiliza un fondo suave del color correspondiente y mantiene `aria-pressed` para accesibilidad.

## 8. Precios y formas de pago

El modelo soporta precios de producto y precios específicos por variante.

Bases soportadas:

```text
DIRECT_USD
BCV_RATE_USD
EURO_RATE_USD
USDT
CONSULT
```

Monedas runtime:

```text
USD
USDT
```

Adidas usa, cuando corresponda:

1. `USD / Divisas`;
2. `USD / Zelle`;
3. `EUR / BCV`.

No se ofrece USDT/Binance para Adidas bajo el contrato comercial actual.

La mención histórica `CL` fue un error de dictado referido a **Zelle**; no existe una forma de pago `CL`.

La UI utiliza ahora `Formas de pago:` o `Precio y formas de pago:` según el caso.

## 9. Producto, carrito y WhatsApp

La ficha de producto incluye el encabezado:

```text
Información del producto:
```

El carrito es local y la consulta final se genera por WhatsApp.

El mensaje incluye, cuando corresponde:

- producto;
- marca;
- variante;
- forma de pago elegida;
- cantidad;
- SKU.

La variante técnica `__default__` no debe presentarse al cliente como una variante comercial.

Los CTA de WhatsApp del home y Contacto comparten el estilo verde e iconografía consistente.

## 10. Home y páginas informativas

La home contiene actualmente:

- hero;
- accesos por categorías;
- sección de marcas;
- franja de confianza;
- productos seleccionados;
- bloque “Cómo funciona”;
- CTA de WhatsApp.

La etiqueta decorativa obsoleta:

```text
2026 / INDEX
```

fue eliminada del hero en `435c14d`.

Páginas informativas:

- `/como-comprar/`;
- `/entregas/`;
- `/contacto/`.

“Cómo comprar” y “Entregas” ya tienen CTA coherentes con el flujo actual y no contienen copy de prototipo como “en esta primera versión”.

## 11. SEO y exportación estática

SEO básico implementado:

- `metadataBase`;
- sitemap estático/dinámico;
- robots;
- rutas anidadas de marcas en sitemap;
- pruebas E2E básicas de SEO.

`robots.ts` y `sitemap.ts` están configurados para funcionar con `output: "export"`.

Configuración de Next.js:

- `output: "export"`;
- `trailingSlash: true`;
- imágenes `unoptimized`.

Build publicado desde:

```text
out
```

SEO avanzado sigue pendiente: canonical dinámico fino, social previews finales y revisión asociada al dominio definitivo.

## 12. Warnings editoriales actuales

El preflight reporta **0 errores y 9 warnings**.

Productos activos sin imagen:

1. `mallems-peto-corporal-karate-do-u14-11`;
2. `mallems-cinturones-grado-bordado-17`;
3. `generica-cinturon-blanco-principiantes-20`;
4. `adidas-k999kit`;
5. `adidas-k999hwt`;
6. `adidas-k192dnakit-v`;
7. `adidas-k220dnakit`;
8. `adidas-k200e`.

Producto activo sin características:

9. `mallems-maleta-viajera-28`.

Son warnings editoriales, no fallos de integridad. No deben resolverse inventando información o usando imágenes de modelos parecidos.

## 13. Imágenes

El catálogo tiene **109 referencias canónicas de imágenes**.

Reglas vigentes:

- debe corresponder exactamente al modelo;
- priorizar fabricante, marca, distribuidor autorizado o proveedor;
- preferir producto aislado y fondo limpio/blanco cuando sea posible;
- evitar collages, textos añadidos, suciedad e imágenes de productos meramente parecidos;
- registrar procedencia cuando exista una URL útil;
- nombres de archivo preferidos: `SKU__01.webp`, `SKU__02.webp`, etc.

Las imágenes pendientes son **no bloqueantes** para el desarrollo estructural.

## 14. Validación integral más reciente

Cadena comprobada durante el checkpoint actual:

```text
npm run catalog:sync
npm run catalog:preflight
npm run format:check
npm run lint
npm run test:unit
npm run build
npx playwright test tests/e2e/info-pages.spec.ts tests/e2e/variants.spec.ts
npm run test:e2e
```

Resultados:

- Google Sheets sync: PASSED;
- validación de texto: PASSED;
- validación de imágenes: **109** referencias;
- preflight: **0 errores / 9 warnings**;
- Adidas metric standardization: PASSED;
- variantes Adidas de karategui verificadas: **45**;
- variantes totales: **255**;
- Prettier: PASSED;
- ESLint: PASSED;
- unit tests: **31/31**;
- production build: PASSED;
- páginas estáticas: **72/72**;
- E2E focalizado info + variantes: **27/27**;
- E2E completo: **123/123**.

## 15. Estado local deliberadamente fuera de Git

Después del commit `ff8807d`, el entorno local conserva intencionalmente:

```text
M public/images/catalogo/products/MALLEMS-22__01.webp
?? public/images/catalogo/brands/
?? recursos/
```

No usar `git add .`.

`MALLEMS-22__01.webp` debe revisarse como checkpoint de imagen independiente.

`public/images/catalogo/brands/` y `recursos/` requieren revisión explícita antes de decidir si se versionan.

## 16. Deployment

Proveedor:

```text
Cloudflare Pages
```

Producción:

```text
https://catalogo-karate.pages.dev
```

Configuración:

- repositorio: `maorusohh/catalogo-karate`;
- rama de producción: `main`;
- build: `npx next build`;
- salida: `out`;
- no se requieren credenciales de Google Sheets en el deployment público ordinario porque producción consume el snapshot versionado.

La verificación pública de cada nuevo deployment es una comprobación operativa separada del build local.

## 17. Backlog inmediato

### Cerrado

- ✅ catálogo, búsqueda y filtros;
- ✅ fichas de producto;
- ✅ carrito local y WhatsApp;
- ✅ Google Sheets + snapshot;
- ✅ directorio y páginas de marcas;
- ✅ navegación `/marcas/[slug]`;
- ✅ home con sección de marcas;
- ✅ variantes Adidas restauradas;
- ✅ K220 DNA corregido;
- ✅ tallas Adidas estandarizadas;
- ✅ semántica singular/plural de variantes;
- ✅ estados visuales de colores de cinturones de grado;
- ✅ Ao/Aka condicionado a productos competitivos azul/rojo;
- ✅ páginas informativas básicas;
- ✅ robots + sitemap + SEO básico;
- ✅ `2026 / INDEX` eliminado.

### Pendiente

- ⬜ auditoría final de UX del catálogo y fichas;
- ⬜ auditoría de accesibilidad/responsive;
- ⬜ revisión de rendimiento;
- ⬜ SEO avanzado y dominio final;
- ⬜ incorporar nueva marca cuando exista nombre/material exacto;
- ⬜ logo actual de Adidas cuando se proporcione;
- ⬜ decidir redirección específica del antiguo slug K200 DNA al K220 DNA;
- ⬜ revisar `MALLEMS-22__01.webp`;
- ⬜ revisar logos locales no rastreados;
- ⬜ completar imágenes faltantes al final;
- ⬜ completar características de la maleta Mallems cuando exista información fiable;
- ⬜ pulido visual final;
- ⬜ smoke test público final en Cloudflare.

## 18. Regla de continuidad

La prioridad sigue siendo **funcionalidad y estructura antes que decoración**.

Ante un error se corrige la causa integral antes de avanzar a nuevas funcionalidades.

Los cambios sustanciales deben conservar rutas, imports, tipos y build válidos, y deben terminar en un checkpoint funcional.

No inventar datos comerciales, variantes, fotos, precios o características.

Las imágenes y el pulido visual no deben bloquear el avance funcional mientras la ausencia esté representada de forma segura en la interfaz.
