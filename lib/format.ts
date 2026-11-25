const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

// "2026-08-21" → "Ago 2026". Devuelve "" si la fecha falta o no es válida.
export function formatEpisodeDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})/.exec(iso ?? "");
  if (!m) return "";
  const mes = MESES[Number(m[2]) - 1];
  return mes ? `${mes} ${m[1]}` : "";
}
