import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import EpisodesSection from "@/components/EpisodesSection";
import TeamSection from "@/components/TeamSection";
import Footer from "@/components/Footer";
import { episodes, allTopics } from "@/lib/data";

export default function Home() {
  const topicNames = allTopics.map((t) => t.name);

  return (
    <>
      <Nav />
      <main>
        <Hero episodes={episodes} />
        <EpisodesSection episodes={episodes} topics={topicNames} />
        <TeamSection />
      </main>
      <Footer />
    </>
  );
}
