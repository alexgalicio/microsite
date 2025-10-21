"use server";

import { createServerSupabaseClient } from "@/utils/server";
import { auth } from "@clerk/nextjs/server";

// handles saving form
export async function submitForm(formData: {
  page_id: string;
  access_token: string;
  user_id: string;
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
      error: "Please create a site before adding this.",
    };
  } else if (siteData.status != "published") {
    return {
      success: false,
      error: "Please make your site public before adding this.",
    };
  }

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

// delete credentials from db
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

// get saved form values
export async function getFormValues(user_id: string) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("facebook_feed")
    .select("page_id, access_token")
    .eq("user_id", user_id)
    .single();

  // if theres error other than no rows found (PGRST116) return null
  if (error && error.code !== "PGRST116") {
    return null;
  }

  return data || null;
}
