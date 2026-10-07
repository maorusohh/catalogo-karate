# Image Extractor

Herramienta interna para extraer imágenes embebidas desde material de proveedores sin mezclar esta responsabilidad con el frontend de Next.js.

## Alcance actual

Soporta:

- PDF mediante PyMuPDF;
- DOCX mediante extracción directa de `word/media`;
- directorios con búsqueda opcional recursiva;
- manifiesto CSV y JSON;
- dimensiones de imagen;
- formato;
- tamaño en bytes;
- hash SHA-256;
- detección de duplicados por contenido.

No soporta todavía PPTX ni XLSX. Se añadirán únicamente si aparece una necesidad real en el flujo editorial.

## Instalación

Desde la raíz del repositorio:

```bash
python -m pip install -r tools/image-extractor/requirements.txt
```

## Uso

Archivo individual:

```bash
python tools/image-extractor/extract_images.py proveedor.pdf
```

Directorio:

```bash
python tools/image-extractor/extract_images.py recursos/proveedores --recursive
```

Salida personalizada:

```bash
python tools/image-extractor/extract_images.py proveedor.docx --output recursos/extractor-output/mallems
```

La salida por defecto es:

```text
recursos/extractor-output/
```

Ese directorio es material de trabajo local y no forma parte del runtime público.

## Manifiesto

Por cada imagen se registra:

- `source_file`: archivo original;
- `source_type`: `PDF` o `DOCX`;
- `source_locator`: página/imagen o ruta interna de `word/media`;
- `output_file`: archivo extraído;
- `format`: formato detectado;
- `width` y `height`;
- `size_bytes`;
- `sha256`;
- `duplicate_of`: primer archivo con el mismo SHA-256, si existe.

El extractor no promueve archivos al catálogo, no modifica Google Sheets y no reemplaza imágenes existentes. Solo prepara material auditable para revisión.

## Pruebas

```bash
python -m unittest discover -s tools/image-extractor/tests -p "test_*.py" -v
```

Las pruebas generan archivos temporales y validan:

- extracción DOCX;
- extracción PDF;
- dimensiones;
- manifiestos;
- detección de duplicados;
- búsqueda recursiva;
- rechazo de formatos no soportados.
