"use client";

import { useEffect, useState } from "react";
import { getLatestLinksBySiteId } from "@/lib/actions/links";
import { Links } from "@/lib/types";
import LinkPreview from "./link-preview";

export default function LatestLinks({ siteId }: { siteId: string }) {
  const [links, setLinks] = useState<Links[]>([]);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const linksData = await getLatestLinksBySiteId(siteId);
        setLinks(linksData);
      } catch (error) {
        console.error("Error fetching links:", error);
      }
    };

    fetchLinks();
  }, [siteId]);

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#F8FAFB] ">
      <div className="container mx-auto px-4 py-10 xl:px-24 mb-4">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Latest Links
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {links.map((link) => (
            <LinkPreview key={link.id} link={link} />
          ))}
        </div>
      </div>
    </div>
  );
}
