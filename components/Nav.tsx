import Link from "next/link";
import Image from "next/image";

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/70 bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-36 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Ciudad Hub Podcast"
            width={96}
            height={108}
            className="h-[108px] w-auto"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#episodios"
            className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
          >
            Episodios
          </Link>
          <Link
            href="/invitados"
            className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
          >
            Invitados
          </Link>
          <Link
            href="#equipo"
            className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
          >
            Equipo
          </Link>
        </div>

        <a
          href="#"
          className="text-sm font-semibold bg-orange-500 text-zinc-950 px-4 py-2 rounded-md hover:bg-orange-400 active:scale-[0.98] transition-all"
        >
          Suscribirse
        </a>
      </div>
    </nav>
  );
}
