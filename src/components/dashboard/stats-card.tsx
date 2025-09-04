import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  total: number;
  difference: number;
  icon: React.ReactElement;
}

export default function StatsCard({
  title,
  total,
  difference,
  icon,
}: StatsCardProps) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <div className="flex flex-col gap-2">
          <h4 className="text-2xl lg:text-3xl font-bold">{total}</h4>
          <div className="text-muted-foreground text-sm">
            <span
              className={difference >= 0 ? "text-green-600" : "text-red-600"}
            >
              {difference >= 0 ? `+${difference}` : difference}
            </span>{" "}
            from last month
          </div>
        </div>
        <CardAction>
          <div className="flex gap-4">
            <div className="bg-muted flex size-12 items-center justify-center rounded-full border">
              {icon}
            </div>
          </div>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
