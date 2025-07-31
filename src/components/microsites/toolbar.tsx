"use client";

import { useState } from "react";
import PageItem from "./site-item";
import { Site } from "@/lib/types";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowDownAZ, SlidersHorizontal, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export default function SearchMicrosites({ sites }: { sites: Site[] }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("ascending");
  const isFiltered = search.length > 0;

  const filteredSites = sites
    .sort((a, b) =>
      sort === "ascending"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    )
    .filter((app) => app.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
          <Input
            className="h-9 w-40 lg:w-[250px]"
            placeholder="Search microsite"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {isFiltered && (
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
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-16">
            <SelectValue>
              <SlidersHorizontal size={18} />
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="ascending">
              <div className="flex items-center gap-4">
                <ArrowDownAZ size={16} />
                <span>Ascending</span>
              </div>
            </SelectItem>
            <SelectItem value="descending">
              <div className="flex items-center gap-4">
                <ArrowDownAZ size={16} />
                <span>Descending</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSites.length ? (
          filteredSites.map((site) => <PageItem key={site.id} site={site} />)
        ) : (
          <div className="col-span-full">
            <p className="text-center text-muted-foreground">No sites found.</p>
          </div>
        )}
      </div>
    </>
  );
}
