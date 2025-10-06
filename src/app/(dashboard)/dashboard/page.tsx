import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getActiveSites, getMonthlyStats } from "@/lib/actions/analytics";
import { Bot, Globe, Menu, User } from "lucide-react";
import { DeviceDistributionPie } from "@/components/dashboard/device-distribution";
import { UserFeedbackLineChart } from "@/components/dashboard/chatbot-feedback";
import RecentSitesTable from "@/components/dashboard/recent-site/view-page";
import StatsCard from "@/components/dashboard/stats-card";

export default async function Dashboard() {
  const userStats = await getMonthlyStats("profiles");
  const menuStats = await getMonthlyStats("menu");
  const siteStats = await getMonthlyStats("sites");
  const chatStats = await getMonthlyStats("chat_interactions");

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Users"
          total={userStats.total}
          difference={userStats.difference}
          description="Total number of users"
          icon={<User size={16} />}
        />

        <StatsCard
          title="Active Microsites"
          total={await getActiveSites()}
          difference={siteStats.difference}
          description="Total number of active microsites"
          icon={<Globe size={16} />}
        />

        <StatsCard
          title="Total Menu"
          total={menuStats.total}
          difference={menuStats.difference}
          description="Total number of menu"
          icon={<Menu size={16} />}
        />

        <StatsCard
          title="Chatbot Conversations"
          total={chatStats.total}
          difference={chatStats.difference}
          description="Total number of chatbot conversations"
          icon={<Bot size={16} />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Microsites</CardTitle>
          <CardDescription>Based on total page views</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentSitesTable />
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <DeviceDistributionPie />
        <UserFeedbackLineChart />
      </div>
    </div>
  );
}
