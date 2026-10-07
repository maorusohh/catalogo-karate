from __future__ import annotations

import importlib.util
import io
import json
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path

import fitz
from PIL import Image

MODULE_PATH = Path(__file__).resolve().parents[1] / "extract_images.py"
SPEC = importlib.util.spec_from_file_location("extract_images", MODULE_PATH)
assert SPEC and SPEC.loader
extract_images = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = extract_images
SPEC.loader.exec_module(extract_images)


def png_bytes(color: tuple[int, int, int], size: tuple[int, int]) -> bytes:
    image = Image.new("RGB", size, color)
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()


class ImageExtractorTests(unittest.TestCase):
    def test_docx_extrae_media_y_detecta_duplicados(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            source = root / "catalogo.docx"
            output = root / "out"
            shared = png_bytes((255, 0, 0), (40, 30))

            with zipfile.ZipFile(source, "w") as archive:
                archive.writestr("word/media/image1.png", shared)
                archive.writestr("word/media/image2.png", shared)

            rows = extract_images.run(source, output)

            self.assertEqual(len(rows), 2)
            self.assertEqual(rows[0].width, 40)
            self.assertEqual(rows[0].height, 30)
            self.assertEqual(rows[0].duplicate_of, "")
            self.assertEqual(rows[1].duplicate_of, rows[0].output_file)
            self.assertTrue((output / "manifest.csv").exists())
            self.assertTrue((output / "manifest.json").exists())

            manifest = json.loads((output / "manifest.json").read_text(encoding="utf-8"))
            self.assertEqual(len(manifest), 2)
            self.assertEqual(manifest[1]["duplicate_of"], rows[0].output_file)

    def test_pdf_extrae_imagen_embebida(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            source = root / "catalogo.pdf"
            output = root / "out"
            image_bytes = png_bytes((0, 0, 255), (64, 48))

            document = fitz.open()
            page = document.new_page(width=200, height=200)
            page.insert_image(fitz.Rect(20, 20, 120, 100), stream=image_bytes)
            document.save(str(source))
            document.close()

            rows = extract_images.run(source, output)

            self.assertEqual(len(rows), 1)
            self.assertEqual(rows[0].source_type, "PDF")
            self.assertEqual(rows[0].width, 64)
            self.assertEqual(rows[0].height, 48)
            self.assertTrue((output / rows[0].output_file).exists())

    def test_directorio_respeta_recursive(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            nested = root / "nested"
            nested.mkdir()

            shallow = root / "uno.docx"
            deep = nested / "dos.docx"

            for source in (shallow, deep):
                with zipfile.ZipFile(source, "w") as archive:
                    archive.writestr("word/media/image1.png", png_bytes((0, 255, 0), (10, 10)))

            self.assertEqual(extract_images.discover_sources(root, recursive=False), [shallow])
            self.assertEqual(extract_images.discover_sources(root, recursive=True), [deep, shallow])

    def test_rechaza_formato_no_soportado(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            source = Path(temp_dir) / "catalogo.txt"
            source.write_text("demo", encoding="utf-8")

            with self.assertRaisesRegex(ValueError, "Formato no soportado"):
                extract_images.discover_sources(source, recursive=False)


if __name__ == "__main__":
    unittest.main()
