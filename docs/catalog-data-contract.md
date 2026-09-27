# Catálogo Karate-Do — Contrato de datos comerciales

## Propósito

Este documento define la estructura de datos pública que debe producir cualquier fuente del catálogo.

La interfaz del catálogo no depende directamente de Google Sheets, archivos CSV, una API o una base de datos.

La fuente se adapta al modelo `Catalog` antes de llegar al `CatalogRepository`.

## Flujo de datos

```text
Source
  ↓
Source Adapter
  ↓
Raw source validation
  ↓
Catalog mapping
  ↓
catalogSchema
  ↓
validateCatalogIntegrity
  ↓
CatalogRepository
  ↓
Frontend