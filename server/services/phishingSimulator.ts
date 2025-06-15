import { Express } from "express";
import { storage } from "../storage";
import { z } from "zod";
import { formatDate } from "@/lib/utils";

// Schema for submitting answers
const submitAnswerSchema = z.object({
  exampleId: z.number(),
  answer: z.boolean()
});

export function phishingSimulatorRoutes(app: Express, apiPrefix: string) {
  // Get current phishing test
  app.get(`${apiPrefix}/phishing/current-test`, async (req, res) => {
    try {
      // Verificar autenticación
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autenticado" });
      }
      
      const example = await storage.getRandomPhishingExample();
      
      if (!example) {
        return res.status(404).json({ message: "No phishing examples available" });
      }
      
      // Don't send the isPhishing field to the client
      const safeExample = {
        id: example.id,
        sender: example.sender,
        senderEmail: example.senderEmail,
        subject: example.subject,
        content: example.content,
        timestamp: formatDate(example.createdAt)
      };
      
      res.json(safeExample);
    } catch (error) {
      console.error("Error fetching phishing test:", error);
      res.status(500).json({ message: "Error fetching phishing test" });
    }
  });
  
  // Submit answer to a phishing test
  app.post(`${apiPrefix}/phishing/submit-answer`, async (req, res) => {
    try {
      // Verificar autenticación
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autenticado" });
      }
      
      const userId = req.user!.id;
      const { exampleId, answer } = submitAnswerSchema.parse(req.body);
      
      const example = await storage.getPhishingExampleById(exampleId);
      if (!example) {
        return res.status(404).json({ message: "Phishing example not found" });
      }
      
      const result = await storage.submitPhishingResult(exampleId, answer, userId);
      
      // Return the result with the correct answer
      res.json({
        id: result.id,
        exampleId: result.exampleId,
        correct: result.correct,
        isPhishing: example.isPhishing,
        indicators: example.indicators
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error submitting answer:", error);
      res.status(500).json({ message: "Error submitting answer" });
    }
  });
  
  // Get next phishing test
  app.post(`${apiPrefix}/phishing/next-test`, async (req, res) => {
    try {
      // Verificar autenticación
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autenticado" });
      }
      
      const example = await storage.getRandomPhishingExample();
      
      if (!example) {
        return res.status(404).json({ message: "No phishing examples available" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error fetching next phishing test:", error);
      res.status(500).json({ message: "Error fetching next phishing test" });
    }
  });
  
  // Get phishing statistics
  app.get(`${apiPrefix}/phishing/stats`, async (req, res) => {
    try {
      // Verificar autenticación
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autenticado" });
      }
      
      const userId = req.user!.id;
      const stats = await storage.getPhishingStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching phishing stats:", error);
      res.status(500).json({ message: "Error fetching phishing stats" });
    }
  });
}
