import { NavItem } from "@/lib/types";
import { Globe, LayoutDashboard, Menu, Settings } from "lucide-react";

//sidebar nav items
export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: false,
    items: [], // array for sub items in the future
    role: "admin",
  },
  {
    title: "Microsites",
    url: "/microsites",
    icon: Globe,
    isActive: false,
    items: [], // empty array as there are no child items
    // no role means available to all
  },
  {
    title: "Manage Menu",
    url: "/manage-menu",
    icon: Menu,
    isActive: false,
    items: [],
    role: "admin",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    isActive: false,
    items: [],
  },
];
