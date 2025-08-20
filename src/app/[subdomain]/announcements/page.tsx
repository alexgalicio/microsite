import { NotFoundError } from "@/app/error/not-found";
import AnnouncementPreview from "@/components/announcement/announcement-preview";
import Header from "@/components/announcement/header";
import { getAnnouncementsBySiteId } from "@/lib/actions/announcement";
import { getSiteBySubdomain } from "@/lib/actions/site";

export default async function Page({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  const response = await getSiteBySubdomain(subdomain);
  if (!response || !response.success) {
    return <NotFoundError />;
  }

  const announcements = await getAnnouncementsBySiteId(response.data?.id);
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
      <AnnouncementPreview announcements={announcements.data || []} />
    </div>
  );
}
