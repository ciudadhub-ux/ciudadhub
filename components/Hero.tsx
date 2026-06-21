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

function seedColor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0xfffff;
  return 20 + (h % 36); // warm hues 20-55°
}

export default function Hero({ episode }: HeroProps) {
  const hue = seedColor(episode.guestAvatarSeed);

  return (
    <section className="min-h-[100dvh] pt-36 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full py-20">
        <div className="grid lg:grid-cols-[1fr_400px] gap-16 xl:gap-24 items-center">
          <div>
            <p className="font-mono text-xs text-orange-500 tracking-[0.15em] uppercase mb-6">
              Último episodio
            </p>

            <h1 className="text-5xl md:text-6xl lg:text-[3.75rem] xl:text-7xl font-bold tracking-tight leading-[1.05] text-zinc-50 mb-6">
              {episode.title}
            </h1>

            {episode.description && (
              <p className="text-lg text-zinc-400 leading-relaxed max-w-[52ch] mb-8">
                {episode.description}
              </p>
            )}

            <div className="mb-10">
              <p className="text-base font-semibold text-zinc-50">
                {episode.guest}
              </p>
              <p className="text-sm text-zinc-500 mt-0.5 leading-relaxed">
                {formatRole(episode.guestRole)}
              </p>
              {episode.city && (
                <p className="flex items-center gap-1 text-sm text-zinc-600 mt-1.5">
                  <MapPin size={10} />
                  {episode.city}
                </p>
              )}
            </div>

            <div className="flex items-center flex-wrap gap-3">
              {episode.spotifyUrl && (
                <a
                  href={episode.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 border border-zinc-700 text-zinc-50 font-medium px-6 py-3.5 rounded-md hover:border-zinc-400 hover:bg-zinc-800 active:scale-[0.98] transition-all text-base"
                >
                  <SpotifyIcon className="w-5 h-5 text-green-400" />
                  Spotify
                </a>
              )}
              {episode.appleUrl && (
                <a
                  href={episode.appleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 border border-zinc-700 text-zinc-50 font-medium px-6 py-3.5 rounded-md hover:border-zinc-400 hover:bg-zinc-800 active:scale-[0.98] transition-all text-base"
                >
                  <AppleIcon className="w-5 h-5 text-purple-400" />
                  Apple Podcasts
                </a>
              )}
              <Link
                href="#episodios"
                className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors px-2"
              >
                Ver todos
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden relative">
              {episode.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={episode.imageUrl}
                  alt={episode.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(ellipse 80% 60% at 30% 40%, hsl(${hue} 70% 22%), transparent),
                                 radial-gradient(ellipse 60% 50% at 75% 70%, hsl(${hue + 15} 60% 16%), transparent),
                                 #09090b`,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
