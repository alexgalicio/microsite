"use client";

import { Links } from "@/lib/types";
import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import LinkPreview from "./link-preview";

export default function SearchableLinks({
  links,
  loading = false,
}: {
  links: Links[];
  loading?: boolean;
}) {
  const [search, setSearch] = useState("");

  const searchLower = search.toLowerCase();
  const filteredLinks = links.filter(
    (link) =>
      link.title.toLowerCase().includes(searchLower) ||
      link.description.toLowerCase().includes(searchLower) ||
      link.url.toLowerCase().includes(searchLower)
  );

  return (
    <>
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex flex-col-reverse items-start sm:flex-row sm:items-center sm:space-x-2 pb-4">
          {/* input search */}
          <Input
            className="h-9 w-50 lg:w-[350px]"
            placeholder="Search link"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* reset filter */}
          {search.length > 0 && (
            <Button
              variant="ghost"
              onClick={() => setSearch("")}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <Separator className="shadow-sm" />

        <div className="flex-1 overflow-y-auto min-h-0 pr-2">
          {loading ? (
            // Loading state
            <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Loading links...</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4 pb-10 pt-4">
              {filteredLinks.length ? (
                filteredLinks.map((link) => (
                  <LinkPreview key={link.id} link={link} />
                ))
              ) : (
                <div className="col-span-full text-center mt-20">
                  No links found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
