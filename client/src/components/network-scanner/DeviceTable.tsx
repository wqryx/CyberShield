import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Info, Network } from "lucide-react";
import { getDeviceIcon } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export interface NetworkDevice {
  id: string;
  name: string;
  type: string;
  ip: string;
  mac: string;
  status: "active" | "inactive";
  ports: number[];
  isVulnerable?: boolean;
}

interface DeviceTableProps {
  devices: NetworkDevice[];
  onPortScan: (ip: string) => void;
}

export function DeviceTable({ devices, onPortScan }: DeviceTableProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const deviceDetailsMutation = useMutation({
    mutationFn: async (deviceId: string) => {
      const response = await apiRequest("GET", `/api/network/devices/${deviceId}`);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Detalles del dispositivo",
        description: `Información detallada para ${data.name}`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudieron cargar los detalles del dispositivo",
        variant: "destructive",
      });
    },
  });

  const handleDeviceDetails = (deviceId: string) => {
    deviceDetailsMutation.mutate(deviceId);
  };

  const filteredDevices = devices.filter(
    (device) =>
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.ip.includes(searchTerm) ||
      device.mac.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const Icon = (deviceType: string) => {
    const iconName = getDeviceIcon(deviceType);
    // This is a simplification, in a real app we would import the right icon
    return <i className={`fas fa-${iconName} text-gray-500 mr-3`}></i>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Dispositivos en la red
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Filtrar dispositivos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dispositivo
                </TableHead>
                <TableHead className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dirección IP
                </TableHead>
                <TableHead className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MAC
                </TableHead>
                <TableHead className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </TableHead>
                <TableHead className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Puertos abiertos
                </TableHead>
                <TableHead className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200">
              {filteredDevices.map((device) => (
                <TableRow
                  key={device.id}
                  className={`hover:bg-gray-50 ${
                    device.isVulnerable ? "bg-red-50" : ""
                  }`}
                >
                  <TableCell className="py-3 px-4">
                    <div className="flex items-center">
                      {Icon(device.type)}
                      <span className="text-sm text-gray-700">{device.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-sm text-gray-500">
                    {device.ip}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-sm text-gray-500">
                    {device.mac}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        device.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {device.status === "active" ? "Activo" : "Inactivo"}
                    </span>
                  </TableCell>
                  <TableCell
                    className={`py-3 px-4 text-sm ${
                      device.isVulnerable ? "text-red-500 font-medium" : "text-gray-500"
                    }`}
                  >
                    {device.ports.join(", ")}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-primary hover:text-blue-700"
                        onClick={() => onPortScan(device.ip)}
                        title="Escanear puertos"
                      >
                        <Network className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-primary hover:text-blue-700"
                        onClick={() => handleDeviceDetails(device.id)}
                        title="Detalles"
                        disabled={deviceDetailsMutation.isPending}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
