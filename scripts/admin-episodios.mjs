// Herramienta local para cargar y editar episodios sin abrir el CSV a mano.
// Corre por fuera de app/ a propósito: nunca se exporta ni se sube al sitio.
//
// Uso: node scripts/admin-episodios.mjs  (o "npm run episodios:admin")
// Abre http://localhost:4002
//
// Escribe en content/episodios.csv. Después hay que correr "npm run sync"
// para regenerar lib/data.ts.

import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CSV_FILE = path.join(ROOT, "content", "episodios.csv");
const TOPICS_FILE = path.join(ROOT, "lib", "topicColors.ts");
const COORDS_FILE = path.join(ROOT, "components", "InvitadosClient.tsx");
const HTML_FILE = path.join(__dirname, "admin-episodios.html");
const PORT = 4002;

const COLUMNS = [
  "ID", "Invitado", "Job Title", "Podcast", "quote", "Topics",
  "Grabado desde País", "Grabado desde Ciudad", "Slider",
  "Date created", "AppelPodcast", "spotify",
];

// --- CSV (sin dependencias) ------------------------------------------------

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field); field = "";
    } else if (c === "\n") {
      row.push(field); rows.push(row); row = []; field = "";
    } else if (c !== "\r") {
      field += c;
    }
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const header = rows[0];
  return rows.slice(1)
    .filter((r) => r.some((v) => v !== ""))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

function toCsv(records) {
  const esc = (v) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [
    COLUMNS.join(","),
    ...records.map((r) => COLUMNS.map((c) => esc(r[c])).join(",")),
  ].join("\n") + "\n";
}

// --- Vocabularios controlados ----------------------------------------------

async function knownTopics() {
  const src = await readFile(TOPICS_FILE, "utf8");
  return [...src.matchAll(/^\s*"([^"]+)":\s*\{ icon: (\w+),\s*hue: (\d+)/gm)]
    .map((m) => ({ name: m[1], hue: Number(m[3]) }));
}

async function knownCities() {
  const src = await readFile(COORDS_FILE, "utf8");
  return [...src.matchAll(/^\s*"([^"]+)":\s*\[/gm)].map((m) => m[1]).sort();
}

// --- Datos ------------------------------------------------------------------

async function loadAll() {
  const records = parseCsv(await readFile(CSV_FILE, "utf8"));
  const [topics, cities] = await Promise.all([knownTopics(), knownCities()]);
  const countries = [...new Set(records.map((r) => r["Grabado desde País"]).filter(Boolean))].sort();
  const usedIds = records.map((r) => Number(r.ID)).filter(Number.isFinite);
  return {
    records,
    topics,
    cities,
    countries,
    usedIds,
    nextId: usedIds.length ? Math.max(...usedIds) + 1 : 1,
  };
}

function validateEpisode(ep, { usedIds, topics, cities, isNew }) {
  const errors = [];
  const id = Number(ep.ID);
  if (!Number.isInteger(id) || id <= 0) errors.push("El ID tiene que ser un número entero positivo.");
  else if (isNew && usedIds.includes(id)) errors.push(`El ID ${id} ya está en uso.`);
  if (!String(ep.Invitado || "").trim()) errors.push("Falta el nombre del invitado.");
  if (!String(ep.Podcast || "").trim()) errors.push("Falta el título del episodio.");
  if (!String(ep.AppelPodcast || "").trim().startsWith("http"))
    errors.push("El link de Apple Podcasts es obligatorio y tiene que empezar con http.");

  const names = topics.map((t) => t.name);
  const chosen = String(ep.Topics || "").split(",").map((s) => s.trim()).filter(Boolean);
  for (const t of chosen) if (!names.includes(t)) errors.push(`Tema desconocido: ${t}`);

  const warnings = [];
  const city = String(ep["Grabado desde Ciudad"] || "").trim();
  if (city && !cities.includes(city))
    warnings.push(`La ciudad "${city}" no tiene coordenadas: no va a aparecer en el mapa. Agregala a CITY_COORDS en components/InvitadosClient.tsx.`);
  if (!chosen.length) warnings.push("El episodio no tiene ningún tema asignado.");
  if (!String(ep["Job Title"] || "").trim()) warnings.push("Falta el cargo del invitado.");

  return { errors, warnings };
}

// --- HTTP -------------------------------------------------------------------

const json = (res, status, data) => {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
};

const readBody = (req) => new Promise((resolve, reject) => {
  let b = "";
  req.on("data", (c) => { b += c; if (b.length > 1e6) req.destroy(); });
  req.on("end", () => { try { resolve(JSON.parse(b || "{}")); } catch (e) { reject(e); } });
  req.on("error", reject);
});

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);

    if (req.method === "GET" && url.pathname === "/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(await readFile(HTML_FILE, "utf8"));
    }

    if (req.method === "GET" && url.pathname === "/api/data") {
      const { records, topics, cities, countries, nextId } = await loadAll();
      return json(res, 200, { records, topics, cities, countries, nextId });
    }

    if (req.method === "POST" && url.pathname === "/api/save") {
      const { episode, originalId } = await readBody(req);
      const { records, topics, cities, usedIds } = await loadAll();
      const isNew = originalId === null || originalId === undefined || originalId === "";

      const { errors, warnings } = validateEpisode(episode, {
        usedIds: usedIds.filter((i) => String(i) !== String(originalId)),
        topics, cities, isNew,
      });
      if (errors.length) return json(res, 400, { ok: false, errors, warnings });

      const clean = Object.fromEntries(
        COLUMNS.map((c) => [c, String(episode[c] ?? "").trim()])
      );
      clean.Slider = episode.Slider ? "TRUE" : "FALSE";

      const idx = records.findIndex((r) => String(r.ID) === String(isNew ? episode.ID : originalId));
      if (idx >= 0) records[idx] = clean; else records.push(clean);
      records.sort((a, b) => Number(a.ID) - Number(b.ID));

      await writeFile(CSV_FILE, toCsv(records), "utf8");
      return json(res, 200, { ok: true, warnings, total: records.length });
    }

    res.writeHead(404).end("No encontrado");
  } catch (err) {
    json(res, 500, { ok: false, errors: [String(err && err.message || err)] });
  }
});

server.listen(PORT, () => {
  console.log(`\n  Editor de episodios → http://localhost:${PORT}`);
  console.log(`  Escribe en content/episodios.csv`);
  console.log(`  Al terminar, corré: npm run sync\n`);
});
