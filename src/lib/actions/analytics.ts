"use server";

import { createServerSupabaseClient } from "@/utils/server";
import { SiteAnalytics } from "../types";

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

export async function getLatestUpdateSites(): Promise<SiteAnalytics[]> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("sites")
    .select("id, title, updated_at, url")
    .order("updated_at", { ascending: false })
    .limit(8);

  const mappedSites =
    data?.map((site) => ({
      id: site.id,
      title: site.title,
      updated_at: site.updated_at,
      url: site.url ,
    })) || [];

  return mappedSites || [];
}

export async function getFeedbackChartData() {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("chat_feedback")
    .select("created_at, feedback")
    .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()); // last 7 days

  if (error) {
    console.error(error);
    return [];
  }

  // initialize counts per day
  const counts: Record<
    string,
    { helpful: number; unhelpful: number; neutral: number }
  > = {};

  data.forEach((row) => {
    const date = new Date(row.created_at).toISOString().split("T")[0];
    if (!counts[date]) {
      counts[date] = { helpful: 0, unhelpful: 0, neutral: 0 };
    }
    if (row.feedback === "helpful") counts[date].helpful += 1;
    else if (row.feedback === "unhelpful") counts[date].unhelpful += 1;
    else counts[date].neutral += 1;
  });

  // build array sorted by date
  const chartData = Object.entries(counts)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([date, vals]) => ({
      date,
      ...vals,
    }));

  return chartData;
}

