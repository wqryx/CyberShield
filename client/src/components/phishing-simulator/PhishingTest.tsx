import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Shield, CheckCircle, AlertTriangle, Mail, Link as LinkIcon, Clock, Eye, User, Globe, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PhishingExample {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  content: string;
  timestamp: string;
  isPhishing?: boolean;
  indicators?: string[];
}

interface PhishingResult {
  id: number;
  exampleId: number;
  correct: boolean;
  isPhishing: boolean;
  indicators?: string[];
}

export function PhishingTest() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showResult, setShowResult] = useState(false);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  const [analysisTab, setAnalysisTab] = useState<string>("indicators");
  const [submissionResult, setSubmissionResult] = useState<PhishingResult | null>(null);

  const { data: currentExample, isLoading } = useQuery<PhishingExample>({
    queryKey: ["/api/phishing/current-test"],
    retry: false,
  });

  const submitAnswerMutation = useMutation({
    mutationFn: async (answer: boolean) => {
      const response = await apiRequest("POST", "/api/phishing/submit-answer", {
        exampleId: currentExample?.id,
        answer,
      });
      return response.json();
    },
    onSuccess: (result: PhishingResult) => {
      setSubmissionResult(result);
      setShowResult(true);
      queryClient.invalidateQueries({ queryKey: ["/api/phishing/stats"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo enviar tu respuesta",
        variant: "destructive",
      });
    },
  });

  const handleAnswer = (isPhishing: boolean) => {
    if (!currentExample) return;
    
    setUserAnswer(isPhishing);
    submitAnswerMutation.mutate(isPhishing);
  };

  const nextTestMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/phishing/next-test", {});
      return response.json();
    },
    onSuccess: () => {
      setShowResult(false);
      setUserAnswer(null);
      setSubmissionResult(null);
      queryClient.invalidateQueries({ queryKey: ["/api/phishing/current-test"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo cargar el siguiente test",
        variant: "destructive",
      });
    },
  });

  // Función para verificar si un dominio es legítimo o sospechoso
  const analyzeDomain = (email: string) => {
    const domain = email.split('@')[1];
    const wellKnownDomains = [
      'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 
      'apple.com', 'microsoft.com', 'google.com', 'amazon.com',
      'paypal.com', 'netflix.com', 'facebook.com', 'linkedin.com'
    ];
    
    if (!domain) return { suspicious: true, reason: 'Formato de correo inválido' };
    
    // Buscar dominios que intentan suplantar a dominios legítimos
    const suspicious = wellKnownDomains.some(knownDomain => {
      return domain.includes(knownDomain.split('.')[0]) && domain !== knownDomain;
    });
    
    if (suspicious) {
      return { 
        suspicious: true, 
        reason: `El dominio "${domain}" podría estar suplantando a un dominio legítimo` 
      };
    }
    
    return { suspicious: false, domain };
  };

  // Función para verificar enlaces sospechosos en el contenido
  const analyzeSuspiciousLinks = (content: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const links = doc.querySelectorAll('a');
    const suspiciousLinks = [];
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href !== '#') {
        if (!href.startsWith('https://') || 
            href.includes('account') || 
            href.includes('login') || 
            href.includes('verify') ||
            href.includes('secure') ||
            href.includes('restore')) {
          suspiciousLinks.push(href);
        }
      }
    });
    
    return suspiciousLinks;
  };

  // Buscar palabras que crean sentido de urgencia
  const analyzeUrgentLanguage = (content: string) => {
    const urgentWords = [
      'urgente', 'inmediato', 'ahora', 'crítico', 'importante',
      'suspendido', 'bloqueado', 'tiempo limitado', 'expirar', 'cancelar',
      'verificar', 'confirmar', 'actualizar', 'seguridad', 'alerta'
    ];
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const text = doc.body.textContent || '';
    
    return urgentWords.filter(word => 
      text.toLowerCase().includes(word.toLowerCase())
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Cargando prueba...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cargando el siguiente ejemplo de phishing...</p>
        </CardContent>
      </Card>
    );
  }

  if (!currentExample) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            No hay ejemplos disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>No hay ejemplos de phishing disponibles en este momento.</p>
        </CardContent>
      </Card>
    );
  }

  // Análisis automático del correo actual
  const domainAnalysis = analyzeDomain(currentExample.senderEmail);
  const suspiciousLinks = analyzeSuspiciousLinks(currentExample.content);
  const urgentLanguage = analyzeUrgentLanguage(currentExample.content);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-card-foreground flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Simulador de Phishing
        </CardTitle>
        <CardDescription>
          Revisa este correo electrónico y determina si es legítimo o un intento de phishing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg p-4 mb-6 shadow-sm">
          <div className="border-b pb-3 mb-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{currentExample.sender}</Badge>
                  <p className="font-medium text-base">{currentExample.subject}</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">{currentExample.senderEmail}</p>
              </div>
              <p className="text-sm text-gray-500">{currentExample.timestamp}</p>
            </div>
          </div>

          <div className="pb-4 overflow-auto">
            <div dangerouslySetInnerHTML={{ __html: currentExample.content }}></div>
          </div>
        </div>

        {!showResult && (
          <div className="mb-6">
            <p className="font-medium mb-4 text-center">
              ¿Es este correo legítimo o un intento de phishing?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={() => handleAnswer(false)}
                variant="outline"
                className="py-6 border-2 border-green-500 hover:bg-green-50"
                disabled={submitAnswerMutation.isPending}
              >
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                <span className="font-medium">Es legítimo</span>
              </Button>
              <Button
                onClick={() => handleAnswer(true)}
                variant="outline"
                className="py-6 border-2 border-red-500 hover:bg-red-50"
                disabled={submitAnswerMutation.isPending}
              >
                <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                <span className="font-medium">Es phishing</span>
              </Button>
            </div>
          </div>
        )}

        {showResult && submissionResult && (
          <div>
            <div
              className={`rounded-md ${
                submissionResult.isPhishing
                  ? "bg-red-50 border border-red-200"
                  : "bg-green-50 border border-green-200"
              } p-4 mb-6`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {submissionResult.isPhishing ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <div className="ml-3">
                  <h3
                    className={`text-lg font-medium ${
                      submissionResult.isPhishing ? "text-red-800" : "text-green-800"
                    }`}
                  >
                    {submissionResult.isPhishing
                      ? "¡Este es un correo de phishing!"
                      : "¡Este es un correo legítimo!"}
                  </h3>
                  {userAnswer !== null && (
                    <div
                      className={`text-sm mt-2 p-2 rounded-md ${
                        submissionResult.correct
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <div className="flex items-center">
                        {submissionResult.correct ? (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        ) : (
                          <AlertCircle className="h-4 w-4 mr-2" />
                        )}
                        <span className="font-medium">
                          {submissionResult.correct
                            ? "¡Respuesta correcta! Has identificado correctamente este correo."
                            : "Respuesta incorrecta. No te preocupes, sigue practicando para mejorar."}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Tabs defaultValue="indicators" className="mb-6" onValueChange={setAnalysisTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="indicators">Indicadores</TabsTrigger>
                <TabsTrigger value="analysis">Análisis detallado</TabsTrigger>
                <TabsTrigger value="tips">Consejos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="indicators" className="space-y-4">
                {submissionResult?.isPhishing && submissionResult.indicators && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-red-800">Indicadores de phishing en este correo:</h4>
                    <ul className="space-y-2">
                      {submissionResult.indicators.map((indicator, index) => (
                        <li key={index} className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{indicator}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {submissionResult && !submissionResult.isPhishing && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-green-800">Señales de legitimidad en este correo:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>El remitente usa un dominio oficial y verificado.</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>No solicita información personal ni financiera.</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Los enlaces apuntan a sitios web oficiales.</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>No crea un sentido de urgencia ni usa amenazas.</span>
                      </li>
                    </ul>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="analysis">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-md p-3">
                      <div className="flex items-center mb-2">
                        <Mail className="h-5 w-5 text-blue-500 mr-2" />
                        <h4 className="font-medium">Remitente</h4>
                      </div>
                      <Separator className="my-2" />
                      <div className="space-y-2">
                        <p className="text-sm">Dominio: <span className={domainAnalysis.suspicious ? "text-red-500 font-medium" : "text-green-500 font-medium"}>
                          {domainAnalysis.domain || currentExample.senderEmail.split('@')[1]}
                        </span></p>
                        {domainAnalysis.suspicious && (
                          <p className="text-sm text-red-500">{domainAnalysis.reason}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <div className="flex items-center mb-2">
                        <LinkIcon className="h-5 w-5 text-blue-500 mr-2" />
                        <h4 className="font-medium">Enlaces</h4>
                      </div>
                      <Separator className="my-2" />
                      <div className="space-y-2">
                        {suspiciousLinks.length > 0 ? (
                          <div>
                            <p className="text-sm text-red-500 font-medium">Enlaces sospechosos detectados:</p>
                            <ul className="text-xs space-y-1 mt-1">
                              {suspiciousLinks.slice(0, 2).map((link, i) => (
                                <li key={i} className="truncate text-red-500">{link}</li>
                              ))}
                              {suspiciousLinks.length > 2 && <li className="text-red-500">Y {suspiciousLinks.length - 2} más...</li>}
                            </ul>
                          </div>
                        ) : (
                          <p className="text-sm text-green-500">No se detectaron enlaces sospechosos</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <div className="flex items-center mb-2">
                        <Clock className="h-5 w-5 text-blue-500 mr-2" />
                        <h4 className="font-medium">Urgencia</h4>
                      </div>
                      <Separator className="my-2" />
                      <div className="space-y-2">
                        {urgentLanguage.length > 0 ? (
                          <div>
                            <p className="text-sm text-red-500 font-medium">Lenguaje urgente detectado:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {urgentLanguage.slice(0, 3).map((word, i) => (
                                <Badge key={i} variant="destructive" className="text-xs">{word}</Badge>
                              ))}
                              {urgentLanguage.length > 3 && <Badge variant="destructive" className="text-xs">+{urgentLanguage.length - 3}</Badge>}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-green-500">No se detectó lenguaje urgente</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md mt-4">
                    <h4 className="font-medium mb-2">Valoración general</h4>
                    <p className="text-sm">
                      {currentExample.isPhishing ? (
                        "Este correo muestra varias técnicas comunes de phishing, incluyendo ingeniería social para inducir miedo o urgencia, y redirección a sitios web falsos."
                      ) : (
                        "Este correo no muestra las señales típicas de phishing. Parece ser una comunicación legítima que sigue las mejores prácticas de seguridad."
                      )}
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tips">
                <div className="space-y-4">
                  <h4 className="font-medium">Consejos para detectar correos de phishing:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <User className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Verifica el remitente:</span>
                        <p className="text-sm">Comprueba siempre la dirección de correo completa, no solo el nombre mostrado.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Globe className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Revisa los enlaces:</span>
                        <p className="text-sm">Pasa el cursor sobre los enlaces para ver la URL real antes de hacer clic.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Desconfía de la urgencia:</span>
                        <p className="text-sm">Los correos que crean sensación de urgencia o miedo suelen ser fraudulentos.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Lock className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Protege tus datos:</span>
                        <p className="text-sm">Las empresas legítimas nunca solicitan información sensible por correo electrónico.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Eye className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Busca errores:</span>
                        <p className="text-sm">Los errores ortográficos, gramaticales o de formato son comunes en correos fraudulentos.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
            
            <Button 
              onClick={() => nextTestMutation.mutate()}
              className="w-full"
              disabled={nextTestMutation.isPending}
            >
              Siguiente ejemplo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
