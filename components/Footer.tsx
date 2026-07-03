import Image from "next/image";
import { SpotifyLogo, XLogo, InstagramLogo, FacebookLogo, Envelope } from "@phosphor-icons/react/dist/ssr";
import { AppleIcon } from "./PodcastIcons";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-[1fr_auto_auto] gap-8 md:gap-12 items-start mb-12">
          <div className="col-span-2 md:col-span-1 max-w-xs">
            <div className="mb-5">
              <Image
                src="/logo.webp"
                alt="Ciudad Hub Podcast"
                width={69}
                height={80}
                className="h-20 w-auto"
              />
            </div>
            <p className="text-zinc-600 text-sm">Desde 2016</p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs text-zinc-700 uppercase tracking-wider mb-2">
              Escuchar en
            </p>
            <a
              href="https://open.spotify.com/show/3C1ry4r1XvOr1YSsWGvtMT"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-zinc-400 hover:text-zinc-50 transition-colors text-sm"
            >
              <SpotifyLogo size={16} weight="fill" className="text-green-400" />
              Spotify
            </a>
            <a
              href="https://podcasts.apple.com/us/podcast/ciudadhubs-tracks/id1093603743"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-zinc-400 hover:text-zinc-50 transition-colors text-sm"
            >
              <AppleIcon className="w-4 h-4 text-purple-400" />
              Apple Podcasts
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs text-zinc-700 uppercase tracking-wider mb-2">
              Seguir
            </p>
            <a
              href="https://www.instagram.com/ciudadhub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-zinc-400 hover:text-zinc-50 transition-colors text-sm"
            >
              <InstagramLogo size={16} weight="fill" />
              Instagram
            </a>
            <a
              href="https://www.twitter.com/ciudadhub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-zinc-400 hover:text-zinc-50 transition-colors text-sm"
            >
              <XLogo size={16} weight="fill" />
              X (Twitter)
            </a>
            <a
              href="https://www.facebook.com/ciudadhub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-zinc-400 hover:text-zinc-50 transition-colors text-sm"
            >
              <FacebookLogo size={16} weight="fill" />
              Facebook
            </a>
            <a
              href="mailto:contacto@ciudadhub.info"
              className="flex items-center gap-2.5 text-zinc-400 hover:text-zinc-50 transition-colors text-sm"
            >
              <Envelope size={16} weight="fill" />
              Contacto
            </a>
          </div>
        </div>

        <div className="border-t border-zinc-800/60 pt-8">
          <p className="text-zinc-700 text-sm">
            © {new Date().getFullYear()} ciudadhub. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
