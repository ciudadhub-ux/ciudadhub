import Nav from "@/components/Nav";
import InvitadosClient, { type GuestData, type EpisodeLink } from "@/components/InvitadosClient";
import Footer from "@/components/Footer";
import { episodes } from "@/lib/data";
import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/site";

const DESCRIPTION =
  "Los invitados e invitadas de CiudadHub: quienes gestionan, estudian y transforman ciudades en América Latina y Europa, y el mapa de dónde hablan.";

// El sufijo "— CiudadHub" lo agrega el template de title del layout raíz.
export const metadata: Metadata = {
  title: "Invitados",
  description: DESCRIPTION,
  alternates: { canonical: "/invitados" },
  openGraph: {
    type: "website",
    url: "/invitados",
    title: "Invitados — CiudadHub",
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

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
    };

    // Un episodio puede tener dos invitados: cada uno recibe su propia ficha,
    // ambas apuntando al mismo episodio.
    const participantes: { nombre: string; rol: string; foto: string }[] = [
      { nombre: name, rol: ep.guestRole, foto: ep.guestImageUrl },
    ];
    if (ep.guest2?.trim()) {
      participantes.push({
        nombre: ep.guest2.trim(),
        rol: ep.guestRole2 ?? "",
        foto: ep.guestImageUrl2 ?? "",
      });
    }

    for (const p of participantes) {
      if (!seen.has(p.nombre)) {
        seen.set(p.nombre, {
          name: p.nombre,
          guestRole: p.rol,
          city: ep.city,
          country: ep.country,
          topics,
          photoSrc: p.foto || null,
          episodes: [],
        });
        guestEpisodes.set(p.nombre, []);
      }
      guestEpisodes.get(p.nombre)!.push(epLink);
    }

    // Collect ALL cities across all episodes for the map
    if (ep.city) {
      if (!cityGuestNames.has(ep.city)) cityGuestNames.set(ep.city, new Set());
      for (const p of participantes) cityGuestNames.get(ep.city)!.add(p.nombre);
      if (!countryByCity.has(ep.city)) countryByCity.set(ep.city, ep.country);
    }
  }

  // Attach episodes array to each guest
  for (const [name, eps] of guestEpisodes) {
    seen.get(name)!.episodes = eps;
  }

  const guests = [...seen.values()].sort((a, b) => a.name.localeCompare(b.name, "es"));
  const cityGuestNamesRecord: Record<string, string[]> = {};
  for (const [city, names] of cityGuestNames) {
    cityGuestNamesRecord[city] = [...names];
  }
  const countryByCityRecord: Record<string, string> = Object.fromEntries(countryByCity);

  return (
    <>
      <Nav />
      <main className="pt-[98px] md:pt-48">
        <h1 className="sr-only">Invitados de CiudadHub</h1>
        <InvitadosClient guests={guests} cityGuestNames={cityGuestNamesRecord} countryByCity={countryByCityRecord} />
      </main>
      <Footer />
    </>
  );
}
