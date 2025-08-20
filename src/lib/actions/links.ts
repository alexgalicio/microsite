"use server";

import { createServerSupabaseClient } from "@/utils/server";
import { auth } from "@clerk/nextjs/server";

export async function getAllCategory() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("link_category")
    .select("id, title");

  if (error) throw error;

  return data;
}

export async function getAllLinks(from: number, to: number) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();
  const { data, error, count } = await supabase
    .from("links")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data, count };
}

export async function addNewLink(formData: {
  title: string;
  url: string;
  description: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("links").insert({
    title: formData.title,
    url: formData.url,
    description: formData.description,
  });

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "Link already exist" };
    }
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function editLink(
  id: string,
  formData: {
    title: string;
    url: string;
    description: string;
  }
) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("links")
    .update({
      title: formData.title,
      url: formData.url,
      description: formData.description,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "Link already exist" };
    }
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteLink(id: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("links").delete().eq("id", id);

  if (error) return { success: false, error: error.message };

  return { success: true };
}
