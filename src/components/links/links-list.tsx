"use client";

import { Links } from "@/lib/types";
import { useEffect, useState } from "react";
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
import { getAllCategories, getAllTo } from "@/lib/actions/links";
import LinkItem from "./link-item";

export default function LinksList({ links }: { links: Links[] }) {
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Links[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tos, setTo] = useState<Links[]>([]);
  const [selectedTo, setSelectedTo] = useState<string | null>(null);
  const isFiltered =
    search.length > 0 || selectedTo !== null || selectedCategory !== null;

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

  // fetch to
  useEffect(() => {
    const fetchTo = async () => {
      try {
        const toData = await getAllTo();
        if (toData.success) {
          setTo(toData.data);
        }
      } catch (error) {
        console.error("Error fetching to:", error);
      }
    };
    fetchTo();
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
        (selectedCategory
          ? link.link_category?.id === selectedCategory
          : true) &&
        (selectedTo ? link.link_to?.id === selectedTo : true)
    );

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory(null);
    setSelectedTo(null);
  };

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

          <div className="flex gap-2">
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

            {/* filter by to */}
            <Select
              value={selectedTo ?? ""}
              onValueChange={(value) =>
                setSelectedTo(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="h-9 border-dashed">
                <SelectValue placeholder="To" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {tos.map((to) => (
                  <SelectItem key={to.id} value={to.id}>
                    {to.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
