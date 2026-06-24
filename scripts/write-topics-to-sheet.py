#!/usr/bin/env python3
"""
write-topics-to-sheet.py — Agrega/actualiza la columna 'Topics' en el Google Sheet.
Uso: python3 scripts/write-topics-to-sheet.py

Requisitos:
  pip install gspread google-auth-oauthlib

Primera vez: necesita scripts/credentials.json
(Google Cloud Console → APIs & Services → Credentials → Create → OAuth 2.0 Client ID → Desktop app → Download JSON)
"""

import os
import sys

SPREADSHEET_ID = "1SJ7pJM-T3ja6v3YI64ScK0Y4PQGrDjLZdf5psuozgNE"
SCRIPTS_DIR = os.path.dirname(__file__)
SERVICE_ACCOUNT_FILE = os.path.join(SCRIPTS_DIR, "service-account.json")

try:
    import gspread
    from google.oauth2.service_account import Credentials
except ImportError:
    print("Faltan dependencias. Instala con:")
    print("  pip install gspread google-auth")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Topics (misma lógica que sync-data.py)
# ---------------------------------------------------------------------------

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


def derive_topics(title: str, role: str = "") -> list[str]:
    text = (title + " " + role).lower()
    topics = []
    for keywords, topic in TOPIC_RULES:
        if any(kw in text for kw in keywords):
            topics.append(topic)
    return topics


def get_topics(apple_url: str, title: str, role: str) -> list[str]:
    return MANUAL_TOPICS.get(apple_url.strip()) or derive_topics(title, role)


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

def authenticate() -> gspread.Client:
    if not os.path.exists(SERVICE_ACCOUNT_FILE):
        print(f"\nNo se encontró: {SERVICE_ACCOUNT_FILE}")
        print("Descarga la clave JSON de la service account y guárdala como scripts/service-account.json")
        sys.exit(1)
    creds = Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE,
        scopes=["https://www.googleapis.com/auth/spreadsheets"],
    )
    return gspread.authorize(creds)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print("Autenticando con Google...")
    gc = authenticate()

    print(f"Abriendo spreadsheet {SPREADSHEET_ID}...")
    sh = gc.open_by_key(SPREADSHEET_ID)
    ws = sh.get_worksheet(0)

    headers = ws.row_values(1)
    print(f"Columnas encontradas: {headers}")

    TOPICS_COL = "Topics"
    APPLE_COL = "AppelPodcast"
    TITLE_COL = "Podcast"
    ROLE_COL = "Job Title"

    for col in [APPLE_COL, TITLE_COL, ROLE_COL]:
        if col not in headers:
            print(f"Error: no se encontró la columna '{col}'")
            sys.exit(1)

    apple_idx = headers.index(APPLE_COL)
    title_idx = headers.index(TITLE_COL)
    role_idx = headers.index(ROLE_COL)

    if TOPICS_COL in headers:
        topics_col_num = headers.index(TOPICS_COL) + 1  # 1-based
        print(f"Columna '{TOPICS_COL}' ya existe (col {topics_col_num}), actualizando valores...")
    else:
        topics_col_num = len(headers) + 1
        ws.update_cell(1, topics_col_num, TOPICS_COL)
        print(f"Columna '{TOPICS_COL}' creada en posición {topics_col_num}")

    all_rows = ws.get_all_values()
    data_rows = all_rows[1:]  # skip header

    updates = []
    for row_num, row in enumerate(data_rows, start=2):
        apple_url = row[apple_idx] if apple_idx < len(row) else ""
        title = row[title_idx] if title_idx < len(row) else ""
        role = row[role_idx] if role_idx < len(row) else ""

        if not title and not apple_url:
            continue

        topics = get_topics(apple_url, title, role)
        cell = gspread.utils.rowcol_to_a1(row_num, topics_col_num)
        updates.append({"range": cell, "values": [[", ".join(topics)]]})

    if updates:
        ws.batch_update(updates)
        print(f"✓ {len(updates)} filas actualizadas en columna '{TOPICS_COL}'")
    else:
        print("Sin filas para actualizar.")


if __name__ == "__main__":
    main()
