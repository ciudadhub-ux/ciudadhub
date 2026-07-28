import { ChartBar } from "@phosphor-icons/react/dist/ssr";
import type { BlogStat } from "@/lib/blog-data";

export default function InfoStats({ title, items }: { title: string; items: BlogStat[] }) {
  return (
    <div className="my-10 rounded-xl border border-zinc-800 bg-zinc-900 p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <ChartBar size={16} weight="bold" className="text-orange-500" />
        <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-zinc-500">
          {title}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4">
        {items.map((item, i) => (
          <div key={i} className={i > 0 ? "sm:border-l sm:border-zinc-800 sm:pl-4" : ""}>
            <p className="font-mono text-3xl md:text-4xl font-semibold text-orange-500 mb-1.5">
              {item.value}
            </p>
            <p className="text-sm text-zinc-400 leading-snug">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
