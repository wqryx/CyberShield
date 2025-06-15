import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Router, Smartphone, Monitor, Printer, Tv, Server, HardDrive, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NetworkDevice {
  id: number;
  name: string;
  type: string;
  ip: string;
  mac: string;
  status: "active" | "inactive";
  ports: number[];
  isVulnerable?: boolean;
}

interface NetworkMapProps {
  isLoading?: boolean;
  devices?: NetworkDevice[];
  onSelectDevice?: (deviceId: number) => void;
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

export function SimpleNetworkMap({ isLoading, devices = [], onSelectDevice }: NetworkMapProps) {
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);

  // Renderizar vista de lista
  const renderDeviceList = () => (
    <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
      {devices.map(device => (
        <div 
          key={device.id}
          className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors
            ${selectedDevice?.id === device.id ? 'bg-primary/10 border-primary/30' : 'bg-white hover:bg-gray-50'}`}
          onClick={() => {
            setSelectedDevice(device);
            if (onSelectDevice) onSelectDevice(Number(device.id));
          }}
        >
          <div className={`p-2 rounded-full ${device.isVulnerable ? 'bg-red-100' : 'bg-blue-100'}`}>
            <DeviceIcon type={device.type} className={device.isVulnerable ? 'text-red-600' : 'text-blue-600'} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{device.name}</p>
            <p className="text-sm text-gray-500">{device.ip}</p>
          </div>
          <div className="flex flex-col items-end">
            <Badge
              variant={device.isVulnerable ? "destructive" : "outline"}
              className="text-xs"
            >
              {device.ports.length} puertos
            </Badge>
            {device.isVulnerable && (
              <span className="text-xs text-red-500 flex items-center mt-1">
                <AlertTriangle size={12} className="mr-1" /> Vulnerable
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Dispositivos en la red
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="border rounded-lg p-4 h-60 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full inline-block mb-3"></div>
              <p className="text-gray-500">Escaneando la red...</p>
            </div>
          </div>
        ) : !devices.length ? (
          <div className="border rounded-lg p-4 h-60 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Network className="text-gray-400 text-4xl mb-3 mx-auto" />
              <p className="text-gray-500">
                Los dispositivos se mostrarán aquí después del escaneo.
              </p>
            </div>
          </div>
        ) : (
          <div>
            {renderDeviceList()}
            
            {/* Información del dispositivo seleccionado */}
            {selectedDevice && (
              <div className="mt-4 p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <DeviceIcon 
                      type={selectedDevice.type} 
                      className={selectedDevice.isVulnerable ? 'text-red-500' : 'text-blue-500'} 
                    />
                    <h3 className="font-semibold">{selectedDevice.name}</h3>
                  </div>
                  {selectedDevice.isVulnerable && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle size={12} /> Vulnerable
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Dirección IP</p>
                    <p className="font-medium">{selectedDevice.ip}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">MAC</p>
                    <p className="font-medium">{selectedDevice.mac}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tipo</p>
                    <p className="font-medium capitalize">{selectedDevice.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Estado</p>
                    <p className="font-medium">
                      <Badge variant={selectedDevice.status === "active" ? "default" : "secondary"}>
                        {selectedDevice.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500 mb-1">Puertos abiertos</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedDevice.ports.length > 0 ? (
                        selectedDevice.ports.map(port => (
                          <Badge key={port} variant="outline">
                            {port}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">No se detectaron puertos abiertos</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}