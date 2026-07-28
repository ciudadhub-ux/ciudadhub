import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarBlank, Clock } from "@phosphor-icons/react/dist/ssr";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BlogCover from "@/components/blog/BlogCover";
import PullQuote from "@/components/blog/PullQuote";
import InfoStats from "@/components/blog/InfoStats";
import TagList from "@/components/blog/TagList";
import BlogCard from "@/components/blog/BlogCard";
import { posts, getPostBySlug, formatBlogDate } from "@/lib/blog-data";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — ciudadhub`,
    description: post.summary,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <Nav />
      <main className="pt-[98px] md:pt-48">
        <article className="max-w-3xl mx-auto px-6 pt-12 pb-8 md:pt-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-orange-400 transition-colors mb-8"
          >
            <ArrowLeft size={14} weight="bold" />
            Volver al blog
          </Link>

          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-orange-500/30 bg-orange-500/10 text-orange-400"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-50 tracking-tight leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-lg md:text-xl text-zinc-300 leading-relaxed mb-6">
            {post.summary}
          </p>

          <div className="flex items-center gap-4 text-sm text-zinc-500 pb-8 border-b border-zinc-800">
            <span className="text-zinc-300 font-medium">{post.author}</span>
            <span className="flex items-center gap-1.5">
              <CalendarBlank size={14} />
              {formatBlogDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {post.readTime}
            </span>
          </div>
        </article>

        <div className="max-w-4xl mx-auto px-6">
          <div className="aspect-[16/7] w-full overflow-hidden rounded-xl">
            <BlogCover hue={post.hue} title={post.title} className="w-full h-full" />
          </div>
        </div>

        <article className="max-w-3xl mx-auto px-6 py-10 md:py-14">
          {post.blocks.map((block, i) => {
            if (block.type === "paragraph") {
              return (
                <p key={i} className="text-zinc-300 text-base md:text-lg leading-relaxed mb-6">
                  {block.text}
                </p>
              );
            }
            if (block.type === "quote") {
              return <PullQuote key={i} text={block.text} />;
            }
            return <InfoStats key={i} title={block.title} items={block.items} />;
          })}

          <TagList tags={post.tags} />
        </article>

        {related.length > 0 && (
          <section className="max-w-4xl mx-auto px-6 pb-24">
            <p className="font-mono text-xs tracking-[0.25em] uppercase text-zinc-600 mb-5">
              Seguir leyendo
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
