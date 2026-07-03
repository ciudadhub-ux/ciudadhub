// Convierte las imágenes de public/images a WebP y elimina los originales.
// Uso: node scripts/convert-webp.mjs
// Correr después de agregar imágenes nuevas y antes de `npm run sync`
// (el sync matchea archivos .webp en las carpetas).
import sharp from "sharp";
import { readdir, unlink, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "images");

// [carpeta, ancho máximo] — se reduce si excede, nunca se agranda
const DIRS = [
  ["episodios", 1600],
  ["INVITADOS", 800],
  ["equipo", 600],
];

const QUALITY = 75;
const exts = new Set([".jpg", ".jpeg", ".png"]);

let totalBefore = 0;
let totalAfter = 0;

for (const [dir, maxW] of DIRS) {
  const abs = path.join(ROOT, dir);
  for (const f of await readdir(abs)) {
    const ext = path.extname(f).toLowerCase();
    if (!exts.has(ext) || f.startsWith(".")) continue;
    const src = path.join(abs, f);
    const dst = path.join(abs, f.slice(0, -ext.length) + ".webp");
    const before = (await stat(src)).size;
    await sharp(src)
      .rotate() // respeta orientación EXIF
      .resize({ width: maxW, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(dst);
    const after = (await stat(dst)).size;
    totalBefore += before;
    totalAfter += after;
    await unlink(src);
    console.log(`${dir}/${f} → .webp  ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB`);
  }
}

console.log(`\nTotal: ${(totalBefore / 1024 / 1024).toFixed(1)}MB → ${(totalAfter / 1024 / 1024).toFixed(1)}MB`);
