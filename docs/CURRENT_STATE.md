# Catálogo Karate-Do — estado actual

Última revisión canónica: **8 de octubre de 2026**.

Este documento es la referencia operativa del proyecto. Resume el estado comprobado de producción, la fuente editorial, las decisiones vigentes y el backlog inmediato. Si una conversación histórica contradice este archivo, debe revisarse primero el repositorio y Google Sheets.

## 1. Estado estable y candidato actual

Repositorio:

```text
maorusohh/catalogo-karate
```

Producción:

```text
https://catalogo-karate.pages.dev
```

Checkpoint estable actualmente publicado:

```text
33c1aec test: cover Adidas Ao Aka competition labels
```

Resultados comprobados del checkpoint estable:

- Prettier: PASSED;
- ESLint: PASSED;
- production build: **73/73** páginas;
- accesibilidad + carrito: **9/9**;
- variantes + Ao/Aka: **21/21**;
- E2E completo: **153/153**.

Checkpoint candidato más reciente:

```text
a66f622 perf: optimize remaining catalog images
```

Validación funcional reciente de `release-candidate`:

- Prettier: PASSED;
- ESLint: PASSED;
- production build: **73/73** páginas;
- SEO E2E dirigido: **9/9**;
- unit tests del bloque de blindajes previo: **32/32**.

Validación de rendimiento posterior:

- auditoría de imágenes: **109** archivos;
- bloqueadores por encima de 1 MiB: **0**;
- warnings por encima de 300 KiB: **1**;
- 10 imágenes adicionales optimizadas y versionadas;
- working tree: limpio tras el checkpoint.

Blindajes vigentes en el candidato:

- K220 DNA conserva **11** variantes;
- K200E conserva **6** rangos;
- `adidas-k200dnakit` no existe como producto canónico;
- `__default__` no aparece en el mensaje de WhatsApp.

El candidato todavía **no** debe considerarse producción hasta completar la validación integral final y el ciclo de promoción correspondiente.

## 2. Flujo de releases

No trabajar directamente sobre producción para cambios nuevos.

Ramas operativas:

```text
release-candidate
production-stable
production-previous
main
```

Contrato:

1. el trabajo nuevo entra en `release-candidate`;
2. se valida localmente;
3. el checkpoint estable anterior pasa a `production-previous`;
4. el SHA validado pasa a `production-stable`;
5. ese mismo SHA pasa a `main` y Cloudflare Pages.

No introducir commits adicionales entre la validación final del candidato y la promoción.

Estado de producción vigente:

```text
main                -> 33c1aec
production-stable   -> 33c1aec
production-previous -> 3321aaa
```

Este esquema permite comparar o recuperar la versión anterior aunque Cloudflare no la muestre de forma destacada en su interfaz.

## 3. Alcance V1

La V1 es un catálogo público nacional de implementos de Karate-Do para Venezuela, orientado a consulta comercial.

Incluye:

- catálogo público;
- búsqueda y filtros;
- categorías y marcas;
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
- base de datos propia.

La V1 debe seguir siendo deliberadamente sencilla y profesional.

## 4. Stack y arquitectura

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

## 5. Google Sheets — fuente editorial canónica

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

## 6. Marcas y navegación

Marcas activas:

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

Compatibilidad histórica:

```text
/marca/* -> /marcas/:splat 301
```

La navegación visible usa **Explorar marcas**.

La home incluye sección de marcas y solo expone filtros con productos activos.

Logos runtime canónicos ya versionados:

```text
public/images/brands/best-sport.webp
public/images/brands/mallems.webp
public/images/brands/no-kashi.png
```

`Generica` y `Adidas` todavía no tienen logo runtime asignado en `brands.logo`.

La carpeta local duplicada `public/images/catalogo/brands/` fue revisada y eliminada tras verificar por SHA-256 que los tres logos usados eran idénticos a los canónicos.

No crear una marca nueva hasta confirmar nombre comercial exacto y material verificable.

## 7. Adidas y variantes

Adidas quedó integrado con variantes reales y verificadas.

Productos con variantes:

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
- `adidas-k200e`: 6 rangos.

