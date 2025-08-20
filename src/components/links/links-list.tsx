"use client";

import { Links } from "@/lib/types";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ, Link, SlidersHorizontal, X } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import LinkItem from "./link-item";

export default function LinksList({ links }: { links: Links[] }) {
  const [sort, setSort] = useState("ascending");
  const [search, setSearch] = useState("");

  const searchLower = search.toLowerCase();
  const filteredLinks = links
    .sort((a, b) =>
      sort === "ascending"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    )
    .filter(
      (link) =>
        link.title.toLowerCase().includes(searchLower) ||
        link.description.toLowerCase().includes(searchLower) ||
        link.url.toLowerCase().includes(searchLower)
    );

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
          {/* input search */}
          <Input
            className="h-9 w-40 lg:w-[250px]"
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
        <div className="ml-auto hidden h-9 lg:flex">
          {/* sort */}
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
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredLinks.length ? (
          filteredLinks.map((link) => <LinkItem key={link.id} link={link} />)
        ) : (
          <div className="col-span-full">
            <EmptyState
              title="No Links Found"
              description="Get started by adding new links."
              icon={<Link className="w-6 h-6 text-muted-foreground" />}
            />
          </div>
        )}
      </div>
    </>
  );
}
