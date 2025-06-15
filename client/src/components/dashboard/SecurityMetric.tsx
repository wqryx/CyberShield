import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface SecurityMetricProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconClassName?: string;
  progressPercentage: number;
  progressLabel: string;
}

export function SecurityMetric({
  title,
  value,
  icon: Icon,
  iconClassName,
  progressPercentage,
  progressLabel,
}: SecurityMetricProps) {
  let progressColorClass = "bg-green-500";
  if (progressPercentage < 40) {
    progressColorClass = "bg-red-500";
  } else if (progressPercentage < 70) {
    progressColorClass = "bg-yellow-500";
  }

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-full ${iconClassName || "bg-primary"} flex items-center justify-center`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`${progressColorClass} h-2 rounded-full`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <span className="ml-2 text-sm text-muted-foreground">{progressPercentage}%</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{progressLabel}</p>
      </div>
    </div>
  );
}
