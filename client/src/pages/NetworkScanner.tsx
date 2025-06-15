import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { SimpleNetworkScanner } from "@/components/network-scanner/SimpleNetworkScanner";
import { DeviceTable, NetworkDevice } from "@/components/network-scanner/DeviceTable";
import { PortScanner } from "@/components/network-scanner/PortScanner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Network, AlertTriangle, Shield, ArrowLeft, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeviceIcon } from "@/components/network-scanner/DeviceIcon";
import { 
  VulnerabilityAlert, 
  Vulnerability 
} from "@/components/network-scanner/VulnerabilityAlert";
import { useToast } from "@/hooks/use-toast";

interface ScanHistory {
  id: string;
  name: string;
  date: string;
  time: string;
  results: any;
  summary: any;
}

const SCAN_HISTORY_KEY = 'cybershield_scan_history';

// Función para cargar historial inicial
const loadInitialHistory = (): ScanHistory[] => {
  try {
    const savedHistory = localStorage.getItem(SCAN_HISTORY_KEY);
    if (savedHistory) {
      return JSON.parse(savedHistory);
    }
  } catch (error) {
    console.error('Error loading initial scan history:', error);
  }
  return [];
};

export default function NetworkScanner() {
  const { toast } = useToast();
  const [selectedIp, setSelectedIp] = useState<string | null>(null);
  const [showPortScanner, setShowPortScanner] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [scanHistory, setScanHistory] = useState<ScanHistory[]>(loadInitialHistory);

  // Efecto para guardar historial en localStorage
  useEffect(() => {
    if (scanHistory.length > 0) {
      localStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(scanHistory));
    }
  }, [scanHistory]);

  const onScanComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const onScanResults = (results: any) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-ES');
    const timeStr = now.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const newScan: ScanHistory = {
      id: `scan-${Date.now()}`,
      name: `Escaneo de ${dateStr}`,
      date: dateStr,
      time: timeStr,
      results: results,
      summary: results.summary
    };
    
    // Actualizar estado y localStorage inmediatamente
    setScanHistory(prev => {
      const updated = [newScan, ...prev];
      
      // Guardar directamente en localStorage
      try {
        localStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving scan history:', error);
      }
      
      return updated;
    });
  };

  const clearHistory = () => {
    setScanHistory([]);
    localStorage.removeItem(SCAN_HISTORY_KEY);
    toast({
      title: "Historial borrado",
      description: "Se ha eliminado todo el historial de escaneos",
    });
  };

  const { data: devices } = useQuery<NetworkDevice[]>({
    queryKey: ["/api/network/devices", refreshTrigger],
    retry: false,
  });

  const { data: vulnerabilities } = useQuery<Vulnerability[]>({
    queryKey: ["/api/network/vulnerabilities", refreshTrigger],
    retry: false,
  });

  const handleDeviceSelect = (device: NetworkDevice) => {
    setSelectedIp(device.ip);
    setShowPortScanner(true);
  };

  const handleBackToScanner = () => {
    setShowPortScanner(false);
    setSelectedIp(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Escáner de Red</h1>
          <p className="text-muted-foreground">
            Analiza tu red local para identificar dispositivos y posibles vulnerabilidades.
          </p>
        </div>
        {showPortScanner && (
          <Button variant="outline" onClick={handleBackToScanner}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al escáner
          </Button>
        )}
      </div>

      {!showPortScanner ? (
        <>
          {/* Escáner principal */}
          <SimpleNetworkScanner 
            onScanComplete={onScanComplete}
            onScanResults={onScanResults}
          />

          {/* Alertas de vulnerabilidades */}
          {vulnerabilities && vulnerabilities.length > 0 && (
            <VulnerabilityAlert
              vulnerabilities={vulnerabilities}
              onViewDetails={() => {}}
            />
          )}

          {/* Lista de dispositivos encontrados */}
          {devices && devices.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Network className="h-6 w-6" />
                  Dispositivos Encontrados ({devices.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {devices.map((device) => (
                    <div 
                      key={device.id} 
                      className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleDeviceSelect(device)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${device.isVulnerable ? 'bg-red-100 dark:bg-red-900/20' : 'bg-blue-100 dark:bg-blue-900/20'}`}>
                            <DeviceIcon 
                              type={device.type} 
                              className={`h-5 w-5 ${device.isVulnerable ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`} 
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{device.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {device.ip} • {device.mac}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={device.status === 'active' ? 'default' : 'secondary'}>
                            {device.status === 'active' ? 'Activo' : 'Inactivo'}
                          </Badge>
                          {device.isVulnerable && (
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Vulnerable
                            </Badge>
                          )}
                          {device.ports && device.ports.length > 0 && (
                            <Badge variant="outline">
                              {device.ports.length} puertos
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {device.ports && device.ports.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm text-muted-foreground mb-2">Puertos abiertos:</p>
                          <div className="flex flex-wrap gap-1">
                            {device.ports.slice(0, 10).map((port) => (
                              <Badge key={port} variant="outline" className="text-xs">
                                {port}
                              </Badge>
                            ))}
                            {device.ports.length > 10 && (
                              <Badge variant="outline" className="text-xs">
                                +{device.ports.length - 10} más
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Estado vacío cuando no hay dispositivos */}
          {devices && devices.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Network className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No se encontraron dispositivos</h3>
                <p className="text-muted-foreground mb-4">
                  Ejecuta un escaneo para descubrir dispositivos en tu red local.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Historial de Escaneos - Siempre visible */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Calendar className="h-6 w-6" />
                  Historial de Escaneos ({scanHistory.length})
                </CardTitle>
                {scanHistory.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearHistory}
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    Limpiar Historial
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {scanHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Sin escaneos guardados</h3>
                  <p className="text-muted-foreground">
                    Los escaneos que realices se guardarán aquí automáticamente con fecha y hora.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {scanHistory.map((scan) => (
                    <div key={scan.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {scan.name}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {scan.time} • {scan.summary.devicesFound} dispositivos • {scan.summary.scanTime}s
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {scan.summary.vulnerableDevices > 0 && (
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {scan.summary.vulnerableDevices} vulnerables
                            </Badge>
                          )}
                          <Badge variant="secondary">
                            {scan.summary.activeDevices} activos
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Resumen rápido del escaneo */}
                      <div className="grid grid-cols-4 gap-3 mb-4 p-3 bg-white dark:bg-gray-900 rounded border">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {scan.summary.devicesFound}
                          </div>
                          <div className="text-xs text-muted-foreground">Total</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            {scan.summary.activeDevices}
                          </div>
                          <div className="text-xs text-muted-foreground">Activos</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-600 dark:text-red-400">
                            {scan.summary.vulnerableDevices}
                          </div>
                          <div className="text-xs text-muted-foreground">Peligrosos</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            {scan.summary.totalOpenPorts}
                          </div>
                          <div className="text-xs text-muted-foreground">Puertos</div>
                        </div>
                      </div>

                      {/* Lista detallada de dispositivos */}
                      {scan.results.devices && scan.results.devices.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <Network className="h-4 w-4" />
                            Dispositivos detectados en este escaneo:
                          </h5>
                          <div className="space-y-2">
                            {scan.results.devices.map((device: any, index: number) => (
                              <div key={index} className={`flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded border ${
                                device.isVulnerable ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' : ''
                              }`}>
                                <div className="flex items-center gap-3">
                                  <div className={`w-3 h-3 rounded-full ${
                                    device.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                  }`} />
                                  <div className="flex items-center gap-2">
                                    <DeviceIcon type={device.type} className="h-4 w-4" />
                                    <div>
                                      <span className="text-sm font-medium">{device.name}</span>
                                      <span className="text-xs text-muted-foreground font-mono ml-2">{device.ip}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {device.type}
                                  </Badge>
                                  {device.isVulnerable && (
                                    <Badge variant="destructive" className="text-xs">
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                      Vulnerable
                                    </Badge>
                                  )}
                                  {device.ports && device.ports.length > 0 && (
                                    <span className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                      {device.ports.length} puertos abiertos
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Resumen de amenazas si hay dispositivos vulnerables */}
                          {scan.results.devices.some((d: any) => d.isVulnerable) && (
                            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                              <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                                <AlertTriangle className="h-4 w-4" />
                                <span className="text-sm font-medium">Amenazas detectadas en este escaneo</span>
                              </div>
                              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                                Se encontraron dispositivos con vulnerabilidades de seguridad que requieren atención inmediata.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        /* Escáner de puertos para dispositivo seleccionado */
        selectedIp && (
          <PortScanner initialIp={selectedIp} />
        )
      )}
    </div>
  );
}