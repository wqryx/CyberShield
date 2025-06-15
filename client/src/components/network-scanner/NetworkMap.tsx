import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Router, Smartphone, Monitor, Printer, Tv, Server, HardDrive, AlertTriangle } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

type NetworkNodeType = "router" | "desktop" | "laptop" | "smartphone" | "printer" | "tv" | "camera" | "server" | "iot_device" | "desconocido";

// Colores para los nodos según tipo
const typeColors: Record<NetworkNodeType, string> = {
  router: "#4f46e5", // Indigo
  desktop: "#0ea5e9", // Sky
  laptop: "#0ea5e9", // Sky
  smartphone: "#8b5cf6", // Violet
  printer: "#f97316", // Orange
  tv: "#14b8a6", // Teal
  camera: "#ec4899", // Pink
  server: "#f43f5e", // Rose
  iot_device: "#84cc16", // Lime
  desconocido: "#6b7280" // Gray
};

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

export function NetworkMap({ isLoading, devices = [], onSelectDevice }: NetworkMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState<string>("mapa");
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);
  const { isMobile } = useMobile();
  const [zoom, setZoom] = useState<number>(1);

  // Renderizar el mapa de red
  useEffect(() => {
    if (!devices.length || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Redimensionar canvas
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Definir variables para mantener estado durante el dibujo
    const nodeSize = 20 * zoom;
    const mainRouter = devices.find(d => d.type === "router") || devices[0];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const routerIndex = devices.indexOf(mainRouter);
    const otherDevices = devices.filter((_, i) => i !== routerIndex);
    const angleStep = (2 * Math.PI) / (otherDevices.length || 1);
    const radius = Math.min(canvas.width, canvas.height) * 0.35 * zoom;

    // Dibujar líneas desde el router a los dispositivos
    ctx.beginPath();
    otherDevices.forEach((device, i) => {
      const angle = i * angleStep;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Función para dibujar un nodo
    const drawNode = (x: number, y: number, device: NetworkDevice) => {
      const typeColor = typeColors[device.type as NetworkNodeType] || typeColors.desconocido;
      
      // Dibujar círculo del nodo
      ctx.beginPath();
      ctx.arc(x, y, nodeSize, 0, 2 * Math.PI);
      ctx.fillStyle = typeColor;
      ctx.fill();
      
      // Si es vulnerable, dibujar borde rojo
      if (device.isVulnerable) {
        ctx.beginPath();
        ctx.arc(x, y, nodeSize + 3, 0, 2 * Math.PI);
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Dibujar etiqueta IP
      ctx.save();
      ctx.font = `${10 * zoom}px sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      const ipParts = device.ip.split('.');
      const shortIp = ipParts[ipParts.length - 1];
      ctx.fillText(shortIp, x, y + nodeSize + 12);
      ctx.restore();
    };
    
    // Dibujar el router en el centro
    drawNode(centerX, centerY, mainRouter);
    
    // Dibujar los demás dispositivos en círculo
    otherDevices.forEach((device, i) => {
      const angle = i * angleStep;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      drawNode(x, y, device);
    });
    
    // Añadir evento de clic al canvas
    const handleCanvasClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      
      // Verificar si el clic fue en algún dispositivo
      let clickedDevice: NetworkDevice | null = null;
      
      // Revisar clic en router
      const distanceToRouter = Math.sqrt(
        Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
      );
      
      if (distanceToRouter <= nodeSize) {
        clickedDevice = mainRouter;
      } else {
        // Revisar clic en otros dispositivos
        otherDevices.forEach((device, i) => {
          const angle = i * angleStep;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          
          const distanceToDevice = Math.sqrt(
            Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2)
          );
          
          if (distanceToDevice <= nodeSize) {
            clickedDevice = device;
          }
        });
      }
      
      if (clickedDevice) {
        setSelectedDevice(clickedDevice);
        if (onSelectDevice) {
          onSelectDevice(Number(clickedDevice.id));
        }
      }
    };
    
    canvas.onclick = handleCanvasClick;
    
    // Limpiar event listener cuando el componente se desmonta
    return () => {
      canvas.onclick = null;
    };
  }, [devices, zoom, onSelectDevice]);

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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-gray-800">
          Mapa de la red
        </CardTitle>
        
        {devices.length > 0 && activeTab === "mapa" && (
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setZoom(Math.max(0.5, zoom - 0.2))} 
              variant="outline" 
              size="sm"
              className="h-8 w-8 p-0"
            >
              -
            </Button>
            <Button 
              onClick={() => setZoom(Math.min(2, zoom + 0.2))} 
              variant="outline" 
              size="sm"
              className="h-8 w-8 p-0"
            >
              +
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="border rounded-lg p-4 h-80 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full inline-block mb-3"></div>
              <p className="text-gray-500">Generando mapa de red...</p>
            </div>
          </div>
        ) : !devices.length ? (
          <div className="border rounded-lg p-4 h-80 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Network className="text-gray-400 text-4xl mb-3 mx-auto" />
              <p className="text-gray-500">
                El mapa de red se mostrará aquí después del escaneo.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <Tabs defaultValue="mapa" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 justify-center">
                <TabsTrigger value="mapa" className="flex gap-2 items-center">
                  <Network size={18} />
                  Mapa Visual
                </TabsTrigger>
                <TabsTrigger value="lista" className="flex gap-2 items-center">
                  <Server size={18} />
                  Lista de Dispositivos
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="mapa">
                <div className="border rounded-lg p-2 h-80 bg-gray-50 relative">
                  <canvas ref={canvasRef} className="w-full h-full"></canvas>
                  
                  {/* Leyenda de tipos de dispositivos */}
                  <div className="absolute bottom-2 left-2 p-2 bg-white rounded-lg border text-xs space-y-1 shadow-sm">
                    <p className="font-medium mb-1">Tipos de dispositivos:</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: typeColors.router}}></div>
                        <span>Router</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: typeColors.desktop}}></div>
                        <span>PC/Laptop</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: typeColors.smartphone}}></div>
                        <span>Móvil</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: typeColors.printer}}></div>
                        <span>Impresora</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: typeColors.server}}></div>
                        <span>Servidor</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: typeColors.iot_device}}></div>
                        <span>IoT</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Badge que indica dispositivos vulnerables */}
                  {devices.some(d => d.isVulnerable) && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute top-2 right-2">
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle size={14} />
                              {devices.filter(d => d.isVulnerable).length} vulnerables
                            </Badge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-sm">Los dispositivos con borde rojo tienen vulnerabilidades detectadas</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="lista">
                {renderDeviceList()}
              </TabsContent>
            </Tabs>
            
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
                      <Badge variant={selectedDevice.status === "active" ? "success" : "secondary"}>
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