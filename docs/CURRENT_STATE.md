# Catálogo Karate-Do — estado actual

Última revisión canónica: **9 de octubre de 2026**.

Este documento es la referencia operativa del proyecto. Resume el estado comprobado de producción, la fuente editorial, las decisiones vigentes y el backlog. Si una conversación histórica contradice este archivo, debe revisarse primero el repositorio y Google Sheets.

## 1. Estado de producción

Repositorio:

```text
maorusohh/catalogo-karate
```

Producción:

```text
https://catalogo-karate.pages.dev
```

SHA validado y publicado:

```text
3d2d363aa84064b345419e1ff1a36cdf231c4a41
```

Refs de release comprobados después de la promoción:

```text
main                -> 3d2d363aa84064b345419e1ff1a36cdf231c4a41
production-stable   -> 3d2d363aa84064b345419e1ff1a36cdf231c4a41
production-previous -> 33c1aecd4c58624f094ecc0cae0adddb39a93c79
```

`release-candidate` puede quedar por delante de producción únicamente por documentación post-release. Eso no altera el SHA validado que está publicado.

La V1 técnica se considera **publicada y estable**. Los pendientes restantes son editoriales, de branding o de microestética y no reabren la arquitectura.

## 2. Validación integral final

La validación integral se ejecutó sobre el SHA exacto publicado `3d2d363aa84064b345419e1ff1a36cdf231c4a41` antes de la promoción.

Resultado:

- `catalog:sync`: PASSED;
- validación de texto: PASSED;
- validación de imágenes: PASSED, **109** referencias comprobadas;
- preflight: **0 errores / 9 warnings editoriales**;
- Prettier: PASSED;
- ESLint: PASSED, sin warnings;
- unit tests: **38/38** en **8/8** archivos;
- production build: **73/73** páginas;
- E2E completo: **171/171**;
- auditoría de imágenes: PASSED;
- `git diff --check`: limpio;
- working tree al freeze: limpio.

Auditoría de imágenes:

- **109** imágenes revisadas;
- **0** bloqueadores por encima de 1 MiB;
- **1** warning residual por encima de 300 KiB;
- `BESTSPORT-2808WKF__03.webp`: ~603.5 KiB.

El warning de tamaño es conocido y no bloquea V1.

## 3. Smoke público de Cloudflare

Smoke final comprobado el 9 de octubre de 2026.

Rutas críticas con HTTP **200**:

1. `/`;
2. `/catalogo/`;
3. `/marcas/`;
4. `/marcas/adidas/`;
5. `/categoria/karategis/`;
6. `/producto/adidas-k220dnakit/`;
7. `/como-comprar/`;
8. `/preguntas-frecuentes/`;
9. `/robots.txt`;
10. `/sitemap.xml`.

Redirects históricos comprobados con HTTP **301**:

```text
/producto/adidas-k200dnakit/ -> /producto/adidas-k220dnakit/
/marca/adidas/               -> /marcas/adidas/
```

Headers públicos comprobados incluyen:

- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `X-Frame-Options: DENY`;
- `Permissions-Policy` restrictiva para cámara, micrófono, geolocalización y payment.

## 4. Flujo de releases

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
5. ese mismo SHA pasa a `main` y Cloudflare Pages;
6. no se introducen commits entre la validación final y la promoción.

La promoción del release actual respetó este contrato.

## 5. Alcance V1

La V1 es un catálogo público nacional de implementos de Karate-Do para Venezuela, orientado a consulta comercial.

Incluye:

- catálogo público;
- búsqueda con equivalencias controladas;
- autosuggest;
- filtros de marca, categoría y aprobación;
- ordenación;
- páginas por categoría y marca;
- fichas de producto;
- variantes verificadas;
- precios y formas de pago;
- carrito local;
- consulta por WhatsApp;
- Google Sheets como CMS editorial;
- SEO técnico y metadata dinámica;
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

## 6. Stack y arquitectura

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

## 7. Google Sheets — fuente editorial canónica

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

Conteos del release:

- **7** marcas registradas;
- **5** marcas activas;
- **25** categorías totales;
- **15** categorías activas;
- **44** productos totales;
- **41** productos activos;
- **255** variantes;
- **109** referencias de imágenes;
- **189** precios totales;
- **186** registros de precio asociados a productos activos;
- **0** errores de preflight;
- **9** warnings editoriales.

