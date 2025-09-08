import Link from "next/link";
import { Links } from "@/lib/types";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function LinkPreview({ link }: { link: Links }) {
  return (
    <div className="rounded-lg border overflow-hidden hover:shadow-md transition-all p-4 bg-background">
      <div className="mb-3">
        <Link
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <div className="flex items-center gap-2 group w-fit">
            <h2 className="text-lg font-semibold transition-colors group-hover:underline">
              {link.title}
            </h2>
            <ExternalLink className="w-4 h-4 opacity-0 transition-opacity group-hover:opacity-60" />
          </div>
        </Link>
      </div>

      <p className="line-clamp-2 text-gray-500 text-sm mb-4">
        {link.description}
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-gray-500 text-xs sm:text-sm order-2 sm:order-1">
          {format(new Date(link.created_at), "M/d/yyyy")}
        </p>

        <div className="flex flex-wrap gap-1 order-1 sm:order-2">
          <Badge className="bg-green-500 text-xs">
            {link.link_category.title}
          </Badge>
          <Badge className="bg-purple-500 text-xs">{link.link_to.title}</Badge>
        </div>
      </div>
    </div>
  );
}
