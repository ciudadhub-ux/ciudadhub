"use client";

import { useState, useMemo, useRef } from "react";
import { MapPin, X } from "@phosphor-icons/react";
import { SpotifyIcon, AppleIcon } from "./PodcastIcons";

const TOPIC_COLORS: Record<string, { h: number; s: number }> = {
  "Smart Cities":      { h: 213, s: 94 },
  "Datos":             { h: 258, s: 89 },
  "Movilidad":         { h: 142, s: 71 },
  "Sostenibilidad":    { h: 160, s: 84 },
  "Urbanismo":         { h: 38,  s: 92 },
  "Equidad":           { h: 343, s: 88 },
  "Gobernanza":        { h: 199, s: 89 },
  "Salud":             { h: 173, s: 80 },
  "Innovación":        { h: 24,  s: 94 },
  "Espacio Público":   { h: 84,  s: 81 },
  "Ciudades Globales": { h: 239, s: 84 },
};

function topicStyle(topic: string, active: boolean, hovered: boolean) {
  const c = TOPIC_COLORS[topic] ?? { h: 30, s: 60 };
  if (active) return { background: `hsl(${c.h} ${c.s}% 55%)`, color: "#09090b", borderColor: `hsl(${c.h} ${c.s}% 55%)` };
  if (hovered) return { background: `hsl(${c.h} ${c.s}% 50% / 0.22)`, color: `hsl(${c.h} ${c.s}% 88%)`, borderColor: `hsl(${c.h} ${c.s}% 55% / 0.6)` };
  return { background: `hsl(${c.h} ${c.s}% 50% / 0.1)`, color: `hsl(${c.h} ${c.s}% 75%)`, borderColor: `hsl(${c.h} ${c.s}% 50% / 0.25)` };
}

function TopicChip({ topic, active, onClick }: { topic: string; active: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200"
      style={topicStyle(topic, active, hovered)}
    >
      {topic}
    </button>
  );
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export type GuestData = {
  name: string;
  guestRole: string;
  episodeId: number;
  city: string;
  country: string;
  topics: string[];
  photoSrc: string | null;
  href: string;
  spotifyUrl: string;
  appleUrl: string;
};

interface Props {
  guests: GuestData[];
  allTopics: string[];
}

export default function InvitadosClient({ guests, allTopics }: Props) {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => guests.filter((g) => !activeTopic || g.topics.includes(activeTopic)),
    [guests, activeTopic]
  );

  const isFiltered = !!activeTopic;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">

      {/* Header */}
      <div ref={topRef} className="flex items-baseline justify-between mb-6 scroll-mt-52">
        <h1 className="text-3xl font-bold text-zinc-50 tracking-tight">Invitados</h1>
        <span className="font-mono text-[10px] text-zinc-600 tracking-widest uppercase">
          {filtered.length}{isFiltered ? ` / ${guests.length}` : ""} personas
        </span>
      </div>

      {/* Active topic filter bar */}
      {activeTopic && (
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <span className="text-xs text-zinc-500 font-mono uppercase tracking-widest">Tema</span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border"
            style={topicStyle(activeTopic, true, false)}>
            {activeTopic}
            <button onClick={() => setActiveTopic(null)} className="ml-1 opacity-60 hover:opacity-100"><X size={11} weight="bold" /></button>
          </span>
          <button onClick={() => setActiveTopic(null)} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors underline underline-offset-2">
            Limpiar
          </button>
        </div>
      )}

      {/* Guest grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-24">
        {filtered.map(({ name, photoSrc, city, country, href, spotifyUrl, appleUrl }) => (
          <a key={name} href={href} className="group flex flex-col">
            <div className="aspect-square rounded-xl overflow-hidden bg-zinc-900 mb-3 relative">
              {photoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoSrc}
                  alt={name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600 font-bold text-xl">
                  {initials(name)}
                </div>
              )}
              <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/8 transition-all duration-500 rounded-xl" />
            </div>
            <p className="text-zinc-200 text-sm font-medium leading-snug group-hover:text-orange-400 transition-colors">
              {name}
            </p>
            {city && (
              <p className="flex items-center gap-1 text-zinc-400 text-sm mt-0.5 mb-2">
                <MapPin size={9} weight="bold" />
                {city}{country ? `, ${country}` : ""}
              </p>
            )}
            {(spotifyUrl || appleUrl) && (
              <div className="flex gap-1.5 mt-auto pt-1" onClick={(e) => e.preventDefault()}>
                {spotifyUrl && (
                  <a href={spotifyUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-zinc-500 hover:text-green-400 transition-colors px-2 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800">
                    <SpotifyIcon className="w-3 h-3 shrink-0" />
                    <span>Spotify</span>
                  </a>
                )}
                {appleUrl && (
                  <a href={appleUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-zinc-500 hover:text-purple-400 transition-colors px-2 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800">
                    <AppleIcon className="w-3 h-3 shrink-0" />
                    <span>Apple</span>
                  </a>
                )}
              </div>
            )}
          </a>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-zinc-600 py-12 text-center text-sm">
            No hay invitados con ese filtro.{" "}
            <button onClick={() => setActiveTopic(null)} className="text-orange-500 underline underline-offset-2">Limpiar filtros</button>
          </p>
        )}
      </div>

      {/* Topic tags */}
      <div className="border-t border-zinc-800 pt-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-50 tracking-tight">Temas</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {allTopics.map((topic) => (
            <TopicChip
              key={topic}
              topic={topic}
              active={activeTopic === topic}
              onClick={() => {
                const next = topic === activeTopic ? null : topic;
                setActiveTopic(next);
                if (next && topRef.current) {
                  topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
