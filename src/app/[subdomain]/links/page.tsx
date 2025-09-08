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
  const [loading, setLoading] = useState(true);
  const site = useSite();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getLinksBySiteId(site.id);
        if (response.success) {
          setLinkData(response.data || []);
        } else {
          setError(handleError(response.error));
        }
      } catch (error) {
        setError(handleError(error));
      } finally {
        setLoading(false);
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
      <SubdomainHeader title={site.title} subdomain={site.subdomain} />
      <SearchableLinks links={linkData} loading={loading} />
    </>
  );
}
