"use client";

import { Episode } from "@/lib/data";

interface GuestsListProps {
  episodes: Episode[];
}

export default function GuestsList({ episodes }: GuestsListProps) {
  const guests = Object.values(
    episodes.reduce<Record<string, { name: string; episodeId: number; city: string }>>(
      (acc, ep) => {
        const name = ep.guest.trim();
        if (!name || name.toLowerCase() === "ciudadhub") return acc;
        if (!acc[name]) {
          acc[name] = { name, episodeId: ep.id, city: ep.city };
        }
        return acc;
      },
      {}
    )
  ).sort((a, b) => a.name.localeCompare(b.name, "es"));

  function handleClick(e: React.MouseEvent, episodeId: number) {
    e.preventDefault();
    const el = document.getElementById(`ep-${episodeId}`);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });

    // Dispatch highlight event after scroll lands (~500ms)
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("highlight-episode", { detail: episodeId })
      );
    }, 500);
  }

  return (
    <section id="invitados" className="py-24 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">
        <p className="font-mono text-xs text-zinc-600 tracking-[0.15em] uppercase mb-10">
          Invitados
        </p>

        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-3">
          {guests.map(({ name, episodeId, city }) => (
            <li key={`${name}-${episodeId}`}>
              <a
                href={`#ep-${episodeId}`}
                onClick={(e) => handleClick(e, episodeId)}
                className="group flex flex-col active:scale-[0.96] transition-transform duration-100"
              >
                <span className="flex items-center gap-1">
                  <span className="text-zinc-300 text-sm font-medium leading-snug group-hover:text-orange-400 transition-colors">
                    {name}
                  </span>
                  <span className="text-zinc-700 text-xs opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                    ↗
                  </span>
                </span>
                {city && (
                  <span className="text-zinc-600 text-xs mt-0.5">{city}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
