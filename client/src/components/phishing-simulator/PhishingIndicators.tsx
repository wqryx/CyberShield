import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mail, 
  Link as LinkIcon, 
  AlertTriangle, 
  Keyboard 
} from "lucide-react";

export function PhishingIndicators() {
  const indicators = [
    {
      icon: Mail,
      title: "Remitentes sospechosos",
      description:
        "Direcciones de correo que imitan dominios legítimos con pequeñas variaciones.",
    },
    {
      icon: LinkIcon,
      title: "URLs fraudulentas",
      description:
        "Enlaces que parecen legítimos pero redirigen a sitios maliciosos.",
    },
    {
      icon: AlertTriangle,
      title: "Urgencia y amenazas",
      description:
        "Mensajes que crean sensación de urgencia o miedo para provocar acciones impulsivas.",
    },
    {
      icon: Keyboard,
      title: "Solicitud de datos",
      description:
        "Peticiones de información personal, financiera o credenciales de acceso.",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Indicadores comunes de phishing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {indicators.map((indicator, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <indicator.icon className="text-red-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{indicator.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {indicator.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
