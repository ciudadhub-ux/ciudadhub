"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { Episode } from "@/lib/data";

function avatarUrl(seed: string) {
  return `https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(seed)}&backgroundColor=18181b`;
}

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

const INTERVAL = 5500;

export default function HeroSlider({ episodes }: { episodes: Episode[] }) {
  const featured = episodes.filter((ep) => ep.featured).sort((a, b) => b.id - a.id);
  const items = (featured.length > 0 ? featured : [...episodes].sort((a, b) => b.id - a.id)).slice(0, 10);

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
          <AnimatePresence mode="wait" custom={direction}>
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
                EP {String(ep.id).padStart(2, "0")}
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
                    "{ep.quote}"
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

          <button onClick={prev} aria-label="Anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-white/90 transition-colors z-30">
            <CaretLeft size={20} weight="bold" />
          </button>
          <button onClick={next} aria-label="Siguiente"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-white/90 transition-colors z-30">
            <CaretRight size={20} weight="bold" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-4">
          {items.map((_, i) => (
            <button key={i} onClick={() => go(i, i > index ? 1 : -1)} aria-label={`Episodio ${i + 1}`}>
              <div className={["rounded-full transition-all duration-300",
                i === index ? "w-5 h-1.5 bg-orange-500" : "w-1.5 h-1.5 bg-zinc-700 hover:bg-zinc-500"].join(" ")} />
            </button>
          ))}
        </div>
      </div>

      {/* ── MOBILE (< md) ─────────────────────────────────────── */}
      <div className="md:hidden px-4">
        <div className="relative rounded-xl overflow-hidden" style={{ height: "16rem" }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={ep.id}
              custom={direction}
              variants={{
                enter:  (d: number) => ({ opacity: 0, x: d * 30 }),
                center: { opacity: 1, x: 0 },
                exit:   (d: number) => ({ opacity: 0, x: d * -30 }),
              }}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {ep.imageUrl ? (
                <Image src={ep.imageUrl} alt={ep.title} fill className="object-cover" unoptimized priority />
              ) : (
                <div className="absolute inset-0 bg-zinc-900" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/20" />

              {/* EP badge */}
              <div className="absolute top-4 left-4 font-mono text-[9px] tracking-[0.15em] uppercase px-2 py-1 rounded-md bg-zinc-950/70 text-orange-400 backdrop-blur-sm border border-orange-500/20 z-20">
                EP {String(ep.id).padStart(2, "0")}
              </div>

              {/* Guest photo + name — top right */}
              <div className="absolute top-4 right-4 flex flex-col items-center gap-1.5 z-20">
                <div className="relative flex-none rounded-lg overflow-hidden" style={{ width: 72, height: 72 }}>
                  <Image src={guestPhoto} alt={ep.guest} fill className="object-cover object-top" unoptimized />
                </div>
                <p className="text-zinc-200 text-[11px] font-medium text-center leading-tight max-w-[80px]"
                  style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
                  {ep.guest}
                </p>
              </div>

              {/* Title + links — no quote on mobile */}
              <div className="absolute inset-x-0 bottom-0 px-5 pb-5 z-20">
                <h2 className="text-white font-bold leading-snug mb-4 pr-20"
                  style={{ fontSize: "1.1rem", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
                  {ep.title}
                </h2>
                <div className="flex items-center gap-2">
                  {ep.spotifyUrl && (
                    <a href={ep.spotifyUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-zinc-200 active:text-green-400 px-4 py-2.5 rounded-lg bg-zinc-950/80 border border-zinc-700/50 flex-1 justify-center">
                      <SpotifyIcon /> Spotify
                    </a>
                  )}
                  {ep.appleUrl && (
                    <a href={ep.appleUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-zinc-200 active:text-purple-400 px-4 py-2.5 rounded-lg bg-zinc-950/80 border border-zinc-700/50 flex-1 justify-center">
                      <AppleIcon /> Apple
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button onClick={prev} aria-label="Anterior"
            className="absolute left-1 top-1/2 -translate-y-1/2 p-2 text-white/40 active:text-white/90 transition-colors z-30">
            <CaretLeft size={18} weight="bold" />
          </button>
          <button onClick={next} aria-label="Siguiente"
            className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-white/40 active:text-white/90 transition-colors z-30">
            <CaretRight size={18} weight="bold" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-3">
          {items.map((_, i) => (
            <button key={i} onClick={() => go(i, i > index ? 1 : -1)} aria-label={`Episodio ${i + 1}`}>
              <div className={["rounded-full transition-all duration-300",
                i === index ? "w-4 h-1.5 bg-orange-500" : "w-1.5 h-1.5 bg-zinc-700"].join(" ")} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
