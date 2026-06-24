"use client";

import { useState } from "react";
import Image from "next/image";
import { XLogo, InstagramLogo, FacebookLogo, List, X } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";

const NAV_LINKS = [
  { href: "/#episodios",          label: "Episodios",  desktopOnly: false },
  { href: "/invitados",           label: "Invitados",  desktopOnly: false },
  { href: "/invitados#ciudades",  label: "Ciudades",   desktopOnly: true  },
  { href: "/#equipo",             label: "Equipo",     desktopOnly: false },
];

const SOCIAL = [
  { href: "https://www.twitter.com/ciudadhub",   Icon: XLogo,         label: "Twitter"   },
  { href: "https://www.instagram.com/ciudadhub", Icon: InstagramLogo, label: "Instagram" },
  { href: "https://www.facebook.com/ciudadhub",  Icon: FacebookLogo,  label: "Facebook"  },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-md shadow-[0_1px_0_rgba(63,63,70,0.3),0_6px_24px_-4px_rgba(0,0,0,0.6)]">

      {/* Main bar */}
      <div className="relative max-w-7xl mx-auto pl-4 md:pl-8 pr-4 md:pr-6 h-[88px] md:h-48 flex items-stretch">

        {/* Logo */}
        <a href="/" className="flex items-center pr-4 md:pr-8 shrink-0">
          <Image
            src="/logo.png"
            alt="Ciudad Hub Podcast"
            width={138}
            height={155}
            className="h-[60px] md:h-[155px] w-auto"
            priority
          />
        </a>

        {/* Tagline centered — mobile only */}
        <p className="md:hidden absolute inset-x-0 top-1/2 -translate-y-1/2 text-center italic font-light text-zinc-400 text-[13px] tracking-wide pointer-events-none">
          El Podcast de las Ciudades
        </p>

        {/* Center: tagline + links — desktop only */}
        <div className="flex-1 hidden md:flex flex-col items-center justify-center gap-3">
          <p
            className="italic font-light text-zinc-300 tracking-wide text-center"
            style={{ fontSize: "clamp(1.1rem, 2vw, 1.6rem)" }}
          >
            El Podcast de las Ciudades
          </p>
          <div className="flex items-center">
            {NAV_LINKS.map(({ href, label }, i) => (
              <div key={label} className="flex items-center">
                {i > 0 && <span className="w-px h-3.5 bg-orange-500/60 mx-1" />}
                <a
                  href={href}
                  className="px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-400 hover:text-orange-400 transition-colors"
                >
                  {label}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Social — desktop only */}
        <div className="hidden md:flex items-center gap-4 pl-6 shrink-0">
          {SOCIAL.map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-zinc-500 hover:text-orange-400 transition-colors"
            >
              <Icon size={26} weight="fill" />
            </a>
          ))}
        </div>

        {/* Hamburger — mobile only */}
        <div className="flex md:hidden flex-1 items-center justify-end">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="p-2 text-zinc-400 hover:text-orange-400 transition-colors"
          >
            {open ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-zinc-800 bg-zinc-950/98 backdrop-blur-md"
          >
            <div className="px-6 py-2 flex flex-col">
              {NAV_LINKS.filter((l) => !l.desktopOnly).map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="py-3.5 text-sm font-semibold uppercase tracking-widest text-zinc-400 hover:text-orange-400 transition-colors border-b border-zinc-800/60 last:border-0"
                >
                  {label}
                </a>
              ))}
              <div className="flex items-center gap-5 py-4">
                {SOCIAL.map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-zinc-500 hover:text-orange-400 transition-colors"
                  >
                    <Icon size={22} weight="fill" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
