"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

interface Guest {
  name: string;
  role: string;
  city: string;
  topics: string[];
  episodeId: number;
  episodeTitle: string;
  appleUrl: string;
  spotifyUrl: string;
  guestAvatarSeed: string;
}

interface GuestsSectionProps {
  guests: Guest[];
  topics: string[];
}

const INITIAL_VISIBLE = 25;

export default function GuestsSection({ guests }: GuestsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const reduce = useReducedMotion();

  const visible = showAll ? guests : guests.slice(0, INITIAL_VISIBLE);
  const hasMore = !showAll && guests.length > INITIAL_VISIBLE;

  return (
    <section id="invitados" className="py-24 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-zinc-50 mb-3">Invitados</h2>
          <p className="text-zinc-500 max-w-md text-base">
            {guests.length} urbanistas, investigadores, gestores y activistas
            que han sido parte de ciudadhub.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <AnimatePresence mode="popLayout">
            {visible.map((guest, i) => (
              <motion.div
                key={`${guest.name}-${guest.episodeId}`}
                layout
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{
                  duration: 0.3,
                  delay: reduce ? 0 : Math.min(i, 12) * 0.03,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-all"
              >
                <p className="text-zinc-50 font-semibold text-sm leading-snug mb-1">
                  {guest.name}
                </p>
                <p className="text-zinc-500 text-xs leading-snug line-clamp-2 mb-1">
                  {guest.role}
                </p>
                {guest.city && (
                  <p className="text-zinc-400 text-xs mb-3">{guest.city}</p>
                )}
                <div className="pt-2 border-t border-zinc-800">
                  <p className="font-mono text-xs text-orange-500/70 mb-1">
                    EP {String(guest.episodeId).padStart(2, "0")}
                  </p>
                  <div className="flex gap-3">
                    {guest.spotifyUrl && (
                      <a
                        href={guest.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-zinc-500 hover:text-green-400 transition-colors"
                      >
                        Spotify
                      </a>
                    )}
                    {guest.appleUrl && (
                      <a
                        href={guest.appleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-zinc-500 hover:text-purple-400 transition-colors"
                      >
                        Apple
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {hasMore && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="px-6 py-3 border border-zinc-700 text-zinc-300 rounded-md text-sm font-medium hover:border-zinc-500 hover:text-zinc-50 active:scale-[0.98] transition-all"
            >
              Ver más invitados ({guests.length - INITIAL_VISIBLE} más)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
