import { Links } from "@/lib/types";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default function LinkPreview({ link }: { link: Links }) {
  return (
    <div className="rounded border-l-4 border-l-muted-foreground border hover:shadow-md p-4 transition">
      <h2 className="font-semibold">
        <Link href={link.url} target="_blank" rel="noopener noreferrer">
          <div className="flex items-center gap-2 group w-fit">
            <h2 className="text-xl font-semibold transition-colors hover:underline">
              {link.title}
            </h2>
            <ExternalLink className="w-4 h-4 opacity-0 transition-opacity group-hover:opacity-60" />
          </div>
        </Link>
      </h2>
      <p className="mt-2 text-sm">{link.description}</p>
    </div>
  );
}
