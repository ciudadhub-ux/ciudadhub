// Herramienta local para cargar artículos del blog sin tocar el build de Next.
// Corre por fuera de app/ a propósito: nunca se exporta ni se sube al sitio estático.
//
// Uso: node scripts/admin-server.mjs  (o "npm run blog:admin")
// Abre http://localhost:4001 y completá el formulario.

import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DATA_FILE = path.join(ROOT, "lib", "blog-data.ts");
const HTML_FILE = path.join(__dirname, "admin-blog.html");
const PORT = 4001;

// Debe coincidir con lib/topicColors.ts
const TOPIC_COLORS = {
  "Smart Cities":    { h: 213, s: 94 },
  "Datos":           { h: 258, s: 89 },
  "Movilidad":       { h: 142, s: 71 },
  "Sostenibilidad":  { h: 160, s: 84 },
  "Urbanismo":       { h: 38,  s: 92 },
  "Equidad":         { h: 343, s: 88 },
  "Gobernanza":      { h: 199, s: 89 },
  "Salud":           { h: 173, s: 80 },
  "Innovación":      { h: 24,  s: 94 },
  "Espacio Público": { h: 84,  s: 81 },
};

function slugify(title) {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function existingSlugs() {
  const content = await readFile(DATA_FILE, "utf-8");
  return [...content.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
}

function uniqueSlug(base, taken) {
  if (!taken.includes(base)) return base;
  let i = 2;
  while (taken.includes(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

function indent(level) {
  return "  ".repeat(level);
}

function serializeValue(value, level) {
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map(
      (item) => `${indent(level + 1)}${serializeValue(item, level + 1)}`
    );
    return `[\n${items.join(",\n")},\n${indent(level)}]`;
  }
  if (value !== null && typeof value === "object") {
    const keys = Object.keys(value);
    const lines = keys.map(
      (k) => `${indent(level + 1)}${k}: ${serializeValue(value[k], level + 1)}`
    );
    return `{\n${lines.join(",\n")},\n${indent(level)}}`;
  }
  if (typeof value === "string") return JSON.stringify(value);
  return String(value);
}

function buildPostObject(input) {
  return {
    slug: input.slug,
    title: input.title,
    summary: input.summary,
    author: input.author,
    date: input.date,
    readTime: input.readTime,
    tags: input.tags,
    hue: input.hue,
    blocks: input.blocks,
  };
}

async function insertPost(post) {
  const content = await readFile(DATA_FILE, "utf-8");
  const marker = "export const posts: BlogPost[] = [\n";
  const idx = content.indexOf(marker);
  if (idx === -1) throw new Error("No se encontró el arreglo posts en blog-data.ts");

  const entry = `  ${serializeValue(post, 1)},\n`;
  const updated =
    content.slice(0, idx + marker.length) +
    entry +
    content.slice(idx + marker.length);

  await writeFile(DATA_FILE, updated, "utf-8");
}

function validate(body) {
  const errors = [];
  if (!body.title || !body.title.trim()) errors.push("Falta el título.");
  if (!body.summary || !body.summary.trim()) errors.push("Falta el encabezado resumen.");
  if (!body.author || !body.author.trim()) errors.push("Falta el autor.");
  if (!body.date || !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) errors.push("Fecha inválida.");
  if (!body.readTime || !body.readTime.trim()) errors.push("Falta el tiempo de lectura.");
  if (!Array.isArray(body.tags) || body.tags.length === 0) errors.push("Elegí al menos un tag.");
  if (!Array.isArray(body.blocks) || body.blocks.length === 0) {
    errors.push("Agregá al menos un bloque de contenido.");
  } else {
    const hasParagraph = body.blocks.some((b) => b.type === "paragraph" && b.text?.trim());
    if (!hasParagraph) errors.push("Agregá al menos un párrafo con texto.");
    for (const b of body.blocks) {
      if (b.type === "stats") {
        if (!b.title?.trim()) errors.push("La infografía necesita un título.");
        if (!Array.isArray(b.items) || b.items.length === 0) {
          errors.push("La infografía necesita al menos una estadística.");
        }
      }
    }
  }
  return errors;
}

function json(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf-8");
}

const server = createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/") {
      const html = await readFile(HTML_FILE, "utf-8");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
      return;
    }

    if (req.method === "GET" && req.url === "/api/topics") {
      json(res, 200, TOPIC_COLORS);
      return;
    }

    if (req.method === "POST" && req.url === "/api/posts") {
      const raw = await readBody(req);
      let body;
      try {
        body = JSON.parse(raw);
      } catch {
        json(res, 400, { ok: false, errors: ["JSON inválido."] });
        return;
      }

      const errors = validate(body);
      if (errors.length) {
        json(res, 400, { ok: false, errors });
        return;
      }

      const taken = await existingSlugs();
      const baseSlug = body.slug?.trim() ? slugify(body.slug) : slugify(body.title);
      const slug = uniqueSlug(baseSlug || "articulo", taken);

      const firstTagColor = TOPIC_COLORS[body.tags[0]];
      const hue = firstTagColor ? firstTagColor.h : Math.floor(Math.random() * 360);

      const blocks = body.blocks
        .filter((b) => {
          if (b.type === "paragraph" || b.type === "quote") return !!b.text?.trim();
          if (b.type === "stats") return !!b.title?.trim() && Array.isArray(b.items) && b.items.length > 0;
          return false;
        })
        .map((b) => {
          if (b.type === "paragraph") return { type: "paragraph", text: b.text.trim() };
          if (b.type === "quote") return { type: "quote", text: b.text.trim() };
          return {
            type: "stats",
            title: b.title.trim(),
            items: b.items
              .filter((it) => it.value?.trim() && it.label?.trim())
              .map((it) => ({ value: it.value.trim(), label: it.label.trim() })),
          };
        });

      const post = buildPostObject({
        slug,
        title: body.title.trim(),
        summary: body.summary.trim(),
        author: body.author.trim(),
        date: body.date,
        readTime: body.readTime.trim(),
        tags: body.tags,
        hue,
        blocks,
      });

      await insertPost(post);
      json(res, 200, { ok: true, slug, url: `/blog/${slug}` });
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  } catch (err) {
    console.error(err);
    json(res, 500, { ok: false, errors: [String(err.message || err)] });
  }
});

server.listen(PORT, () => {
  console.log(`\n  Cargador de artículos — http://localhost:${PORT}\n`);
});