La diferencia entre 189 y 186 es intencional: `catalog:preflight` cuenta precios de todo el catálogo y `catalog:report` cuenta únicamente precios de productos activos.

Correcciones comerciales ya reflejadas en la fuente canónica:

- No Kashi `Karategi Liviano de Entrenamiento Karate-Do` -> aprobación nacional FVKD;
- Mallems `Maleta Viajera` -> sin homologación;
- Mallems `Bolso Deportivo` -> sin homologación.

## 8. Marcas y navegación

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

Logos runtime canónicos versionados:

```text
public/images/brands/best-sport.webp
public/images/brands/mallems.webp
public/images/brands/no-kashi.png
```

`Generica` y `Adidas` no tienen logo runtime asignado actualmente.

## 9. Adidas y variantes

Adidas está integrado con variantes verificadas.

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

Producto canónico corregido:

```text
adidas-k220dnakit
ADIDAS-K220DNAKIT
Kit Karategi Kumite K220 DNA
```

`K200E` es un producto separado y válido.

`adidas-k200dnakit` no debe reaparecer como producto canónico.

## 10. Búsqueda, filtros y ordenación

Búsqueda por:

- nombre;
- marca;
- categoría;
- SKU;
- descripción;
- características;
- variantes;
- etiquetas de precio/aprobación cuando corresponda.

Equivalencias controladas:

- `karategi`, `karategui`, `kimono`, `uniforme`;
- `guantín`, `guante`;
- `espinillera`, `canillera`;
- `empeinera`, `empeine`;
- `peto`, `pechera`;
- `casco`, `cabezal`;
- `cinturón`, `cinto`, `obi`;
- `bolso`, `maleta`, `mochila`.

Los prefijos se expanden únicamente desde longitudes controladas; no existe fuzzy search indiscriminado.

Autosuggest:

- desde 2 caracteres;
- máximo 5 productos;
- miniatura, nombre y marca;
- semántica accesible de `combobox`.

Filtros:

- Marcas, Categorías y Aprobación parten en estado neutro `—`;
- `Todas las marcas`, `Todas las categorías` y `Todos los estados` son selecciones explícitas;
- la selección activa usa fondo negro;
- una marca aplica inmediatamente todos sus productos y conserva su árbol para refinar;
- una categoría padre aplica inmediatamente todo su árbol;
- volver al padre restaura su ámbito completo;
- `Limpiar` restablece filtros y ordenación.

Ordenación:

- estado inicial neutro `—`;
- Destacados;
- Nombre A-Z / Z-A;
- precio ascendente / descendente;
- `none` conserva el orden original del catálogo.

## 11. Producto, carrito y WhatsApp

La ficha usa el encabezado:

```text
Información del producto:
```

La UI usa singular/plural según la cantidad real de opciones y no presenta selectores artificiales.

Ao/Aka se utiliza únicamente cuando el conjunto real es exactamente azul/rojo competitivo:

```text
Ao = azul
Aka = rojo
```

La tarjeta de catálogo usa `PRECIO:` como rótulo visual y mantiene disponibilidad separada.

El carrito es local y prepara una consulta por WhatsApp.

El mensaje incluye, cuando corresponde:

- producto;
- marca;
- variante;
- forma de pago;
- cantidad;
- SKU.

La variante técnica `__default__` no se presenta al cliente.

El drawer del carrito:

- gestiona foco como diálogo modal;
- confina `Tab` / `Shift+Tab` en desktop;
- cierra con `Escape`;
- restaura foco al trigger cuando corresponde;
- permite cierre por backdrop;
- mantiene franja exterior real en pantallas compactas.

## 12. Home y páginas informativas

La home contiene:

- hero;
- categorías;
- marcas;
- franja de confianza;
- productos seleccionados;
- bloque `Cómo funciona`;
- CTA de WhatsApp.

Páginas informativas:

- `/como-comprar/`;
- `/entregas/`;
- `/contacto/`;
- `/preguntas-frecuentes/`.

FAQ incorpora **Quiénes somos** y dudas de compra, disponibilidad, variantes, pagos, aprobaciones y envíos.

## 13. Accesibilidad y responsive

Implementado y cubierto:

