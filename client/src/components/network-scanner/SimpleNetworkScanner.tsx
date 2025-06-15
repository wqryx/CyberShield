import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Wifi, 
  Search, 
  Settings, 
  AlertTriangle, 
  CheckCircle,
  Network,
  Clock,
  Shield
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { DeviceIcon } from "./DeviceIcon";

// Funciones auxiliares para análisis de seguridad
function getRiskLevel(device: any): 'high' | 'medium' | 'low' {
  if (device.isVulnerable) return 'high';
  if (device.ports && device.ports.length > 5) return 'medium';
  if (device.ports && device.ports.some((port: number) => [22, 23, 3389, 135, 445].includes(port))) return 'medium';
  return 'low';
}

function getPortRisk(port: number): 'danger' | 'warning' | 'safe' {
  const dangerousPorts = [23, 135, 139, 445, 3389, 5900];
  const warningPorts = [22, 21, 80, 443, 8080, 3306, 5432];
  
  if (dangerousPorts.includes(port)) return 'danger';
  if (warningPorts.includes(port)) return 'warning';
  return 'safe';
}

function getVulnerabilityDescription(device: any): string {
  const vulnerabilities = [];
  
  if (device.ports?.includes(23)) {
    vulnerabilities.push("Puerto Telnet (23) abierto - protocolo no cifrado");
  }
  if (device.ports?.includes(135)) {
    vulnerabilities.push("Puerto RPC (135) expuesto - riesgo de ataques remotos");
  }
  if (device.ports?.includes(445)) {
    vulnerabilities.push("Puerto SMB (445) abierto - vulnerabilidad conocida");
  }
  if (device.ports?.includes(3389)) {
    vulnerabilities.push("RDP (3389) habilitado - acceso remoto sin protección");
  }
  if (device.type === 'router' && device.ports?.includes(80)) {
    vulnerabilities.push("Panel de administración accesible por HTTP no seguro");
  }
  
  return vulnerabilities.length > 0 
    ? vulnerabilities.join('. ') 
    : "Configuración de seguridad potencialmente débil detectada";
}

function getSecurityRecommendation(device: any): string {
  const type = device.type?.toLowerCase();
  
  if (type === 'router') {
    return "Cambiar credenciales por defecto, actualizar firmware, deshabilitar WPS y usar WPA3";
  }
  if (type === 'computadora' || type === 'pc') {
    return "Instalar actualizaciones de seguridad, activar firewall y usar antivirus actualizado";
  }
  if (type === 'teléfono' || type === 'móvil') {
    return "Actualizar sistema operativo, revisar permisos de aplicaciones";
  }
  if (type === 'impresora') {
    return "Cambiar contraseña por defecto, actualizar firmware, limitar acceso de red";
  }
  
  return "Revisar configuración de seguridad, cambiar credenciales por defecto y mantener actualizado";
}

interface ScanSettings {
  scanType: string;
  ipRange: string;
  scanPorts: boolean;
  detectVulnerabilities: boolean;
  scanSpeed: number;
}

interface ScanResult {
  success: boolean;
  summary: {
    devicesFound: number;
    activeDevices: number;
    vulnerableDevices: number;
    scanTime: number;
    ipRange: string;
    ipScanned: number;
    portsScanned: number;
    totalOpenPorts: number;
  };
  statistics: {
    deviceTypes: Record<string, number>;
    commonPorts: number[];
  };
  devices: any[];
}

interface SimpleNetworkScannerProps {
  onScanComplete: () => void;
  onScanStart?: () => void;
  onScanResults?: (results: ScanResult) => void;
}

