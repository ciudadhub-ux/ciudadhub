import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BlogCard from "@/components/blog/BlogCard";
import { posts } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog — ciudadhub",
  description:
    "Artículos sobre movilidad, datos urbanos, salud pública y espacio público: análisis del equipo de ciudadhub sobre el futuro de nuestras ciudades.",
};

export default function BlogIndexPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <Nav />
      <main className="pt-[98px] md:pt-48">
        <section className="max-w-7xl mx-auto px-6 pt-14 pb-10 md:pt-20 md:pb-14">
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-orange-500 mb-4">
            ciudadhub / blog
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold text-zinc-50 tracking-tight mb-5 max-w-3xl">
            Ideas sobre el futuro de nuestras ciudades
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
            Análisis y reflexiones sobre movilidad, datos urbanos, salud pública
            y espacio público — a partir de las conversaciones del podcast.
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sorted.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
