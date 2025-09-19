"use server";

import { createServerSupabaseClient } from "@/utils/server";
import { FeedbackType } from "../types";
import { Chunks } from "../schema";

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

export async function getTableData(): Promise<{
  data: Chunks[];
  error: string | null;
}> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("chunks").select(`
        id, 
        filename,
        url
      `);

  if (error) return { data: [], error: error.message };

  const mappedData =
    data?.map((chunks) => ({
      id: chunks.id,
      filename: chunks.filename,
      url: chunks.url,
    })) || [];

  // remove duplicates by filename
  const uniqueData = Array.from(
    new Map(mappedData.map((item) => [item.filename, item])).values()
  );

  return { data: uniqueData, error: null };
}

export async function deleteFile(filename: string) {
  const supabase = createServerSupabaseClient();

  // delete file from storage
  const { error: storageError } = await supabase.storage
    .from("media")
    .remove([filename]);

  if (storageError) {
    return {
      success: false,
      error: storageError.message,
    };
  }

  // delete from chunks table
  const { error: dbError } = await supabase
    .from("chunks")
    .delete()
    .eq("filename", filename);

  if (dbError) {
    return { success: false, error: dbError.message };
  }

  return { success: true };
}
