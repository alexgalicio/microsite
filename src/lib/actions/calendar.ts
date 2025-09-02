"use server";

import { createServerSupabaseClient } from "@/utils/server";
import { auth } from "@clerk/nextjs/server";

export async function createCalendarEvent(
  title: string,
  start: string,
  end: string,
  all_day: boolean,
  color?: string
) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("calendar_events").insert({
    title: title,
    start: start,
    end: end,
    all_day: all_day,
    color: color,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateCalendarEvent(
  id: string,
  title: string,
  all_day: boolean,
  start?: string,
  end?: string,
  color?: string
) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("calendar_events")
    .update({
      title: title,
      start: start,
      end: end,
      all_day: all_day,
      color: color,
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteCalendarEvent(id: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("calendar_events")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getNextEvents() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("calendar_events")
    .select("start, end, title")
    .gte("start", new Date().toISOString())
    .order("start", { ascending: true })
    .limit(4);

  if (error) {
    return [];
  }

  return data.map((event) => {
    const startDate = new Date(event.start);

    return {
      day: startDate
        .toLocaleDateString("en-US", { weekday: "long" })
        .toUpperCase(),
      month: startDate
        .toLocaleDateString("en-US", { month: "short" })
        .toUpperCase(),
      date: startDate.getDate().toString(),
      title: event.title,
    };
  });
}
