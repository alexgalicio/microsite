"use client";

import { useRouter } from "next/navigation";
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
  Clock,
  ExternalLink,
  Trash,
  Edit,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { getLink } from "@/lib/getLink";
import { Site } from "@/lib/types";
import { useSite } from "./site-context";

export default function PageItem({ site }: { site: Site }) {
  const { setOpen, setCurrentRow } = useSite();

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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="text-muted-foreground text-sm flex flex-col gap-1">
        <div className="flex items-center gap-2 group hover:cursor-pointer">
          <Globe className="flex-shrink-0 w-4 h-4 mt-1 group-hover:text-primary" />
          <Link
            href={getLink({ subdomain: site.subdomain })}
            target="_blank"
            rel="noopener noreferrer"
            className="group-hover:text-primary"
          >
            {site.subdomain}.alexgalicio.dev
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="flex-shrink-0 w-4 h-4 mt-1" />
          <span>
            Updated{" "}
            {formatDistanceToNow(new Date(site.updated_at), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
