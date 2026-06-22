import Image from "next/image";

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/70 bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-40 flex items-center justify-between">
        <a href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Ciudad Hub Podcast"
            width={120}
            height={135}
            className="h-[135px] w-auto"
            priority
          />
        </a>

        <div className="hidden md:flex items-center">
          {[
            { href: "/#episodios",         label: "Episodios" },
            { href: "/invitados",          label: "Invitados" },
            { href: "/invitados#ciudades", label: "Ciudades"  },
            { href: "/#equipo",            label: "Equipo"    },
          ].map(({ href, label }, i) => (
            <div key={label} className="flex items-center">
              {i > 0 && <span className="w-px h-4 bg-orange-500/60 mx-1" />}
              <a
                href={href}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-orange-400 transition-colors"
              >
                {label}
              </a>
            </div>
          ))}
        </div>

      </div>
    </nav>
  );
}
