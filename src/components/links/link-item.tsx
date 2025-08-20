import Link from "next/link";
import { Edit, ExternalLink, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLink } from "./link-context";
import { Links } from "@/lib/types";

export default function LinkItem({ link }: { link: Links }) {
  const { setOpen, setCurrentRow } = useLink();

  return (
    <div className="rounded-lg border overflow-hidden hover:shadow-md transition-all">
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <Link
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <div className="flex items-center gap-2 group w-fit">
              <h2 className="font-semibold transition-colors group-hover:text-primary">
                {link.title}
              </h2>
              <ExternalLink className="w-4 h-4 opacity-0 transition-opacity group-hover:opacity-60" />
            </div>
          </Link>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem
                onClick={() => {
                  setCurrentRow(link);
                  setOpen("edit");
                }}
              >
                Edit
                <DropdownMenuShortcut>
                  <Edit size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setCurrentRow(link);
                  setOpen("delete");
                }}
                className="text-red-500!"
              >
                Delete
                <DropdownMenuShortcut>
                  <Trash2 size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="line-clamp-2 text-gray-500 text-sm">{link.description}</p>
      </div>
    </div>
  );
}
