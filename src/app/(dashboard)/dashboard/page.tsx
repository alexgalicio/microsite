import { UserFeedbackChartBar } from "@/components/dashboard/chatbot-feedback";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveSites, getMonthlyStats } from "@/lib/actions/analytics";
import { Bot, Globe, Menu, User } from "lucide-react";
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
          icon={<User size={16} />}
        />

        <StatsCard
          title="Active Microsites"
          total={await getActiveSites()}
          difference={siteStats.difference}
          icon={<Globe size={16} />}
        />

        <StatsCard
          title="Total Menu"
          total={menuStats.total}
          difference={menuStats.difference}
          icon={<Menu size={16} />}
        />

        <StatsCard
          title="Chatbot Conversations"
          total={chatStats.total}
          difference={chatStats.difference}
          icon={<Bot size={16} />}
        />
      </div>

      <div className="space-y-4 xl:grid xl:grid-cols-12 xl:gap-4 xl:space-y-0">
        <UserFeedbackChartBar />

        <Card className="lg:col-span-5 shadow-none">
          <CardHeader>
            <CardTitle>Recently Published Microsites</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSitesTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
