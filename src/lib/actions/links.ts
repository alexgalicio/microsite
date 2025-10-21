"use server";

import { createServerSupabaseClient } from "@/utils/server";
import { auth } from "@clerk/nextjs/server";

export async function getLinksByUserId(id: string, from: number, to: number) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();
  // fetch links and their category info
  const { data, error, count } = await supabase
    .from("links")
    .select(
      `
      *,
      link_category (
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
  image?: string;
  description: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();

  // find users site
  const { data: siteData, error: siteError } = await supabase
    .from("sites")
    .select("id, status")
    .eq("user_id", userId)
    .single();

  // user needs a published site before adding links
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
    image: formData.image,
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

// edit existing link
export async function editLink(
  id: string,
  formData: {
    title: string;
    url: string;
    category: string;
    image?: string;
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
      image: formData.image,
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

// delete a link by id
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

export async function uploadImage(file: File) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in." };
  }

  // create unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `links_img/${userId}/${fileName}`;

  const supabase = createServerSupabaseClient();
  // upload to supabase storage
  const { error } = await supabase.storage
    .from("assets")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    return { success: false, error: error.message };
  }

  // get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("assets").getPublicUrl(filePath);

  return { success: true, data: publicUrl };
}

export async function removeImage(url: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in." };
  }

  // extract filename from url
  const fileName = url.split("/").pop();
  const filePath = `links_img/${userId}/${fileName}`;
  console.log("filename: ", fileName);
  if (!fileName) return;

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.storage.from("assets").remove([filePath]);

  if (error) return { success: false, error: error.message };
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

  // check if category already exists
  const { data: existingCategory } = await supabase
    .from("link_category")
    .select("*")
    .ilike("title", trimmedTitle)
    .single();

  if (existingCategory) {
    return { success: false, error: "Category with this title already exists" };
  }

  // create new category
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

// get 3 latest links by site id
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
      )
    `
    )
    .eq("site_id", id)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    return [];
  }

  return data || [];
}
