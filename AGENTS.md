<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Catálogo Karate-Do — reglas del repositorio

## Documentación canónica

Antes de realizar cambios relevantes, leer en este orden:

1. `docs/PROJECT_CONTEXT.md`: objetivo, alcance e invariantes durables.
2. `docs/CURRENT_STATE.md`: estado comprobado y próximo checkpoint técnico.
3. `docs/catalog-data-contract.md`: contrato entre la fuente editorial y el dominio.
4. `README.md`: operación general del repositorio y comandos.

No crear documentación paralela que duplique estas responsabilidades. `DECISIONS.md` o ADRs se incorporarán únicamente cuando exista un conjunto suficiente de decisiones arquitectónicas que justifique mantenerlos.

## Rama de trabajo

Mientras no se cierre la profesionalización, la rama activa es `feature/profesionalizacion`. No asumir que `main` contiene el estado más reciente.

## Principios de implementación

- Mantener una solución profesional pero deliberadamente sencilla para el alcance real de la V1.
- Conservar la arquitectura aprobada; no introducir backend, base de datos, autenticación o infraestructura adicional sin un requisito real.
- Dejar la aplicación funcional y coherente al terminar cada checkpoint.
- Corregir integralmente la causa de un error antes de continuar con funcionalidad nueva.
- Cuando un archivo cambie sustancialmente, tratarlo como una unidad completa y validar imports, tipos, rutas, contratos y efectos colaterales.
- Separar contenido comercial, catálogo, interfaz, datos y lógica.

## Fuente de datos

Google Sheets es la fuente editorial canónica.

La aplicación consume únicamente las pestañas canónicas definidas en `docs/catalog-data-contract.md`:

`meta`, `brands`, `categories`, `products`, `variants`, `variant_options`, `prices`, `images`, `features`.

Las pestañas `catalog_intake*` son staging editorial. No deben ser consumidas directamente por la UI ni por el `CatalogRepository`.

Flujo obligatorio:

```text
Google Sheets
  -> scripts/sync-catalog-from-google.ts
  -> src/data/catalog-source.google.generated.ts
  -> adapter tabular
  -> validación de esquema e integridad
  -> Catalog
  -> CatalogRepository
  -> UI
```

`src/data/catalog-source.google.generated.ts` es generado. Nunca editarlo manualmente.

## Integridad y publicación

- Las referencias entre entidades deben resolver a IDs válidos.
- Los errores de esquema o integridad bloquean la publicación.
- Los datos inactivos pueden permanecer en la fuente, pero no deben publicarse.
- Las imágenes comerciales se sirven como assets locales; no introducir hotlinking como sustituto permanente.
- Nunca versionar secretos, service-account JSON, tokens ni credenciales.
- La fuente pública no contiene costos internos, márgenes, datos de clientes ni información privada del ERP.

## Validación

Comandos relevantes del repositorio:

```bash
npm run format:check
npm run lint
npm run test:unit
npm run test:e2e
npm run build
npm run catalog:sync
npm run catalog:report
npm run catalog:preflight
npm run build:catalog
```

Para cambios de datos o de integración con Google Sheets, verificar como mínimo el sync, las validaciones de catálogo y el build. Si faltan credenciales o assets para ejecutar una comprobación, documentar el bloqueo con precisión; no afirmar que la validación pasó.
