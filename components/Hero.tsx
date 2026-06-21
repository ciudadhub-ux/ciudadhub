import Link from "next/link";
import { MapPin } from "@phosphor-icons/react/dist/ssr";
import { Episode } from "@/lib/data";

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

interface HeroProps {
  episode: Episode;
}

function formatRole(role: string) {
  const parts = role.replace(/, /g, ",\n").replace(/ \(/g, "\n(").split("\n");
  return parts.map((part, i) => (
    <span key={i}>
      {i > 0 && <br />}
      {part}
    </span>
  ));
}

export default function Hero({ episode }: HeroProps) {
  return (
    <section className="relative min-h-[100dvh] pt-36 flex flex-col overflow-hidden">
      {/* Glow de fondo */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-0 left-1/3 w-[700px] h-[500px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-[0.055] blur-[140px] bg-orange-500" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col justify-between py-12 lg:py-16">

        {/* Franja superior */}
        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-5">
          <span className="font-mono text-[11px] text-orange-500 tracking-[0.2em] uppercase">
            Último episodio
          </span>
          {episode.topics.length > 0 && (
            <div className="hidden sm:flex items-center gap-5">
              {episode.topics.slice(0, 3).map((t) => (
                <span key={t} className="font-mono text-[10px] text-zinc-600 tracking-widest uppercase">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Título central */}
        <div className="flex-1 flex items-center py-10 lg:py-0">
          <h1
            className="font-bold tracking-tight leading-[0.96] text-zinc-50 max-w-[18ch]"
            style={{ fontSize: "clamp(3rem, 5.8vw, 5.75rem)" }}
          >
            {episode.title}
          </h1>
        </div>

        {/* Franja inferior */}
        <div className="border-t border-zinc-800/60 pt-7">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-7">

            {/* Invitado */}
            <div>
              <p className="text-base font-semibold text-zinc-100 leading-snug">
                {episode.guest}
              </p>
              <p className="text-sm text-zinc-500 mt-1 leading-relaxed">
                {formatRole(episode.guestRole)}
              </p>
              {episode.city && (
                <p className="flex items-center gap-1.5 text-[11px] text-zinc-600 mt-2.5 font-mono tracking-widest uppercase">
                  <MapPin size={9} weight="bold" />
                  {episode.city}
                </p>
              )}
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2.5 flex-shrink-0 flex-wrap">
              {episode.spotifyUrl && (
                <a
                  href={episode.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-zinc-700 text-zinc-100 font-medium px-4 py-2.5 rounded-md hover:border-zinc-500 hover:bg-zinc-800/60 active:scale-[0.98] transition-all text-sm"
                >
                  <SpotifyIcon className="w-3.5 h-3.5 text-green-400" />
                  Spotify
                </a>
              )}
              {episode.appleUrl && (
                <a
                  href={episode.appleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-zinc-700 text-zinc-100 font-medium px-4 py-2.5 rounded-md hover:border-zinc-500 hover:bg-zinc-800/60 active:scale-[0.98] transition-all text-sm"
                >
                  <AppleIcon className="w-3.5 h-3.5 text-purple-400" />
                  Apple Podcasts
                </a>
              )}
              <Link
                href="#episodios"
                className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors px-2 font-mono tracking-widest uppercase"
              >
                Ver todos →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
