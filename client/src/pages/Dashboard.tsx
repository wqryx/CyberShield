import { useQuery } from "@tanstack/react-query";
import { 
  Key, 
  AlertTriangle, 
  Search, 
  Network 
} from "lucide-react";
import { FeatureCard } from "@/components/dashboard/FeatureCard";
import { SecurityMetric } from "@/components/dashboard/SecurityMetric";
import { ActivityTable, Activity } from "@/components/dashboard/ActivityTable";

interface SecurityMetrics {
  passwords: {
    count: number;
    securityScore: number;
  };
  phishing: {
    completedTests: number;
    successRate: number;
  };
  network: {
    devices: number;
    securityScore: number;
  };
}

export default function Dashboard() {
  const { data: securityData } = useQuery<SecurityMetrics>({
    queryKey: ["/api/dashboard/security-metrics"],
  });

  const { data: activityData } = useQuery<{ activities: Activity[] }>({
    queryKey: ["/api/dashboard/recent-activities"],
  });

  const metrics = securityData || {
    passwords: {
      count: 12,
      securityScore: 75,
    },
    phishing: {
      completedTests: 8,
      successRate: 60,
    },
    network: {
      devices: 7,
      securityScore: 85,
    },
  };

  const activities: Activity[] = activityData?.activities || [
    {
      id: "1",
      date: "2023-08-09T14:32:00Z",
      module: "Escáner de Red",
      activity: "Escaneo completado",
      status: "completed",
    },
    {
      id: "2",
      date: "2023-08-09T12:45:00Z",
      module: "Gestor de Contraseñas",
      activity: "Contraseña actualizada",
      status: "completed",
    },
    {
      id: "3",
      date: "2023-08-08T18:21:00Z",
      module: "Simulador Phishing",
      activity: "Test completado",
      status: "warning",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Bienvenido a CyberShield</h1>
      <p className="text-muted-foreground">Tu plataforma integral de seguridad cibernética</p>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
        <FeatureCard
          title="Gestor de Contraseñas"
          description="Almacena y gestiona tus contraseñas de forma segura"
          icon={Key}
          iconBackgroundClass="bg-primary/20"
          actionLabel="Abrir"
          actionPath="/password-manager"
        />

        <FeatureCard
          title="Simulador de Phishing"
          description="Prueba tu capacidad para detectar ataques de phishing"
          icon={AlertTriangle}
          iconBackgroundClass="bg-accent/20"
          actionLabel="Iniciar"
          actionPath="/phishing-simulator"
        />

        <FeatureCard
          title="Escáner de Red"
          description="Analiza tu red local en busca de vulnerabilidades"
          icon={Search}
          iconBackgroundClass="bg-secondary/20"
          actionLabel="Escanear"
          actionPath="/network-scanner"
        />
      </div>

      {/* Security Status Summary */}
      <div className="bg-card rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">
          Estado de seguridad
        </h2>

        {/* Security Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SecurityMetric
            title="Contraseñas almacenadas"
            value={metrics.passwords.count}
            icon={Key}
            progressPercentage={metrics.passwords.securityScore}
            progressLabel="Seguridad de contraseñas"
          />

          <SecurityMetric
            title="Simulaciones completadas"
            value={metrics.phishing.completedTests}
            icon={AlertTriangle}
            iconClassName="bg-accent bg-opacity-20"
            progressPercentage={metrics.phishing.successRate}
            progressLabel="Detección de phishing"
          />

          <SecurityMetric
            title="Dispositivos en red"
            value={metrics.network.devices}
            icon={Network}
            iconClassName="bg-secondary bg-opacity-20"
            progressPercentage={metrics.network.securityScore}
            progressLabel="Seguridad de la red"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">
          Actividad reciente
        </h2>
        <ActivityTable activities={activities} />
      </div>
    </div>
  );
}
