"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { MapPin } from "@phosphor-icons/react";
import { Episode } from "@/lib/data";

interface EpisodesGridProps {
  episodes: Episode[];
  topics: string[];
}

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

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
  if (active) {
    return {
      background: `hsl(${c.h} ${c.s}% 55%)`,
      color: "#09090b",
      borderColor: `hsl(${c.h} ${c.s}% 55%)`,
    };
  }
  if (hovered) {
    return {
      background: `hsl(${c.h} ${c.s}% 50% / 0.22)`,
      color: `hsl(${c.h} ${c.s}% 88%)`,
      borderColor: `hsl(${c.h} ${c.s}% 55% / 0.6)`,
    };
  }
  return {
    background: `hsl(${c.h} ${c.s}% 50% / 0.1)`,
    color: `hsl(${c.h} ${c.s}% 75%)`,
    borderColor: `hsl(${c.h} ${c.s}% 50% / 0.25)`,
  };
}

function TopicChip({ topic, active, onClick }: { topic: string; active: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="px-3 py-1.5 rounded-full text-[13px] md:text-base font-medium border transition-all duration-200"
      style={topicStyle(topic, active, hovered)}
    >
      {topic}
    </button>
  );
}

function CityChip({ city, active, onClick }: { city: string; active: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  let style: React.CSSProperties;
  if (active) {
    style = { background: "#27272a", color: "#f4f4f5", borderColor: "#f97316" };
  } else if (hovered) {
    style = { background: "#27272a", color: "#e4e4e7", borderColor: "#71717a" };
  } else {
    style = { background: "transparent", color: "#71717a", borderColor: "#3f3f46" };
  }
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 flex items-center gap-1.5"
      style={style}
    >
      <MapPin size={10} weight="bold" />
      {city}
    </button>
  );
}

