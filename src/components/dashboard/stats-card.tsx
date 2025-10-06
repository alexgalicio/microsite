import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleMinus, Info, TrendingDown, TrendingUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  total: number;
  difference: number;
  description: string;
  icon: React.ReactElement;
}

export default function StatsCard({
  title,
  total,
  difference,
  description,
  icon,
}: StatsCardProps) {
  const isPositive = difference > 0;
  const isNegative = difference < 0;

  const diffColor = isPositive
    ? "text-emerald-500"
    : isNegative
    ? "text-red-500"
    : "text-gray-500";

  const ArrowIcon = isPositive
    ? TrendingUp
    : isNegative
    ? TrendingDown
    : CircleMinus;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row items-center justify-between gap-5">
            <div className="tracking-tight flex items-center gap-2 truncate text-sm font-medium">
              {icon}
              {title}
            </div>
          </div>
        </CardTitle>
        <CardAction>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info size={18} />
            </TooltipTrigger>
            <TooltipContent>
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </CardAction>

        <CardContent className="p-0">
          <div className="text-2xl font-bold">
            <span>{total}</span>
          </div>
          <div className={`flex items-center gap-2 font-medium ${diffColor}`}>
            <p className="text-sm">
              {difference > 0 ? `+${difference}` : difference}
            </p>
            {ArrowIcon && <ArrowIcon size={18} />}
          </div>
          <p className="text-sm tracking-tight">vs Previous 30 Days</p>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
