import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Save, 
  Wifi, 
  Shield, 
  ChevronDown, 
  BellRing, 
  Clock, 
  Zap, 
  X, 
  Copy 
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useMobile } from "@/hooks/use-mobile";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ScannerControlsProps {
  onScanComplete: () => void;
  onScanStart?: () => void;
  onScanResults?: (results: any) => void;
}

// Tipos de configuración
interface ScanProfile {
  id: string;
  name: string;
  scanType: string;
  ipRange: string;
  scanPorts: boolean;
  portRanges: string[];
  scanSpeed: number;
  scheduledScan: boolean;
  scanInterval: "daily" | "weekly" | "monthly";
  notifyOnCompletion: boolean;
  detectVulnerabilities: boolean;
}

// Perfiles predefinidos
const defaultProfiles: ScanProfile[] = [
  {
    id: "default-quick",
    name: "Escaneo Rápido",
    scanType: "quick",
    ipRange: "192.168.1.0/24",
    scanPorts: false,
    portRanges: ["1-1024"],
    scanSpeed: 70,
    scheduledScan: false,
    scanInterval: "weekly",
    notifyOnCompletion: true,
    detectVulnerabilities: true
  },
  {
    id: "default-full",
    name: "Escaneo Completo",
    scanType: "full",
    ipRange: "192.168.1.0/24",
    scanPorts: true,
    portRanges: ["1-1024", "1025-5000", "5001-10000"],
    scanSpeed: 40,
    scheduledScan: false,
    scanInterval: "weekly",
    notifyOnCompletion: true,
    detectVulnerabilities: true
  },
  {
    id: "default-stealth",
    name: "Escaneo Sigiloso",
    scanType: "devices",
    ipRange: "192.168.1.0/24",
    scanPorts: true,
    portRanges: ["20-25", "80-443", "3389"],
    scanSpeed: 20,
    scheduledScan: false,
    scanInterval: "weekly",
    notifyOnCompletion: true,
    detectVulnerabilities: true
  }
];