function EpisodeCard({
  episode,
  index,
  isMatch,
  isFilterActive,
  isHighlighted,
  reduce,
  isLatest,
}: {
  episode: Episode;
  index: number;
  isMatch: boolean;
  isFilterActive: boolean;
  isHighlighted: boolean;
  reduce: boolean | null;
  isLatest: boolean;
}) {
  return (
    <motion.div
      key={episode.id}
      layout
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{
        opacity: isFilterActive && !isMatch ? 0.3 : 1,
        y: 0,
        filter: isFilterActive && !isMatch ? "saturate(0.15)" : "saturate(1)",
      }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
      transition={{
        duration: 0.4,
        delay: reduce ? 0 : isMatch ? Math.min(index, 12) * 0.03 : 0,
        ease: [0.16, 1, 0.3, 1],
      }}
      id={`ep-${episode.id}`}
      className={[
        "group rounded-xl p-5 flex flex-col transition-[border-color,box-shadow] scroll-mt-[170px] md:scroll-mt-[280px]",
        isHighlighted
          ? "ep-highlight bg-zinc-900 border border-orange-500 shadow-[0_0_40px_-4px_rgba(249,115,22,0.35)]"
          : isFilterActive && isMatch
          ? "bg-zinc-900 border border-orange-500/30 shadow-[0_0_32px_-8px_rgba(249,115,22,0.18)]"
          : "bg-zinc-900 border border-zinc-800 hover:border-zinc-700",
      ].join(" ")}
    >
      {isLatest && (
        <div className="inline-flex self-start items-center gap-1.5 px-2.5 py-1 rounded-md mb-3 font-mono text-[10px] tracking-[0.18em] uppercase bg-orange-500/15 border border-orange-500/35 text-orange-400">
          Último episodio
        </div>
      )}
      <h3 className="text-zinc-50 font-semibold text-lg leading-snug mb-3 group-hover:text-orange-500 transition-colors">
        {episode.title}
      </h3>

      <p className="text-zinc-300 text-base font-medium mb-1">{episode.guest}</p>
      <p className="text-zinc-400 text-base leading-snug">{episode.guestRole}</p>

      {episode.quote && (
        <p className="text-zinc-500 text-sm italic leading-relaxed mt-3 border-l-2 border-orange-500/30 pl-3 line-clamp-3">
          "{episode.quote}"
        </p>
      )}

      <div className="flex-1" />

      {episode.city && (
        <p className="flex items-center gap-1 text-zinc-300 text-base mt-3">
          <MapPin size={12} />
          {episode.city}
        </p>
      )}

      <div className="flex items-center gap-2 pt-3 mt-3 border-t border-zinc-800">
        {episode.spotifyUrl && (
          <a
            href={episode.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 group-hover:text-green-400 hover:text-green-400 transition-colors px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700"
          >
            <SpotifyIcon className="w-3.5 h-3.5" />
            Spotify
          </a>
        )}
        {episode.appleUrl && (
          <a
            href={episode.appleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 group-hover:text-purple-400 hover:text-purple-400 transition-colors px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700"
          >
            <AppleIcon className="w-3.5 h-3.5" />
            Apple
          </a>
        )}
      </div>
    </motion.div>
  );
}

const PAGE_SIZE = 12;

export default function EpisodesGrid({ episodes, topics }: EpisodesGridProps) {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const reduce = useReducedMotion();
  const latestId = episodes[0]?.id ?? -1;
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleTopicChange = useCallback((topic: string | null) => {
    setActiveTopic(topic);
    setVisibleCount(PAGE_SIZE);
    // If the section is partially behind the nav, scroll so its top aligns with the nav bottom
    setTimeout(() => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const NAV_H = 192;
      if (rect.top < NAV_H) {
        window.scrollTo({ top: window.scrollY + rect.top - NAV_H, behavior: "smooth" });
      }
    }, 30);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<number>).detail;
      setHighlightedId(id);
      setTimeout(() => setHighlightedId(null), 2800);
    };
    window.addEventListener("highlight-episode", handler);
    return () => window.removeEventListener("highlight-episode", handler);
  }, []);

  // On arrival from /invitados via /?highlight=ID&topic=TEMA#ep-ID
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const topicParam = params.get("topic");
    const highlightParam = params.get("highlight");
    if (!highlightParam) return;

    const id = parseInt(highlightParam, 10);
    if (isNaN(id)) return;

    if (topicParam) {
      setActiveTopic(topicParam);
    } else {
      // Expand visible list so the target episode is rendered
      const idx = episodes.findIndex((ep) => ep.id === id);
      if (idx >= 0) setVisibleCount(idx + 1);
    }

    // Wait for filter + Motion animations to settle (~0.76s max), then scroll precisely
    setTimeout(() => {
      setHighlightedId(id);
      const el = document.getElementById(`ep-${id}`);
      if (el) {
        // Measure the actual bottom of the sticky chips bar so the card clears it
        const stickyBar = wrapperRef.current?.querySelector<HTMLElement>(".sticky");
        const clearance = (stickyBar ? stickyBar.getBoundingClientRect().bottom : 260) + 16;
        const top = el.getBoundingClientRect().top + window.scrollY - clearance;
        window.scrollTo({ top, behavior: "instant" });
      }
      setTimeout(() => setHighlightedId(null), 3200);
    }, 900);
  }, [episodes]);

  const isFilterActive = !!activeTopic;

  const { matchingEps, restEps } = useMemo(() => {
    if (!activeTopic) return { matchingEps: episodes, restEps: [] };

    const matches = (ep: Episode) => !activeTopic || ep.topics.includes(activeTopic);

    const matching = episodes.filter(matches);
    const matchSet = new Set(matching.map((ep) => ep.id));
    const rest = episodes.filter((ep) => !matchSet.has(ep.id));

    const shuffled = [...rest];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return { matchingEps: matching, restEps: shuffled };
  }, [episodes, activeTopic]);

  return (
    <div ref={wrapperRef}>
      {/* Topic filter — sticky secondary nav */}
      <div
        className="sticky z-40 -mx-6 px-6 py-3 mb-4 bg-zinc-950/95 backdrop-blur-md top-[98px] md:top-48"
      >
        <div className="flex md:flex-wrap gap-2 overflow-x-auto md:overflow-visible scrollbar-none pb-0.5 md:pb-0">
          <button
            onClick={() => handleTopicChange(null)}
            className="px-3.5 py-1.5 rounded-full text-[13px] md:text-base font-medium border transition-all duration-200 shrink-0"
            style={!activeTopic
              ? { background: "#f97316", color: "#09090b", borderColor: "#f97316" }
              : { background: "transparent", color: "#71717a", borderColor: "#3f3f46" }}
          >
            Todos
          </button>
          {topics.map((topic) => (
            <div key={topic} className="shrink-0">
              <TopicChip
                topic={topic}
                active={activeTopic === topic}
                onClick={() => handleTopicChange(topic === activeTopic ? null : topic)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Matching count */}
      {isFilterActive && matchingEps.length > 0 && (
        <p className="text-xs text-zinc-600 mb-4">
          {matchingEps.length} podcast{matchingEps.length !== 1 ? "s" : ""} coinciden
        </p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        <AnimatePresence mode="popLayout">
          {(isFilterActive ? matchingEps : matchingEps.slice(0, visibleCount)).map((ep, i) => (
            <EpisodeCard
              key={ep.id}
              episode={ep}
              index={i}
              isMatch={true}
              isFilterActive={isFilterActive}
              isHighlighted={highlightedId === ep.id}
              reduce={reduce}
              isLatest={ep.id === latestId}
            />
          ))}

          {isFilterActive && restEps.length > 0 && (
            <motion.div
              key="separator"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-full flex items-center gap-4 py-5"
            >
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="font-mono text-[10px] text-zinc-600 tracking-[0.25em] uppercase select-none">
                {restEps.length} más
              </span>
              <div className="flex-1 h-px bg-zinc-800" />
            </motion.div>
          )}

          {restEps.map((ep, i) => (
            <EpisodeCard
              key={ep.id}
              episode={ep}
              index={i}
              isMatch={false}
              isFilterActive={isFilterActive}
              isHighlighted={highlightedId === ep.id}
              reduce={reduce}
              isLatest={ep.id === latestId}
            />
          ))}
        </AnimatePresence>
      </div>

      {!isFilterActive && visibleCount < matchingEps.length && (
        <div className="flex justify-center pt-10">
          <button
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            className="px-6 py-2.5 rounded-full border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-colors text-sm font-medium"
          >
            Ver más · {matchingEps.length - visibleCount} episodios
          </button>
        </div>
      )}
    </div>
  );
}
