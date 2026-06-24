import { Episode } from "@/lib/data";
import HeroSlider from "./HeroSlider";

export default function Hero({ episodes }: { episodes: Episode[] }) {
  return (
    <section className="relative pt-56 pb-16 overflow-hidden">
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-[0.05] blur-[120px] bg-orange-500" />
      </div>

      <div className="relative w-full">
        <HeroSlider episodes={episodes} />
      </div>
    </section>
  );
}
