"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getFeedbackChartData } from "@/lib/actions/analytics";
import { useEffect, useState } from "react";

type ChatbotFeedback = {
  date: string;
  helpful: number;
  unhelpful: number;
};

const chartConfig = {
  helpful: {
    label: "Helpful",
    color: "var(--chart-2)",
  },
  unhelpful: {
    label: "Not Helpful",
    color: "var(--chart-1)",
  },
  neutral: {
    label: "Neutral",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig;

export function UserFeedbackChartBar() {
  const [chartData, setChartData] = useState<ChatbotFeedback[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFeedbackChartData();
        setChartData(data);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="lg:col-span-7 shadow-none">
      <CardHeader>
        <CardTitle>User Feedback</CardTitle>
        <CardDescription>
          Showing user feedback on chatbot for the last 7 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="helpful" fill="var(--color-helpful)" radius={4} />
            <Bar dataKey="unhelpful" fill="var(--color-unhelpful)" radius={4} />
            <Bar dataKey="neutral" fill="var(--color-neutral)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
