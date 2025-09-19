"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import DeleteDialog from "./delete-dialog";
import { DataTableColumnHeader } from "@/components/manage-menu/data-table-column-header";
import { Chunks } from "@/lib/schema";
import Link from "next/link";

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
      <DataTableColumnHeader column={column} title="File" />
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
    accessorKey: "url",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="URL" />
    ),
    cell: ({ row }) => {
      const url = row.getValue("url") as string;
      return (
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View File
        </Link>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const chunks = row.original;

      return <DeleteDialog chunks={chunks} />;
    },
  },
];