Producto corregido:

```text
adidas-k220dnakit
ADIDAS-K220DNAKIT
Kit Karategi Kumite K220 DNA
```

`K200E` es un producto separado y válido.

No debe reaparecer `adidas-k200dnakit` como producto canónico.

Compatibilidad pública:

```text
/producto/adidas-k200dnakit/ -> /producto/adidas-k220dnakit/ 301
```

Las **45 variantes de karategui Adidas** fueron normalizadas en `variants.label` y `variant_options.value`.

Formato visible canónico:

```text
1.40m
1.50m
2.05m
1.00m - 1.10m
Talla 0 · 1.00m - 1.05m
```

Los IDs técnicos no cambian por ajustes de presentación.

## 8. Semántica de opciones y colores

La interfaz usa singular/plural según la cantidad real:

- `Talla:` / `Tallas:`;
- `Color:` / `Colores:`;
- `Longitud:` / `Longitudes:`.

Productos sin ese tipo de opción no muestran una sección artificial.

Ao/Aka se usa únicamente cuando el conjunto real de colores es exactamente el par competitivo azul/rojo.

Para esos productos, la interfaz presenta:

```text
Ao = azul
Aka = rojo
```

La regla aplica a Mallems, Best Sport y Adidas sin cambiar IDs ni datos canónicos.

Los cinturones de grado conservan nombres normales:

- Amarillo;
- Naranja;
- Verde;
- Azul;
- Marrón;
- Otro color a consultar.

Los estados seleccionados mantienen color visual suave y `aria-pressed`.

## 9. Precios y formas de pago

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

`CL` fue un error de dictado referido a Zelle; no existe una forma de pago `CL`.

La UI utiliza `Formas de pago:` o `Precio y formas de pago:` según corresponda.

## 10. Producto, carrito y WhatsApp

La ficha usa el encabezado:

```text
Información del producto:
```

El carrito es local y prepara una consulta por WhatsApp.

El mensaje incluye, cuando corresponde:

- producto;
- marca;
- variante;
- forma de pago elegida;
- cantidad;
- SKU.

La variante técnica `__default__` no se presenta al cliente.

El drawer del carrito:

- gestiona foco como diálogo modal en teclado;
- confina `Tab` / `Shift+Tab` en desktop;
- cierra con `Escape`;
- restaura foco al trigger en interacción de teclado;
- permite cierre por backdrop;
- en pantallas compactas deja una franja exterior real para tocar fuera del drawer.

Los CTA de WhatsApp usan estilo verde consistente.

## 11. Home y páginas informativas

La home contiene:

- hero;
- categorías;
- marcas;
- franja de confianza;
- productos seleccionados;
- bloque “Cómo funciona”;
- CTA de WhatsApp.

`2026 / INDEX` fue eliminado.

Páginas informativas:

- `/como-comprar/`;
- `/entregas/`;
- `/contacto/`;
- `/preguntas-frecuentes/`.

FAQ incorpora una introducción **Quiénes somos** y dudas de compra, disponibilidad, variantes, pagos, aprobaciones y envíos.

Cómo comprar, Envíos y Contacto se mantienen como accesos directos; FAQ los complementa, no los sustituye.

## 12. Accesibilidad y responsive

Implementado y cubierto:

- skip link `Saltar al contenido principal`;
- `aria-pressed` en filtros y opciones aplicables;
- diálogo del carrito con gestión de foco;
- responsive smoke sin overflow en rutas principales;
- cobertura de Marcas y FAQ;
- navegación compacta mobile/tablet y navegación horizontal desktop.

El último checkpoint funcional completo de producción pasó **153/153 E2E**.

## 13. SEO y exportación estática

SEO implementado:

- `metadataBase` global;
- sitemap;
- robots;
- rutas de marcas y FAQ en sitemap;
- canonical explícito en producto, marca y categoría;
- Open Graph dinámico en producto, marca y categoría;
- Twitter metadata dinámica;
- producto reutiliza su primera imagen canónica como imagen social cuando existe;
- marca reutiliza su logo canónico como imagen social cuando existe;
- pruebas E2E específicas de SEO.

