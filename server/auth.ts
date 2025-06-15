import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import connectPg from "connect-pg-simple";
import { db } from "../db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";
import { pool } from "../db";

declare global {
  namespace Express {
    interface User extends schema.User {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Configurar almacenamiento de sesiones con PostgreSQL
  const PostgresSessionStore = connectPg(session);
  
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "cybershield-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
    },
    store: new PostgresSessionStore({
      pool,
      tableName: 'user_sessions',
      createTableIfMissing: true
    })
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const users = await db.select().from(schema.users).where(eq(schema.users.username, username));
        const user = users.length > 0 ? users[0] : null;
        
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const users = await db.select().from(schema.users).where(eq(schema.users.id, id));
      const user = users.length > 0 ? users[0] : null;
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Ruta de registro
  app.post("/api/register", async (req, res, next) => {
    try {
      // Verificar si el usuario ya existe
      const existingUsers = await db.select().from(schema.users).where(eq(schema.users.username, req.body.username));
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: "El nombre de usuario ya existe" });
      }

      // Verificar si el email ya existe
      if (req.body.email) {
        const existingEmails = await db.select().from(schema.users).where(eq(schema.users.email, req.body.email));
        if (existingEmails.length > 0) {
          return res.status(400).json({ message: "El correo electrónico ya está registrado" });
        }
      }

      // Crear el nuevo usuario
      const hashedPassword = await hashPassword(req.body.password);
      const userData = {
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email || null
      };

      // Insertar el usuario en la base de datos
      const result = await db.insert(schema.users).values(userData).returning();
      
      const user = result[0];

      // Enviar correo de bienvenida si hay email
      if (user.email) {
        try {
          // Importamos de forma dinámica para evitar problemas de inicialización
          const { sendWelcomeEmail } = await import('./services/emailService');
          // Enviamos el correo pero no esperamos a que termine para no bloquear el registro
          sendWelcomeEmail(user.username, user.email)
            .then(success => {
              if (success) {
                console.log(`Correo de bienvenida enviado exitosamente a ${user.email}`);
              } else {
                console.log(`No se pudo enviar el correo de bienvenida a ${user.email}`);
              }
            })
            .catch(err => {
              console.error("Error al enviar correo de bienvenida:", err);
            });
        } catch (emailError) {
          console.error("Error al cargar el servicio de correo:", emailError);
          // No bloqueamos el registro por fallos en el correo
        }
      }

      // Iniciar sesión automáticamente después del registro
      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(201).json({ 
          id: user.id, 
          username: user.username,
          email: user.email
        });
      });
    } catch (error) {
      console.error("Error en registro:", error);
      return res.status(500).json({ message: "Error al registrar el usuario" });
    }
  });

  // Ruta de login
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: schema.User | false, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Credenciales inválidas" });
      
      req.login(user, (err: Error) => {
        if (err) return next(err);
        return res.status(200).json({ 
          id: user.id, 
          username: user.username,
          email: user.email
        });
      });
    })(req, res, next);
  });

  // Ruta de logout
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Ruta para obtener el usuario actual
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "No autenticado" });
    }
    
    res.json({
      id: req.user.id,
      username: req.user.username,
      email: req.user.email
    });
  });
}