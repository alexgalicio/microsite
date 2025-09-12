"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

type BreadcrumbItem = {
  title: string;
  link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  "/manage-menu": [{ title: "Manage Menu", link: "/manage-menu" }],
  "/facebook-feed": [{ title: "Facebook Feed", link: "/facebook-feed" }],
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // Custom handling of routes
    if (pathname.includes("/manage-menu/") && pathname.includes("/submenu")) {
      return [
        { title: "Manage Menu", link: "/manage-menu" },
        { title: "Submenu", link: pathname },
      ];
    } else if (pathname.includes("/announcements/") && pathname.includes("-")) {
      return [
        { title: "Announcements", link: "/announcements" },
        { title: "Edit", link: pathname },
      ];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join("/")}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path,
      };
    });
  }, [pathname]);

  return breadcrumbs;
}
