"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Menu } from "@/lib/schema";
import { Checkbox } from "../../ui/checkbox";
import Link from "next/link";

export const columns: ColumnDef<Menu>[] = [
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
      <DataTableColumnHeader column={column} title="Menu" />
    ),
  },
  {
    accessorKey: "submenu_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No. of Submenu" />
    ),
    cell: ({ row }) => {
      const menuId = row.original.id; 
      const submenuCount = row.getValue("submenu_count") as number;

      const text = `${submenuCount} submenu${submenuCount > 1 ? "s" : ""}`;

      if (submenuCount === 0) {
        return <span>{text}</span>;
      }

      return (
        <Link href={`/manage-menu/submenu/${menuId}`} className="hover:underline">
          {text}
        </Link>
      );
    },
  },
  {
    id: "actions",
    cell: DataTableRowActions,
  },
];
