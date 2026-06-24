#!/usr/bin/env python3
"""
sync-data.py — Lee el Google Sheet publicado y regenera lib/data.ts
Uso: python3 scripts/sync-data.py  (o: npm run sync)
"""

import csv
import io
import json
import os
import re
import unicodedata
import urllib.parse
import urllib.request
from collections import Counter

SHEET_CSV_URL = (
    "https://docs.google.com/spreadsheets/d/e/"
    "2PACX-1vR67mdGIFDbn9wFuVTI01wGmV6zuj2k7rhAwPk6dCamJkiYGjSQUdBc8RrBssTqmXhlJvdYkt0q6cTb"
    "/pub?output=csv"
)

OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "lib", "data.ts")
INVITADOS_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images", "INVITADOS")
EPISODIOS_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images", "episodios")

# ---------------------------------------------------------------------------
# Derivar topics desde el título (sin columna de keywords en el Sheet)
# ---------------------------------------------------------------------------
# Topics asignados manualmente (apple_url → lista de topics).
# Tienen prioridad sobre los derivados por TOPIC_RULES.
MANUAL_TOPICS: dict[str, list[str]] = {
    "https://podcasts.apple.com/us/podcast/ciudades-geopol%C3%ADtica-y-el-nuevo-des-orden-mundial/id1093603743?i=1000754009235": ["Ciudades Globales", "Gobernanza"],
    "https://podcasts.apple.com/us/podcast/buenos-aires-juegos-deporte-y-espacio-urbano/id1093603743?i=1000750039015": ["Espacio Público", "Urbanismo"],
    "https://podcasts.apple.com/us/podcast/mendoza-un-oasis-urbano/id1093603743?i=1000666946582": ["Sostenibilidad", "Urbanismo"],
    "https://podcasts.apple.com/us/podcast/de-las-estrategias-a-los-cambios-reales/id1093603743?i=1000663958522": ["Urbanismo", "Gobernanza"],
    "https://open.spotify.com/episode/2PpNRwrTz4dhYO9YvdUsPf?si=50316716608f4314": ["Gobernanza", "Urbanismo"],
    "https://podcasts.apple.com/us/podcast/bogot%C3%A1-una-ciudad-cuidadora/id1093603743?i=1000535344330": ["Equidad", "Gobernanza"],
    "https://podcasts.apple.com/ca/podcast/ciudad-hubs-tracks/id1093603743?i=1000527175980": ["Gobernanza", "Innovación"],
    "https://podcasts.apple.com/ca/podcast/ciudad-hubs-tracks/id1093603743?i=1000507372571": ["Ciudades Globales", "Urbanismo"],
    "https://podcasts.apple.com/ca/podcast/ciudad-hubs-tracks/id1093603743?i=1000407391334": ["Gobernanza", "Urbanismo"],
    "https://podcasts.apple.com/ca/podcast/ciudad-hubs-tracks/id1093603743?i=1000372447037": ["Sostenibilidad", "Innovación"],
    "https://podcasts.apple.com/ca/podcast/ciudad-hubs-tracks/id1093603743?i=1000400805736": ["Sostenibilidad", "Gobernanza"],
    "https://podcasts.apple.com/ca/podcast/ciudad-hubs-tracks/id1093603743?i=1000424333818": ["Sostenibilidad", "Ciudades Globales"],
    "https://podcasts.apple.com/ca/podcast/ciudad-hubs-tracks/id1093603743?i=1000389710855": ["Ciudades Globales", "Urbanismo"],
    "https://podcasts.apple.com/ca/podcast/ciudad-hubs-tracks/id1093603743?i=1000364882952": ["Urbanismo", "Ciudades Globales"],
    "https://podcasts.apple.com/ca/podcast/ciudad-hubs-tracks/id1093603743?i=1000443424811": ["Gobernanza", "Urbanismo"],
    "https://podcasts.apple.com/ca/podcast/ciudad-hubs-tracks/id1093603743?i=1000421743124": ["Espacio Público", "Urbanismo"],
    "https://podcasts.apple.com/ca/podcast/ciudad-hubs-tracks/id1093603743?i=1000394443714": ["Gobernanza", "Ciudades Globales"],
    "https://podcasts.apple.com/ca/podcast/ciudad-hubs-tracks/id1093603743?i=1000384618088": ["Urbanismo", "Gobernanza"],
    "https://podcasts.apple.com/ca/podcast/ciudad-hubs-tracks/id1093603743?i=1000385312004": ["Sostenibilidad", "Espacio Público"],
    "https://podcasts.apple.com/ca/podcast/ciudad-hubs-tracks/id1093603743?i=1000403022231": ["Movilidad", "Urbanismo"],
    "https://podcasts.apple.com/ca/podcast/ciudad-hubs-tracks/id1093603743?i=1000404429488": ["Ciudades Globales", "Urbanismo"],
    "https://podcasts.apple.com/ca/podcast/ciudad-hubs-tracks/id1093603743?i=1000460870405": ["Urbanismo", "Equidad"],
    "https://podcasts.apple.com/ca/podcast/ciudad-hubs-tracks/id1093603743?i=1000408860992": ["Espacio Público", "Equidad"],
    "https://podcasts.apple.com/ca/podcast/ciudad-hubs-tracks/id1093603743?i=1000425048218": ["Urbanismo", "Equidad"],
    "https://podcasts.apple.com/ca/podcast/ciudad-hubs-tracks/id1093603743?i=1000450957597": ["Urbanismo", "Innovación"],
    "https://podcasts.apple.com/ca/podcast/ciudad-hubs-tracks/id1093603743?i=1000375136075": ["Movilidad", "Urbanismo"],
}

