import sharp from "sharp";
import { readdir, stat, writeFile, unlink } from "fs/promises";
import { join, extname, basename } from "path";

const FOLDERS = [
  { path: "public/images/INVITADOS", maxWidth: 600,  quality: 82 },
  { path: "public/images/episodios", maxWidth: 1400, quality: 85 },
  { path: "public/images/equipo",    maxWidth: 900,  quality: 85 },
];

const EXTS = new Set([".jpg", ".jpeg", ".png"]);

async function processFile(filePath, maxWidth, quality) {
  const ext = extname(filePath).toLowerCase();
  if (!EXTS.has(ext)) return null;

  const before = (await stat(filePath)).size;
  const img = sharp(filePath);
  const meta = await img.metadata();

  const pipeline = img.rotate(); // auto-orient from EXIF

  if (meta.width > maxWidth) {
    pipeline.resize(maxWidth, null, { withoutEnlargement: true });
  }

  let buf;
  let outPath = filePath;
  if (ext === ".png") {
    // PNG con transparencia se queda PNG; foto opaca en PNG pasa a .jpg (mucho más liviana)
    if (meta.hasAlpha) {
      buf = await pipeline.png({ compressionLevel: 9, effort: 10 }).toBuffer();
    } else {
      buf = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
      outPath = filePath.slice(0, -ext.length) + ".jpg";
    }
  } else {
    buf = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
  }

  const after = buf.length;
  if (after < before || outPath !== filePath) {
    await writeFile(outPath, buf);
    if (outPath !== filePath) await unlink(filePath);
    return { filePath: outPath, before, after, saved: before - after };
  }
  return { filePath, before, after: before, saved: 0, skipped: true };
}

let totalBefore = 0;
let totalAfter = 0;
let count = 0;

for (const { path: folder, maxWidth, quality } of FOLDERS) {
  const files = await readdir(folder).catch(() => []);
  console.log(`\n📁 ${folder} (${files.length} archivos)`);

  for (const file of files) {
    const ext = extname(file).toLowerCase();
    if (!EXTS.has(ext)) continue;

    const filePath = join(folder, file);
    try {
      const result = await processFile(filePath, maxWidth, quality);
      if (!result) continue;
      totalBefore += result.before;
      totalAfter += result.after;
      count++;
      if (!result.skipped) {
        const pct = Math.round((result.saved / result.before) * 100);
        console.log(`  ✓ ${basename(filePath).slice(0, 45).padEnd(45)} ${(result.before/1024).toFixed(0).padStart(5)}KB → ${(result.after/1024).toFixed(0).padStart(5)}KB  (-${pct}%)`);
      }
    } catch (e) {
      console.log(`  ✗ ${file}: ${e.message}`);
    }
  }
}

const totalSaved = totalBefore - totalAfter;
console.log(`\n✅ ${count} imágenes procesadas`);
console.log(`   Antes:  ${(totalBefore/1024/1024).toFixed(1)} MB`);
console.log(`   Después: ${(totalAfter/1024/1024).toFixed(1)} MB`);
console.log(`   Ahorro: ${(totalSaved/1024/1024).toFixed(1)} MB (${Math.round(totalSaved/totalBefore*100)}%)`);
