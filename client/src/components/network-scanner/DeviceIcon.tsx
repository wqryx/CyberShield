import { Network, Router, Smartphone, Monitor, Printer, Tv, Server, HardDrive } from "lucide-react";

interface DeviceIconProps {
  type: string;
  className?: string;
}

export function DeviceIcon({ type, className }: DeviceIconProps) {
  const size = 20;
  
  switch (type.toLowerCase()) {
    case "router":
      return <Router size={size} className={className} />;
    case "smartphone":
    case "phone":
    case "mobile":
      return <Smartphone size={size} className={className} />;
    case "desktop":
    case "laptop":
    case "pc":
    case "computer":
      return <Monitor size={size} className={className} />;
    case "printer":
      return <Printer size={size} className={className} />;
    case "tv":
    case "television":
    case "smart tv":
      return <Tv size={size} className={className} />;
    case "server":
      return <Server size={size} className={className} />;
    case "iot_device":
    case "iot":
    case "camera":
    case "smart device":
      return <HardDrive size={size} className={className} />;
    default:
      return <Network size={size} className={className} />;
  }
}