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

export default function Page() {
  const [announcementData, setAnnouncementData] = useState<Announcements[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const site = useSite();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = 6;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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

      setLoading(false);
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
      <div className="max-w-6xl mx-auto px-5 mt-25 mb-10">
        <h2 className="text-3xl font-semibold text-foreground">
          Announcements
        </h2>
        <AnnouncementPreview
          announcements={announcementData}
          loading={loading}
        />
        {!loading && (
          <div className="flex justify-center">
            <div className="w-auto">
              <PaginationWithLinks
                page={page}
                pageSize={pageSize}
                totalCount={totalCount}
                navigationMode="router"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
