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
    .select(
      `
      *,
      link_category (
        id,
        title
      ),
      link_to (
        id,
        title
      )
    `,
      { count: "exact" }
    )
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
  category: string;
  to: string;
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
    category_id: formData.category,
    to_id: formData.to,
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
    category: string;
    to: string;
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
      category_id: formData.category,
      to_id: formData.to,
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
    .select(
      `
      *,
      link_category (
        id,
        title
      ),
      link_to (
        id,
        title
      )
    `
    )
    .eq("site_id", id)
    .order("title", { ascending: true });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function getAllCategories() {
  const supabase = createServerSupabaseClient();

  const { data: categories, error } = await supabase
    .from("link_category")
    .select("*")
    .order("title");

  if (error) {
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data: categories || [] };
}

export async function createCategory(title: string) {
  const supabase = createServerSupabaseClient();

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return { success: false, error: "Title is required" };
  }

  const trimmedTitle = title.trim();

  // Check if category already exists
  const { data: existingCategory } = await supabase
    .from("link_category")
    .select("*")
    .ilike("title", trimmedTitle)
    .single();

  if (existingCategory) {
    return { success: false, error: "Category with this title already exists" };
  }

  // Create new category
  const { data, error } = await supabase
    .from("link_category")
    .insert([{ title: trimmedTitle }])
    .select("id, title")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function getAllTo() {
  const supabase = createServerSupabaseClient();

  const { data: categories, error } = await supabase
    .from("link_to")
    .select("*")
    .order("title");

  if (error) {
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data: categories || [] };
}

export async function createTo(title: string) {
  const supabase = createServerSupabaseClient();

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return { success: false, error: "Title is required" };
  }

  const trimmedTitle = title.trim();

  // check if category already exists
  const { data: existingCategory } = await supabase
    .from("link_to")
    .select("*")
    .ilike("title", trimmedTitle)
    .single();

  if (existingCategory) {
    return { success: false, error: "Category with this title already exists" };
  }

  // Create new category
  const { data: newCategory, error } = await supabase
    .from("link_to")
    .insert([{ title: trimmedTitle }])
    .select("id, title")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: newCategory };
}

export async function getLatestLinksBySiteId(id: string) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("links")
    .select(
      `
      *,
      link_category (
        id,
        title
      ),
      link_to (
        id,
        title
      )
    `
    )
    .eq("site_id", id)
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    return [];
  }

  return data || [];
}