TOPIC_RULES: list[tuple[list[str], str]] = [
    (["smart city", "smart cities", "smartcity", "ciudad inteligente", "ciudades inteligentes",
      "tecnolog", "iot", "digital", "datos abiertos", "open data"], "Smart Cities"),
    (["datos", "data", "big data"], "Datos"),
    (["movilidad", "mobility", "transporte", "bicicleta", "bikesharing", "bus", "metro",
      "eléctrico", "electrico", "micromovil", "scooter", "tráfico"], "Movilidad"),
    (["sostenibilidad", "sustainability", "medioambiente", "medio ambiente", "climát",
      "ecolog", "verde", "green", "biodiversidad", "residuos", "energía"], "Sostenibilidad"),
    (["urbanismo", "urbanism", "diseño urbano", "arquitectura", "planeamiento",
      "planificación", "metropol", "barrio", "expansión urbana", "gentrific"], "Urbanismo"),
    (["equidad", "desigualdad", "inclusión", "inclusion", "género", "genero",
      "diversidad", "accesibilidad", "pobreza", "derecho a la ciudad"], "Equidad"),
    (["gobernanza", "governance", "gobierno", "participación", "participacion",
      "democracia", "ciudadanía", "ciudadania", "liderazgo", "gestión"], "Gobernanza"),
    (["salud", "health", "bienestar", "pandemia", "covid", "espacio público para la salud"], "Salud"),
    (["innovación", "innovacion", "innovation", "emprendimiento", "startup",
      "start-up", "laboratorio", "lab", "hackeractivismo"], "Innovación"),
    (["espacio público", "espacio publico", "parque", "plaza", "mercado"], "Espacio Público"),
    (["ciudades globales", "ciudad global", "globalización", "globalizacion",
      "diplomacia", "cooperación", "internacional"], "Ciudades Globales"),
]


# Guest name → image filename (for names that don't auto-match)
MANUAL_GUEST_IMAGES: dict[str, str] = {
    "Xavi Matilla":                    "Xavier Matilla bw.jpg",
    "Nicolás Galarza":                 "Nicalás Galarza bw.jpeg",
    "Genis Arnàs":                     "Genis Arnal bw.jpg",
    "Miguel Rodríguez Planas":         "Miquel_Rodriguez_Planas bw.png",
    "Manu Fernández":                  "ManuvFernandez bw.jpg",
    "Patricia Alalta":                 "Patricia Alata bw.jpg",
    "Jorge Pérez Jaramillo":           "JorgePerez bw.jpg",
    "Aida Esteban Millet":             "Aida Esteban Millat bw.jpg",
    "Mauricio Leclerc":                "Mauricio Leclerq bw.jpg",
    "Elkin Velasquez":                 "Elkin Velazques bw.jpg",
    "Guillermo Peñalosa":              "Guillermo Gil Peñaloza bw.jpeg",
    "Joao Porto de Albuquereque":      "Joa Porto de Albuquerque bw.jpg",
}


def build_episodio_image_map() -> dict[int, str]:
    if not os.path.isdir(EPISODIOS_DIR):
        return {}
    result: dict[int, str] = {}
    for f in os.listdir(EPISODIOS_DIR):
        if f.startswith("."):
            continue
        m = re.match(r'^id\s+(\d+)', f, re.IGNORECASE)
        if m:
            ep_id = int(m.group(1))
            result[ep_id] = f"/images/episodios/{urllib.parse.quote(unicodedata.normalize('NFC', f), safe='')}"
    return result


def _norm(s: str) -> str:
    s = s.strip().lower()
    s = "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")
    s = re.sub(r"[^a-z0-9 ]", "", s)
    return re.sub(r"\s+", " ", s).strip()


