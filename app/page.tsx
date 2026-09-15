import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import EpisodesSection from "@/components/EpisodesSection";
import TeamSection from "@/components/TeamSection";
import Footer from "@/components/Footer";
import PodcastJsonLd from "@/components/PodcastJsonLd";
import { episodes, allTopics } from "@/lib/data";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export default function Home() {
  const topicNames = allTopics.map((t) => t.name);

  // Los 10 episodios más nuevos, para los datos estructurados de la serie.
  const latest = [...episodes]
    .sort((a, b) => b.id - a.id)
    .slice(0, 10)
    .map((ep) => ({
      title: ep.title,
      guest: ep.guest,
      url: ep.appleUrl || ep.spotifyUrl,
    }))
    .filter((ep) => ep.url);

  return (
    <>
      <PodcastJsonLd latest={latest} />
      <Nav />
      <main>
        {/* Título principal de la página. Va oculto: el encabezado visible del
            sitio es el logo, pero Google y los lectores de pantalla necesitan
            un h1 que declare de qué trata la página. */}
        <h1 className="sr-only">
          {SITE_NAME} — {SITE_TAGLINE}
        </h1>
        <Hero episodes={episodes} />
        <EpisodesSection episodes={episodes} topics={topicNames} />
        <TeamSection />
      </main>
      <Footer />
    </>
  );
}