export function ScannerControls({ onScanComplete, onScanStart, onScanResults }: ScannerControlsProps) {
  const { toast } = useToast();
  const { isMobile } = useMobile();
  
  // Estado principal
  const [profiles, setProfiles] = useState<ScanProfile[]>(() => {
    const savedProfiles = localStorage.getItem('scanProfiles');
    return savedProfiles ? JSON.parse(savedProfiles) : defaultProfiles;
  });
  
  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    const savedProfileId = localStorage.getItem('activeScanProfileId');
    return savedProfileId || "default-quick";
  });
  
  const [showConfigDialog, setShowConfigDialog] = useState<boolean>(false);
  const [editingProfile, setEditingProfile] = useState<ScanProfile | null>(null);
  const [newProfileName, setNewProfileName] = useState<string>("");
  
  // Estado para la UI
  const [scanProgress, setScanProgress] = useState<number | null>(null);
  const [currentScannedIp, setCurrentScannedIp] = useState<string | null>(null);
  const [scanResults, setScanResults] = useState<{
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
      scanSettings: {
        scanType: string;
        scanPorts: boolean;
        detectVulnerabilities: boolean;
        scanSpeed: number;
      };
    };
  } | null>(null);
  
  // Obtener perfil activo
  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];
  
  // Mutación para el escaneo
  const scanMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/network/scan", {
        scanType: activeProfile.scanType,
        ipRange: activeProfile.ipRange,
        scanPorts: activeProfile.scanPorts,
        portRanges: activeProfile.scanPorts ? activeProfile.portRanges : [],
        scanSpeed: activeProfile.scanSpeed,
        detectVulnerabilities: activeProfile.detectVulnerabilities
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Escaneo completado",
        description: `Se encontraron ${data.devicesFound} dispositivos en la red`,
      });
      
      const scanResultsData = {
        summary: data.summary || {
          devicesFound: 0,
          activeDevices: 0,
          vulnerableDevices: 0,
          scanTime: 0,
          ipRange: '',
          ipScanned: 0,
          portsScanned: 0,
          totalOpenPorts: 0
        },
        statistics: data.statistics || {
          deviceTypes: {},
          commonPorts: [],
          scanSettings: {
            scanType: '',
            scanPorts: false,
            detectVulnerabilities: false,
            scanSpeed: 0
          }
        }
      };
      
      setScanResults(scanResultsData);
      
      // Pass results to parent component
      if (onScanResults) {
        onScanResults(scanResultsData);
      }
      
      setScanProgress(null);
      setCurrentScannedIp(null);
      onScanComplete();
      
      // Notificar si está configurado
      if (activeProfile.notifyOnCompletion) {
        // Simular notificación
        setTimeout(() => {
          toast({
            title: "Informe de Seguridad",
            description: "Tu informe de seguridad de red está listo para revisar",
          });
        }, 3000);
      }
    },
    onError: (error) => {
      toast({
        title: "Error de escaneo",
        description: "No se pudo completar el escaneo de red",
        variant: "destructive",
      });
      setScanProgress(null);
      setCurrentScannedIp(null);
    },
  });

  // Iniciar escaneo
  const handleStartScan = () => {
    // Notificar al componente padre que inicia el escaneo
    if (onScanStart) {
      onScanStart();
    }
    
    // Iniciar la petición de escaneo
    scanMutation.mutate();
    
    // Calcular duración del escaneo basado en la velocidad
    const scanDuration = 15000 - (activeProfile.scanSpeed * 100); 
    const intervalTime = scanDuration / 100;
    
    // Mostrar progreso
    setScanProgress(0);
    setScanResults(null);
    
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const nextProgress = prev !== null ? prev + 1 : 0;
        if (nextProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        // Actualizar IP actual siendo escaneada
        if (nextProgress % 5 === 0) {
          const ipParts = activeProfile.ipRange.split('.');
          const baseIp = ipParts[0] && ipParts[1] && ipParts[2] 
            ? `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.` 
            : "192.168.1.";
          const lastPart = Math.floor(Math.random() * 254) + 1;
          setCurrentScannedIp(`${baseIp}${lastPart}`);
        }
        
        return nextProgress;
      });
    }, intervalTime);
  };
  
  // Guardar configuración
  const saveProfileToStorage = (profiles: ScanProfile[], activeId: string) => {
    localStorage.setItem('scanProfiles', JSON.stringify(profiles));
    localStorage.setItem('activeScanProfileId', activeId);
  };
  
  // Gestión de perfiles
  const handleProfileSelect = (profileId: string) => {
    setActiveProfileId(profileId);
    saveProfileToStorage(profiles, profileId);
  };
  
  const handleEditProfile = (profile: ScanProfile) => {
    setEditingProfile({...profile});
    setNewProfileName(profile.name);
    setShowConfigDialog(true);
  };
  
  const handleCreateProfile = () => {
    const newProfile = {...activeProfile, 
      id: `custom-${Date.now()}`,
      name: "Nuevo Perfil"
    };
    setEditingProfile(newProfile);
    setNewProfileName("Nuevo Perfil");
    setShowConfigDialog(true);
  };
  
  const handleSaveProfile = () => {
    if (!editingProfile) return;
    
    const updatedProfile = {...editingProfile, name: newProfileName || editingProfile.name};
    
    // Actualizar o crear perfil
    const profileExists = profiles.some(p => p.id === updatedProfile.id);
    let newProfiles;
    
    if (profileExists) {
      newProfiles = profiles.map(p => p.id === updatedProfile.id ? updatedProfile : p);
    } else {
      newProfiles = [...profiles, updatedProfile];
    }
    
    setProfiles(newProfiles);
    setActiveProfileId(updatedProfile.id);
    saveProfileToStorage(newProfiles, updatedProfile.id);
    setShowConfigDialog(false);
  };
  
  const handleDeleteProfile = (profileId: string) => {
    // No permitir eliminar perfiles predefinidos
    if (profileId.startsWith('default-')) {
      toast({
        title: "Acción no permitida",
        description: "No se pueden eliminar los perfiles predefinidos",
        variant: "destructive",
      });
      return;
    }
    
    const newProfiles = profiles.filter(p => p.id !== profileId);
    
    // Si eliminamos el perfil activo, seleccionar el primero
    const newActiveId = profileId === activeProfileId ? newProfiles[0].id : activeProfileId;
    
    setProfiles(newProfiles);
    setActiveProfileId(newActiveId);
    saveProfileToStorage(newProfiles, newActiveId);
  };
  
  // JSX para el diálogo de configuración
  const renderConfigDialog = () => {
    if (!editingProfile) return null;
    
    return (
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Configuración de Perfil de Escaneo
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="general" className="mt-4">
            <TabsList className="mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="advanced">Avanzado</TabsTrigger>
              <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Nombre del perfil</Label>
                  <Input 
                    id="profile-name"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    placeholder="Nombre descriptivo para este perfil"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="scan-type">Tipo de escaneo</Label>
                  <Select
                    value={editingProfile.scanType}
                    onValueChange={(value) => setEditingProfile({...editingProfile, scanType: value})}
                  >
                    <SelectTrigger id="scan-type">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quick">Escaneo rápido</SelectItem>
                      <SelectItem value="full">Escaneo completo</SelectItem>
                      <SelectItem value="ports">Escaneo de puertos</SelectItem>
                      <SelectItem value="devices">Solo dispositivos activos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ip-range">Rango de direcciones IP</Label>
                  <Input
                    id="ip-range"
                    value={editingProfile.ipRange}
                    onChange={(e) => setEditingProfile({...editingProfile, ipRange: e.target.value})}
                    placeholder="192.168.1.0/24 o 192.168.1.1-192.168.1.254"
                  />
                  <p className="text-xs text-gray-500">
                    Formato: 192.168.1.0/24, 192.168.1.1-254, o una IP específica
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="detect-vulnerabilities"
                      checked={editingProfile.detectVulnerabilities}
                      onCheckedChange={(checked) => setEditingProfile({
                        ...editingProfile, 
                        detectVulnerabilities: checked === true
                      })}
                    />
                    <Label htmlFor="detect-vulnerabilities">Detectar vulnerabilidades de seguridad</Label>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="scan-ports"
                        checked={editingProfile.scanPorts}
                        onCheckedChange={(checked) => setEditingProfile({
                          ...editingProfile, 
                          scanPorts: checked === true
                        })}
                      />
                      <Label htmlFor="scan-ports">Escanear puertos</Label>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-gray-500 cursor-help">?</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-60 text-xs">
                            Escanea puertos abiertos en los dispositivos detectados.
                            Esto puede detectar servicios vulnerables.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
                {editingProfile.scanPorts && (
                  <div className="pl-6 space-y-2">
                    <Label>Rangos de puertos a escanear</Label>
                    {editingProfile.portRanges.map((range, index) => (
                      <div key={index} className="flex items-center space-x-2 mt-1">
                        <Input
                          value={range}
                          onChange={(e) => {
                            const newRanges = [...editingProfile.portRanges];
                            newRanges[index] = e.target.value;
                            setEditingProfile({...editingProfile, portRanges: newRanges});
                          }}
                          placeholder="1-1024"
                          className="max-w-xs"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newRanges = editingProfile.portRanges.filter((_, i) => i !== index);
                            setEditingProfile({...editingProfile, portRanges: newRanges});
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-1"
                      onClick={() => {
                        setEditingProfile({
                          ...editingProfile, 
                          portRanges: [...editingProfile.portRanges, "1-1024"]
                        });
                      }}
                    >
                      Añadir rango
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">
                      Ejemplos: 1-1024 (puertos comunes), 1-65535 (todos), 80,443,8080 (específicos)
                    </p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="scan-speed">Velocidad de escaneo</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm">Sigiloso</span>
                    <Slider
                      id="scan-speed"
                      value={[editingProfile.scanSpeed]}
                      min={10}
                      max={100}
                      step={10}
                      className="flex-1"
                      onValueChange={(values) => setEditingProfile({
                        ...editingProfile, 
                        scanSpeed: values[0]
                      })}
                    />
                    <span className="text-sm">Rápido</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Un escaneo más lento es menos detectable pero tarda más tiempo
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between space-x-4">
                  <Label htmlFor="notify-completion">Notificar al completar el escaneo</Label>
                  <Switch
                    id="notify-completion"
                    checked={editingProfile.notifyOnCompletion}
                    onCheckedChange={(checked) => setEditingProfile({
                      ...editingProfile, 
                      notifyOnCompletion: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-4">
                  <Label htmlFor="scheduled-scan">Programar escaneos periódicos</Label>
                  <Switch
                    id="scheduled-scan"
                    checked={editingProfile.scheduledScan}
                    onCheckedChange={(checked) => setEditingProfile({
                      ...editingProfile, 
                      scheduledScan: checked
                    })}
                  />
                </div>
                
                {editingProfile.scheduledScan && (
                  <div className="pl-6 space-y-2">
                    <Label htmlFor="scan-interval">Frecuencia</Label>
                    <Select
                      value={editingProfile.scanInterval}
                      onValueChange={(value: "daily" | "weekly" | "monthly") => setEditingProfile({
                        ...editingProfile, 
                        scanInterval: value
                      })}
                    >
                      <SelectTrigger id="scan-interval">
                        <SelectValue placeholder="Seleccionar frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Diario</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensual</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="mt-2 p-3 bg-amber-50 text-amber-800 rounded-md text-sm">
                      <p><strong>Nota:</strong> Esta función estará disponible próximamente.</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfigDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveProfile}>
              <Save className="mr-2 h-4 w-4" />
              Guardar perfil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex justify-between">
          <span>Opciones de escaneo</span>
          {scanResults && (
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Último escaneo: {scanResults.summary.devicesFound} dispositivos en {scanResults.summary.scanTime.toFixed(1)}s
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Selector de perfiles */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <Label className="mb-2 block">Perfil de escaneo</Label>
              <div className="flex space-x-2">
                <Select
                  value={activeProfileId}
                  onValueChange={handleProfileSelect}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Seleccionar perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.map(profile => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-52 p-2">
                    <div className="grid gap-1">
                      <Button 
                        variant="ghost" 
                        className="justify-start text-sm font-normal"
                        onClick={() => handleEditProfile(activeProfile)}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Editar perfil
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="justify-start text-sm font-normal"
                        onClick={handleCreateProfile}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Crear nuevo perfil
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="justify-start text-sm font-normal text-red-600"
                        onClick={() => handleDeleteProfile(activeProfileId)}
                        disabled={activeProfileId.startsWith('default-')}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Eliminar perfil
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="flex-1">
              <Label className="mb-2 block">Configuración rápida</Label>
              <div className="grid grid-cols-3 gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        onClick={() => handleStartScan()}
                        disabled={scanMutation.isPending || scanProgress !== null}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        <span className="truncate">Iniciar</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Iniciar escaneo</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        onClick={() => handleEditProfile(activeProfile)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        <span className="truncate">Ajustes</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Configurar opciones</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        disabled={true}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="truncate">Programar</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Programar escaneo (Próximamente)</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
          
          {/* Acordeón con detalles */}
          <Accordion type="single" collapsible className="border rounded-lg">
            <AccordionItem value="details">
              <AccordionTrigger className="px-4 py-2">
                <span className="text-sm font-medium">Detalles del perfil actual</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Nombre:</span>
                      <span className="text-sm font-medium">{activeProfile.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Tipo:</span>
                      <span className="text-sm font-medium">
                        {activeProfile.scanType === 'quick' && 'Escaneo rápido'}
                        {activeProfile.scanType === 'full' && 'Escaneo completo'}
                        {activeProfile.scanType === 'ports' && 'Escaneo de puertos'}
                        {activeProfile.scanType === 'devices' && 'Solo dispositivos activos'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Rango IP:</span>
                      <span className="text-sm font-medium">{activeProfile.ipRange}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Velocidad:</span>
                      <div>
                        {activeProfile.scanSpeed < 30 && (
                          <span className="text-sm font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Sigiloso</span>
                        )}
                        {activeProfile.scanSpeed >= 30 && activeProfile.scanSpeed < 70 && (
                          <span className="text-sm font-medium bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Equilibrado</span>
                        )}
                        {activeProfile.scanSpeed >= 70 && (
                          <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Rápido</span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Escaneo de puertos:</span>
                      <span className="text-sm font-medium">
                        {activeProfile.scanPorts ? 'Activado' : 'Desactivado'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Detección de vulnerabilidades:</span>
                      <span className="text-sm font-medium">
                        {activeProfile.detectVulnerabilities ? 'Activado' : 'Desactivado'}
                      </span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          {/* Progreso del escaneo */}
          {scanProgress !== null && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <Wifi className="h-4 w-4 text-primary animate-pulse mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    {scanProgress < 100 ? "Escaneando red..." : "Escaneo completado"}
                  </span>
                </div>
                <span className="text-sm text-gray-600">{scanProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-150"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  {currentScannedIp && (
                    <span className="flex items-center">
                      <Shield className="h-3 w-3 mr-1" />
                      Analizando: {currentScannedIp}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {scanProgress < 100 && "Tiempo restante: ~" + Math.ceil((100 - scanProgress) / 5) + " segundos"}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Diálogo de configuración */}
      {renderConfigDialog()}
    </Card>
  );
}
