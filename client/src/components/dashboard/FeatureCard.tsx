import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { useLocation } from "wouter";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBackgroundClass: string;
  actionLabel: string;
  actionPath: string;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  iconBackgroundClass,
  actionLabel,
  actionPath,
}: FeatureCardProps) {
  const [_, setLocation] = useLocation();

  const handleActionClick = () => {
    setLocation(actionPath);
  };

  return (
    <div className="bg-card rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-center">
        <div className={`w-20 h-20 rounded-full ${iconBackgroundClass} flex items-center justify-center mb-4`}>
          <Icon className="h-8 w-8 text-primary" />
        </div>
      </div>
      <h2 className="text-xl font-semibold text-center">{title}</h2>
      <p className="mt-3 text-center text-muted-foreground">{description}</p>
      <div className="mt-4 text-center">
        <Button
          onClick={handleActionClick}
          variant="default"
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
