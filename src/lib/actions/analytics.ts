"use server";

import { createServerSupabaseClient } from "@/utils/server";

export async function getMonthlyStats(table: string) {
  const now = new Date();

  // current month start
  const currentMonthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).toISOString();

  // Last month start & end
  const lastMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  ).toISOString();
  const lastMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    0
  ).toISOString();

  // total
  const supabase = createServerSupabaseClient();
  const { count: total } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });

  // Current month
  const { count: currentMonth } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true })
    .gte("created_at", currentMonthStart);

  // Last month
  const { count: lastMonth } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true })
    .gte("created_at", lastMonthStart)
    .lte("created_at", lastMonthEnd);

  const difference = (currentMonth ?? 0) - (lastMonth ?? 0);

  return {
    total: total ?? 0,
    difference,
  };
}

export async function getActiveSites() {
  const supabase = createServerSupabaseClient();
  const { count } = await supabase
    .from("sites")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  return count ?? 0;
}

export async function getTopPerformingSite() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("site_analytics")
    .select("id, title, url, total_views, total_visitors")
    .limit(5);

  if (error) return [];

  return data;
}

export async function getDeviceDistribution() {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("analytics")
    .select("device_type");

  if (error) {
    console.error("Error fetching device distribution:", error);
    return { mobile: 0, desktop: 0, tablet: 0 };
  }

  // Count each device type
  const mobile = data.filter((row) => row.device_type === "Mobile").length;
  const desktop = data.filter((row) => row.device_type === "Desktop").length;
  const tablet = data.filter((row) => row.device_type === "Tablet").length;

  return {
    mobile,
    desktop,
    tablet,
  };
}

export async function getFeedbackData() {
  const supabase = createServerSupabaseClient();
  const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString();

  // get all feedback from this year
  const { data: feedbackData, error: feedbackError } = await supabase
    .from("chat_feedback")
    .select("created_at, feedback, interaction_id")
    .gte("created_at", startOfYear);

  if (feedbackError) {
    console.error("Feedback error:", feedbackError);
    return [];
  }

  // get all chat interactions from this year
  const { data: interactionsData, error: interactionsError } = await supabase
    .from("chat_interactions")
    .select("id, created_at")
    .gte("created_at", startOfYear);

  if (interactionsError) {
    console.error("Interactions error:", interactionsError);
    return [];
  }

  // create a set of interaction ids that have feedback
  const interactionsWithFeedback = new Set(
    feedbackData?.map((f) => f.interaction_id) || []
  );

  // init counts per day
  const counts: Record<
    string,
    { helpful: number; unhelpful: number; neutral: number }
  > = {};

  // count explicit feedback
  feedbackData?.forEach((row) => {
    const date = new Date(row.created_at).toISOString().split("T")[0];
    if (!counts[date]) {
      counts[date] = { helpful: 0, unhelpful: 0, neutral: 0 };
    }
    if (row.feedback === "helpful") counts[date].helpful += 1;
    else if (row.feedback === "unhelpful") counts[date].unhelpful += 1;
  });

  // count neutral feedback
  interactionsData?.forEach((interaction) => {
    if (!interactionsWithFeedback.has(interaction.id)) {
      const date = new Date(interaction.created_at).toISOString().split("T")[0];
      if (!counts[date]) {
        counts[date] = { helpful: 0, unhelpful: 0, neutral: 0 };
      }
      counts[date].neutral += 1;
    }
  });

  const chartData = Object.entries(counts)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([date, vals]) => ({
      date,
      ...vals,
    }));

  return chartData;
}
