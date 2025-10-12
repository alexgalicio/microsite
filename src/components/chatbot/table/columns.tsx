"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/manage-menu/data-table-column-header";
import { Chunks } from "@/lib/schema";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import Link from "next/link";
import DeleteDialog from "./delete-dialog";

export const columns: ColumnDef<Chunks>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "filename",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Filename" />
    ),
    cell: ({ row }) => {
      const file = row.getValue("filename") as string;
      return (
        <span
          className="max-w-32 truncate sm:max-w-72 md:max-w-[31rem]"
          title={file}
        >
          {file}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Added" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string | Date;
      const formattedDate = date ? format(new Date(date), "yyyy-MM-dd") : "-";
      return <span>{formattedDate}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const chunks = row.original;
      const fileUrl = chunks.view_url;
      const fileName = chunks.filename;

      return (
        <div className="flex">
          <Button variant="ghost" size="icon" className="h-8 w-8" title="View">
            <Link
              href={chunks.view_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Download"
            onClick={async () => {
              try {
                const response = await fetch(fileUrl);
                if (!response.ok)
                  throw new Error("Network response was not ok");

                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = blobUrl;
                link.download = fileName; // force download with original filename
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // clean up object URL
                window.URL.revokeObjectURL(blobUrl);
              } catch (error) {
                console.error("Error downloading file:", error);
              }
            }}
          >
            <Download className="h-4 w-4" />
          </Button>

          <DeleteDialog chunks={chunks} />
        </div>
      );
    },
  },
];
