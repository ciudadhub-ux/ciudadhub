import { Episode } from "@/lib/data";
import HeroSlider from "./HeroSlider";

const MAX_SLIDES = 10;

export default function Hero({ episodes }: { episodes: Episode[] }) {
  // La selección se hace acá, en el servidor: al componente de cliente solo
  // le llegan los episodios que realmente se muestran. Así los datos de los
  // demás (quotes incluidas) no viajan en el payload de la página.
  const featured = episodes.filter((ep) => ep.featured).sort((a, b) => b.id - a.id);
  const fallback = [...episodes].sort((a, b) => b.id - a.id);
  const items = (featured.length > 0 ? featured : fallback).slice(0, MAX_SLIDES);
  // El badge "Último episodio" se calcula sobre TODOS los episodios, no solo
  // los del slider, así que el id se pasa aparte.
  const latestId = episodes.length > 0 ? Math.max(...episodes.map((e) => e.id)) : -1;

  return (
    <section className="relative hidden md:block md:pt-56 md:pb-8 overflow-hidden">
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-[0.05] blur-[120px] bg-orange-500" />
      </div>

      <div className="relative w-full">
        <HeroSlider episodes={items} latestId={latestId} />
      </div>
    </section>
  );
}
