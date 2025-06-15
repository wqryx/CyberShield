import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

interface PhishingStats {
  totalTests: number;
  correctDetections: number;
  successRate: number;
}

export function PhishingStats() {
  const { data: stats, isLoading } = useQuery<PhishingStats>({
    queryKey: ["/api/phishing/stats"],
    retry: false,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Tu desempeño
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cargando estadísticas...</p>
        </CardContent>
      </Card>
    );
  }

  const defaultStats: PhishingStats = stats || {
    totalTests: 0,
    correctDetections: 0,
    successRate: 0,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Tu desempeño
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4 text-center">
            <p className="text-lg font-semibold">Tests completados</p>
            <p className="text-3xl font-bold text-primary mt-2">
              {defaultStats.totalTests}
            </p>
          </div>

          <div className="border rounded-lg p-4 text-center">
            <p className="text-lg font-semibold">
              Detecciones correctas
            </p>
            <p className="text-3xl font-bold text-green-500 mt-2">
              {defaultStats.correctDetections}
            </p>
          </div>

          <div className="border rounded-lg p-4 text-center">
            <p className="text-lg font-semibold">Porcentaje de acierto</p>
            <p className="text-3xl font-bold text-blue-500 mt-2">
              {defaultStats.successRate}%
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium mb-2">Progreso de aprendizaje</h3>
          <div className="w-full bg-muted rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full"
              style={{ width: `${defaultStats.successRate}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
