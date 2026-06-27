import Nav from "@/components/Nav";
import InvitadosClient, { type GuestData, type EpisodeLink } from "@/components/InvitadosClient";
import { episodes } from "@/lib/data";

export default function InvitadosPage() {
  const seen = new Map<string, GuestData>();
  const guestEpisodes = new Map<string, EpisodeLink[]>();
  const cityGuestNames = new Map<string, Set<string>>();
  const countryByCity = new Map<string, string>();

  for (const ep of episodes) {
    const name = ep.guest.trim();
    if (!name || name.toLowerCase() === "ciudadhub") continue;

    const topics: string[] = ep.topics ?? [];
    const epLink: EpisodeLink = {
      id: ep.id,
      title: ep.title,
      spotifyUrl: ep.spotifyUrl,
      appleUrl: ep.appleUrl,
      href: `/?highlight=${ep.id}${topics[0] ? `&topic=${encodeURIComponent(topics[0])}` : ""}#ep-${ep.id}`,
    };

    if (!seen.has(name)) {
      seen.set(name, {
        name,
        guestRole: ep.guestRole,
        episodeId: ep.id,
        city: ep.city,
        country: ep.country,
        topics,
        photoSrc: ep.guestImageUrl || null,
        href: epLink.href,
        spotifyUrl: ep.spotifyUrl,
        appleUrl: ep.appleUrl,
        episodes: [],
      });
      guestEpisodes.set(name, []);
    }
    guestEpisodes.get(name)!.push(epLink);

    // Collect ALL cities across all episodes for the map
    if (ep.city) {
      if (!cityGuestNames.has(ep.city)) cityGuestNames.set(ep.city, new Set());
      cityGuestNames.get(ep.city)!.add(name);
      if (!countryByCity.has(ep.city)) countryByCity.set(ep.city, ep.country);
    }
  }

  // Attach episodes array to each guest
  for (const [name, eps] of guestEpisodes) {
    seen.get(name)!.episodes = eps;
  }

  const guests = [...seen.values()].sort((a, b) => a.name.localeCompare(b.name, "es"));
  const allTopics = [...new Set(guests.flatMap((g) => g.topics))].sort((a, b) => a.localeCompare(b, "es"));
  const cityGuestNamesRecord: Record<string, string[]> = {};
  for (const [city, names] of cityGuestNames) {
    cityGuestNamesRecord[city] = [...names];
  }
  const countryByCityRecord: Record<string, string> = Object.fromEntries(countryByCity);

  return (
    <>
      <Nav />
      <main className="pt-[98px] md:pt-48">
        <InvitadosClient guests={guests} allTopics={allTopics} cityGuestNames={cityGuestNamesRecord} countryByCity={countryByCityRecord} />
      </main>
    </>
  );
}
