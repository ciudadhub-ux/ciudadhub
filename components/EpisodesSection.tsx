import { Episode } from "@/lib/data";
import EpisodesGrid from "./EpisodesGrid";

interface EpisodesSectionProps {
  episodes: Episode[];
  topics: string[];
}

export default function EpisodesSection({
  episodes,
  topics,
}: EpisodesSectionProps) {
  // La grilla no muestra quotes: se quitan antes de pasarlas al componente de
  // cliente para que no viajen en el payload de la página.
  const stripped: Omit<Episode, "quote">[] = episodes.map((ep) => {
    const rest = { ...ep } as Partial<Episode>;
    delete rest.quote;
    return rest as Omit<Episode, "quote">;
  });

  const years = episodes.map((ep) => ep.date.slice(0, 4)).filter(Boolean).sort();
  const firstYear = years[0] ?? "";

  return (
    <section id="episodios" className="pt-28 md:pt-2 pb-24 scroll-mt-[98px] md:scroll-mt-48">
      <div className="max-w-7xl mx-auto px-6">
        <p className="font-mono text-xs tracking-[0.18em] uppercase text-zinc-500 mb-4">
          {episodes.length} episodios{firstYear ? ` · desde ${firstYear}` : ""}
        </p>
        <EpisodesGrid episodes={stripped} topics={topics} />
      </div>
    </section>
  );
}
