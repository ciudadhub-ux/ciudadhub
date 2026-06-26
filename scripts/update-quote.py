#!/usr/bin/env python3
"""
update-quote.py — Sube un quote al Google Sheet
Uso: python3 scripts/update-quote.py <ID_EPISODIO> "<quote>"
"""

import sys
from google.oauth2 import service_account
from googleapiclient.discovery import build

SHEET_ID = "1SJ7pJM-T3ja6v3YI64ScK0Y4PQGrDjLZdf5psuozgNE"
SERVICE_ACCOUNT_FILE = "scripts/service-account.json"
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

def main():
    if len(sys.argv) < 3:
        print("Uso: python3 scripts/update-quote.py <ID_EPISODIO> \"<quote>\"")
        sys.exit(1)

    ep_id = int(sys.argv[1])
    quote = sys.argv[2]

    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    service = build("sheets", "v4", credentials=creds)
    sheet = service.spreadsheets()

    result = sheet.values().get(
        spreadsheetId=SHEET_ID,
        range="A:Z"
    ).execute()
    rows = result.get("values", [])
    headers = rows[0]

    id_col = headers.index("ID")
    quote_col = headers.index("quote") if "quote" in headers else headers.index("Quote")

    for i, row in enumerate(rows[1:], start=2):
        if len(row) > id_col and str(row[id_col]).strip() == str(ep_id):
            col_letter = chr(ord('A') + quote_col)
            range_notation = f"{col_letter}{i}"
            sheet.values().update(
                spreadsheetId=SHEET_ID,
                range=range_notation,
                valueInputOption="RAW",
                body={"values": [[quote]]}
            ).execute()
            print(f"✓ Quote actualizado en fila {i} (episodio {ep_id})")
            return

    print(f"✗ Episodio {ep_id} no encontrado en el Sheet")

if __name__ == "__main__":
    main()
