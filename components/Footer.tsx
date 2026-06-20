import Image from "next/image";
import { SpotifyLogo, YoutubeLogo } from "@phosphor-icons/react/dist/ssr";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-[1fr_auto_auto] gap-12 items-start mb-12">
          <div className="max-w-xs">
            <div className="mb-5">
              <Image
                src="/logo.png"
                alt="Ciudad Hub Podcast"
                width={69}
                height={80}
                className="h-20 w-auto"
              />
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Conversaciones sobre urbanismo, movilidad, cultura y el futuro de
              nuestras ciudades en Latinoamérica.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs text-zinc-700 uppercase tracking-wider mb-2">
              Escuchar en
            </p>
            <a
              href="#"
              className="flex items-center gap-2.5 text-zinc-400 hover:text-zinc-50 transition-colors text-sm"
            >
              <SpotifyLogo size={16} weight="fill" className="text-green-400" />
              Spotify
            </a>
            <a
              href="#"
              className="flex items-center gap-2.5 text-zinc-400 hover:text-zinc-50 transition-colors text-sm"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-purple-400"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 4.5c2.071 0 3.938.84 5.3 2.2L15.75 10.25A5.478 5.478 0 0012 8.5c-3.038 0-5.5 2.462-5.5 5.5s2.462 5.5 5.5 5.5c2.627 0 4.836-1.845 5.369-4.314H12V13h5.98c.013.164.02.329.02.5 0 3.314-2.686 6-6 6s-6-2.686-6-6 2.686-6 6-6z" />
              </svg>
              Apple Podcasts
            </a>
            <a
              href="#"
              className="flex items-center gap-2.5 text-zinc-400 hover:text-zinc-50 transition-colors text-sm"
            >
              <YoutubeLogo size={16} weight="fill" className="text-red-400" />
              YouTube
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs text-zinc-700 uppercase tracking-wider mb-2">
              Seguir
            </p>
            <a
              href="#"
              className="text-zinc-400 hover:text-zinc-50 transition-colors text-sm"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-zinc-400 hover:text-zinc-50 transition-colors text-sm"
            >
              X (Twitter)
            </a>
            <a
              href="#"
              className="text-zinc-400 hover:text-zinc-50 transition-colors text-sm"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div className="border-t border-zinc-800/60 pt-8">
          <p className="text-zinc-700 text-sm">
            2025 ciudadhub. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
