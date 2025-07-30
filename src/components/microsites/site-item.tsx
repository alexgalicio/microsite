"use client";

import { Site } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "../ui/card";
import Link from "next/link";
import { Clock, ExternalLink, Globe } from "lucide-react";

export default function SiteItem({ site }: { site: Site }) {
  const router = useRouter();

  return (
    <Card className="flex flex-col px-[1rem] justify-between h-full py-[1rem]">
      <CardHeader>
        <div>
          <Link
            // href={getLink({ subdomain: "editor", pathName: site.id })}
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold transition-colors group-hover:text-primary">
                {site.title}
              </h2>
              <ExternalLink className="w-4 h-4 opacity-0 transition-opacity group-hover:opacity-50" />
            </div>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start sm:items-center text-sm gap-x-6 gap-y-2 sm:gap-y-0 text-muted-foreground">
          <div className="flex items-center gap-2 group hover:cursor-pointer">
            <Globe className="flex-shrink-0 w-4 h-4 mt-1 group-hover:text-primary" />
            <Link
              //   href={getLink({ subdomain: site.subdomain })}
              href="/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="group-hover:text-primary"
            >
              {site.subdomain}.framely.site
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="flex-shrink-0 w-4 h-4 mt-1" />
            <span>Updated at {site.updated_at}</span>
            {/* <span>Updated {formatTimeAgo(Number(site.updatedAt))}</span> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
