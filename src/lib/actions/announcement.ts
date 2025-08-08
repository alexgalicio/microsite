"use server";

import { createServerSupabaseClient } from "@/utils/server";
import { auth } from "@clerk/nextjs/server";

export async function createNewArticle(formData: {
  title: string;
  content: string;
  author: string;
  cover?: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();

  // get users site
  const { data: siteData, error: siteError } = await supabase
    .from("sites")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (siteError || !siteData) {
    return { success: false, error: "No site found for user" };
  }

  // create the blog
  const { data, error } = await supabase.from("announcements").insert({
    title: formData.title,
    content: formData.content,
    author: formData.author,
    cover: formData.cover,
    user_id: userId,
    site_id: siteData.id,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function editArticle(
  id: string,
  formData: {
    title: string;
    content: string;
    author: string;
    cover?: string;
  }
) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("announcements")
    .update({
      title: formData.title,
      content: formData.content,
      author: formData.author,
      cover: formData.cover,
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function deleteAnnouncement(id: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("announcements")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function getAnnouncementsByUserId(id: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function getAnnouncementById(id: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function uploadCoverImage(file: File) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  // create unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `covers/${fileName}`;

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

export async function removeCoverImage(url: string) {
  // extract filename from url
  const fileName = url.split("/").pop();
  const filePath = `covers/${fileName}`;
  console.log("filename: ", fileName);
  if (!fileName) return;

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.storage.from("assets").remove([filePath]);

  if (error) return { success: false, error: error.message };
}
