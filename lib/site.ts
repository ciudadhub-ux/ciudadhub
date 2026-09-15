// Datos del sitio que se usan en metadatos, sitemap y datos estructurados.
// El dominio sale del CNAME del repositorio: ciudadhub.info, sin www.

export const SITE_URL = "https://ciudadhub.info";

export const SITE_NAME = "CiudadHub";

export const SITE_TAGLINE = "El Podcast de las Ciudades";

export const SITE_DESCRIPTION =
  "Conversaciones sobre urbanismo, movilidad, gobernanza y el futuro de las " +
  "ciudades, con quienes las gestionan y las estudian en América Latina y Europa.";

/** RSS del podcast (Spreaker). Es el feed que consumen Apple, Spotify y Google. */
export const PODCAST_FEED = "https://www.spreaker.com/show/1681693/episodes/feed";

/** Conductores, tal como figuran en el feed. */
export const SITE_AUTHORS = [
  "Andrés Carpanzano",
  "Oscar Chamat",
  "Ignacio Argonz",
];

/** Perfiles y plataformas oficiales — alimentan sameAs en los datos estructurados. */
export const SITE_PROFILES = [
  "https://podcasts.apple.com/us/podcast/ciudadhubs-tracks/id1093603743",
  "https://open.spotify.com/show/3C1ry4r1XvOr1YSsWGvtMT",
  "https://www.spreaker.com/podcast/ciudadhub-s-tracks--1681693",
  "https://www.instagram.com/ciudadhub",
  "https://www.twitter.com/ciudadhub",
  "https://www.facebook.com/ciudadhub",
];

export const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
};
