import AnnouncementForm from "./announcement-form";
import { getAnnouncementById } from "@/lib/actions/announcement";
import { Announcements } from "@/lib/types";
import { redirect } from "next/navigation";

export default async function AnnouncementViewPage({ id }: { id: string }) {
  let announcement = null;
  let pageTitle = "Create New Announcement";

  if (id !== "new") {
    const response = await getAnnouncementById(id);
    announcement = response.data as Announcements;
    if (!announcement) {
      redirect("/announcements");
    }
    pageTitle = `Edit Announcement`;
  }

  return <AnnouncementForm initialData={announcement} pageTitle={pageTitle} />;
}
