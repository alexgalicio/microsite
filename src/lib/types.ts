import { LucideIcon } from "lucide-react";

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
  user_id: string; // reference from clerk id
  title: string;
  subdomain: string;
  description?: string;
  bg_image?: string;
  status: SiteStatus;
  created_at: string;
  updated_at: string;
  submenu?: {
    // get submenu and menu
    title: string;
    menu: {
      id: string;
      title: string;
    };
  };
}

export interface Announcements {
  id: string;
  title: string;
  author: string;
  content: string;
  cover?: string;
  slug: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  all_day: boolean;
  color?: string;
}

export interface Links {
  id: string;
  title: string;
  url: string;
  description: string;
}

export interface Feedback {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export type MainNavItem = NavItemWithOptionalChildren;
export type SidebarNavItem = NavItemWithChildren;
