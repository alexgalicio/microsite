"use server";

import { createServerSupabaseClient } from "@/utils/server";

export async function uploadMedia(file: File) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase.storage
    .from("media")
    .upload(`${Date.now()}-${file.name}`, file);

  if (error) {
    return null;
  }

  return data.path;
}
