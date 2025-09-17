"use client";

import SubdomainHeader from "@/components/subdomain-header";
import AnnouncementPreview from "@/components/announcement/announcement-preview";
import { PaginationWithLinks } from "@/components/announcement/pagination";
import { useSite } from "@/components/subdomain-provider";
import { getAnnouncementsBySiteId } from "@/lib/actions/announcement";
import { Announcements } from "@/lib/types";
import { handleError } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FacebookFeed from "@/components/facebook-feed/facebook-feed-list";

export default function Page() {
  const [announcementData, setAnnouncementData] = useState<Announcements[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const site = useSite();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = 6;

  useEffect(() => {
    const fetchData = async () => {
      setError(null);

      const response = await getAnnouncementsBySiteId(site.id, {
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });
      if (response.success) {
        setAnnouncementData(response.data || []);
        setTotalCount(response.count || 0);
      } else {
        setError(handleError(response.error));
      }
    };
    fetchData();
  }, [site.id, page]);

  if (error) {
    return (
      <div className="p-4">
        <h2>Error Loading Announcements</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <SubdomainHeader title={site.title} subdomain={site.subdomain} />
      <div className="container mx-auto px-4 pt-6 pb-10 xl:px-24 mt-20">
        {announcementData.length > 0 && (
          <>
            <AnnouncementPreview announcements={announcementData} />

            <div className="flex justify-center mt-8 mb-20">
              <div className="w-auto">
                <PaginationWithLinks
                  page={page}
                  pageSize={pageSize}
                  totalCount={totalCount}
                  navigationMode="router"
                />
              </div>
            </div>
          </>
        )}

        <FacebookFeed siteId={site.id} />
      </div>
    </>
  );
}
