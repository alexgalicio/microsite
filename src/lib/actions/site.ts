"use server";

import { createServerSupabaseClient } from "@/utils/server";
import { auth } from "@clerk/nextjs/server";

export async function createNewSite(formData: {
  title: string;
  subdomain: string;
  description?: string;
  bg_image?: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  if (formData.subdomain.toLocaleLowerCase() === "www") {
    return { success: false, error: "Not allowed to use www as subdomain" };
  }

  const supabase = createServerSupabaseClient();

  // check if user has a submenu, only user with sub can create site
  const { data: submenu, error: submenuError } = await supabase
    .from("submenu")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (!submenu || submenuError) {
    return { success: false, error: "Submenu not found for this user" };
  }

  const { error } = await supabase.from("sites").insert({
    title: formData.title,
    subdomain: formData.subdomain.toLowerCase(),
    user_id: userId,
    submenu_id: submenu.id,
    description: formData.description,
    bg_image: formData.bg_image,
  });

  if (error) {
    if (error.code === "23505") {
      // check which constraint was violated
      if (error.message.includes("user_id")) {
        return {
          success: false,
          error: "You can only create one site per account",
        };
      }
      return { success: false, error: "Subdomain is taken" };
    }
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function editSite(
  id: string,
  formData: {
    title: string;
    subdomain: string;
    description?: string;
    bg_image?: string;
  }
) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  if (formData.subdomain.toLocaleLowerCase() === "www") {
    return { success: false, error: "Not allowed to use www as subdomain" };
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("sites")
    .update({
      title: formData.title,
      subdomain: formData.subdomain.toLowerCase(),
      description: formData.description,
      bg_image: formData.bg_image,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "Subdomain is taken" };
    }
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getSiteBySubdomain(subdomain: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("sites")
    .select("id, title, subdomain, description, status")
    .eq("subdomain", subdomain)
    .single();

  if (error) return { success: false, error: error.message };

  return { success: true, data };
}

export async function getSiteData(id: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("site-content")
    .select("html, css")
    .eq("site_id", id)
    .single();

  if (error) return { success: false, error: error.message };

  return { success: true, data };
}

export async function getAllSite() {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();
  // query to get all sites with submenu and menu details
  const { data, error } = await supabase.from("sites").select(`
    *,
    submenu:submenu_id ( 
      id,
      title,
      menu:menu_id (
        id,
        title
      )
    )
  `);

  if (error) return { success: false, error: error.message };

  return { success: true, data };
}

export async function getSiteByUserId(id: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("user_id", id);

  if (error) return { success: false, error: error.message };

  return { success: true, data };
}

export async function archiveSite(id: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("sites")
    .update({ status: "archived" })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  return { success: true };
}

export async function restoreSite(id: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("sites")
    .update({ status: "published" })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  return { success: true };
}

export async function uploadBgImage(file: File) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  // create unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `backgrounds/${userId}/${fileName}`;

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

export async function removeBgImage(url: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  // extract filename from url
  const fileName = url.split("/").pop();
  const filePath = `backgrounds/${userId}/${fileName}`;
  console.log("filename: ", fileName);
  if (!fileName) return;

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.storage.from("assets").remove([filePath]);

  if (error) return { success: false, error: error.message };
}
