import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import GuestsList from "@/components/GuestsList";
import EpisodesSection from "@/components/EpisodesSection";
import TeamSection from "@/components/TeamSection";
import Footer from "@/components/Footer";
import { episodes, allTopics } from "@/lib/data";

export default function Home() {
  const latestEpisode = episodes[0];
  const topicNames = allTopics.map((t) => t.name);

  return (
    <>
      <Nav />
      <main>
        <Hero episode={latestEpisode} />
        <EpisodesSection episodes={episodes} topics={topicNames} />
        <GuestsList episodes={episodes} />
        <TeamSection />
      </main>
      <Footer />
    </>
  );
}
