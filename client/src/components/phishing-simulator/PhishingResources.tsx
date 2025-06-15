import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { 
  Shield, 
  FileText, 
  ExternalLink,
  BookOpen,
  Video,
  Lightbulb,
  Lock
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

export function PhishingResources() {
  const [resourceTab, setResourceTab] = useState("tutoriales");

  const tutoriales = [
    {
      title: "Identificación de correos phishing",
      description: "Guía paso a paso para reconocer correos electrónicos fraudulentos",
      steps: [
        "Verifique siempre la dirección de correo del remitente, no solo el nombre mostrado",
        "Pase el cursor sobre los enlaces antes de hacer clic para ver la URL real",
        "Desconfíe de mensajes que generen urgencia o miedo",
        "Busque errores gramaticales y de formato en el contenido",
        "Nunca descargue archivos adjuntos sospechosos",
        "Verifique si el saludo es genérico o personalizado"
      ],
      icon: Shield
    },
    {
      title: "Qué hacer ante un intento de phishing",
      description: "Pasos a seguir cuando detecta un correo electrónico sospechoso",
      steps: [
        "No haga clic en ningún enlace ni descargue archivos adjuntos",
        "No responda al correo ni proporcione información personal",
        "Marque el correo como spam o phishing en su cliente de correo",
        "Reporte el incidente a la entidad suplantada (banco, empresa, etc.)",
        "Si ha proporcionado datos, cambie sus contraseñas inmediatamente",
        "Mantenga actualizado su software de seguridad"
      ],
      icon: Lock
    },
    {
      title: "Protección contra el phishing",
      description: "Medidas preventivas para evitar ser víctima de phishing",
      steps: [
        "Utilice contraseñas únicas y fuertes para cada servicio",
        "Active la autenticación de dos factores cuando sea posible",
        "Mantenga actualizados su navegador y sistema operativo",
        "Instale una extensión de seguridad en su navegador",
        "Acceda directamente a los sitios web oficiales en lugar de usar enlaces",
        "Revise regularmente la actividad de sus cuentas"
      ],
      icon: Shield
    }
  ];

  const recursos = [
    {
      title: "INCIBE - Instituto Nacional de Ciberseguridad",
      description: "Organismo de referencia en España para la concienciación sobre ciberseguridad",
      link: "https://www.incibe.es/aprendeciberseguridad"
    },
    {
      title: "Phishing.org",
      description: "Recursos educativos y guías sobre phishing y cómo prevenirlo",
      link: "https://www.phishing.org/what-is-phishing"
    },
    {
      title: "No More Ransom",
      description: "Iniciativa que ayuda a las víctimas de ransomware a recuperar sus datos",
      link: "https://www.nomoreransom.org/es/index.html"
    },
    {
      title: "OSI - Oficina de Seguridad del Internauta",
      description: "Portal con guías, herramientas y servicios para la ciberseguridad",
      link: "https://www.osi.es/es"
    }
  ];

  const preguntas = [
    {
      pregunta: "¿Qué es exactamente el phishing?",
      respuesta: "El phishing es una técnica de ingeniería social donde los ciberdelincuentes se hacen pasar por entidades legítimas para engañar a las personas y robar información sensible como contraseñas, datos bancarios o información personal. Generalmente se realiza a través de correos electrónicos, mensajes o sitios web falsos."
    },
    {
      pregunta: "¿Cómo puedo saber si un correo es phishing?",
      respuesta: "Busque señales como: dominios de correo sospechosos, enlaces que no coinciden con el sitio oficial, errores gramaticales, solicitudes urgentes de información personal, ofertas que parecen demasiado buenas para ser verdad, o saludos genéricos en lugar de personalizados."
    },
    {
      pregunta: "He caído en una estafa de phishing, ¿qué debo hacer?",
      respuesta: "Actúe rápidamente: 1) Cambie inmediatamente sus contraseñas, 2) Contacte con su banco si proporcionó datos financieros, 3) Monitorice sus cuentas para detectar actividad sospechosa, 4) Reporte el incidente a la entidad suplantada y a las autoridades, 5) Considere congelar su historial crediticio si es necesario."
    },
    {
      pregunta: "¿Los correos de phishing siempre tienen faltas de ortografía?",
      respuesta: "No siempre. Aunque muchos correos de phishing contienen errores gramaticales o de ortografía, los ataques sofisticados pueden estar muy bien redactados. Es importante verificar múltiples señales de alerta y no confiar solo en la calidad del texto."
    },
    {
      pregunta: "¿Pueden los filtros de correo detectar todo el phishing?",
      respuesta: "No. Aunque los filtros de correo electrónico modernos son cada vez más eficaces para detectar phishing, los atacantes constantemente evolucionan sus técnicas. Los ataques dirigidos o sofisticados pueden evadir los filtros automáticos, por lo que sigue siendo fundamental la vigilancia del usuario."
    }
  ];

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Recursos Educativos
        </CardTitle>
        <CardDescription>
          Tutoriales, recursos y guías para protegerse contra ataques de phishing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tutoriales" className="w-full" onValueChange={setResourceTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="tutoriales">Tutoriales</TabsTrigger>
            <TabsTrigger value="preguntas">Preguntas Frecuentes</TabsTrigger>
            <TabsTrigger value="recursos">Enlaces Útiles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tutoriales">
            <div className="space-y-6">
              {tutoriales.map((tutorial, index) => (
                <Card key={index} className="border overflow-hidden">
                  <CardHeader className="bg-gray-50 pb-3">
                    <div className="flex items-center gap-2">
                      <tutorial.icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg font-medium">{tutorial.title}</CardTitle>
                    </div>
                    <CardDescription>{tutorial.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ol className="list-decimal list-inside space-y-2">
                      {tutorial.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="text-sm">{step}</li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              ))}
              
              <div className="pt-4">
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md flex gap-3">
                  <Lightbulb className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">Consejo práctico</h4>
                    <p className="text-sm text-yellow-700">
                      La mayoría de las empresas legítimas nunca le pedirán información sensible por correo electrónico. 
                      Si recibe un correo solicitando datos personales o financieros, visite directamente el sitio web oficial 
                      escribiendo la URL en su navegador, en lugar de hacer clic en los enlaces del correo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preguntas">
            <div className="pt-2">
              <Accordion type="single" collapsible className="w-full">
                {preguntas.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium">
                      {faq.pregunta}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-gray-700">{faq.respuesta}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </TabsContent>
          
          <TabsContent value="recursos">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recursos.map((recurso, index) => (
                  <Card key={index} className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">{recurso.title}</CardTitle>
                      <CardDescription className="text-xs">{recurso.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-2">
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={recurso.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1">
                          <ExternalLink className="h-4 w-4" />
                          <span>Visitar</span>
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Videos educativos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">¿Cómo detectar un correo de phishing?</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="bg-gray-100 p-4 rounded-md flex flex-col items-center justify-center h-32">
                        <Video className="h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">Video demostrativo</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">Medidas preventivas contra el phishing</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="bg-gray-100 p-4 rounded-md flex flex-col items-center justify-center h-32">
                        <Video className="h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">Video demostrativo</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}