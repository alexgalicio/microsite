"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { SiteAnalytics } from "@/lib/types";
import Link from "next/link";

export const columns: ColumnDef<SiteAnalytics>[] = [
  {
    accessorKey: "title",
    header: "Site",
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated",
    cell: ({ row }) => {
      const updatedAt = new Date(row.getValue("updated_at") as string);
      return `${formatDistanceToNow(updatedAt, { addSuffix: true })}`;
    },
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
          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
        >
          <ExternalLink size={14} />
          View Page
        </Link>
      );
    },
  },
];
