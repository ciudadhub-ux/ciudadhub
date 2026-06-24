"use client";

import { useState, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { MapPin, X } from "@phosphor-icons/react";
import { SpotifyIcon, AppleIcon } from "./PodcastIcons";
import type { CityDot } from "./InvitadosMap";

const InvitadosMap = dynamic(() => import("./InvitadosMap"), {
  ssr: false,
  loading: () => <div className="w-full h-[420px] bg-zinc-900/50 rounded-xl animate-pulse" />,
});

// Coordenadas: [longitud, latitud]
const CITY_COORDS: Record<string, [number, number]> = {
  "Barcelona":    [2.17,    41.39],
  "Berkeley":     [-122.27, 37.87],
  "Bilbao":       [-2.92,   43.26],
  "Bogotá":       [-74.07,  4.71],
  "Boston":       [-71.06,  42.36],
  "Bucaramanga":  [-73.12,  7.13],
  "Buenos Aires": [-58.38,  -34.60],
  "Caracas":      [-66.92,  10.48],
  "Chile":        [-70.67,  -33.45],
  "Córdoba":      [-64.18,  -31.42],
  "Estonia":      [24.75,   59.44],
  "Guadalajara":  [-103.35, 20.67],
  "Lima":         [-77.04,  -12.05],
  "Londres":      [-0.12,   51.51],
  "Madrid":       [-3.70,   40.42],
  "Manresa":      [1.83,    41.72],
  "Mendoza":      [-68.83,  -32.89],
  "Miami":        [-80.19,  25.77],
  "Montería":     [-75.89,  8.75],
  "Montevideo":   [-56.16,  -34.90],
  "New York":     [-74.01,  40.71],
  "Ottawa":       [-75.70,  45.42],
  "Oxford":       [-1.26,   51.75],
  "Philadelphia": [-75.16,  39.95],
  "Pinamar":      [-56.86,  -37.11],
  "Portland":     [-122.68, 45.52],
  "Porto Alegre": [-51.23,  -30.03],
  "Puebla":       [-98.20,  19.04],
  "Rio de Janeiro": [-43.17, -22.91],
  "San Salvador": [-89.20,  13.70],
  "Tandil":       [-59.13,  -37.32],
  "Tel Aviv":     [34.78,   32.08],
  "Toronto":      [-79.38,  43.65],
  "Tucumán":      [-65.20,  -26.82],
  "Vancouver":    [-123.12, 49.28],
  "Warwick":      [-1.59,   52.28],
  "Washington":   [-77.04,  38.91],
  "Zaragoza":     [-0.88,   41.65],
};

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

const PAGE_SIZE = 18;

export default function InvitadosClient({ guests, allTopics }: Props) {
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const topRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => guests.filter((g) => !activeTopic || g.topics.includes(activeTopic)),
    [guests, activeTopic]
  );

  const cityGuests = useMemo(
    () => (activeCity ? guests.filter((g) => g.city === activeCity) : []),
    [guests, activeCity]
  );

  const cityDots = useMemo<CityDot[]>(() => {
    const counts = new Map<string, number>();
    const countryByCity = new Map<string, string>();
    for (const g of guests) {
      if (g.city && CITY_COORDS[g.city]) {
        counts.set(g.city, (counts.get(g.city) ?? 0) + 1);
        if (!countryByCity.has(g.city)) countryByCity.set(g.city, g.country);
      }
    }
    return [...counts.entries()].map(([city, count]) => ({
      city,
      country: countryByCity.get(city) ?? "",
      coordinates: CITY_COORDS[city],
      count,
    }));
  }, [guests]);

  const handleCityClick = (city: string) => {
    setActiveCity(city === activeCity ? null : city);
  };

  const clearAll = () => { setActiveCity(null); setActiveTopic(null); setVisibleCount(PAGE_SIZE); };
  const isFiltered = !!activeTopic;
  const visibleGuests = activeTopic ? filtered : filtered.slice(0, visibleCount);
  const hasMore = !activeTopic && visibleCount < filtered.length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">

      {/* Header */}
      <div ref={topRef} className="flex items-baseline justify-between mb-6 scroll-mt-52">
        <span className="font-mono text-[10px] text-zinc-600 tracking-widest uppercase">
          {filtered.length}{isFiltered ? ` / ${guests.length}` : ""} invitados
        </span>
      </div>

      {/* Active topic filter bar */}
      {activeTopic && (
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <span className="text-xs text-zinc-500 font-mono uppercase tracking-widest">Tema</span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border"
            style={topicStyle(activeTopic, true, false)}>
            {activeTopic}
            <button onClick={() => { setActiveTopic(null); setVisibleCount(PAGE_SIZE); }} className="ml-1 opacity-60 hover:opacity-100"><X size={11} weight="bold" /></button>
          </span>
          <button onClick={clearAll} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors underline underline-offset-2">
            Limpiar
          </button>
        </div>
      )}

      {/* Guest grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
        {visibleGuests.map(({ name, photoSrc, city, country, href, spotifyUrl, appleUrl }) => (
          <a key={name} href={href} className="group flex flex-col">
            <div className="aspect-square rounded-xl overflow-hidden bg-zinc-900 mb-3 relative">
              {photoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoSrc}
                  alt={name}
                  loading="lazy"
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
            <button onClick={clearAll} className="text-orange-500 underline underline-offset-2">Limpiar filtros</button>
          </p>
        )}
      </div>

      {hasMore && (
        <div className="flex justify-center mb-20">
          <button
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            className="px-6 py-2.5 rounded-full border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-colors text-sm font-medium"
          >
            Ver más · {filtered.length - visibleCount} invitados
          </button>
        </div>
      )}

      {!hasMore && <div className="mb-20" />}

      {/* Map section — desktop only */}
      <div className="hidden md:block">
        <div id="ciudades" className="border-t border-zinc-800 pt-16 mb-4 scroll-mt-52">
          <div className="relative">
            <InvitadosMap
              cities={cityDots}
              activeCity={activeCity}
              onCityClick={handleCityClick}
            />

            {activeCity && cityGuests.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div
                  className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm rounded-xl"
                  onClick={() => setActiveCity(null)}
                />
                <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-xl mx-6 max-h-[80%] overflow-y-auto shadow-2xl shadow-black/60">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h3 className="text-lg font-bold text-zinc-50 tracking-tight">{activeCity}</h3>
                      <p className="text-xs text-zinc-500 mt-0.5 font-mono uppercase tracking-widest">
                        {cityGuests.length} invitado{cityGuests.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveCity(null)}
                      className="text-zinc-500 hover:text-zinc-200 transition-colors p-1 -mr-1"
                    >
                      <X size={18} weight="bold" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                    {cityGuests.map(({ name, guestRole, photoSrc, spotifyUrl, appleUrl }) => {
                      const roleFirstLine = guestRole ? guestRole.split("\n")[0] : "";
                      return (
                        <div key={name} className="flex flex-col">
                          <div className="aspect-square rounded-xl overflow-hidden bg-zinc-800 mb-3 relative">
                            {photoSrc ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={photoSrc}
                                alt={name}
                                loading="lazy"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-600 font-bold text-base">
                                {initials(name)}
                              </div>
                            )}
                          </div>
                          <p className="text-zinc-100 text-sm font-semibold leading-snug">{name}</p>
                          {roleFirstLine && (
                            <p className="text-zinc-400 text-xs leading-snug mt-1 mb-3">{roleFirstLine}</p>
                          )}
                          <div className="flex flex-wrap gap-1.5 mt-auto">
                            {spotifyUrl && (
                              <a href={spotifyUrl} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-green-400 transition-colors px-2 py-1.5 rounded-md bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50">
                                <SpotifyIcon className="w-3 h-3 shrink-0" />
                                Spotify
                              </a>
                            )}
                            {appleUrl && (
                              <a href={appleUrl} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-purple-400 transition-colors px-2 py-1.5 rounded-md bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50">
                                <AppleIcon className="w-3 h-3 shrink-0" />
                                Apple
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Topic tags */}
      <div className="pt-8">
        <div className="flex flex-wrap gap-2">
          {allTopics.map((topic) => (
            <TopicChip
              key={topic}
              topic={topic}
              active={activeTopic === topic}
              onClick={() => {
                const next = topic === activeTopic ? null : topic;
                setActiveTopic(next);
                setVisibleCount(PAGE_SIZE);
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
