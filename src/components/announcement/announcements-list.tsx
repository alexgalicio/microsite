"use client";

import { Announcements } from "@/lib/types";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { EmptyState } from "@/components/ui/empty-state";
import { Megaphone } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

interface AnnouncementsProps {
  announcements: Announcements[];
}

export default function AnnouncementsList({
  announcements,
}: AnnouncementsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {announcements.length ? (
        announcements.map((announcement) => (
          <div
            className="bg-muted overflow-hidden rounded-lg hover:shadow-md transition-all"
            key={announcement.id}
          >
            <Link
              key={announcement.id}
              href={`/announcements/${announcement.id}`}
            >
              <AspectRatio ratio={16 / 9} className="w-full">
                <Image
                  src={announcement.cover || "/images/placeholder.webp"}
                  alt={announcement.title}
                  fill
                  priority
                  sizes="auto"
                  className="h-full min-h-full min-w-full object-cover object-center"
                />
              </AspectRatio>
              <div className="flex flex-col gap-2 p-4">
                <h2 className="text-xl font-semibold tracking-tight line-clamp-2">
                  {announcement.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(announcement.created_at), "MMMM d, yyyy")}
                </p>
              </div>
            </Link>
          </div>
        ))
      ) : (
        <div className="col-span-full">
          <EmptyState
            title="No Annoucements Yet"
            description="Share news, updates, or important information with your audience."
            icon={<Megaphone className="w-6 h-6 text-muted-foreground" />}
          />
        </div>
      )}
    </div>
  );
}
