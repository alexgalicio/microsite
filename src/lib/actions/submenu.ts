"use server";

import { createServerSupabaseClient } from "@/utils/server";
import { auth } from "@clerk/nextjs/server";
import { Submenu } from "../schema";

export async function editSubmenu(id: string, title: string, menu_id: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in." };
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("submenu")
    .update({ title: title, menu_id: menu_id })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "A submenu with this name already exists." };
    }
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteSubmenu(id: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in." };
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("submenu").delete().eq("id", id);

  if (error) return { success: false, error: error.message };

  return { success: true };
}

export async function getTableData(
  menuId: string
): Promise<{ data: Submenu[]; error: string | null }> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("submenu")
    .select(
      `
      id,
      title,
      menu_id,
      profiles:user_id(email)
    `
    )
    .eq("menu_id", menuId);

  if (error) return { data: [], error: error.message };

  return { data: data, error: null };
}
