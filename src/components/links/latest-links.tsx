"use client";

import { useEffect, useState } from "react";
import { getLatestLinks } from "@/lib/actions/links";
import { Links } from "@/lib/types";
import LinkPreview from "./link-preview";

export default function LatestLinks() {
  const [links, setLinks] = useState<Links[]>([]);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const linksData = await getLatestLinks();
        setLinks(linksData);
      } catch (error) {
        console.error("Error fetching links:", error);
      }
    };

    fetchLinks();
  }, []);

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
