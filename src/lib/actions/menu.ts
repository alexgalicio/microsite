"use server";

import { createServerSupabaseClient } from "@/utils/server";
import { auth } from "@clerk/nextjs/server";
import { Menu } from "../schema";

export async function createNewMenu(title: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in." };
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("menu").insert({ title: title });

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "A menu with this name already exists." };
    }
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function editMenu(id: string, title: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in." };
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("menu")
    .update({ title: title })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "A menu with this name already exists." };
    }
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteMenu(id: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in." };
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("menu").delete().eq("id", id);

  if (error) return { success: false, error: error.message };

  return { success: true };
}

export async function getAllMenu() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("menu").select("id, title");

  if (error) throw error;

  return data;
}

export async function getMenuTitle(menuId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("menu")
    .select("title")
    .eq("id", menuId)
    .single();

  if (error) return { success: false, error: error.message };

  return { success: true, data: data.title };
}

export async function getTableData(): Promise<{
  data: Menu[];
  error: string | null;
}> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("menu").select(`
        id, 
        title,
        submenus:submenu(count)
      `);

  if (error) return { data: [], error: error.message };

  const mappedData =
    data?.map((menu) => ({
      id: menu.id,
      title: menu.title,
      submenu_count: menu.submenus?.[0]?.count || 0,
    })) || [];

  return { data: mappedData, error: null };
}

export async function getMenuandSubmenu() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("menu").select(`
      id,
      title,
      submenu (
        id,
        title,
        sites!inner (
          id,
          url,
          site_content!inner (
            site_id
          )
        )
      )
    `);

  if (error) {
    return [];
  }

  const formatted = data.map((menu) => ({
    id: menu.id,
    title: menu.title,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sublink: menu.submenu.map((sub: any) => ({
      id: sub.id,
      name: sub.title,
      link: sub.sites?.[0]?.url || "#",
    })),
  }));

  return formatted;
}
