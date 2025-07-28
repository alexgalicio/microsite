import { z } from "zod";

const menuSchema = z.object({
  id: z.string(),
  title: z.string(),
  submenu_count: z.number(),
});

const submenuSchema = z.object({
  id: z.string(),
  title: z.string(),
  menu_id: z.string(),
  profiles: z.array(
    z.object({
      email: z.string(),
    })
  ),
});

export type Menu = z.infer<typeof menuSchema>;
export type Submenu = z.infer<typeof submenuSchema>;
