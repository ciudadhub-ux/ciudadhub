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
import urllib.request
from collections import Counter

SHEET_CSV_URL = (
    "https://docs.google.com/spreadsheets/d/e/"
    "2PACX-1vR67mdGIFDbn9wFuVTI01wGmV6zuj2k7rhAwPk6dCamJkiYGjSQUdBc8RrBssTqmXhlJvdYkt0q6cTb"
    "/pub?output=csv"
)

OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "lib", "data.ts")

# ---------------------------------------------------------------------------
# Derivar topics desde el título (sin columna de keywords en el Sheet)
# ---------------------------------------------------------------------------
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
        name = row.get("Name", "").strip()
        role = row.get("Job Title", "").strip()
        title = row.get("Podcast", "").strip()
        apple_url = row.get("AppelPodcast", "").strip()
        spotify_url = row.get("spotify", "").strip()
        city = clean_city(row.get("Grabado desde...", ""))
        order_raw = row.get("Order", "0").strip()

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

        topics = derive_topics(title, role)

        episodes.append({
            "name": name,
            "role": role,
            "title": title,
            "description": "",
            "apple_url": apple_url,
            "spotify_url": spotify_url if spotify_url.startswith("http") else "",
            "city": city,
            "topics": topics,
            "created_date": created_date,
            "image_url": image_url,
            "seed": name_to_seed(name),
            "row_index": len(episodes),  # posición en el sheet
        })

    # Ordenar: con fecha → por fecha DESC; sin fecha → por posición en sheet DESC (más reciente al tope)
    total = len(episodes)
    episodes.sort(
        key=lambda e: e["created_date"] if e["created_date"] else f"9999-{total - e['row_index']:05d}",
        reverse=True,
    )

    # Asignar IDs correlativos (el más reciente = id más alto)
    for i, ep in enumerate(episodes):
        ep["id"] = len(episodes) - i

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
        "  description: string",
        "  guest: string",
        "  guestRole: string",
        "  topics: string[]",
        "  city: string",
        "  appleUrl: string",
        "  spotifyUrl: string",
        "  imageUrl: string",
        "  guestAvatarSeed: string",
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
            f"    description: {ts_string(ep['description'])},",
            f"    guest: {ts_string(ep['name'])},",
            f"    guestRole: {ts_string(ep['role'])},",
            f"    topics: {topics_ts},",
            f"    city: {ts_string(ep['city'])},",
            f"    appleUrl: {ts_string(ep['apple_url'])},",
            f"    spotifyUrl: {ts_string(ep['spotify_url'])},",
            f"    imageUrl: {ts_string(ep['image_url'])},",
            f"    guestAvatarSeed: {ts_string(ep['seed'])},",
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
