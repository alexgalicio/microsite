import AnnouncementsPreview from "@/components/announcement/announcement-preview";
import Header from "@/components/announcement/header";
import { PaginationWithLinks } from "@/components/announcement/pagination";
import { getAnnouncementsBySiteId } from "@/lib/actions/announcement";
import { getSiteBySubdomain } from "@/lib/actions/site";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ subdomain: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { subdomain } = await params;
  const resolveSearchParams = await searchParams;

  const response = await getSiteBySubdomain(subdomain);
  if (!response || !response.success) {
    return <div>Site not found</div>;
  }

  const page = parseInt((resolveSearchParams?.page as string) || "1");
  const pageSize = parseInt((resolveSearchParams?.pageSize as string) || "4");

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const announcements = await getAnnouncementsBySiteId(
    response.data?.id,
    from,
    to
  );

  console.log("page:", page);
  console.log("announcements:", announcements);

  if (!announcements.success) {
    return (
      <div className="p-4">
        <h2>Error Loading Announcements</h2>
        <p>{announcements.error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 mb-10">
      <Header />
      <AnnouncementsPreview announcements={announcements.data || []} />
      <div className="mt-8">
        <PaginationWithLinks
          page={page}
          pageSize={pageSize}
          totalCount={announcements.count || 0}
          navigationMode="router"
          pageSizeSelectOptions={{
            pageSizeOptions: [10, 20, 30, 40, 50],
          }}
        />
      </div>
    </div>
  );
}
