import Nav from "@/components/Nav";
import InvitadosClient, { type GuestData } from "@/components/InvitadosClient";
import { episodes } from "@/lib/data";

export default function InvitadosPage() {
  const seen = new Map<string, GuestData>();
  const cityGuestNames = new Map<string, Set<string>>();
  const countryByCity = new Map<string, string>();

  for (const ep of episodes) {
    const name = ep.guest.trim();
    if (!name || name.toLowerCase() === "ciudadhub") continue;

    if (!seen.has(name)) {
      const topics: string[] = ep.topics ?? [];
      seen.set(name, {
        name,
        guestRole: ep.guestRole,
        episodeId: ep.id,
        city: ep.city,
        country: ep.country,
        topics,
        photoSrc: ep.guestImageUrl || null,
        href: `/?highlight=${ep.id}${topics[0] ? `&topic=${encodeURIComponent(topics[0])}` : ""}#ep-${ep.id}`,
        spotifyUrl: ep.spotifyUrl,
        appleUrl: ep.appleUrl,
      });
    }

    // Collect ALL cities across all episodes for the map
    if (ep.city) {
      if (!cityGuestNames.has(ep.city)) cityGuestNames.set(ep.city, new Set());
      cityGuestNames.get(ep.city)!.add(name);
      if (!countryByCity.has(ep.city)) countryByCity.set(ep.city, ep.country);
    }
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
