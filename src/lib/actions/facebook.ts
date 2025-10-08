"use server";

import { createServerSupabaseClient } from "@/utils/server";

export async function submitForm(formData: {
  page_id: string;
  access_token: string;
  user_id: string;
}) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("facebook_feed")
    .upsert(formData, { onConflict: "user_id" })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteFacebookCreds(userId: string) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("facebook_feed")
    .delete()
    .eq("user_id", userId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getFormValues(user_id: string) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("facebook_feed")
    .select("page_id, access_token")
    .eq("user_id", user_id)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data || null;
}
