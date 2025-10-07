"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
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
import { getFeedbackData } from "@/lib/actions/analytics";
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

export function UserFeedbackLineChart() {
  const [chartData, setChartData] = useState<ChatbotFeedback[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFeedbackData();
        setChartData(data);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Feedback</CardTitle>
        <CardDescription>
          User satisfaction with chatbot responses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="helpful"
              type="monotone"
              stroke="var(--color-helpful)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="unhelpful"
              type="monotone"
              stroke="var(--color-unhelpful)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="neutral"
              type="monotone"
              stroke="var(--color-neutral)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
