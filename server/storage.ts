import { db } from "@db";
import { 
  users, 
  passwords, 
  phishingExamples, 
  phishingResults, 
  networkDevices, 
  vulnerabilities, 
  activities 
} from "@shared/schema";
import { eq, and, desc, count, sql } from "drizzle-orm";
import { hashPassword } from "../client/src/lib/encryption";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Security Metrics Type
export interface SecurityMetrics {
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

// Storage class to handle all database operations
export const storage = {
  // User management
  async getUserById(id: number) {
    return db.query.users.findFirst({
      where: eq(users.id, id)
    });
  },

  async getUserByUsername(username: string) {
    return db.query.users.findFirst({
      where: eq(users.username, username)
    });
  },

  async createUser(username: string, password: string) {
    const hashedPassword = await hashPassword(password);
    const [user] = await db.insert(users)
      .values({
        username,
        password: hashedPassword
      })
      .returning();
    return user;
  },

  // Password manager
  async getPasswords(userId: number) {
    return db.query.passwords.findMany({
      where: eq(passwords.userId, userId),
      orderBy: desc(passwords.updatedAt)
    });
  },

  async getPasswordById(id: number, userId: number) {
    return db.query.passwords.findFirst({
      where: and(
        eq(passwords.id, id),
        eq(passwords.userId, userId)
      )
    });
  },

  async createPassword(data: { site: string; username: string; password: string; siteIcon?: string; notes?: string }, userId: number) {
    const passwordData = {
      ...data,
      userId: userId,
      strengthScore: Math.floor(Math.random() * 100) // Mock score, replace with actual calculation
    };
    
    const [password] = await db.insert(passwords).values(passwordData).returning();
    
    // Log activity
    await this.logActivity("Gestor de Contraseñas", "Contraseña creada", "completed", userId);
    
    return password;
  },

  async updatePassword(id: number, data: { site?: string; username?: string; password?: string; siteIcon?: string; notes?: string }, userId: number) {
    const [password] = await db.update(passwords)
      .set({ ...data, updatedAt: new Date() })
      .where(and(
        eq(passwords.id, id),
        eq(passwords.userId, userId)
      ))
      .returning();
    
    // Log activity
    await this.logActivity("Gestor de Contraseñas", "Contraseña actualizada", "completed", userId);
    
    return password;
  },

  async deletePassword(id: number, userId: number) {
    const [password] = await db.delete(passwords)
      .where(and(
        eq(passwords.id, id),
        eq(passwords.userId, userId)
      ))
      .returning();
    
    // Log activity
    await this.logActivity("Gestor de Contraseñas", "Contraseña eliminada", "completed", userId);
    
    return password;
  },

  async markPasswordBreached(id: number, breached: boolean, userId: number) {
    const [password] = await db.update(passwords)
      .set({ breached, updatedAt: new Date() })
      .where(and(
        eq(passwords.id, id),
        eq(passwords.userId, userId)
      ))
      .returning();
    
    // Log activity
    if (breached) {
      await this.logActivity("Gestor de Contraseñas", "Contraseña comprometida detectada", "warning", userId);
    }
    
    return password;
  },

  // Phishing simulator management
  async getPhishingExamples() {
    return db.query.phishingExamples.findMany();
  },

  async getPhishingExampleById(id: number) {
    return db.query.phishingExamples.findFirst({
      where: eq(phishingExamples.id, id)
    });
  },

  async getRandomPhishingExample() {
    // Get a random example
    const examples = await db.query.phishingExamples.findMany();
    if (examples.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * examples.length);
    return examples[randomIndex];
  },

  async submitPhishingResult(exampleId: number, userAnswer: boolean, userId: number) {
    // Get the actual phishing status
    const example = await this.getPhishingExampleById(exampleId);
    if (!example) throw new Error("Phishing example not found");
    
    const isCorrect = example.isPhishing === userAnswer;
    
    // Save result
    const [result] = await db.insert(phishingResults)
      .values({
        exampleId,
        userId,
        userAnswer,
        correct: isCorrect
      })
      .returning();
    
    // Log activity
    await this.logActivity(
      "Simulador de Phishing", 
      `Test completado: ${isCorrect ? "Correctamente" : "Incorrectamente"}`, 
      isCorrect ? "completed" : "warning",
      userId
    );
    
    return result;
  },

  async getPhishingStats(userId: number) {
    const results = await db.query.phishingResults.findMany({
      where: eq(phishingResults.userId, userId)
    });
    
    const totalTests = results.length;
    const correctDetections = results.filter(r => r.correct).length;
    const incorrectDetections = totalTests - correctDetections;
    
    return {
      totalTests,
      correctDetections,
      incorrectDetections,
      successRate: totalTests > 0 ? Math.round((correctDetections / totalTests) * 100) : 0
    };
  },

  // Network scanner
  async getNetworkDevices(userId: number) {
    return db.query.networkDevices.findMany({
      where: eq(networkDevices.userId, userId),
      orderBy: desc(networkDevices.updatedAt)
    });
  },

  async getNetworkDeviceById(id: number, userId: number) {
    return db.query.networkDevices.findFirst({
      where: and(
        eq(networkDevices.id, id),
        eq(networkDevices.userId, userId)
      )
    });
  },

  async createNetworkDevice(data: { name: string; type: string; ip: string; mac: string; status: "active" | "inactive"; ports: number[]; isVulnerable?: boolean }, userId: number) {
    const deviceData = {
      ...data,
      userId
    };
    
    const [device] = await db.insert(networkDevices).values(deviceData).returning();
    
    // Log activity
    await this.logActivity("Escáner de Red", "Dispositivo nuevo detectado", "completed", userId);
    
    return device;
  },

  async updateNetworkDevice(id: number, data: { name?: string; type?: string; ip?: string; mac?: string; status?: "active" | "inactive"; ports?: number[]; isVulnerable?: boolean }, userId: number) {
    const [device] = await db.update(networkDevices)
      .set({ ...data, updatedAt: new Date() })
      .where(and(
        eq(networkDevices.id, id),
        eq(networkDevices.userId, userId)
      ))
      .returning();
    
    return device;
  },

  async clearNetworkDevicesForUser(userId: number) {
    // Primero, eliminar todas las vulnerabilidades asociadas a los dispositivos del usuario
    await db.delete(vulnerabilities)
      .where(
        sql`"device_id" IN (
          SELECT "id" FROM "network_devices" WHERE "user_id" = ${userId}
        )`
      );
    
    // Luego eliminar todos los dispositivos del usuario
    return db.delete(networkDevices)
      .where(eq(networkDevices.userId, userId));
  },
  
  async deleteNetworkDevice(id: number, userId: number) {
    // First, delete associated vulnerabilities
    await db.delete(vulnerabilities)
      .where(eq(vulnerabilities.deviceId, id));
    
    // Then delete the device
    const [device] = await db.delete(networkDevices)
      .where(and(
        eq(networkDevices.id, id),
        eq(networkDevices.userId, userId)
      ))
      .returning();
    
    return device;
  },

  // Vulnerability management
  async getVulnerabilities(userId: number) {
    // Primer obtener los dispositivos del usuario
    const devices = await this.getNetworkDevices(userId);
    const deviceIds = devices.map(device => device.id);
    
    // Luego obtener las vulnerabilidades asociadas a esos dispositivos
    return db.query.vulnerabilities.findMany({
      where: eq(vulnerabilities.deviceId, 
        // Si no hay dispositivos, usar -1
        deviceIds.length > 0 ? 
        deviceIds[0] : -1)
    });
  },

  async createVulnerability(data: { deviceId: number; description: string; severity: "high" | "medium" | "low"; recommendation?: string }, userId: number) {
    // Verify the device belongs to the user
    const device = await this.getNetworkDeviceById(data.deviceId, userId);
    if (!device) throw new Error("Device not found");
    
    const [vulnerability] = await db.insert(vulnerabilities)
      .values(data)
      .returning();
    
    // Log activity
    await this.logActivity(
      "Escáner de Red", 
      `Vulnerabilidad detectada en ${device.name}`, 
      "warning",
      userId
    );
    
    // Update device vulnerability status
    await this.updateNetworkDevice(data.deviceId, { isVulnerable: true }, userId);
    
    return vulnerability;
  },

  async resolveVulnerability(id: number, userId: number) {
    // Get vulnerability with device
    const vuln = await db.query.vulnerabilities.findFirst({
      where: eq(vulnerabilities.id, id),
      with: {
        device: true
      }
    });
    
    if (!vuln || !vuln.device) throw new Error("Vulnerability not found");
    
    // Verify the device belongs to the user
    const device = await this.getNetworkDeviceById(vuln.device.id, userId);
    if (!device) throw new Error("Device not found");
    
    // Update vulnerability
    const [vulnerability] = await db.update(vulnerabilities)
      .set({ resolvedAt: new Date() })
      .where(eq(vulnerabilities.id, id))
      .returning();
    
    // Check if device has other unresolved vulnerabilities
    const remainingVulns = await db.query.vulnerabilities.findMany({
      where: and(
        eq(vulnerabilities.deviceId, vuln.device.id),
        sql`"resolved_at" IS NULL`
      )
    });
    
    if (remainingVulns.length === 0) {
      // No more vulnerabilities, update device status
      await this.updateNetworkDevice(vuln.device.id, { isVulnerable: false }, userId);
    }
    
    // Log activity
    await this.logActivity(
      "Escáner de Red", 
      `Vulnerabilidad resuelta en ${vuln.device.name}`, 
      "completed",
      userId
    );
    
    return vulnerability;
  },

  // Activity logging
  async logActivity(module: string, activity: string, status: "completed" | "warning" | "error", userId: number) {
    const [result] = await db.insert(activities)
      .values({
        userId,
        module,
        activity,
        status
      })
      .returning();
    
    return result;
  },

  async getRecentActivities(userId: number, limit = 10) {
    return db.select({
      id: activities.id,
      module: activities.module,
      activity: activities.activity,
      status: activities.status,
      date: activities.date
    })
    .from(activities)
    .where(eq(activities.userId, userId))
    .orderBy(desc(activities.date))
    .limit(limit);
  },

  // Security metrics
  async getSecurityMetrics(userId: number): Promise<SecurityMetrics> {
    // Get password stats
    const userPasswords = await this.getPasswords(userId);
    const passwordCount = userPasswords.length;
    const passwordScores = userPasswords.map(p => p.strengthScore || 0);
    const avgPasswordScore = passwordScores.length > 0 
      ? Math.round(passwordScores.reduce((a, b) => a + b, 0) / passwordScores.length) 
      : 0;
    
    // Get phishing stats
    const phishingStats = await this.getPhishingStats(userId);
    
    // Get network stats
    const devices = await this.getNetworkDevices(userId);
    const vulnerabilities = await this.getVulnerabilities(userId);
    const deviceCount = devices.length;
    
    // Simple security score: percentage of devices without vulnerabilities
    const vulnerableDevices = new Set(vulnerabilities.map(v => v.deviceId));
    const secureDevicePercentage = deviceCount > 0
      ? Math.round(((deviceCount - vulnerableDevices.size) / deviceCount) * 100)
      : 100;
    
    return {
      passwords: {
        count: passwordCount,
        securityScore: avgPasswordScore
      },
      phishing: {
        completedTests: phishingStats.totalTests,
        successRate: phishingStats.successRate
      },
      network: {
        devices: deviceCount,
        securityScore: secureDevicePercentage
      }
    };
  }
};