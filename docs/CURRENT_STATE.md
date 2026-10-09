# Catálogo Karate-Do — estado actual

Última revisión canónica: **9 de octubre de 2026**.

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
9272439 style: format catalog filter refinements
```

Validación funcional reciente del candidato antes de los últimos ajustes exclusivamente visuales de filtros:

- Prettier: PASSED;
- ESLint: PASSED, **0 warnings**;
- unit tests: **38/38** en **8/8** archivos;
- production build: **73/73** páginas;
- responsive + accesibilidad dirigido: **108/108 E2E**.

Tras los últimos ajustes exclusivamente visuales de filtros se volvió a comprobar:

- Prettier: PASSED;
- ESLint: PASSED;
- production build: **73/73** páginas.

La validación integral final del SHA definitivo todavía está pendiente y debe ejecutarse una sola vez cuando termine el contenido/branding pendiente y el pulido visual global.

Blindajes vigentes en el candidato:

- K220 DNA conserva **11** variantes;
- K200E conserva **6** rangos;
- `adidas-k200dnakit` no existe como producto canónico;
- `__default__` no aparece en el mensaje de WhatsApp;
- búsqueda `karategi` / `karategui` / `uniforme` / `kimono` usa equivalencias controladas;
- búsqueda `canillera` / `espinillera` y prefijos inequívocos recupera las protecciones equivalentes, incluido Adidas 661-35-20;
- los filtros distinguen estado neutro de selección explícita de `Todas...`.

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

Último sync/preflight comprobado:

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

Correcciones comerciales recientes ya reflejadas en la fuente canónica:

- No Kashi `Karategi Liviano de Entrenamiento Karate-Do` -> aprobación nacional FVKD;
- Mallems `Maleta Viajera` -> sin homologación;
- Mallems `Bolso Deportivo` -> sin homologación.

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

No crear una marca nueva hasta confirmar nombre comercial exacto y material verificable.

## 7. Adidas y variantes

Adidas quedó integrado con variantes reales y verificadas.

Productos con variantes:

- `adidas-661-22-20`: 10 variantes;
- `adidas-661-35-20`: 10 variantes;
- `adidas-adip03`: 5 variantes;
- `adidas-adithgm01k`: 3 variantes;
- `adidas-adipkid`: 4 variantes;
- `adidas-adibp06wkf`: 4 variantes;
- `adidas-adibp12`: 4 variantes;
- `adidas-k999kit`: 8 tallas;
- `adidas-k999hwt`: 8 tallas;
- `adidas-k192dnakit-v`: 12 tallas;
- `adidas-k220dnakit`: 11 tallas;
- `adidas-k200e`: 6 rangos.

Total Adidas: **85 variantes**.

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

Las variantes métricas usan presentación normalizada sin cambiar IDs técnicos.

## 8. Búsqueda, filtros y ordenación

El catálogo permite búsqueda por:

- nombre;
- marca;
- categoría;
- SKU;
- descripción;
- características;
- variantes;
- etiquetas de precio/aprobación cuando corresponda.

Equivalencias controladas implementadas:

- `karategi`, `karategui`, `kimono`, `uniforme`;
- `guantín`, `guante`;
- `espinillera`, `canillera`;
- `empeinera`, `empeine`;
- `peto`, `pechera`;
- `casco`, `cabezal`;
- `cinturón`, `cinto`, `obi`;
- `bolso`, `maleta`, `mochila`.

Los prefijos solo se expanden desde longitudes controladas para evitar fuzzy search indiscriminado.

Autosuggest:

- aparece desde 2 caracteres;
- máximo 5 productos;
- muestra miniatura, nombre y marca;
- utiliza semántica accesible de `combobox`;
- el conteo y la grilla principal siguen reaccionando a la consulta.

Filtros:

- Marcas, Categorías y Aprobación parten en estado neutro `—`;
- `Todas las marcas`, `Todas las categorías` y `Todos los estados` son selecciones explícitas, no el estado neutro;
- la selección activa usa fondo negro;
- pulsar una marca aplica inmediatamente esa marca y deja sus categorías disponibles para refinar;
- pulsar una categoría padre aplica inmediatamente todo su árbol;
- volver a pulsar la marca o categoría padre desde una subcategoría restaura su ámbito completo;
- `Limpiar` restablece filtros y ordenación.

Ordenación:

- parte en estado neutro `—`;
- permite Destacados, Nombre A-Z/Z-A y precio ascendente/descendente;
- `none` conserva el orden original del catálogo.

## 9. Semántica de opciones y colores

La interfaz usa singular/plural según la cantidad real:

- `Talla:` / `Tallas:`;
- `Color:` / `Colores:`;
- `Longitud:` / `Longitudes:`.

Productos sin ese tipo de opción no muestran una sección artificial.

Ao/Aka se usa únicamente cuando el conjunto real de colores es exactamente el par competitivo azul/rojo.

```text
Ao = azul
Aka = rojo
```

La regla aplica a Mallems, Best Sport y Adidas sin cambiar IDs ni datos canónicos.

## 10. Precios y formas de pago

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

En tarjetas de catálogo se elimina únicamente el sufijo visual redundante `según talla` del precio primario; la ficha conserva el detalle completo por talla.

La tarjeta usa `PRECIO:` como rótulo visual y mantiene disponibilidad separada.

## 11. Producto, carrito y WhatsApp

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

## 12. Home y páginas informativas

La home contiene:

- hero;
- categorías;
- marcas;
- franja de confianza;
- productos seleccionados;
- bloque “Cómo funciona”;
- CTA de WhatsApp.

Páginas informativas:

- `/como-comprar/`;
- `/entregas/`;
- `/contacto/`;
- `/preguntas-frecuentes/`.

FAQ incorpora una introducción **Quiénes somos** y dudas de compra, disponibilidad, variantes, pagos, aprobaciones y envíos.

## 13. Accesibilidad y responsive

Implementado y cubierto:

- skip link `Saltar al contenido principal`;
- `aria-pressed` en opciones aplicables;
- `combobox` accesible para autosuggest;
- diálogo del carrito con gestión de foco;
- responsive smoke sin overflow en rutas principales;
- navegación compacta mobile/tablet y navegación horizontal desktop;
- filtros compactos en mobile/tablet y sidebar sticky en desktop.

Último pase dirigido del candidato:

```text
108/108 E2E responsive + accesibilidad
```

El último checkpoint funcional completo de producción pasó **153/153 E2E**.

## 14. SEO y exportación estática

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

Validación SEO previa del candidato:

```text
9/9 E2E SEO
73/73 build estático
```

Configuración Next.js:

- `output: "export"`;
- `trailingSlash: true`;
- imágenes `unoptimized`.

Pendiente relacionado con SEO:

- revisar metadatos y canonicales cuando exista dominio definitivo distinto de `catalogo-karate.pages.dev`;
- definir imagen social/branding global definitivo cuando exista el activo de identidad aprobado.

No publicar datos estructurados de ofertas que simplifiquen o contradigan las distintas bases comerciales de precio.

## 15. Rendimiento

Cloudflare usa caché explícita:

- `/_next/static/*`: caché larga e inmutable;
- `/images/*`: caché corta con revalidación.

Auditoría repetible:

```text
npm run images:audit
```

Umbrales actuales:

- warning: **300 KiB**;
- bloqueo: **1 MiB**.

Resultado final comprobado:

- **109** imágenes revisadas;
- **0** bloqueadores por encima de 1 MiB;
- **1** warning por encima de 300 KiB;
- resultado: PASSED.

Único warning residual deliberado:

```text
BESTSPORT-2808WKF__03.webp = ~603.5 KiB
```

La optimización de peso de imágenes para V1 se considera cerrada salvo mejora material verificable.

## 16. Warnings editoriales actuales

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

## 17. Imágenes y branding

El catálogo tiene **109 referencias canónicas de imágenes**.

Reglas:

- corresponder exactamente al modelo;
- priorizar fabricante, marca, distribuidor autorizado o proveedor;
- preferir producto aislado y fondo limpio cuando sea posible;
- evitar modelos meramente parecidos;
- registrar procedencia cuando exista URL útil;
- nombres preferidos: `SKU__01.webp`, `SKU__02.webp`, etc.

Branding pendiente:

- reemplazar el marcador temporal `KD` por el logo definitivo del Catálogo Karate-Do cuando exista activo aprobado;
- incorporar logo Adidas únicamente con activo exacto aprobado;
- no crear nueva marca hasta confirmar nombre comercial exacto y material verificable.

Las imágenes faltantes son deuda editorial y no bloquean el runtime mientras el producto se represente de forma segura.

## 18. Estado local y recursos de trabajo

`recursos/` contiene material fuente, auditorías, imágenes extraídas y capturas de revisión. Es deliberadamente local y está excluido mediante:

```text
/recursos/
```

Sigue vigente la regla:

```text
NO usar git add .
```

Los stages deben ser explícitos por archivo.

## 19. Deployment

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

## 20. Backlog inmediato

### Cerrado

- ✅ catálogo, búsqueda, aliases y autosuggest;
- ✅ filtros con estado neutro y selección explícita;
- ✅ ordenación neutra y criterios disponibles;
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
- ✅ homologaciones recientes corregidas en la fuente canónica;
- ✅ skip link, combobox accesible y foco modal del carrito;
- ✅ cierre del carrito por backdrop en pantallas compactas;
- ✅ responsive smoke de rutas principales;
- ✅ caché de assets Cloudflare;
- ✅ robots + sitemap;
- ✅ canonical dinámico + Open Graph + Twitter metadata;
- ✅ auditoría final de imágenes: 109 revisadas, 0 bloqueadores y 1 warning residual deliberado;
- ✅ `recursos/` excluido como material local;
- ✅ flujo `release-candidate` -> `production-stable` -> `main`;
- ✅ último pase dirigido del candidato: 38/38 unit, 73/73 build y 108/108 responsive+a11y E2E;
- ✅ últimos ajustes visuales de filtros: format, lint y 73/73 build.

### Camino crítico de cierre V1

- ⬜ validación integral final del candidato;
- ⬜ congelar el SHA exacto que pase la validación;
- ⬜ promoción exacta del SHA validado;
- ⬜ smoke público final en Cloudflare;
- ⬜ cierre V1.

### Backlog editorial diferido — no bloquea el cierre técnico

Mantener estos pendientes visibles y resolverlos ordenadamente cuando exista material verificable. No deben desviar el camino crítico ni resolverse con datos o activos aproximados.

1. ⬜ **Ocho productos sin imagen canónica:**
   - `mallems-peto-corporal-karate-do-u14-11`;
   - `mallems-cinturones-grado-bordado-17`;
   - `generica-cinturon-blanco-principiantes-20`;
   - `adidas-k999kit`;
   - `adidas-k999hwt`;
   - `adidas-k192dnakit-v`;
   - `adidas-k220dnakit`;
   - `adidas-k200e`.
2. ⬜ **Características de `mallems-maleta-viajera-28`**, únicamente cuando el proveedor confirme información fiable.
3. ⬜ **Logo Adidas**, únicamente con activo exacto aprobado.
4. ⬜ **Logo definitivo del Catálogo Karate-Do**, para reemplazar el marcador temporal `KD` cuando exista diseño aprobado.
5. ⬜ **Nueva marca**, únicamente cuando estén confirmados nombre comercial, productos y material exacto.
6. ⬜ **SEO de dominio definitivo**, solo si se migra desde `catalogo-karate.pages.dev`.
7. ⬜ **Pulido visual global final / microestética**, agrupado como una auditoría posterior y no como cambios aislados durante el cierre funcional.

Estos puntos pueden incorporarse después como checkpoints editoriales independientes sin reabrir la arquitectura de V1.

## 21. Orden de trabajo restante

1. ejecutar la validación integral final del candidato actual;
2. si alguna validación modifica el snapshot o detecta una regresión, corregir la causa y repetir únicamente lo necesario hasta obtener un árbol limpio;
3. registrar los conteos reales finales y actualizar esta documentación si el SHA cambia;
4. congelar el SHA exacto validado y no crear commits posteriores;
5. promover ese mismo SHA a `production-stable` y `main`;
6. comprobar el deployment público en Cloudflare;
7. cerrar técnicamente V1;
8. resolver después el backlog editorial diferido en checkpoints separados cuando existan los activos o datos aprobados.

## 22. Regla de continuidad

Prioridad: **funcionalidad y estructura antes que decoración**.

Ante un error se corrige la causa integral antes de avanzar.

Los cambios deben mantener rutas, imports, tipos y build válidos y terminar en un checkpoint funcional.

Cambiar únicamente lo solicitado, salvo dependencias directas necesarias para mantener coherencia o evitar romper funcionalidad relacionada.

No inventar datos comerciales, variantes, fotos, precios o características.

Las imágenes y el pulido visual no deben bloquear el avance funcional mientras la ausencia esté representada de forma segura.
