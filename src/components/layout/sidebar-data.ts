import { NavItem } from "@/lib/types";
import { Globe, LayoutDashboard, Menu, Settings } from "lucide-react";

//sidebar nav items
export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: false,
    items: [], // empty array as there are no child items
  },
  {
    title: "Microsites",
    url: "/microsites",
    icon: Globe,
    isActive: false,
    items: [],
  },
  {
    title: "Manage Menu",
    url: "/manage-menu",
    icon: Menu,
    isActive: false,
    items: [],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    isActive: false,
    items: [],
  },
];
