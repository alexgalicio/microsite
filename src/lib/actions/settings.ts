"use server";

import { createServerSupabaseClient } from "@/utils/server";
import { auth } from "@clerk/nextjs/server";

export async function upsertPageConfigurations(
  pageTitle: string,
  logoWidth: number,
  logoHeight: number
) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in." };
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("configuration")
    .upsert({
      id: 1,
      page_title: pageTitle,
      logo_width: logoWidth,
      logo_height: logoHeight,
    });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function uploadLogo(file: File, oldPath?: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in." };
  }
  const supabase = createServerSupabaseClient();

  if (oldPath) {
    const { error: deleteError } = await supabase.storage
      .from("assets")
      .remove([oldPath]);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }
  }

  // create unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `logo/${fileName}`;

  // upload to supabase storage
  const { error: uploadError } = await supabase.storage
    .from("assets")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  // get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("assets").getPublicUrl(filePath);

  // upload to table config
  const { error } = await supabase
    .from("configuration")
    .upsert({ id: 1, logo: publicUrl });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: publicUrl };
}

export async function getConfiguration() {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("configuration")
    .select("*")
    .single();

  if (error) {
    return null;
  }

  return data;
}
