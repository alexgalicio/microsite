"use server";

import { createServerSupabaseClient } from "@/utils/server";
import { auth } from "@clerk/nextjs/server";

export async function createNewAnnouncement(formData: {
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
    return {
      success: false,
      error: "Please create a site before creating announcements",
    };
  }

  // create the announcement
  const { error } = await supabase.from("announcements").insert({
    title: formData.title,
    content: formData.content,
    author: formData.author,
    cover: formData.cover,
    site_id: siteData.id,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function editAnnouncement(
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
  const { error } = await supabase
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

  return { success: true };
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

export async function getAnnouncementsByUserId(
  id: string,
  from: number,
  to: number
) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();
  const { data, error, count } = await supabase
    .from("announcements")
    .select(
      `*,
       sites!inner (
         user_id
       )`,
      { count: "exact" }
    )
    .eq("sites.user_id", id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data, count };
}

export async function getAnnouncementsBySiteId(id: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("site_id", id)
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
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `covers/${userId}/${fileName}`;

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
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  // extract filename from url
  const fileName = url.split("/").pop();
  const filePath = `covers/${userId}/${fileName}`;
  if (!fileName) return;

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.storage.from("assets").remove([filePath]);

  if (error) return { success: false, error: error.message };
}
