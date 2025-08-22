"use client";

import Header from "@/components/links/header";
import SearchableLinks from "@/components/links/search-link";
import { useSite } from "@/components/subdomain-provider";
import { getLinksBySiteId } from "@/lib/actions/links";
import { Links } from "@/lib/types";
import { handleError } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Page() {
  const [linkData, setLinkData] = useState<Links[]>([]);
  const [error, setError] = useState<string | null>(null);
  const site = useSite();

  useEffect(() => {
    const fetchData = async () => {
      setError(null);

      const response = await getLinksBySiteId(site.id);
      if (response.success) {
        setLinkData(response.data || []);
      } else {
        setError(handleError(response.error));
      }
    };
    fetchData();
  }, [site.id]);

  if (error) {
    return (
      <div className="p-4">
        <h2>Error Loading Links</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 h-screen flex flex-col">
      <Header />
      <SearchableLinks links={linkData} />
    </div>
  );
}
