import { z } from "zod";

export const menuSchema = z.object({
  id: z.string(),
  title: z.string(),
  submenu_count: z.number(),
});

export const submenuSchema = z.object({
  id: z.string(),
  title: z.string(),
  menu_id: z.string(),
  profiles: z.array(
    z.object({
      email: z.string(),
    })
  ),
});

export const siteSchema = z.object ({
  id: z.string(),
  user_id: z.string(),
  title: z.string(),
  subdomain: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Menu = z.infer<typeof menuSchema>;
export type Submenu = z.infer<typeof submenuSchema>;
export type Site = z.infer<typeof siteSchema>;
