import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { passwordManagerRoutes } from "./services/passwordManager";
import { phishingSimulatorRoutes } from "./services/phishingSimulator";
import { networkScannerRoutes } from "./services/networkScanner";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configurar autenticación
  setupAuth(app);
  
  // API prefix
  const apiPrefix = "/api";

  // Dashboard routes
  app.get(`${apiPrefix}/dashboard/security-metrics`, async (req, res) => {
    try {
      // Verificar si el usuario está autenticado
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autenticado" });
      }
      
      // Obtener métricas específicas del usuario
      const userId = req.user?.id;
      
      // Si no hay ID de usuario, devolver métricas vacías
      if (!userId) {
        return res.json({
          passwords: { count: 0, securityScore: 0 },
          phishing: { completedTests: 0, successRate: 0 },
          network: { devices: 0, securityScore: 0 }
        });
      }
      
      const securityMetrics = await storage.getSecurityMetrics(userId);
      res.json(securityMetrics);
    } catch (error) {
      console.error("Error fetching security metrics:", error);
      res.status(500).json({ message: "Error fetching security metrics" });
    }
  });

  app.get(`${apiPrefix}/dashboard/recent-activities`, async (req, res) => {
    try {
      // Verificar si el usuario está autenticado
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autenticado" });
      }
      
      // Obtener actividades específicas del usuario
      const userId = req.user?.id;
      
      // Si no hay ID de usuario, devolver lista vacía
      if (!userId) {
        return res.json({ activities: [] });
      }
      
      const activities = await storage.getRecentActivities(userId);
      res.json({ activities });
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      res.status(500).json({ message: "Error fetching recent activities" });
    }
  });

  // Register module-specific routes
  passwordManagerRoutes(app, apiPrefix);
  phishingSimulatorRoutes(app, apiPrefix);
  networkScannerRoutes(app, apiPrefix);

  // Handle invalid routes
  app.use(`${apiPrefix}/*`, (req, res) => {
    res.status(404).json({ message: "API endpoint not found" });
  });

  const httpServer = createServer(app);

  return httpServer;
}
