import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").unique(), // Permitimos que sea null temporalmente
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users, {
  email: (schema) => schema.email("El correo electrónico no es válido"),
}).pick({
  username: true,
  email: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Passwords
export const passwords = pgTable("passwords", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  site: text("site").notNull(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  category: text("category").default("general"),
  siteIcon: text("site_icon"),
  notes: text("notes"),
  breached: boolean("breached").default(false),
  strengthScore: integer("strength_score").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const passwordsRelations = relations(passwords, ({ one }) => ({
  user: one(users, { fields: [passwords.userId], references: [users.id] }),
}));

export const insertPasswordSchema = createInsertSchema(passwords, {
  site: (schema) => schema.min(1, "El sitio es requerido"),
  username: (schema) => schema.min(1, "El nombre de usuario es requerido"),
  password: (schema) => schema.min(1, "La contraseña es requerida"),
  category: (schema) => schema.default("general"),
}).omit({ userId: true, id: true, createdAt: true, updatedAt: true, breached: true, strengthScore: true });

export type InsertPassword = z.infer<typeof insertPasswordSchema>;
export type Password = typeof passwords.$inferSelect;

// Phishing Examples
export const phishingExamples = pgTable("phishing_examples", {
  id: serial("id").primaryKey(),
  sender: text("sender").notNull(),
  senderEmail: text("sender_email").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  isPhishing: boolean("is_phishing").notNull(),
  indicators: jsonb("indicators").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPhishingExampleSchema = createInsertSchema(phishingExamples).omit({
  id: true,
  createdAt: true,
});

export type InsertPhishingExample = z.infer<typeof insertPhishingExampleSchema>;
export type PhishingExample = typeof phishingExamples.$inferSelect;

// Phishing Results
export const phishingResults = pgTable("phishing_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  exampleId: integer("example_id").references(() => phishingExamples.id),
  userAnswer: boolean("user_answer").notNull(),
  correct: boolean("correct").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const phishingResultsRelations = relations(phishingResults, ({ one }) => ({
  user: one(users, { fields: [phishingResults.userId], references: [users.id] }),
  example: one(phishingExamples, { fields: [phishingResults.exampleId], references: [phishingExamples.id] }),
}));

export const insertPhishingResultSchema = createInsertSchema(phishingResults).omit({
  id: true,
  correct: true,
  createdAt: true,
});

export type InsertPhishingResult = z.infer<typeof insertPhishingResultSchema>;
export type PhishingResult = typeof phishingResults.$inferSelect;

// Network Devices
export const networkDevices = pgTable("network_devices", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  ip: text("ip").notNull(),
  mac: text("mac").notNull(),
  status: text("status").notNull().$type<"active" | "inactive">(),
  ports: jsonb("ports").$type<number[]>(),
  isVulnerable: boolean("is_vulnerable").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const networkDevicesRelations = relations(networkDevices, ({ one }) => ({
  user: one(users, { fields: [networkDevices.userId], references: [users.id] }),
}));

export const insertNetworkDeviceSchema = createInsertSchema(networkDevices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertNetworkDevice = z.infer<typeof insertNetworkDeviceSchema>;
export type NetworkDevice = typeof networkDevices.$inferSelect;

// Vulnerabilities
export const vulnerabilities = pgTable("vulnerabilities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  deviceId: integer("device_id").references(() => networkDevices.id),
  description: text("description").notNull(),
  severity: text("severity").notNull().$type<"high" | "medium" | "low">(),
  recommendation: text("recommendation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

export const vulnerabilitiesRelations = relations(vulnerabilities, ({ one }) => ({
  user: one(users, { fields: [vulnerabilities.userId], references: [users.id] }),
  device: one(networkDevices, { fields: [vulnerabilities.deviceId], references: [networkDevices.id] }),
}));

export const insertVulnerabilitySchema = createInsertSchema(vulnerabilities).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
});

export type InsertVulnerability = z.infer<typeof insertVulnerabilitySchema>;
export type Vulnerability = typeof vulnerabilities.$inferSelect;

// Activities
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  module: text("module").notNull(),
  activity: text("activity").notNull(),
  status: text("status").notNull().$type<"completed" | "warning" | "error">(),
  date: timestamp("date").defaultNow().notNull(),
});

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, { fields: [activities.userId], references: [users.id] }),
}));

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  date: true,
});

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
