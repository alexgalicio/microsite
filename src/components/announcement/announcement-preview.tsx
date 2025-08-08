import { Announcements } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "../ui/aspect-ratio";

interface AnnouncementsProps {
  announcements: Announcements[];
}

export default function AnnouncementsPreview({
  announcements,
}: AnnouncementsProps) {
  return (
    <div className="grid grid-cols-1 gap-16 lg:gap-28 md:grid-cols-2 md:my-16 my-8">
      {announcements.length ? (
        announcements.map((announcement) => (
          <div className="break-words" key={announcement.id}>
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

            <div className="grid grid-cols-1 gap-3 md:col-span-2 mt-4">
              <h2 className="font-semibold tracking-tighter text-2xl md:text-3xl">
                <Link key={announcement.id} href={`/blog/${announcement.slug}`}>
                  {announcement.title}
                </Link>
              </h2>
              <p className="line-clamp-3 ">
                {DOMPurify.sanitize(announcement.content, {
                  ALLOWED_TAGS: [],
                })}
              </p>

              <div className="flex gap-2 text-muted-foreground">
                <p>{announcement.author}</p>
                <span>•</span>
                <time dateTime={announcement.created_at}>
                  {formatDate(announcement.created_at)}
                </time>
              </div>
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
