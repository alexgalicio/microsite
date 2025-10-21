"use client";

import SearchableLinks from "@/components/links/search-link";
import SubdomainHeader from "@/components/subdomain-header";
import { useSite } from "@/components/subdomain-provider";
import { getLinksBySiteId } from "@/lib/actions/links";
import { Links } from "@/lib/types";
import { handleError } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Page() {
  const [linkData, setLinkData] = useState<Links[]>([]);
  const [error, setError] = useState<string | null>(null);

  // get site info
  const site = useSite();

  // fetch link by site id
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
    <>
      {/* header */}
      <SubdomainHeader title={site.title} subdomain={site.subdomain} />

      {/* links with search and filter*/}
      <SearchableLinks links={linkData} id={site.id} />
    </>
  );
}
