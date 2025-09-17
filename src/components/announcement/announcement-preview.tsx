import { Announcements } from "@/lib/types";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import DOMPurify from "isomorphic-dompurify";

interface AnnouncementsProps {
  announcements: Announcements[];
}

export default function AnnouncementPreview({
  announcements,
}: AnnouncementsProps) {
  return (
    <>
      <h2 className="text-3xl font-semibold text-foreground mb-6">
        Announcements
      </h2>

      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {announcements.map((announcement) => (
          <Link
            href={`/announcements/${announcement.slug}`}
            key={announcement.id}
            className="group"
          >
            <AspectRatio
              ratio={16 / 9}
              className="w-full overflow-hidden rounded-lg"
            >
              <Image
                src={announcement.cover || "/images/placeholder.webp"}
                alt={announcement.title}
                fill
                sizes="100%"
                priority
                className="h-full min-h-full min-w-full object-cover object-center transition-transform duration-400 ease-in-out group-hover:scale-105"
              />
            </AspectRatio>

            <div className="flex flex-col gap-1 pt-2">
              <p className="text-sm text-muted-foreground ">
                {format(new Date(announcement.created_at), "MMMM d, yyyy")}
              </p>

              <h3 className="font-semibold tracking-tighter text-xl line-clamp-2 md:text-lg">
                {announcement.title}
              </h3>

              <p className="line-clamp-2">
                {DOMPurify.sanitize(announcement.content, {
                  ALLOWED_TAGS: [],
                })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
