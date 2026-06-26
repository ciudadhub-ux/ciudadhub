#!/usr/bin/env python3
"""
smart-crop-invitados.py — Recorte inteligente de fotos de invitados a 600×600px
Detecta la cara y centra el cuadrado en ella. Si no hay cara, centra en la imagen.

Uso:
  python3 scripts/smart-crop-invitados.py            # procesa todas las fotos
  python3 scripts/smart-crop-invitados.py --dry-run  # muestra qué haría sin modificar
  python3 scripts/smart-crop-invitados.py "Nombre.jpg"  # procesa un solo archivo
"""

import sys
import os
import argparse
import cv2
import numpy as np
from PIL import Image

INVITADOS_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images", "INVITADOS")
OUTPUT_SIZE = 600
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".tiff", ".gif"}

CASCADE_PATH = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
face_cascade = cv2.CascadeClassifier(CASCADE_PATH)


def detect_face_center(img_rgb: np.ndarray):
    """Devuelve (cx, cy) del centro de la cara principal, o None si no detecta."""
    gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)
    h, w = gray.shape

    # Intenta con distintos parámetros para cubrir fotos pequeñas y grandes
    for scale, neighbors, min_size_ratio in [
        (1.1, 4, 0.05),
        (1.2, 3, 0.04),
        (1.3, 2, 0.03),
    ]:
        min_size = int(min(h, w) * min_size_ratio)
        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=scale,
            minNeighbors=neighbors,
            minSize=(min_size, min_size),
        )
        if len(faces) > 0:
            # Cara más grande = cara principal
            faces = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)
            fx, fy, fw, fh = faces[0]
            # Centro horizontal de la cara, pero un poco más arriba que el centro
            # vertical para incluir la frente y dejar espacio bajo el mentón
            cx = fx + fw // 2
            cy = fy + int(fh * 0.4)
            return cx, cy

    return None


def smart_crop(img: Image.Image, dry_run: bool = False):
    """
    Devuelve (imagen_recortada, método_usado).
    método_usado: "cara" | "centro"
    """
    img_rgb = np.array(img.convert("RGB"))
    orig_w, orig_h = img.size

    face_center = detect_face_center(img_rgb)

    if face_center:
        cx, cy = face_center
        method = "cara"
    else:
        # Sin cara: centrar la imagen pero ligeramente hacia arriba (regla de tercios)
        cx = orig_w // 2
        cy = int(orig_h * 0.38)
        method = "centro"

    # Tamaño del cuadrado: el mayor lado de la imagen, mínimo OUTPUT_SIZE
    crop_size = min(orig_w, orig_h)

    # Calcular el cuadrado centrado en (cx, cy)
    half = crop_size // 2
    left  = cx - half
    top   = cy - half
    right = left + crop_size
    bottom = top + crop_size

    # Ajustar si sale de los bordes
    if left < 0:
        right -= left
        left = 0
    if top < 0:
        bottom -= top
        top = 0
    if right > orig_w:
        left -= right - orig_w
        right = orig_w
    if bottom > orig_h:
        top -= bottom - orig_h
        bottom = orig_h

    left  = max(0, left)
    top   = max(0, top)
    right = min(orig_w, right)
    bottom = min(orig_h, bottom)

    if dry_run:
        return None, method

    cropped = img.crop((left, top, right, bottom))
    resized = cropped.resize((OUTPUT_SIZE, OUTPUT_SIZE), Image.LANCZOS)
    return resized, method


def process_file(filepath: str, dry_run: bool = False) -> None:
    ext = os.path.splitext(filepath)[1].lower()
    if ext not in IMAGE_EXTS:
        return

    try:
        img = Image.open(filepath)
        orig_w, orig_h = img.size

        # Ya es 600×600, saltar
        if orig_w == OUTPUT_SIZE and orig_h == OUTPUT_SIZE:
            print(f"  ↩  {os.path.basename(filepath)} — ya es {OUTPUT_SIZE}×{OUTPUT_SIZE}, saltando")
            return

        result, method = smart_crop(img, dry_run=dry_run)

        if dry_run:
            print(f"  ✓  {os.path.basename(filepath)} ({orig_w}×{orig_h}) → {OUTPUT_SIZE}×{OUTPUT_SIZE} [{method}]")
            return

        # Guardar en el formato original (jpg → jpg, png → png)
        save_kwargs = {}
        save_format = img.format or "JPEG"
        if save_format in ("JPEG", "JPG"):
            save_format = "JPEG"
            save_kwargs = {"quality": 88, "optimize": True}
            result = result.convert("RGB")
        elif save_format == "PNG":
            save_kwargs = {"optimize": True}

        result.save(filepath, format=save_format, **save_kwargs)
        print(f"  ✓  {os.path.basename(filepath)} ({orig_w}×{orig_h}) → {OUTPUT_SIZE}×{OUTPUT_SIZE} [{method}]")

    except Exception as e:
        print(f"  ✗  {os.path.basename(filepath)}: {e}")


def main():
    parser = argparse.ArgumentParser(description="Smart crop de fotos de invitados a 600×600px")
    parser.add_argument("file", nargs="?", help="Archivo específico a procesar")
    parser.add_argument("--dry-run", action="store_true", help="Mostrar qué haría sin modificar archivos")
    args = parser.parse_args()

    if args.dry_run:
        print("── DRY RUN — no se modificará ningún archivo ──\n")

    if args.file:
        filepath = args.file if os.path.isabs(args.file) else os.path.join(INVITADOS_DIR, args.file)
        process_file(filepath, dry_run=args.dry_run)
        return

    files = sorted(f for f in os.listdir(INVITADOS_DIR) if not f.startswith("."))
    print(f"Procesando {len(files)} archivos en INVITADOS/\n")
    for f in files:
        process_file(os.path.join(INVITADOS_DIR, f), dry_run=args.dry_run)

    print("\nListo ✓")


if __name__ == "__main__":
    main()