def _build_image_map() -> dict[str, str]:
    if not os.path.isdir(INVITADOS_DIR):
        return {}
    result: dict[str, str] = {}
    files = [f for f in os.listdir(INVITADOS_DIR) if not f.startswith(".")]
    # Process color first so bw versions override them
    for bw_first in (False, True):
        for f in files:
            is_bw = " bw" in f.lower()
            if is_bw != bw_first:
                continue
            base = os.path.splitext(f)[0]
            base = re.sub(r"\s+bw\s*$", "", base, flags=re.IGNORECASE).strip()
            encoded = urllib.parse.quote(unicodedata.normalize("NFC", f), safe="")
            result[_norm(base)] = f"/images/INVITADOS/{encoded}"
    return result


_IMAGE_MAP: dict[str, str] = {}


def find_guest_image(guest_name: str) -> str:
    global _IMAGE_MAP
    if not _IMAGE_MAP:
        _IMAGE_MAP = _build_image_map()
    # Manual override first
    if guest_name in MANUAL_GUEST_IMAGES:
        f = MANUAL_GUEST_IMAGES[guest_name]
        return f"/images/INVITADOS/{urllib.parse.quote(unicodedata.normalize('NFC', f), safe='')}"
    norm = _norm(guest_name)
    # Exact match
    if norm in _IMAGE_MAP:
        return _IMAGE_MAP[norm]
    # File name is prefix of guest full name (e.g. "pau solanilla" vs "pau solanilla franco")
    for key, path in _IMAGE_MAP.items():
        if norm.startswith(key) or key.startswith(norm):
            return path
    # All words in the file name appear in the guest name
    for key, path in _IMAGE_MAP.items():
        key_words = set(key.split())
        if key_words and key_words.issubset(set(norm.split())):
            return path
    return ""


def derive_topics(title: str, role: str = "") -> list[str]:
    text = (title + " " + role).lower()
    topics = []
    for keywords, topic in TOPIC_RULES:
        if any(kw in text for kw in keywords):
            topics.append(topic)
    return topics


def name_to_seed(name: str) -> str:
    return re.sub(r"[^a-z]", "", name.lower())[:20]


