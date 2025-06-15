import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface LeakCheckResult {
  email: string;
  breached: boolean | null;
  breachCount: number;
  breaches?: string[];
  message?: string;
}

export function PasswordLeakChecker() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [checkResult, setCheckResult] = useState<LeakCheckResult | null>(null);

  const checkLeaksMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", "/api/passwords/check-leaks", { email });
      return response.json();
    },
    onSuccess: (data: LeakCheckResult) => {
      setCheckResult(data);
      if (data.message) {
        toast({
          title: "Información",
          description: data.message,
          variant: data.breached === null ? "default" : "destructive",
        });
      }
    },
    onError: async (error: any) => {
      if (error.response) {
        try {
          const errorData = await error.response.json();
          setCheckResult(errorData);
          toast({
            title: "Servicio limitado",
            description: errorData.message || "Error al verificar filtraciones",
            variant: "destructive",
          });
        } catch {
          toast({
            title: "Error al verificar filtraciones",
            description: "No se pudo verificar el correo electrónico. Inténtalo de nuevo.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error al verificar filtraciones",
          description: "No se pudo verificar el correo electrónico. Inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    },
  });

  const handleCheckLeaks = () => {
    if (!email || !email.includes("@")) {
      toast({
        title: "Email inválido",
        description: "Por favor, introduce un correo electrónico válido",
        variant: "destructive",
      });
      return;
    }

    checkLeaksMutation.mutate(email);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Verificación de filtraciones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Verifica si tu correo electrónico aparece en filtraciones de datos conocidas usando nuestra base de datos de incidentes de seguridad documentados públicamente.
        </p>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <Input
              type="email"
              placeholder="Introduce tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Button 
              onClick={handleCheckLeaks}
              disabled={checkLeaksMutation.isPending}
            >
              {checkLeaksMutation.isPending ? "Verificando..." : "Verificar"}
            </Button>
          </div>
        </div>

        {checkResult && checkResult.breached === true && (
          <div className="mt-6">
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                    <span className="font-bold">¡ALERTA!</span> Tu correo <span className="font-bold">{checkResult.email}</span>{" "}
                    apareció en {checkResult.breachCount}{" "}
                    {checkResult.breachCount === 1 ? "filtración" : "filtraciones"} de datos conocidas.
                  </p>
                  {checkResult.breaches && checkResult.breaches.length > 0 && (
                    <div>
                      <p className="text-sm text-red-700 dark:text-red-300 font-medium mb-2">
                        Filtraciones encontradas:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {checkResult.breaches.map((breach, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200"
                          >
                            {breach}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-3">
                        <span className="font-medium">Recomendación:</span> Cambia inmediatamente las contraseñas de todas las cuentas que usen este correo.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {checkResult && checkResult.breached === false && (
          <div className="mt-6">
            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    ¡Excelente! Tu correo <span className="font-bold">{checkResult.email}</span>{" "}
                    no aparece en ninguna filtración de datos conocida.
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                    Mantén buenas prácticas de seguridad y verifica regularmente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {checkResult && checkResult.breached === null && (
          <div className="mt-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    No se pudo verificar el correo <span className="font-bold">{checkResult.email}</span> en este momento.
                  </p>
                  {checkResult.message && (
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                      {checkResult.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
