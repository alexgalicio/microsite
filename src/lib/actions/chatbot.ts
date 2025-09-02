"use server";

import { createServerSupabaseClient } from "@/utils/server";
import { FeedbackType } from "../types";

export async function saveUserFeedback(type: FeedbackType) {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from("chat_feedback").insert({
    feedback: type,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function saveUserQuestion(question: string) {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from("chat_interactions").insert({
    question: question,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
