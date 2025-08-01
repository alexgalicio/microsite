import { LucideIcon } from "lucide-react";
import { string } from "zod";

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  icon?: LucideIcon;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
  role?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MenuItem = {
  id: string;
  title: string;
};

export type SiteStatus = "published" | "archived" | "draft";

export interface Site {
  id: string;
  user_id: string; // from clerk id
  title: string;
  description?: string;
  subdomain: string;
  created_at: string;
  updated_at: string;
  status?: string;
  submenu?: { // get menu id
    title: string;
    menu: {
      id: string;
      title: string;
    };
  };
}

export type MainNavItem = NavItemWithOptionalChildren;
export type SidebarNavItem = NavItemWithChildren;
