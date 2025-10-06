"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import { SiteAnalytics } from "@/lib/types";
import Link from "next/link";

export const columns: ColumnDef<SiteAnalytics>[] = [
  {
    accessorKey: "title",
    header: "Microsite",
  },
  {
    accessorKey: "total_views",
    header: "Total Views",
  },
  {
    accessorKey: "total_visitors",
    header: "Total Visitors",
  },
  {
    accessorKey: "url",
    header: "Actions",
    cell: ({ row }) => {
      const url = row.getValue("url") as string;

      return (
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group hover:text-blue-600 flex items-center gap-1"
        >
          View Page
          <ExternalLink
            size={14}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </Link>
      );
    },
  },
];
