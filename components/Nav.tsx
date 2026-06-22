import Image from "next/image";
import { XLogo, InstagramLogo, FacebookLogo } from "@phosphor-icons/react/dist/ssr";

const NAV_LINKS = [
  { href: "/#podcasts",           label: "Podcasts"  },
  { href: "/invitados",          label: "Invitados" },
  { href: "/invitados#ciudades", label: "Ciudades"  },
  { href: "/#equipo",            label: "Equipo"    },
];

const SOCIAL = [
  { href: "https://www.twitter.com/ciudadhub",   Icon: XLogo,         label: "Twitter"   },
  { href: "https://www.instagram.com/ciudadhub", Icon: InstagramLogo, label: "Instagram" },
  { href: "https://www.facebook.com/ciudadhub",  Icon: FacebookLogo,  label: "Facebook"  },
];

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-md shadow-[0_1px_0_rgba(63,63,70,0.3),0_6px_24px_-4px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto pl-8 pr-6 h-48 flex items-stretch">

        {/* Logo — sin líneas separadoras, alineado con contenido */}
        <a href="/" className="flex items-center pr-8 shrink-0">
          <Image
            src="/logo.png"
            alt="Ciudad Hub Podcast"
            width={138}
            height={155}
            className="h-[155px] w-auto"
            priority
          />
        </a>

        {/* Centro: tagline + menú centrados juntos */}
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <p
            className="italic font-light text-zinc-300 tracking-wide text-center"
            style={{ fontSize: "clamp(1.1rem, 2vw, 1.6rem)" }}
          >
            El Podcast de las Ciudades
          </p>

          <div className="hidden md:flex items-center">
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

        {/* Redes sociales — horizontal, sin líneas */}
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

      </div>
    </nav>
  );
}
