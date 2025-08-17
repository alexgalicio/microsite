"use server";

import { createServerSupabaseClient } from "@/utils/server";
import { Mail } from "../types";

export async function submitForm(formData: {
  name: string;
  email: string;
  message: string;
}) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("notifications").insert([formData]);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getAllNotifications(): Promise<{
  data: Mail[];
  error: string | null;
}> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };

  const mappedData =
    data?.map((mail) => ({
      id: mail.id,
      name: mail.name,
      email: mail.email,
      message: mail.message,
      created_at: mail.created_at,
      is_read: mail.is_read,
    })) || [];

  return { data: mappedData, error: null };
}

export async function getUnreadNotifications() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("is_read", false)
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function markNotificationsAsRead(id: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id)
    .select();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function markAllNotificationsAsRead() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("is_read", false)
    .select();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function deleteNotification(id: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
