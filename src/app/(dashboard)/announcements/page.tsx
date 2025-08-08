import AnnouncementsList from "@/components/announcement/announcements-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAnnouncementsByUserId } from "@/lib/actions/announcement";
import { auth } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const response = await getAnnouncementsByUserId(userId);

  if (!response.success) {
    return (
      <div className="p-4">
        <h2>Error Loading Announcements</h2>
        <p>{response.error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Announcements</h2>
        <Link href="/announcements/new">
          <Button className="space-x-1">
            <Plus size={18} /> <span>Create New</span>
          </Button>
        </Link>
      </div>
      <AnnouncementsList announcements={response.data || []} />
    </div>
  );
}
