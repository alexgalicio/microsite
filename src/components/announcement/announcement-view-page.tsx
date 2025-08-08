import { notFound } from "next/navigation";
import { getAnnouncementById } from "@/lib/actions/announcement";
import { Announcements } from "@/lib/types";
import AnnouncementForm from "./announcement-form";

type TPAnnouncementViewPageProps = {
  id: string;
};

export default async function AnnouncementViewPage({
  id,
}: TPAnnouncementViewPageProps) {
  let announcement = null;
  let pageTitle = "Create New Announcement";

  if (id !== "new") {
    const response = await getAnnouncementById(id);
    announcement = response.data as Announcements;
    if (!announcement) {
      notFound();
    }
    pageTitle = `Edit Announcement`;
  }

  return <AnnouncementForm initialData={announcement} pageTitle={pageTitle} />;
}
