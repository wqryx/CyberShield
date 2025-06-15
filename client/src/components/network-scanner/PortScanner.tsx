import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getPortRiskLevel, getPortServiceName } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, AlertTriangle, ShieldAlert, Server } from "lucide-react";

interface PortScannerProps {
  initialIp?: string;
}

interface OpenPort {
  port: number;
  service: string;
  risk: "safe" | "warning" | "danger";
}

export function PortScanner({ initialIp }: PortScannerProps) {
  const { toast } = useToast();
  const [targetIp, setTargetIp] = useState<string>(initialIp || "192.168.1.1");
  const [portRange, setPortRange] = useState<string>("1-1024");
  const [onlyCommonPorts, setOnlyCommonPorts] = useState<boolean>(true);
  const [openPorts, setOpenPorts] = useState<OpenPort[]>([]);
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Actualizar IP si cambia el prop
  useEffect(() => {
    if (initialIp) {
      setTargetIp(initialIp);
    }
  }, [initialIp]);

  const scanPortsMutation = useMutation({
    mutationFn: async () => {
      const queryParams = onlyCommonPorts
        ? { ip: targetIp, commonOnly: "true" }
        : { ip: targetIp, portRange };

      const response = await apiRequest(
        "POST",
        `/api/network/scan-ports`,
        queryParams
      );
      return response.json();
    },
    onSuccess: (data) => {
      if (data.openPorts && Array.isArray(data.openPorts)) {
        const formattedPorts = data.openPorts.map((port: number) => ({
          port,
          service: getPortServiceName(port),
          risk: getPortRiskLevel(port),
        }));
        setOpenPorts(formattedPorts);
        setActiveTab("results");
      } else {
        setOpenPorts([]);
      }

      toast({
        title: "Escaneo completado",
        description: `Se completó el escaneo de ${targetIp}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error en el escaneo",
        description: `No se pudo completar el escaneo: ${error}`,
        variant: "destructive",
      });
    },
  });

  const handleScan = () => {
    setOpenPorts([]);
    scanPortsMutation.mutate();
  };

  // Contar puertos por nivel de riesgo
  const riskCounts = {
    high: openPorts.filter(p => p.risk === "danger").length,
    medium: openPorts.filter(p => p.risk === "warning").length,
    low: openPorts.filter(p => p.risk === "safe").length
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Análisis de Puertos</CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs font-normal">
            {targetIp}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Principal</TabsTrigger>
            <TabsTrigger value="scan">Configuración</TabsTrigger>
            <TabsTrigger value="results" disabled={openPorts.length === 0 && !scanPortsMutation.isPending}>
              Resultados
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Input
                  value={targetIp}
                  onChange={(e) => setTargetIp(e.target.value)}
                  placeholder="192.168.1.1"
                  disabled={scanPortsMutation.isPending}
                  className="max-w-[250px]"
                />
                <Button
                  onClick={handleScan}
                  disabled={scanPortsMutation.isPending}
                  size="sm"
                >
                  {scanPortsMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Escanear"
                  )}
                </Button>
              </div>
              
              {scanPortsMutation.isPending ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <p className="text-sm text-gray-500">Escaneando puertos en {targetIp}...</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Este proceso puede tardar hasta un minuto
                  </p>
                </div>
              ) : openPorts.length > 0 ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col items-center justify-center p-3 border rounded-md bg-gray-50">
                      <div className="flex items-center mb-1">
                        <Server className="h-4 w-4 text-primary mr-1" />
                        <span className="text-sm font-medium">Total</span>
                      </div>
                      <p className="text-2xl font-bold">{openPorts.length}</p>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center p-3 border rounded-md bg-red-50">
                      <div className="flex items-center mb-1">
                        <ShieldAlert className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-sm font-medium">Alto riesgo</span>
                      </div>
                      <p className="text-2xl font-bold text-red-500">{riskCounts.high}</p>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center p-3 border rounded-md bg-yellow-50">
                      <div className="flex items-center mb-1">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">Medio</span>
                      </div>
                      <p className="text-2xl font-bold text-yellow-500">{riskCounts.medium}</p>
                    </div>
                  </div>
                  
                  <div className="border rounded-md overflow-hidden">
                    <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium">
                      Puertos de riesgo detectados
                    </div>
                    <div className="max-h-[180px] overflow-y-auto p-2">
                      {openPorts
                        .filter(port => port.risk !== "safe")
                        .slice(0, 5)
                        .map(port => (
                          <div key={port.port} className="flex justify-between p-2 border-b last:border-0">
                            <div>
                              <span className="font-medium">{port.port}</span>
                              <span className="text-xs text-gray-500 ml-2">{port.service}</span>
                            </div>
                            <Badge 
                              variant={port.risk === "danger" ? "destructive" : "outline"}
                              className="text-xs"
                            >
                              {port.risk === "danger" ? "Alto" : "Medio"}
                            </Badge>
                          </div>
                        ))}
                      {openPorts.filter(port => port.risk !== "safe").length > 5 && (
                        <Button 
                          variant="ghost" 
                          className="w-full mt-1 h-8 text-xs"
                          onClick={() => setActiveTab("results")}
                        >
                          Ver todos
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <Shield className="h-12 w-12 text-gray-300 mb-2" />
                  <p className="text-gray-500">
                    {scanPortsMutation.isSuccess 
                      ? "No se encontraron puertos abiertos"
                      : "Escanea los puertos del dispositivo para identificar vulnerabilidades"}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="scan" className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="targetIp">Dirección IP</Label>
                <Input
                  id="targetIp"
                  value={targetIp}
                  onChange={(e) => setTargetIp(e.target.value)}
                  placeholder="192.168.1.1"
                  disabled={scanPortsMutation.isPending}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="portRange" className="text-sm">Rango de puertos</Label>
                  <Input
                    id="portRange"
                    value={portRange}
                    onChange={(e) => setPortRange(e.target.value)}
                    placeholder="1-1024"
                    disabled={scanPortsMutation.isPending || onlyCommonPorts}
                    className="text-sm"
                  />
                </div>
                
                <div className="flex items-end">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="commonPorts"
                      checked={onlyCommonPorts}
                      onCheckedChange={(checked) => {
                        setOnlyCommonPorts(checked as boolean);
                      }}
                      disabled={scanPortsMutation.isPending}
                    />
                    <Label htmlFor="commonPorts" className="text-sm">Solo puertos comunes</Label>
                  </div>
                </div>
              </div>
              
              <div className="pt-1">
                <Button
                  onClick={handleScan}
                  disabled={scanPortsMutation.isPending}
                  className="w-full"
                >
                  {scanPortsMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Escaneando...
                    </>
                  ) : (
                    "Iniciar escaneo"
                  )}
                </Button>
              </div>
              
              <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded-md">
                <p className="font-medium text-blue-600 mb-1">Información:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>El escaneo de puertos permite detectar servicios vulnerables</li>
                  <li>Usar "Solo puertos comunes" es más rápido (80, 443, 22, etc.)</li>
                  <li>Para un análisis exhaustivo, usa rangos completos (1-1024 o 1-65535)</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            {openPorts.length > 0 ? (
              <div className="space-y-3">
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Puerto
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Servicio
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Riesgo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {openPorts.map((port) => (
                        <tr key={port.port} className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                            {port.port}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {port.service}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs">
                            <Badge
                              variant={
                                port.risk === "danger"
                                  ? "destructive"
                                  : port.risk === "warning"
                                  ? "default"
                                  : "outline"
                              }
                              className="text-xs font-normal"
                            >
                              {port.risk === "danger"
                                ? "Alto"
                                : port.risk === "warning"
                                ? "Medio"
                                : "Bajo"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-500 px-1">
                  <span>Total: {openPorts.length} puertos abiertos</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={() => {
                      setActiveTab("overview");
                    }}
                  >
                    Volver al resumen
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <Shield className="h-10 w-10 text-gray-300 mb-2" />
                <p className="text-gray-500">No hay resultados disponibles</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}