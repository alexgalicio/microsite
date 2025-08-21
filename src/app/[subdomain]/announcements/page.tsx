"use client";

import AnnouncementPreview from "@/components/announcement/announcement-preview";
import Header from "@/components/announcement/header";
import { PaginationWithLinks } from "@/components/announcement/pagination";
import { useSite } from "@/components/subdomain-provider";
import { getAnnouncementsBySiteId } from "@/lib/actions/announcement";
import { Announcements } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [announcementData, setAnnouncementData] = useState<Announcements[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const site = useSite();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = 6;

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAnnouncementsBySiteId(site.id, {
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });
      if (!response.success) {
        return (
          <div className="p-4">
            <h2>Error Loading Announcements</h2>
            <p>{response.error}</p>
          </div>
        );
      }

      setAnnouncementData(response.data || []);
      setTotalCount(response.count || 0);
    };
    fetchData();
  }, [site.id, page]);

  return (
    <div className="max-w-6xl mx-auto px-5 mb-10">
      <Header />
      <AnnouncementPreview announcements={announcementData} />
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
    </div>
  );
}