- skip link `Saltar al contenido principal`;
- `aria-pressed` en opciones aplicables;
- combobox accesible para autosuggest;
- diálogo del carrito con gestión de foco;
- responsive sin overflow en rutas principales;
- navegación compacta mobile/tablet;
- navegación horizontal desktop;
- filtros compactos mobile/tablet;
- sidebar sticky desktop.

Último pase dirigido previo al freeze:

```text
108/108 E2E responsive + accesibilidad
```

Suite integral final del release:

```text
171/171 E2E
```

## 14. SEO y exportación estática

SEO implementado:

- `metadataBase` global;
- sitemap;
- robots;
- rutas de marcas y FAQ en sitemap;
- canonical explícito en producto, marca y categoría;
- Open Graph dinámico;
- Twitter metadata dinámica;
- producto reutiliza primera imagen canónica cuando existe;
- marca reutiliza logo canónico cuando existe;
- pruebas E2E específicas de SEO.

Configuración Next.js:

- `output: "export"`;
- `trailingSlash: true`;
- imágenes `unoptimized`;
- adaptador de exportación estática para Next.js 16.

Revisar canonicales y `metadataBase` únicamente si se migra a un dominio distinto de `catalogo-karate.pages.dev`.

## 15. Cloudflare y rendimiento

Cloudflare usa:

- `/_next/static/*`: caché larga e inmutable;
- `/images/*`: caché corta con revalidación;
- redirects históricos mediante `public/_redirects`;
- headers básicos de seguridad mediante `public/_headers`.

El deployment ordinario consume el snapshot versionado y no requiere credenciales de Google Sheets.

Auditoría repetible:

```text
npm run images:audit
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

## 17. Backlog editorial diferido — no bloquea V1

Mantener estos pendientes visibles y resolverlos únicamente con material verificable.

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
7. ⬜ **Pulido visual global / microestética**, agrupado como auditoría posterior y no como cambios aislados sobre producción estable.

Los antiguos activos Adidas eliminados como `stale` no deben restaurarse. Las antiguas imágenes retiradas del Peto U14 tampoco deben recuperarse automáticamente sin volver a verificar su correspondencia.

## 18. Estado local y reglas de trabajo

`recursos/` es material local y está excluido del repositorio.

Regla permanente:

```text
NO usar git add .
```

Los stages deben ser explícitos por archivo.

Ante errores, corregir la causa integral antes de añadir nuevas funcionalidades.

No inventar datos comerciales, variantes, precios, características ni activos visuales.

## 19. Estado del checklist V1

### Cerrado

- ✅ arquitectura V1;
- ✅ Google Sheets como fuente editorial canónica;
- ✅ catálogo y navegación;
- ✅ búsqueda, aliases y autosuggest;
- ✅ filtros y ordenación;
- ✅ fichas de producto;
- ✅ variantes y semántica;
- ✅ K220/K200E y redirects históricos;
- ✅ homologaciones;
- ✅ carrito local;
- ✅ WhatsApp;
- ✅ responsive;
- ✅ accesibilidad;
- ✅ páginas de marcas;
- ✅ páginas informativas;
- ✅ Home funcional;
- ✅ SEO técnico;
- ✅ rendimiento e imágenes;
- ✅ seguridad/higiene V1;
- ✅ documentación canónica de release;
- ✅ validación integral final;
- ✅ freeze del SHA;
- ✅ promoción exacta a `production-stable` y `main`;
- ✅ deployment Cloudflare;
- ✅ smoke público 10/10 + redirects 301;
- ✅ **cierre técnico V1**.

### Pendiente no bloqueante

- ⬜ backlog editorial del apartado 17;
- ⬜ branding definitivo;
- ⬜ nueva marca cuando exista material exacto;
- ⬜ auditoría visual/microestética posterior si se decide realizar;
- ⬜ dominio propio, si se adopta en el futuro.

## 20. Próximo modo de trabajo

La V1 técnica ya no está en fase de construcción base.

Los siguientes cambios deben tratarse como checkpoints post-V1 independientes:

1. recibir un activo o dato editorial verificable;
2. incorporarlo primero a la fuente canónica cuando corresponda;
3. sincronizar el snapshot;
4. validar únicamente el alcance afectado más los blindajes necesarios;
5. promover un nuevo SHA estable si el cambio debe llegar a producción.

No reabrir arquitectura ni añadir backend/autenticación/inventario sin una decisión explícita de nueva fase.