export function SimpleNetworkScanner({ onScanComplete, onScanStart, onScanResults }: SimpleNetworkScannerProps) {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [foundDevices, setFoundDevices] = useState<any[]>([]);
  
  const [settings, setSettings] = useState<ScanSettings>({
    scanType: "quick",
    ipRange: "192.168.1.0/24",
    scanPorts: true,
    detectVulnerabilities: true,
    scanSpeed: 50
  });

  const simulateProgressiveScanning = async () => {
    setScanProgress(0);
    setCurrentStep("Iniciando escaneo de red...");
    setFoundDevices([]);

    const steps = [
      { step: "Detectando rango de red...", progress: 10, delay: 500 },
      { step: "Enviando pings a direcciones IP...", progress: 25, delay: 800 },
      { step: "Analizando respuestas de hosts...", progress: 40, delay: 700 },
      { step: "Escaneando puertos abiertos...", progress: 60, delay: 1000 },
      { step: "Identificando tipos de dispositivos...", progress: 75, delay: 600 },
      { step: "Evaluando vulnerabilidades de seguridad...", progress: 90, delay: 800 },
      { step: "Finalizando análisis...", progress: 100, delay: 400 }
    ];

    // Simular progreso paso a paso
    for (const { step, progress, delay } of steps) {
      setCurrentStep(step);
      setScanProgress(progress);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Agregar dispositivos encontrados progresivamente
      if (progress === 25) {
        setFoundDevices([{ ip: "192.168.1.1", name: "Router", type: "Router" }]);
      } else if (progress === 40) {
        setFoundDevices(prev => [...prev, { ip: "192.168.1.100", name: "PC-Usuario", type: "Computadora" }]);
      } else if (progress === 60) {
        setFoundDevices(prev => [...prev, { ip: "192.168.1.55", name: "iPhone", type: "Teléfono" }]);
      } else if (progress === 75) {
        setFoundDevices(prev => [...prev, { ip: "192.168.1.200", name: "Impresora-HP", type: "Impresora" }]);
      }
    }

    // Realizar el escaneo real al final
    try {
      const response = await apiRequest("POST", "/api/network/scan", settings);
      const data = await response.json();
      console.log('Datos del escaneo recibidos:', data);
      setScanResults(data);
      
      if (onScanResults) {
        console.log('Ejecutando callback onScanResults');
        onScanResults(data);
      } else {
        console.log('No hay callback onScanResults definido');
      }
      
      toast({
        title: "Escaneo completado exitosamente",
        description: `Se analizaron ${data.summary?.devicesFound || 0} dispositivos. ${data.summary?.vulnerableDevices > 0 ? `¡${data.summary.vulnerableDevices} dispositivos vulnerables detectados!` : 'No se detectaron amenazas.'}`,
        variant: data.summary?.vulnerableDevices > 0 ? "destructive" : "default"
      });
    } catch (error) {
      console.error("Error en el escaneo:", error);
      toast({
        title: "Error en el escaneo",
        description: "No se pudo completar el escaneo de red",
        variant: "destructive",
      });
    }
  };

  const scanMutation = useMutation({
    mutationFn: simulateProgressiveScanning,
    onSettled: () => {
      setIsScanning(false);
      onScanComplete();
    },
  });

  const handleStartScan = () => {
    if (onScanStart) {
      onScanStart();
    }
    
    setIsScanning(true);
    scanMutation.mutate();
  };

  const updateSetting = (key: keyof ScanSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Control Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network className="h-6 w-6" />
              Escáner de Red
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Configuración expandible */}
            {showSettings && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ipRange">Rango de IP</Label>
                    <Input
                      id="ipRange"
                      value={settings.ipRange}
                      onChange={(e) => updateSetting('ipRange', e.target.value)}
                      placeholder="192.168.1.0/24"
                    />
                  </div>
                  <div>
                    <Label htmlFor="scanType">Tipo de escaneo</Label>
                    <select
                      id="scanType"
                      value={settings.scanType}
                      onChange={(e) => updateSetting('scanType', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="quick">Rápido</option>
                      <option value="full">Completo</option>
                      <option value="devices">Solo dispositivos</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="scanPorts"
                      checked={settings.scanPorts}
                      onCheckedChange={(checked) => updateSetting('scanPorts', checked)}
                    />
                    <Label htmlFor="scanPorts">Escanear puertos</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="detectVulnerabilities"
                      checked={settings.detectVulnerabilities}
                      onCheckedChange={(checked) => updateSetting('detectVulnerabilities', checked)}
                    />
                    <Label htmlFor="detectVulnerabilities">Detectar vulnerabilidades</Label>
                  </div>
                </div>
              </div>
            )}

            {/* Progreso en tiempo real */}
            {isScanning && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">{currentStep}</span>
                    <span className="text-gray-600 dark:text-gray-400">{scanProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>

                {/* Dispositivos encontrados en tiempo real */}
                {foundDevices.length > 0 && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Dispositivos detectados ({foundDevices.length}):
                    </h4>
                    <div className="space-y-2">
                      {foundDevices.map((device, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm bg-white dark:bg-gray-800 p-2 rounded border">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{device.ip}</span>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{device.name}</span>
                          <span className="text-blue-600 dark:text-blue-400 text-xs bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">{device.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Botón de escaneo */}
            <div className="flex justify-center">
              <Button
                onClick={handleStartScan}
                disabled={isScanning || scanMutation.isPending}
                size="lg"
                className="w-full max-w-md"
              >
                {isScanning ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Analizando red...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Iniciar Análisis de Seguridad
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados del escaneo */}
      {scanResults && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Resultados del Escaneo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {scanResults.summary.devicesFound}
                </div>
                <div className="text-sm text-muted-foreground">Dispositivos</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {scanResults.summary.activeDevices}
                </div>
                <div className="text-sm text-muted-foreground">Activos</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {scanResults.summary.vulnerableDevices}
                </div>
                <div className="text-sm text-muted-foreground">Vulnerables</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {scanResults.summary.scanTime.toFixed(1)}s
                </div>
                <div className="text-sm text-muted-foreground">Tiempo</div>
              </div>
            </div>

            {/* Análisis de Seguridad */}
            {scanResults.summary.vulnerableDevices > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <h4 className="font-semibold text-red-800 dark:text-red-200">
                    ¡Amenazas de Seguridad Detectadas!
                  </h4>
                </div>
                <p className="text-red-700 dark:text-red-300 text-sm mb-2">
                  Se han encontrado {scanResults.summary.vulnerableDevices} dispositivos con posibles vulnerabilidades de seguridad.
                </p>
                <div className="text-red-600 dark:text-red-400 text-sm">
                  <strong>Recomendación:</strong> Revise inmediatamente los dispositivos marcados como vulnerables y aplique las medidas de seguridad sugeridas.
                </div>
              </div>
            )}

            {/* Dispositivos Analizados */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Dispositivos Analizados ({scanResults.devices.length})
              </h4>
              
              <div className="space-y-3">
                {scanResults.devices.map((device, index) => {
                  const isVulnerable = device.isVulnerable;
                  const riskLevel = getRiskLevel(device);
                  
                  return (
                    <div key={index} className={`border rounded-lg p-4 ${
                      isVulnerable 
                        ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' 
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            device.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                          <div>
                            <h5 className="font-medium">{device.name}</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">{device.ip}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            riskLevel === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {riskLevel === 'high' ? 'Alto Riesgo' : 
                             riskLevel === 'medium' ? 'Riesgo Medio' : 'Seguro'}
                          </span>
                          {isVulnerable && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Tipo:</span>
                          <span className="ml-2 font-medium">{device.type}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">MAC:</span>
                          <span className="ml-2 font-mono text-xs">{device.mac || 'No detectada'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Puertos abiertos:</span>
                          <span className="ml-2 font-medium">{device.ports?.length || 0}</span>
                        </div>
                      </div>

                      {device.ports && device.ports.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium">Puertos detectados:</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {device.ports.slice(0, 10).map((port, portIndex) => {
                              const portRisk = getPortRisk(port);
                              return (
                                <span key={portIndex} className={`px-2 py-1 rounded text-xs font-mono ${
                                  portRisk === 'danger' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                  portRisk === 'warning' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                  'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                }`}>
                                  {port}
                                </span>
                              );
                            })}
                            {device.ports.length > 10 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                +{device.ports.length - 10} más
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {isVulnerable && (
                        <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 -mx-4 -mb-4 px-4 pb-4 rounded-b-lg">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                            <div>
                              <h6 className="font-medium text-red-800 dark:text-red-200 text-sm">
                                Posibles Vulnerabilidades Detectadas
                              </h6>
                              <p className="text-red-700 dark:text-red-300 text-xs mt-1">
                                {getVulnerabilityDescription(device)}
                              </p>
                              <p className="text-red-600 dark:text-red-400 text-xs mt-2">
                                <strong>Recomendación:</strong> {getSecurityRecommendation(device)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Información del escaneo */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h5 className="font-medium mb-2 text-sm">Detalles del Escaneo</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rango escaneado:</span>
                    <span className="font-mono">{scanResults.summary.ipRange}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IPs verificadas:</span>
                    <span>{scanResults.summary.ipScanned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Puertos analizados:</span>
                    <span>{scanResults.summary.portsScanned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tiempo de escaneo:</span>
                    <span>{scanResults.summary.scanTime}s</span>
                  </div>
                </div>
              </div>

              {Object.keys(scanResults.statistics.deviceTypes).length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium mb-2 text-sm">Tipos de dispositivos encontrados</h5>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(scanResults.statistics.deviceTypes).map(([type, count]) => (
                      <Badge key={type} variant="secondary" className="flex items-center gap-1">
                        <DeviceIcon type={type} className="h-3 w-3" />
                        <span className="capitalize">{type.replace('_', ' ')}</span>
                        <span>({count})</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}