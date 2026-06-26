#!/usr/bin/env python3
"""
extract-quotes-ollama.py — Extrae quotes de transcripts usando Ollama local
Uso: python3 scripts/extract-quotes-ollama.py <ID> "<Nombre Invitado>"
"""

import sys
import json
import urllib.request
import os
import re

TRANSCRIPTS_FILE = "transcripts/TRANSCRIPCIONES_UNIDAS.txt"
VAULT_QUOTES = "/Users/abc/Library/Mobile Documents/iCloud~md~obsidian/Documents/andres/ciudadhub/quotes"
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "qwen3:8b"

def find_transcript(nombre: str, content: str) -> str:
    nombre_norm = nombre.lower().split()[0]
    pattern = rf"={{{10,}}}\s*\n.*{re.escape(nombre.split()[0])}.*\n={{{10,}}}(.*?)(?=={{{10,}}}|\Z)"
    match = re.search(pattern, content, re.IGNORECASE | re.DOTALL)
    if match:
        return match.group(1).strip()
    return ""

def extract_quotes(transcript: str, nombre: str, titulo: str) -> str:
    prompt = f"""Eres un editor de podcast. Leé esta transcripción y extraé exactamente 3 quotes del invitado {nombre}.

Criterios:
- Solo palabras del invitado, nunca del conductor
- Máximo 350 caracteres cada uno
- Idea completa, sin necesitar contexto previo
- Sin muletillas ni frases de relleno (no usar: "eh", "bueno", "o sea", "digamos")
- Que capture ideas centrales del episodio
- Los 3 deben ser distintos entre sí

Respondé SOLO con este formato JSON, sin texto adicional:
{{
  "quote1": "texto del primer quote",
  "quote2": "texto del segundo quote", 
  "quote3": "texto del tercer quote"
}}

TRANSCRIPCIÓN:
{transcript[:8000]}"""

    data = json.dumps({
        "model": MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {"temperature": 0.3}
    }).encode()

    req = urllib.request.Request(OLLAMA_URL, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        result = json.load(resp)
    
    response = result["response"].strip()
    match = re.search(r'\{.*\}', response, re.DOTALL)
    if match:
        quotes = json.loads(match.group())
        return quotes
    return None

def save_to_obsidian(ep_id: str, nombre: str, titulo: str, quotes: dict):
    filename = f"EP-{ep_id.zfill(3)} - {nombre}.md"
    path = os.path.join(VAULT_QUOTES, filename)
    
    content = f"""---
id: {ep_id}
invitado: {nombre}
titulo: {titulo}
estado: pendiente
---

## Quote 1
"{quotes['quote1']}"

## Quote 2
"{quotes['quote2']}"

## Quote 3
"{quotes['quote3']}"
"""
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✓ Nota creada: {filename}")

def main():
    if len(sys.argv) < 3:
        print("Uso: python3 scripts/extract-quotes-ollama.py <ID> \"<Nombre Invitado>\"")
        sys.exit(1)

    ep_id = sys.argv[1]
    nombre = sys.argv[2]
    titulo = sys.argv[3] if len(sys.argv) > 3 else ""

    with open(TRANSCRIPTS_FILE, encoding="utf-8") as f:
        content = f.read()

    print(f"Buscando transcript de {nombre}...")
    transcript = find_transcript(nombre, content)
    
    if not transcript:
        print(f"✗ No se encontró transcript para {nombre}")
        sys.exit(1)
    
    print(f"Transcript encontrado ({len(transcript)} chars). Extrayendo quotes...")
    quotes = extract_quotes(transcript, nombre, titulo)
    
    if not quotes:
        print("✗ No se pudieron extraer quotes")
        sys.exit(1)

    save_to_obsidian(ep_id, nombre, titulo, quotes)
    print("Listo ✓")

if __name__ == "__main__":
    main()

