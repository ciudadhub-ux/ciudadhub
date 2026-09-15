import {
  OG_IMAGE,
  PODCAST_FEED,
  SITE_AUTHORS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_PROFILES,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/site";

/**
 * Datos estructurados del podcast (Schema.org / JSON-LD).
 *
 * Describe la serie completa, no un episodio suelto, así que va una sola vez
 * en la home. Los episodios se enlazan con sus URLs reales de Apple y Spotify:
 * el sitio no tiene una página propia por episodio.
 */
export default function PodcastJsonLd({
  latest,
}: {
  latest?: { title: string; guest: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    name: `${SITE_NAME} — ${SITE_TAGLINE}`,
    alternateName: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    image: `${SITE_URL}${OG_IMAGE.url}`,
    inLanguage: "es",
    // webFeed es lo que permite a Google reconocerlo como podcast y ofrecer
    // resultados enriquecidos; sin el RSS queda como una página cualquiera.
    webFeed: PODCAST_FEED,
    author: SITE_AUTHORS.map((name) => ({ "@type": "Person", name })),
    sameAs: SITE_PROFILES,
    ...(latest?.length
      ? {
          hasPart: latest.map((ep) => ({
            "@type": "PodcastEpisode",
            name: ep.title,
            url: ep.url,
            partOfSeries: { "@type": "PodcastSeries", name: SITE_NAME, url: SITE_URL },
            ...(ep.guest
              ? { actor: { "@type": "Person", name: ep.guest } }
              : {}),
          })),
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      // El contenido es nuestro y se serializa con JSON.stringify, no viene del usuario.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
