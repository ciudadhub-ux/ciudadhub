import { TopicStat } from "@/lib/data";

interface TopicsSectionProps {
  topics: TopicStat[];
}

export default function TopicsSection({ topics }: TopicsSectionProps) {
  const maxCount = Math.max(...topics.map((t) => t.count));

  return (
    <section id="temas" className="py-24 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[280px_1fr] gap-16 items-start">
          <div>
            <h2 className="text-4xl font-bold text-zinc-50 mb-3">Temas</h2>
            <p className="text-zinc-500 leading-relaxed text-base">
              Desde movilidad hasta cultura, exploramos las dimensiones que
              definen la ciudad contemporánea.
            </p>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-3">
            {topics.map((topic) => {
              const scale = 1.1 + (topic.count / maxCount) * 1.6;
              return (
                <a
                  key={topic.name}
                  href="#episodios"
                  className="text-zinc-500 hover:text-orange-500 transition-colors font-bold tracking-tight leading-none"
                  style={{ fontSize: `${scale}rem` }}
                >
                  {topic.name}
                  <sup className="font-mono text-[0.55em] text-zinc-700 ml-1 not-italic font-normal">
                    {topic.count}
                  </sup>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
