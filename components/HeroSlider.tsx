"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { Episode } from "@/lib/data";
import { SpotifyIcon as SpotifyIconBase, AppleIcon as AppleIconBase } from "./PodcastIcons";

function avatarUrl(seed: string) {
  return `https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(seed)}&backgroundColor=18181b`;
}

function SpotifyIcon() {
  return <SpotifyIconBase className="w-4 h-4" />;
}

function AppleIcon() {
  return <AppleIconBase className="w-4 h-4" />;
}

const INTERVAL = 5500;

export default function HeroSlider({
  episodes: items,
  latestId,
}: {
  episodes: Episode[];
  latestId: number;
}) {

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const go = useCallback((next: number, dir: number) => {
    setDirection(dir);
    setIndex(next);
  }, []);

  const prev = useCallback(() => go((index - 1 + items.length) % items.length, -1), [index, items.length, go]);
  const next = useCallback(() => go((index + 1) % items.length, 1), [index, items.length, go]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go((index + 1) % items.length, 1), INTERVAL);
    return () => clearInterval(t);
  }, [index, items.length, paused, go]);

  const ep = items[index];
  const guestPhoto = ep.guestImageUrl || avatarUrl(ep.guestAvatarSeed);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── DESKTOP (md+) ─────────────────────────────────────── */}
      <div className="hidden md:block pl-10 pr-3 max-w-5xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden" style={{ height: "30rem" }}>
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={ep.id}
              custom={direction}
              variants={{
                enter:  (d: number) => ({ opacity: 0, x: d * 40 }),
                center: { opacity: 1, x: 0 },
                exit:   (d: number) => ({ opacity: 0, x: d * -40 }),
              }}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {ep.imageUrl ? (
                <Image src={ep.imageUrl} alt={ep.title} fill className="object-cover" unoptimized priority />
              ) : (
                <div className="absolute inset-0 bg-zinc-900" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/65 to-zinc-950/15" />

              {/* EP badge */}
              <div className="absolute top-5 left-16 font-mono text-[10px] tracking-[0.18em] uppercase px-2.5 py-1 rounded-md bg-zinc-950/70 text-orange-400 backdrop-blur-sm border border-orange-500/20 z-20">
                {ep.id === latestId ? "Último episodio" : `EP ${String(ep.id).padStart(2, "0")}`}
              </div>

              {/* Guest photo + name */}
              <div className="absolute top-5 right-16 flex flex-col items-center gap-2 z-20">
                <div className="relative flex-none rounded-lg overflow-hidden" style={{ width: 106, height: 106 }}>
                  <Image src={guestPhoto} alt={ep.guest} fill className="object-cover object-top" unoptimized />
                </div>
                <p className="text-zinc-200 text-sm font-medium text-center leading-snug max-w-[130px]"
                  style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
                  {ep.guest}
                </p>
              </div>

              {/* Title, quote, links */}
              <div className="absolute inset-x-0 bottom-0 pl-16 pr-28 pb-7 z-20">
                <h2 className="text-white font-bold leading-snug mb-3"
                  style={{ fontSize: "clamp(1.325rem, 2.1vw, 1.725rem)", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
                  {ep.title}
                </h2>
                {ep.quote && (
                  <p className="text-zinc-300 text-sm leading-relaxed mb-4 italic"
                    style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
                    “{ep.quote}”
                  </p>
                )}
                <div className="flex items-center gap-3">
                  {ep.spotifyUrl && (
                    <a href={ep.spotifyUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-zinc-200 hover:text-green-400 transition-colors px-4 py-2 rounded-lg bg-zinc-950/70 hover:bg-zinc-800 backdrop-blur-sm border border-zinc-700/50">
                      <SpotifyIcon /> Spotify
                    </a>
                  )}
                  {ep.appleUrl && (
                    <a href={ep.appleUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-zinc-200 hover:text-purple-400 transition-colors px-4 py-2 rounded-lg bg-zinc-950/70 hover:bg-zinc-800 backdrop-blur-sm border border-zinc-700/50">
                      <AppleIcon /> Apple
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

        <div className="flex items-center justify-center gap-3 mt-4">
          <button onClick={prev} aria-label="Anterior"
            className="p-1 text-zinc-500 hover:text-zinc-200 transition-colors">
            <CaretLeft size={16} weight="bold" />
          </button>
          {items.map((_, i) => (
            <button key={i} onClick={() => go(i, i > index ? 1 : -1)} aria-label={`Episodio ${i + 1}`}>
              <div className={["rounded-full transition-all duration-300",
                i === index ? "w-6 h-2 bg-orange-500" : "w-2 h-2 bg-zinc-700 hover:bg-zinc-500"].join(" ")} />
            </button>
          ))}
          <button onClick={next} aria-label="Siguiente"
            className="p-1 text-zinc-500 hover:text-zinc-200 transition-colors">
            <CaretRight size={16} weight="bold" />
          </button>
        </div>
      </div>

    </div>
  );
}
