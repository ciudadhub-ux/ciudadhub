import Link from "next/link";
import { CalendarBlank, Clock, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { topicStyle, topicIconColor, TOPIC_ICONS, DEFAULT_TOPIC_ICON } from "@/lib/topicColors";
import { formatBlogDate, type BlogPost } from "@/lib/blog-data";
import BlogCover from "./BlogCover";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
    >
      <div className="aspect-video w-full overflow-hidden">
        <BlogCover
          hue={post.hue}
          title={post.title}
          className="w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-3 text-xs text-zinc-500 mb-3">
          <span className="flex items-center gap-1.5">
            <CalendarBlank size={12} />
            {formatBlogDate(post.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} />
            {post.readTime}
          </span>
        </div>

        <h3 className="text-zinc-50 font-semibold text-lg leading-snug mb-2.5 group-hover:text-orange-500 transition-colors">
          {post.title}
        </h3>

        <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-3">
          {post.summary}
        </p>

        <div className="flex-1" />

        <div className="flex items-center justify-between gap-3 pt-3 border-t border-zinc-800">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 2).map((tag) => {
              const Icon = TOPIC_ICONS[tag]?.icon ?? DEFAULT_TOPIC_ICON;
              return (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border"
                  style={topicStyle(tag, false, false)}
                >
                  <Icon size={11} weight="bold" color={topicIconColor(tag, false)} />
                  {tag}
                </span>
              );
            })}
          </div>
          <ArrowRight
            size={16}
            weight="bold"
            className="shrink-0 text-zinc-600 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all"
          />
        </div>
      </div>
    </Link>
  );
}
