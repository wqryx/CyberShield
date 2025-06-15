import { PhishingTest } from "@/components/phishing-simulator/PhishingTest";
import { PhishingStats } from "@/components/phishing-simulator/PhishingStats";
import { PhishingIndicators } from "@/components/phishing-simulator/PhishingIndicators";
import { PhishingResources } from "@/components/phishing-simulator/PhishingResources";
import { Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PhishingSimulator() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Shield className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-semibold">
            Simulador de Phishing
          </h1>
        </div>
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded-full text-sm font-medium">
          Modo educativo
        </span>
      </div>

      <p className="text-muted-foreground">
        Aprende a identificar correos fraudulentos con nuestros ejemplos prácticos y recursos educativos.
      </p>

      <PhishingTest />
      
      <div className="pt-2">
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stats">Estadísticas</TabsTrigger>
            <TabsTrigger value="indicators">Indicadores</TabsTrigger>
            <TabsTrigger value="resources">Recursos Educativos</TabsTrigger>
          </TabsList>
          <TabsContent value="stats">
            <PhishingStats />
          </TabsContent>
          <TabsContent value="indicators">
            <PhishingIndicators />
          </TabsContent>
          <TabsContent value="resources">
            <PhishingResources />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
