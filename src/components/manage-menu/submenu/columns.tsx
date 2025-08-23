"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Submenu } from "@/lib/schema";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<Submenu>[] = [
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
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Submenu" />
    ),
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return (
        <div className="max-w-[200px] truncate" title={title}>
          {title}
        </div>
      );
    },
  },
  {
    accessorKey: "profiles.email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
