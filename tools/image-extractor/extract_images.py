from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
import sys
import zipfile
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable

try:
    import fitz  # PyMuPDF
except ImportError:  # pragma: no cover - validated by CLI dependency check
    fitz = None

try:
    from PIL import Image
except ImportError:  # pragma: no cover - validated by CLI dependency check
    Image = None

SUPPORTED_EXTENSIONS = {".pdf", ".docx"}


@dataclass(frozen=True)
class ManifestRow:
    source_file: str
    source_type: str
    source_locator: str
    output_file: str
    format: str
    width: int | None
    height: int | None
    size_bytes: int
    sha256: str
    duplicate_of: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Extrae imágenes embebidas de PDF y DOCX y genera un manifiesto auditable.",
    )
    parser.add_argument("input", type=Path, help="Archivo PDF/DOCX o directorio a inspeccionar.")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("recursos/extractor-output"),
        help="Directorio de salida. Por defecto: recursos/extractor-output",
    )
    parser.add_argument(
        "--recursive",
        action="store_true",
        help="Si input es un directorio, busca PDF/DOCX recursivamente.",
    )
    return parser.parse_args()


def slugify(value: str) -> str:
    normalized = re.sub(r"[^A-Za-z0-9._-]+", "-", value.strip())
    normalized = re.sub(r"-+", "-", normalized).strip("-._")
    return normalized or "source"


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def image_dimensions(data: bytes) -> tuple[int | None, int | None, str | None]:
    if Image is None:
        return None, None, None

    from io import BytesIO

    try:
        with Image.open(BytesIO(data)) as image:
            image_format = image.format.lower() if image.format else None
            return image.width, image.height, image_format
    except Exception:
        return None, None, None


def safe_extension(raw_extension: str, detected_format: str | None) -> str:
    extension = raw_extension.lower().lstrip(".")
    aliases = {
        "jpeg": "jpg",
        "jpe": "jpg",
        "tif": "tiff",
    }

    extension = aliases.get(extension, extension)

    if not extension and detected_format:
        extension = aliases.get(detected_format.lower(), detected_format.lower())

    if not extension:
        extension = "bin"

    return extension


def write_asset(
    *,
    output_dir: Path,
    source: Path,
    source_type: str,
    locator: str,
    ordinal: int,
    data: bytes,
    extension: str,
    known_hashes: dict[str, str],
) -> ManifestRow:
    digest = sha256_bytes(data)
    width, height, detected_format = image_dimensions(data)
    final_extension = safe_extension(extension, detected_format)

    source_stem = slugify(source.stem)
    locator_slug = slugify(locator)
    filename = f"{source_stem}__{ordinal:03d}__{locator_slug}.{final_extension}"
    output_path = output_dir / filename

    output_path.write_bytes(data)

    duplicate_of = known_hashes.get(digest, "")
    if not duplicate_of:
        known_hashes[digest] = filename

    return ManifestRow(
        source_file=str(source),
        source_type=source_type,
        source_locator=locator,
        output_file=filename,
        format=detected_format or final_extension,
        width=width,
        height=height,
        size_bytes=len(data),
        sha256=digest,
        duplicate_of=duplicate_of,
    )


def extract_pdf(
    source: Path,
    output_dir: Path,
    known_hashes: dict[str, str],
) -> list[ManifestRow]:
    if fitz is None:
        raise RuntimeError("PyMuPDF no está instalado. Ejecuta pip install -r tools/image-extractor/requirements.txt")

    rows: list[ManifestRow] = []
    ordinal = 0

    with fitz.open(source) as document:
        for page_index in range(document.page_count):
            page = document.load_page(page_index)
            images = page.get_images(full=True)

            for image_index, image_info in enumerate(images, start=1):
                xref = image_info[0]
                extracted = document.extract_image(xref)
                data = extracted.get("image")

                if not data:
                    continue

                ordinal += 1
                locator = f"page-{page_index + 1}-image-{image_index}-xref-{xref}"

                rows.append(
                    write_asset(
                        output_dir=output_dir,
                        source=source,
                        source_type="PDF",
                        locator=locator,
                        ordinal=ordinal,
                        data=data,
                        extension=extracted.get("ext", ""),
                        known_hashes=known_hashes,
                    )
                )

    return rows


def extract_docx(
    source: Path,
    output_dir: Path,
    known_hashes: dict[str, str],
) -> list[ManifestRow]:
    rows: list[ManifestRow] = []
    ordinal = 0

    with zipfile.ZipFile(source) as archive:
        media_paths = sorted(
            name
            for name in archive.namelist()
            if name.startswith("word/media/") and not name.endswith("/")
        )

        for media_path in media_paths:
            data = archive.read(media_path)
            ordinal += 1

            rows.append(
                write_asset(
                    output_dir=output_dir,
                    source=source,
                    source_type="DOCX",
                    locator=media_path,
                    ordinal=ordinal,
                    data=data,
                    extension=Path(media_path).suffix,
                    known_hashes=known_hashes,
                )
            )

    return rows


def discover_sources(input_path: Path, recursive: bool) -> list[Path]:
    if input_path.is_file():
        if input_path.suffix.lower() not in SUPPORTED_EXTENSIONS:
            raise ValueError(f"Formato no soportado: {input_path.suffix or '(sin extensión)'}")
        return [input_path]

    if not input_path.is_dir():
        raise FileNotFoundError(f"No existe: {input_path}")

    iterator: Iterable[Path]
    iterator = input_path.rglob("*") if recursive else input_path.glob("*")

    return sorted(
        path
        for path in iterator
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS
    )


def write_manifests(rows: list[ManifestRow], output_dir: Path) -> None:
    csv_path = output_dir / "manifest.csv"
    json_path = output_dir / "manifest.json"

    fieldnames = [field.name for field in ManifestRow.__dataclass_fields__.values()]

    with csv_path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(asdict(row) for row in rows)

    json_path.write_text(
        json.dumps([asdict(row) for row in rows], ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def run(input_path: Path, output_dir: Path, recursive: bool = False) -> list[ManifestRow]:
    sources = discover_sources(input_path, recursive)

    if not sources:
        raise RuntimeError("No se encontraron archivos PDF o DOCX para procesar.")

    output_dir.mkdir(parents=True, exist_ok=True)

    known_hashes: dict[str, str] = {}
    rows: list[ManifestRow] = []

    for source in sources:
        extension = source.suffix.lower()

        if extension == ".pdf":
            rows.extend(extract_pdf(source, output_dir, known_hashes))
        elif extension == ".docx":
            rows.extend(extract_docx(source, output_dir, known_hashes))

    write_manifests(rows, output_dir)
    return rows


def main() -> int:
    args = parse_args()

    if Image is None:
        print(
            "ERROR: Pillow no está instalado. Ejecuta: "
            "python -m pip install -r tools/image-extractor/requirements.txt",
            file=sys.stderr,
        )
        return 2

    try:
        rows = run(args.input, args.output, args.recursive)
    except Exception as error:
        print(f"ERROR: {error}", file=sys.stderr)
        return 1

    duplicate_count = sum(1 for row in rows if row.duplicate_of)

    print("=" * 60)
    print(" CATÁLOGO KARATE-DO | IMAGE EXTRACTOR")
    print("=" * 60)
    print(f"Imágenes extraídas: {len(rows)}")
    print(f"Duplicados detectados: {duplicate_count}")
    print(f"Salida: {args.output}")
    print(f"Manifest CSV: {args.output / 'manifest.csv'}")
    print(f"Manifest JSON: {args.output / 'manifest.json'}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
