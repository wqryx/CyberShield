import { Network, Router, Smartphone, Monitor, Printer, Tv, Server, HardDrive, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface NetworkDevice {
  id: number | string;
  name: string;
  type: string;
  ip: string;
  mac: string;
  status: "active" | "inactive";
  ports: number[];
  isVulnerable?: boolean;
}

interface NetworkDeviceInfoProps {
  devices: NetworkDevice[];
  isLoading?: boolean;
  onSelectDevice?: (id: number) => void;
}

// Iconos para los tipos de dispositivos
const DeviceIcon = ({ type, className }: { type: string, className?: string }) => {
  const size = 20;
  switch (type) {
    case "router":
      return <Router size={size} className={className} />;
    case "smartphone":
      return <Smartphone size={size} className={className} />;
    case "desktop":
    case "laptop":
      return <Monitor size={size} className={className} />;
    case "printer":
      return <Printer size={size} className={className} />;
    case "tv":
      return <Tv size={size} className={className} />;
    case "server":
      return <Server size={size} className={className} />;
    case "iot_device":
    case "camera":
      return <HardDrive size={size} className={className} />;
    default:
      return <Network size={size} className={className} />;
  }
};

export function NetworkDeviceInfo({ devices, isLoading, onSelectDevice }: NetworkDeviceInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispositivos en la red</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : devices.length === 0 ? (
          <div className="text-center py-8">
            <Network className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">No se encontraron dispositivos</p>
          </div>
        ) : (
          <div className="space-y-3">
            {devices.map((device) => (
              <div 
                key={device.id} 
                className="p-3 border rounded-lg flex items-center gap-3 cursor-pointer hover:bg-gray-50"
                onClick={() => onSelectDevice && onSelectDevice(Number(device.id))}
              >
                <div className={`p-2 rounded-full ${device.isVulnerable ? 'bg-red-100' : 'bg-blue-100'}`}>
                  <DeviceIcon type={device.type} className={device.isVulnerable ? 'text-red-600' : 'text-blue-600'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{device.name}</p>
                  <p className="text-xs text-gray-500">{device.ip}</p>
                </div>
                <div>
                  <Badge variant={device.isVulnerable ? "destructive" : "outline"} className="text-xs">
                    {device.ports.length > 0 ? `${device.ports.length} puertos` : "Sin puertos"}
                  </Badge>
                  {device.isVulnerable && (
                    <div className="flex items-center mt-1 text-xs text-red-500">
                      <AlertTriangle size={12} className="mr-1" />
                      <span>Vulnerable</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}