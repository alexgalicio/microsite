import { NavItem } from "@/lib/types";
import {
  Calendar,
  Facebook,
  Globe,
  LayoutDashboard,
  Link,
  Megaphone,
  Menu,
  Settings,
} from "lucide-react";

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
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
    isActive: false,
    items: [],
    role: "admin",
  },
  {
    title: "Links",
    url: "/links",
    icon: Link,
    isActive: false,
    items: [],
    role: "user",
  },
  {
    title: "Announcements",
    url: "/announcements",
    icon: Megaphone,
    isActive: false,
    items: [],
    role: "user",
  },
  {
    title: "Facebook Feed",
    url: "/facebook-feed",
    icon: Facebook,
    isActive: false,
    items: [],
    role: "user",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    isActive: false,
    items: [],
  },
];
