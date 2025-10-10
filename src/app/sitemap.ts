import type { MetadataRoute } from "next";
import { getSiteforSitemap } from "@/lib/actions/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const microsites = await getSiteforSitemap();

  const micrositeEntries = microsites.map((microsite) => ({
    url: microsite.url,
    lastModified: new Date(microsite.updated_at),
    priority: 0.8,
  }));

  return [
    {
      url: "https://cictmicro.site",
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: "https://www.cictmicro.site/programs/bsit",
      lastModified: new Date(),
      priority: 0.8,
    },
    ...micrositeEntries,
  ];
}
