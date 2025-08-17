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
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getLink } from "@/lib/getLink";
import { Site } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useSite } from "./site-context";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import Image from "next/image";

export default function PageItem({ site }: { site: Site }) {
  const { setOpen, setCurrentRow } = useSite();
  const isArchived = site.status === "archived";
  const isDraft = site.status === "draft";
  const { user } = useUser();
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
  ]);

  const isAdmin = user?.publicMetadata.role === "admin";
  const isOwner = user?.id === site.user_id;

  // if current user is admin dont allow to access editor
  const handleEditorClick = (e: React.MouseEvent) => {
    if (isAdmin && !isOwner) {
      e.preventDefault();
      toast.error("Only the site owner can access the editor");
      return;
    }
  };

  return (
    <div className="relative rounded-lg border overflow-hidden hover:shadow-md transition-all">
      <Image
        src={site.bg_image || "/images/placeholder.webp"}
        alt={site.title}
        fill
        priority
        sizes="auto"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-linear-to-r from-gray-900 via-gray-900/70"></div>

      <div className="relative z-10 p-4">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href={getLink({ subdomain: "editor", pathName: site.id })}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-white"
            onClick={handleEditorClick}
          >
            <div className="flex items-center gap-2 group w-fit">
              <h2 className="text-xl font-semibold transition-colors group-hover:text-primary">
                {site.title}
              </h2>
              <ExternalLink className="w-4 h-4 opacity-0 transition-opacity group-hover:opacity-60" />
            </div>
          </Link>
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
                  disabled={isDraft}
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
