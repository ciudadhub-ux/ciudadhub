import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Se genera como archivo estático durante el build (output: "export").
// output: "export" exige declarar la ruta como estática.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
