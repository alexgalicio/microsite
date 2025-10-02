"use client";

import { Links } from "@/lib/types";
import { useEffect, useState } from "react";
import { ArrowDownAZ, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAllCategories } from "@/lib/actions/links";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LatestLinks from "./latest-links";
import LinkPreview from "./link-preview";

interface SearchableLinksProps {
  links: Links[];
  id: string;
}

export default function SearchableLinks({ links, id }: SearchableLinksProps) {
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Links[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const isFiltered = search.length > 0 || selectedCategory !== null;

  // fetch category
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categData = await getAllCategories();
        if (categData.success) {
          setCategories(categData.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const searchLower = search.toLowerCase();
  const filteredLinks = links
    .sort((a, b) =>
      sort === "newest"
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    .filter(
      (link) =>
        (link.url.toLowerCase().includes(searchLower) ||
          link.title.toLowerCase().includes(searchLower) ||
          link.description.toLowerCase().includes(searchLower)) &&
        (selectedCategory ? link.link_category?.id === selectedCategory : true)
    );

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory(null);
  };

  return (
    <>
      <div className="mt-20 mb-8">
        <div className="sticky top-20 z-40 bg-background border-b">
          <div className="container mx-auto px-4 pt-8 py-4 xl:px-24">
            <div className="flex items-center justify-between">
              <div className="flex flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
                {/* input search */}
                <Input
                  className="h-9 w-50 lg:w-[250px]"
                  placeholder="Search link"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {/* filter by category */}
                <Select
                  value={selectedCategory ?? ""}
                  onValueChange={(value) =>
                    setSelectedCategory(value === "all" ? null : value)
                  }
                >
                  <SelectTrigger className="h-9 border-dashed">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* reset filter */}
                {isFiltered && (
                  <Button
                    variant="ghost"
                    onClick={resetFilters}
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
                    <SelectItem value="newest">
                      <div className="flex items-center gap-4">
                        <ArrowDownAZ size={16} />
                        <span>Newest to Oldest</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="oldest">
                      <div className="flex items-center gap-4">
                        <ArrowDownAZ size={16} />
                        <span>Oldest to Newest</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <LatestLinks siteId={id} />

        <div className="container mx-auto p-4 xl:px-24">
          {filteredLinks.length > 0 ? (
            <>
              <h2 className="text-2xl font-semibold text-foreground">
                More Links
              </h2>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pb-10 pt-4">
                {filteredLinks.map((link) => (
                  <LinkPreview key={link.id} link={link} />
                ))}
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-muted-foreground">
              <p>No links found.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
