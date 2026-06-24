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
  return (
    <section id="episodios" className="pt-2 pb-24 scroll-mt-[200px]">
      <div className="max-w-7xl mx-auto px-6">
        <EpisodesGrid episodes={episodes} topics={topics} />
      </div>
    </section>
  );
}
