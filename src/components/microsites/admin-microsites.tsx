"use client";

import PageItem from "./site-item";
import { useEffect, useState } from "react";
import { MenuItem, Site, SiteStatus } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ, Globe, SlidersHorizontal, X } from "lucide-react";
import { getAllMenu } from "@/lib/actions/menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";

export default function Microsites({ sites }: { sites: Site[] }) {
  const [sort, setSort] = useState("ascending");
  const [search, setSearch] = useState("");
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<SiteStatus | null>(null);
  const isFiltered =
    search.length > 0 || selectedStatus !== null || selectedMenu !== null;

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const menuData = await getAllMenu();
        setMenus(menuData);
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    };

    fetchMenus();
  }, []);

  const filteredSites = sites
    .sort((a, b) =>
      sort === "ascending"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    )
    .filter(
      (site) =>
        site.title.toLowerCase().includes(search.toLowerCase()) &&
        (selectedMenu ? site.submenu?.menu?.id === selectedMenu : true) &&
        (selectedStatus
          ? site.status === selectedStatus
          : site.status !== "archived") // hide archived sites by default
    );

  const resetFilters = () => {
    setSearch("");
    setSelectedMenu(null);
    setSelectedStatus(null);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
          {/* input search */}
          <Input
            className="h-9 w-40 lg:w-[250px]"
            placeholder="Search microsite"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-2">
            {/* filter by menu */}
            <Select
              value={selectedMenu ?? ""}
              onValueChange={(value) =>
                setSelectedMenu(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="h-9 border-dashed">
                <SelectValue placeholder="Menu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Menu</SelectItem>
                {menus.map((menu) => (
                  <SelectItem key={menu.id} value={menu.id}>
                    {menu.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* filter by status */}
            <Select
              value={selectedStatus ?? ""}
              onValueChange={(value) =>
                setSelectedStatus(
                  value === "all" ? null : (value as SiteStatus)
                )
              }
            >
              <SelectTrigger className="h-9 border-dashed">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
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
        {filteredSites.length ? (
          filteredSites.map((site) => <PageItem key={site.id} site={site} />)
        ) : (
          <div className="col-span-full">
            <EmptyState
              title="No Microsites Found"
              description="Microsites will appear here once users start creating them."
              icon={<Globe className="w-6 h-6 text-muted-foreground" />}
            />
          </div>
        )}
      </div>
    </>
  );
}