Validación del candidato SEO:

```text
9/9 E2E SEO
73/73 build estático
```

Configuración Next.js:

- `output: "export"`;
- `trailingSlash: true`;
- imágenes `unoptimized`.

Build desde:

```text
out
```

Pendiente relacionado con SEO:

- revisar metadatos y canonicales cuando exista dominio definitivo distinto de `catalogo-karate.pages.dev`;
- definir imagen social/branding global definitivo cuando exista el activo de identidad aprobado.

No publicar datos estructurados de ofertas que simplifiquen o contradigan las distintas bases comerciales de precio.

## 14. Rendimiento

Cloudflare usa caché explícita:

- `/_next/static/*`: caché larga e inmutable;
- `/images/*`: caché corta con revalidación.

La arquitectura cliente mantiene la interacción aislada en los componentes que realmente la requieren.

Como `next/image` usa `unoptimized: true`, el peso original de cada imagen importa directamente.

Auditoría repetible:

```text
npm run images:audit
```

Umbrales actuales:

- warning: **300 KiB**;
- bloqueo: **1 MiB**.

Bloqueador original resuelto:

```text
BESTSPORT-2808WKF__03.webp
antes: 2,576,681 bytes (~2.46 MiB)
ahora: 617,972 bytes (~603.5 KiB)
```

La primera optimización preservó las dimensiones originales y quedó versionada en:

```text
9a3bdc6 perf: optimize Best Sport competition belt image
```

Optimización Mallems resuelta:

```text
MALLEMS-22__01.webp
antes: 452,750 bytes (~442.1 KiB)
ahora: 70,938 bytes (~69.3 KiB)
dimensiones: 881x1279
PSNR comprobado: 49.11 dB
```

Quedó versionada en:

```text
c19d6a7 perf: optimize Mallems product image
```

Checkpoint final de optimización de imágenes:

```text
a66f622 perf: optimize remaining catalog images
```

En el lote final se optimizaron otras **10 imágenes**, preservando dimensiones originales y validando cada candidato antes de sustituir el archivo del proyecto.

Resultado final comprobado:

- **109** imágenes revisadas;
- **0** bloqueadores por encima de 1 MiB;
- **1** warning por encima de 300 KiB;
- resultado: PASSED.

Único warning residual deliberado:

```text
BESTSPORT-2808WKF__03.webp = ~603.5 KiB
```

El análisis conservador de recompresión no produjo una variante por debajo de 300 KiB que justificara sustituir la versión actual. Se conserva deliberadamente para evitar una reducción adicional sin suficiente beneficio.

La optimización de peso de imágenes para V1 se considera **cerrada**. Futuras optimizaciones solo deben hacerse cuando exista una mejora material verificable sin degradar calidad, modelo exacto o procedencia.

## 15. Warnings editoriales actuales

Preflight: **0 errores / 9 warnings**.

Sin imagen:

1. `mallems-peto-corporal-karate-do-u14-11`;
2. `mallems-cinturones-grado-bordado-17`;
3. `generica-cinturon-blanco-principiantes-20`;
4. `adidas-k999kit`;
5. `adidas-k999hwt`;
6. `adidas-k192dnakit-v`;
7. `adidas-k220dnakit`;
8. `adidas-k200e`.

Sin características:

9. `mallems-maleta-viajera-28`.

Son warnings editoriales, no fallos de integridad.

## 16. Imágenes

El catálogo tiene **109 referencias canónicas de imágenes**.

Reglas:

- corresponder exactamente al modelo;
- priorizar fabricante, marca, distribuidor autorizado o proveedor;
- preferir producto aislado y fondo limpio cuando sea posible;
- evitar collages, textos añadidos, suciedad y modelos meramente parecidos;
- registrar procedencia cuando exista URL útil;
- nombres preferidos: `SKU__01.webp`, `SKU__02.webp`, etc.

Las imágenes pendientes no bloquean el desarrollo estructural.

## 17. Estado local y recursos de trabajo

Tras el checkpoint de rendimiento `a66f622`, el working tree quedó limpio.

