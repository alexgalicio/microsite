import { Announcements } from "@/lib/types";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface AnnouncementsProps {
  announcements: Announcements[];
  loading?: boolean;
}

export default function AnnouncementPreview({
  announcements,
  loading = false,
}: AnnouncementsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-4 col-span-full">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : announcements.length ? (
        announcements.map((announcement) => (
          <div
            className=" bg-muted overflow-hidden rounded-lg hover:shadow-md transition-all"
            key={announcement.id}
          >
            <AspectRatio ratio={16 / 9} className="w-full">
              <Image
                src={announcement.cover || "/images/placeholder.webp"}
                alt={announcement.title}
                fill
                sizes="100%"
                priority
                className="h -full min-h-full min-w-full object-cover object-center"
              />
            </AspectRatio>

            <div className="p-4 flex flex-col gap-2">
              <Link href={`/announcements/${announcement.slug}`}>
                <h3 className="font-semibold tracking-tighter text-xl line-clamp-2 md:text-lg">
                  {announcement.title}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground">{format(new Date(announcement.created_at), "MMMM d, yyyy")}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full mt-16">
          <p className="text-center text-muted-foreground">
            No announcements yet.
          </p>
        </div>
      )}
    </div>
  );
}
