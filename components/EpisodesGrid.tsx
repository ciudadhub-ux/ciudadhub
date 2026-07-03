"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { MapPin } from "@phosphor-icons/react";
import { Episode } from "@/lib/data";
import { SpotifyIcon, AppleIcon } from "./PodcastIcons";
import { TopicChip } from "./TopicChip";

interface EpisodesGridProps {
  episodes: Episode[];
  topics: string[];
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
      const NAV_H = window.innerWidth >= 768 ? 192 : 98;
      if (rect.top < NAV_H) {
        window.scrollTo({ top: window.scrollY + rect.top - NAV_H, behavior: "smooth" });
      }
    }, 30);
  }, []);

  // On arrival from /invitados via /?highlight=ID&topic=TEMA#ep-ID
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const topicParam = params.get("topic");
    const highlightParam = params.get("highlight");
    if (!highlightParam) return;

    const id = parseInt(highlightParam, 10);
    if (isNaN(id)) return;

    // Deferred so state updates don't run synchronously inside the effect
    // (avoids a double render on mount; see react-hooks/set-state-in-effect)
    setTimeout(() => {
      if (topicParam) {
        setActiveTopic(topicParam);
      } else {
        // Expand visible list so the target episode is rendered
        const idx = episodes.findIndex((ep) => ep.id === id);
        if (idx >= 0) setVisibleCount(idx + 1);
      }
    }, 0);

    // Wait for filter + Motion animations to settle (~0.76s max), then scroll precisely
    setTimeout(() => {
      setHighlightedId(id);
      const el = document.getElementById(`ep-${id}`);
      if (el) {
        // Use the sticky bar's stuck position (NAV height + bar height) so the
        // clearance is correct regardless of where the page is when this fires.
        const stickyBar = wrapperRef.current?.querySelector<HTMLElement>(".sticky");
        const NAV_H = window.innerWidth >= 768 ? 192 : 98;
        const stickyH = stickyBar ? stickyBar.offsetHeight : 0;
        const clearance = NAV_H + stickyH + 16;
        const top = el.getBoundingClientRect().top + window.scrollY - clearance;
        window.scrollTo({ top, behavior: "instant" });
      }
      setTimeout(() => setHighlightedId(null), 3200);
    }, 900);
  }, [episodes]);

  const isFilterActive = !!activeTopic;

  const { matchingEps, restEps } = useMemo(() => {
    if (!activeTopic) return { matchingEps: episodes, restEps: [] };
    return {
      matchingEps: episodes.filter((ep) => ep.topics.includes(activeTopic)),
      restEps: episodes.filter((ep) => !ep.topics.includes(activeTopic)),
    };
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
                className="px-3 py-1.5 rounded-full text-[13px] md:text-base font-medium border transition-all duration-200"
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
        <AnimatePresence mode="popLayout" initial={false}>
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
