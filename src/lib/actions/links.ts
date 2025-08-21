"use server";

import { createServerSupabaseClient } from "@/utils/server";
import { auth } from "@clerk/nextjs/server";

export async function getLinksByUserId(id: string, from: number, to: number) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();
  const { data, error, count } = await supabase
    .from("links")
    .select("*", { count: "exact" })
    .eq("user_id", id)
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

  // get users site
  const { data: siteData, error: siteError } = await supabase
    .from("sites")
    .select("id, status")
    .eq("user_id", userId)
    .single();

  if (siteError || !siteData) {
    return {
      success: false,
      error: "Please create a site before adding links",
    };
  } else if (siteData.status != "published") {
    return {
      success: false,
      error: "Please make your site public before adding links",
    };
  }

  // add the link
  const { error } = await supabase.from("links").insert({
    title: formData.title,
    url: formData.url,
    description: formData.description,
    site_id: siteData.id,
    user_id: userId,
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

export async function getLinksBySiteId(id: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("site_id", id)
    .order("title", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