def clean_city(val: str) -> str:
    val = val.strip()
    if not val or val.startswith(("http", "[", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9")):
        return ""
    if len(val) > 60 or any(c in val for c in ["/", "\\", "@", "=", "?"]):
        return ""
    return val


def convert_image_url(url: str) -> str:
    """Convierte URLs de imagen. Soporta rutas locales (/images/...) y URLs externas."""
    url = url.strip()
    if not url:
        return ""
    # Ruta local (ej: /images/episodio.jpg)
    if url.startswith("/"):
        return url
    if not url.startswith("http"):
        return ""
    # Google Drive → no fiable para embed, devolver vacío
    if "drive.google.com" in url or "googleusercontent.com" in url:
        return ""
    return url


def ts_string(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def fetch_sheet() -> list[dict]:
    print(f"Descargando Google Sheet...")
    response = urllib.request.urlopen(SHEET_CSV_URL)
    data = response.read().decode("utf-8")
    reader = csv.DictReader(io.StringIO(data))
    return list(reader)


def parse_rows(rows: list[dict]) -> list[dict]:
    episodes = []
    seen_apple = set()

    for row in rows:
        name = (row.get("Invitado") or row.get("Name") or "").strip()
        role = row.get("Job Title", "").strip()
        title = row.get("Podcast", "").strip()
        apple_url = row.get("AppelPodcast", "").strip()
        spotify_url = row.get("spotify", "").strip()
        city = clean_city(row.get("Grabado desde Ciudad", ""))
        country = clean_city(row.get("Grabado desde País", ""))

        # Saltar filas sin datos esenciales
        if not name or not title or not apple_url.startswith("http"):
            continue

        # Deduplicar por Apple URL
        if apple_url in seen_apple:
            continue
        seen_apple.add(apple_url)

        created_date = row.get("Created Date", "").strip()
        image_url_raw = row.get("Image", "").strip()
        image_url = convert_image_url(image_url_raw)

        sheet_topics_raw = row.get("Topics", "").strip()
        if sheet_topics_raw:
            topics = [t.strip() for t in sheet_topics_raw.split(",") if t.strip()]
        else:
            topics = MANUAL_TOPICS.get(apple_url) or derive_topics(title, role)

        quote = (row.get("quote") or row.get("Quote") or "").strip()
        slider_raw = (row.get("Slider") or row.get("slider") or "").strip().lower()
        featured = slider_raw in ("yes", "si", "sí", "x", "1", "true", "✓", "✔")

        sheet_id_raw = row.get("ID", "").strip()
        sheet_id = int(sheet_id_raw) if sheet_id_raw.isdigit() else None

        episodes.append({
            "name": name,
            "role": role,
            "title": title,
            "quote": quote,
            "apple_url": apple_url,
            "spotify_url": spotify_url if spotify_url.startswith("http") else "",
            "city": city,
            "country": country,
            "topics": topics,
            "created_date": created_date,
            "image_url": image_url,
            "guest_image_url": find_guest_image(name),
            "featured": featured,
            "seed": name_to_seed(name),
            "sheet_id": sheet_id,
            "row_index": len(episodes),
        })

    # Usar IDs del sheet si están disponibles; si no, asignar por orden descendente de fecha
    has_sheet_ids = all(ep["sheet_id"] is not None for ep in episodes)
    if has_sheet_ids:
        for ep in episodes:
            ep["id"] = ep["sheet_id"]
        episodes.sort(key=lambda e: e["id"], reverse=True)
    else:
        total = len(episodes)
        episodes.sort(
            key=lambda e: e["created_date"] if e["created_date"] else f"9999-{total - e['row_index']:05d}",
            reverse=True,
        )
        for i, ep in enumerate(episodes):
            ep["id"] = len(episodes) - i

    # Sobrescribir image_url con fotos locales de la carpeta episodios/
    episodio_images = build_episodio_image_map()
    for ep in episodes:
        if ep["id"] in episodio_images:
            ep["image_url"] = episodio_images[ep["id"]]

    return episodes


def generate_ts(episodes: list[dict]) -> str:
    topic_counter: Counter = Counter()
    for ep in episodes:
        for t in ep["topics"]:
            topic_counter[t] += 1

    lines = [
        "// AUTO-GENERADO por scripts/sync-data.py — no editar manualmente",
        "",
        "export interface Episode {",
        "  id: number",
        "  title: string",
        "  quote: string",
        "  guest: string",
        "  guestRole: string",
        "  topics: string[]",
        "  city: string",
        "  country: string",
        "  appleUrl: string",
        "  spotifyUrl: string",
        "  imageUrl: string",
        "  guestImageUrl: string",
        "  guestAvatarSeed: string",
        "  featured: boolean",
        "}",
        "",
        "export interface TopicStat {",
        "  name: string",
        "  count: number",
        "}",
        "",
        "export const episodes: Episode[] = [",
    ]

    for ep in episodes:
        topics_ts = "[" + ", ".join(ts_string(t) for t in ep["topics"]) + "]"
        lines += [
            "  {",
            f"    id: {ep['id']},",
            f"    title: {ts_string(ep['title'])},",
            f"    quote: {ts_string(ep['quote'])},",
            f"    guest: {ts_string(ep['name'])},",
            f"    guestRole: {ts_string(ep['role'])},",
            f"    topics: {topics_ts},",
            f"    city: {ts_string(ep['city'])},",
            f"    country: {ts_string(ep['country'])},",
            f"    appleUrl: {ts_string(ep['apple_url'])},",
            f"    spotifyUrl: {ts_string(ep['spotify_url'])},",
            f"    imageUrl: {ts_string(ep['image_url'])},",
            f"    guestImageUrl: {ts_string(ep['guest_image_url'])},",
            f"    guestAvatarSeed: {ts_string(ep['seed'])},",
            f"    featured: {'true' if ep['featured'] else 'false'},",
            "  },",
        ]

    lines += [
        "]",
        "",
        "export const allTopics: TopicStat[] = [",
    ]
    for topic, count in topic_counter.most_common():
        lines.append(f"  {{ name: {ts_string(topic)}, count: {count} }},")
    lines += [
        "]",
        "",
        "export const allGuests = episodes.map(ep => ({",
        "  name: ep.guest,",
        "  role: ep.guestRole,",
        "  city: ep.city,",
        "  topics: ep.topics,",
        "  episodeId: ep.id,",
        "  episodeTitle: ep.title,",
        "  appleUrl: ep.appleUrl,",
        "  spotifyUrl: ep.spotifyUrl,",
        "  guestAvatarSeed: ep.guestAvatarSeed,",
        "}))",
        "",
    ]

    return "\n".join(lines)


def main():
    rows = fetch_sheet()
    episodes = parse_rows(rows)
    print(f"Episodios encontrados: {len(episodes)}")

    output = os.path.abspath(OUTPUT_PATH)
    with open(output, "w", encoding="utf-8") as f:
        f.write(generate_ts(episodes))
    print(f"Generado: {output}")
    print("Listo ✓")


if __name__ == "__main__":
    main()