`recursos/` contiene material fuente, auditorías, imágenes extraídas y capturas de revisión. Es deliberadamente local y está excluido mediante:

```text
/recursos/
```

en `.gitignore`.

Commit de higiene:

```text
14b8a00 chore: ignore local project resources
```

La antigua carpeta local redundante:

```text
public/images/catalogo/brands/
```

fue eliminada después de verificar que Best Sport, Mallems y No Kashi coincidían por SHA-256 con los logos runtime canónicos.

Los originales previos de las optimizaciones de imágenes se conservaron únicamente como respaldos temporales fuera del repositorio durante la validación.

No existe actualmente ningún archivo deliberadamente modificado o no rastreado que deba preservarse dentro del working tree.

Sigue vigente la regla:

```text
NO usar git add .
```

Los stages deben ser explícitos por archivo.

## 18. Deployment

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
- producción consume el snapshot versionado y no necesita credenciales de Google Sheets para el deployment ordinario.

La verificación pública de cada deployment es separada del build local.

## 19. Backlog inmediato

### Cerrado

- ✅ catálogo, búsqueda y filtros;
- ✅ fichas de producto;
- ✅ carrito local y WhatsApp;
- ✅ Google Sheets + snapshot;
- ✅ directorio y páginas de marcas;
- ✅ navegación `/marcas/[slug]`;
- ✅ home con sección de marcas;
- ✅ FAQ + Quiénes somos;
- ✅ variantes Adidas restauradas;
- ✅ K220 DNA corregido;
- ✅ redirección K200 DNA -> K220 DNA;
- ✅ tallas Adidas estandarizadas;
- ✅ semántica singular/plural;
- ✅ Ao/Aka competitivo en Mallems, Best Sport y Adidas;
- ✅ colores de cinturones de grado;
- ✅ skip link y foco modal del carrito;
- ✅ cierre del carrito por backdrop en pantallas compactas;
- ✅ responsive smoke de rutas principales;
- ✅ caché de assets Cloudflare;
- ✅ robots + sitemap;
- ✅ canonical dinámico + Open Graph + Twitter metadata;
- ✅ auditoría repetible de peso de imágenes;
- ✅ bloqueador Best Sport reducido por debajo de 1 MiB;
- ✅ Mallems-22 optimizada y versionada;
- ✅ lote final de 10 imágenes adicionales optimizado;
- ✅ auditoría final de imágenes: 109 revisadas, 0 bloqueadores y 1 warning residual deliberado;
- ✅ `recursos/` excluido como material local;
- ✅ logos locales redundantes revisados y eliminados;
- ✅ flujo `release-candidate` -> `production-stable` -> `main`;
- ✅ 73/73 build y 153/153 E2E del último release estable;
- ✅ 32/32 unit tests de blindaje;
- ✅ 73/73 build + 9/9 SEO E2E del candidato previo al bloque de imágenes.

### Pendiente

- ⬜ incorporar logo definitivo del Catálogo Karate-Do para reemplazar el marcador `KD`;
- ⬜ incorporar logo Adidas cuando exista un activo exacto aprobado;
- ⬜ completar imágenes faltantes con fuentes fiables;
- ⬜ completar características de la maleta Mallems cuando exista información fiable;
- ⬜ incorporar nueva marca cuando exista nombre/material exacto;
- ⬜ revisar SEO al migrar a un dominio definitivo, si ocurre;
- ⬜ pulido visual final;
- ⬜ validación integral final del candidato;
- ⬜ promoción exacta del SHA validado;
- ⬜ smoke público final en Cloudflare;
- ⬜ cierre V1.

## 20. Regla de continuidad

Prioridad: **funcionalidad y estructura antes que decoración**.

Ante un error se corrige la causa integral antes de avanzar.

Los cambios deben mantener rutas, imports, tipos y build válidos y terminar en un checkpoint funcional.

Cambiar únicamente lo solicitado, salvo dependencias directas necesarias para mantener coherencia o evitar romper funcionalidad relacionada.

No inventar datos comerciales, variantes, fotos, precios o características.

Las imágenes y el pulido visual no deben bloquear el avance funcional mientras la ausencia esté representada de forma segura.
