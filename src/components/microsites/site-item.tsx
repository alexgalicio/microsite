"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Globe,
  ExternalLink,
  Edit,
  Archive,
  XCircle,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getLink } from "@/lib/getLink";
import { Site } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useSite } from "./site-context";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function PageItem({ site }: { site: Site }) {
  const { setOpen, setCurrentRow } = useSite();
  const { user } = useUser();
  const isOwner = user?.id === site.user_id;

  const isArchived = site.status === "archived";
  const isPublished = site.status === "published";

  const badgeColor = new Map([
    [
      "draft",
      "bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 border-amber-600/60 shadow-none rounded-full",
    ],
    [
      "published",
      "bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full",
    ],
    [
      "archived",
      "bg-neutral-300/40 border-neutral-300 hover:bg-neutral-300/40 text-neutral-300 shadow-none rounded-full",
    ],
    [
      "unpublished",
      "bg-neutral-300/40 border-neutral-300 hover:bg-neutral-300/40 text-neutral-300 shadow-none rounded-full",
    ],
  ]);

  return (
    <div className="relative rounded-lg border overflow-hidden hover:shadow-md transition-all">
      {/* bg image */}
      <Image
        src={site.bg_image || "/images/placeholder.webp"}
        alt={site.title}
        fill
        priority
        sizes="auto"
        className="object-cover object-center"
      />
      {/* overlay to darken the image for text visibility */}
      <div className="absolute inset-0 bg-linear-to-r from-gray-900 via-gray-900/70"></div>

      <div className="relative z-10 p-4">
        <div className="mb-8 flex items-center justify-between">
          {isOwner ? (
            // if user own the site, make title clickable to open editor
            <Link
              href={getLink({ subdomain: "editor", pathName: site.id })}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-white"
            >
              <div className="flex items-center gap-2 group w-fit">
                <h2 className="text-xl font-semibold transition-colors group-hover:text-primary">
                  {site.title}
                </h2>
                <ExternalLink className="w-4 h-4 opacity-0 transition-opacity group-hover:opacity-60" />
              </div>
            </Link>
          ) : (
            // if not just display the title
            <div className="flex items-center gap-2 w-fit text-white">
              <h2 className="text-xl font-semibold">{site.title}</h2>
            </div>
          )}

          {/* actions */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex h-8 w-8 p-0 bg-input/30 border-input hover:bg-input/50 text-white"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem
                onClick={() => {
                  setCurrentRow(site);
                  setOpen("edit");
                }}
              >
                Edit
                <DropdownMenuShortcut>
                  <Edit size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* is site is published, show unpublish option */}
              {isPublished && (
                <DropdownMenuItem
                  onClick={() => {
                    setCurrentRow(site);
                    setOpen("unpublish");
                  }}
                >
                  Unpublish
                  <DropdownMenuShortcut>
                    <XCircle size={16} />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )}

              {/* is site is archived or not published, show publish option */}
              {(isArchived || !isPublished) && (
                <DropdownMenuItem
                  onClick={() => {
                    setCurrentRow(site);
                    setOpen("publish");
                  }}
                >
                  Publish
                  <DropdownMenuShortcut>
                    <ArrowUpRight size={16} />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )}

              {/* if site is not archived and published, show archive option */}
              {!isArchived && !isPublished && (
                <DropdownMenuItem
                  disabled={isPublished}
                  onClick={() => {
                    setCurrentRow(site);
                    setOpen("archive");
                  }}
                >
                  Archive
                  <DropdownMenuShortcut>
                    <Archive size={16} />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="text-white/80 text-sm flex flex-col gap-2">
          <div className="flex items-center gap-2 group w-fit hover:cursor-pointer">
            {/* site url opens live microsite */}
            <Globe className="flex-shrink-0 w-4 h-4 group-hover:text-primary " />
            <Link
              href={getLink({ subdomain: site.subdomain })}
              target="_blank"
              rel="noopener noreferrer"
              className="group-hover:text-primary"
            >
              {site.subdomain}.{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
            </Link>
          </div>

          {/* badge status */}
          <div className="flex space-x-2">
            <Badge
              variant="outline"
              className={cn(
                "capitalize",
                badgeColor.get(site.status || "draft")
              )}
            >
              {site.status}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
