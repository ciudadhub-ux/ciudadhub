import type { MetadataRoute } from "next";
import { posts } from "@/lib/blog-data";
import { SITE_URL } from "@/lib/site";

// Se genera como archivo estático durante el build (output: "export").
//
// La home y /invitados usan la fecha del build como lastModified: el sitio se
// recompila con cada cambio de contenido, así que esa fecha es exactamente
// cuándo cambiaron por última vez. Las notas del blog usan su propia fecha.
// output: "export" exige declarar la ruta como estática.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const built = new Date();

  const postDates = posts
    .map((p) => Date.parse(p.date))
    .filter((t) => !Number.isNaN(t));
  const blogUpdated = postDates.length ? new Date(Math.max(...postDates)) : built;

  return [
    {
      url: SITE_URL,
      lastModified: built,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/invitados`,
      lastModified: built,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: blogUpdated,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
