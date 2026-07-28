import { Hash } from "@phosphor-icons/react/dist/ssr";
import { topicStyle, topicIconColor, TOPIC_ICONS, DEFAULT_TOPIC_ICON } from "@/lib/topicColors";

export default function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="mt-12 pt-8 border-t border-zinc-800">
      <p className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.18em] uppercase text-zinc-600 mb-3">
        <Hash size={12} weight="bold" />
        Temas
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const Icon = TOPIC_ICONS[tag]?.icon ?? DEFAULT_TOPIC_ICON;
          return (
            <span
              key={tag}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border"
              style={topicStyle(tag, false, false)}
            >
              <Icon size={13} weight="bold" color={topicIconColor(tag, false)} />
              {tag}
            </span>
          );
        })}
      </div>
    </div>
  );
}
