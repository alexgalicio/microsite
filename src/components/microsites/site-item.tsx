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
  ArchiveRestore,
} from "lucide-react";
import Link from "next/link";
import { getLink } from "@/lib/getLink";
import { Site } from "@/lib/types";
import { useSite } from "./site-context";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export default function PageItem({ site }: { site: Site }) {
  const { setOpen, setCurrentRow } = useSite();
  const isArchived = site.status === "archived";
  const badgeColor = new Map([
    ["draft", "bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300"],
    [
      "published",
      "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200",
    ],
    ["archived", "bg-neutral-300/40 border-neutral-300"],
  ]);

  return (
    <div className="rounded-lg border p-4 hover:shadow-md">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href={getLink({ subdomain: "editor", pathName: site.id })}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <div className="flex items-center gap-2 group">
            <h2 className="text-xl font-semibold transition-colors group-hover:text-primary">
              {site.title}
            </h2>
            <ExternalLink className="w-4 h-4 opacity-0 transition-opacity group-hover:opacity-50" />
          </div>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
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
            {isArchived ? (
              <DropdownMenuItem
                onClick={() => {
                  setCurrentRow(site);
                  setOpen("restore");
                }}
              >
                Restore
                <DropdownMenuShortcut>
                  <ArchiveRestore size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
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

      <div className="text-muted-foreground text-sm flex flex-col gap-2">
        <div className="flex items-center gap-2 group hover:cursor-pointer">
          <Globe className="flex-shrink-0 w-4 h-4 mt-1 group-hover:text-primary" />
          <Link
            href={getLink({ subdomain: site.subdomain })}
            target="_blank"
            rel="noopener noreferrer"
            className="group-hover:text-primary"
          >
            {site.subdomain}.{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
          </Link>
        </div>
        <div className="flex space-x-2">
          <Badge
            variant="outline"
            className={cn("capitalize", badgeColor.get(site.status || "draft"))}
          >
            {site.status}
          </Badge>
        </div>
      </div>
    </div>
  );
}
