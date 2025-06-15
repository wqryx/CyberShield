import { db } from "./index";
import * as schema from "@shared/schema";
import { hashPassword } from "../client/src/lib/encryption";

async function seed() {
  try {
    console.log("Starting database seed...");
    
    // Create a default user if none exists
    const existingUsers = await db.select().from(schema.users);
    if (existingUsers.length === 0) {
      console.log("Creating default user...");
      const hashedPassword = hashPassword("password123");
      
      await db.insert(schema.users).values({
        username: "usuario",
        password: hashedPassword
      });
    }
    
    // Add some example passwords if none exist
    const existingPasswords = await db.select().from(schema.passwords);
    if (existingPasswords.length === 0) {
      console.log("Adding sample passwords...");
      
      // Get the default user
      const users = await db.select().from(schema.users);
      const user = users[0];
      if (!user) {
        throw new Error("No user found for adding passwords");
      }
      
      await db.insert(schema.passwords).values([
        {
          userId: user.id,
          site: "Google",
          username: "usuario@gmail.com",
          password: hashPassword("GooglePass123!"),
          siteIcon: "google",
          notes: "Cuenta principal de Google",
          breached: false
        },
        {
          userId: user.id,
          site: "Facebook",
          username: "usuario@email.com",
          password: hashPassword("FacebookPass456!"),
          siteIcon: "facebook",
          notes: "Cuenta personal de Facebook",
          breached: true
        },
        {
          userId: user.id,
          site: "Amazon",
          username: "usuario_123",
          password: hashPassword("weak123"),
          siteIcon: "amazon",
          notes: "Cuenta de compras",
          breached: false
        }
      ]);
    }
    
    // Add phishing examples if none exist
    const existingExamples = await db.select().from(schema.phishingExamples);
    if (existingExamples.length === 0) {
      console.log("Adding phishing examples...");
      
      await db.insert(schema.phishingExamples).values([
        {
          sender: "Amazon",
          senderEmail: "noreply@amazon-support.com",
          subject: "Su cuenta ha sido suspendida",
          content: `
            <p>Estimado cliente de Amazon,</p>
            <p>Hemos detectado actividad sospechosa en su cuenta Amazon. Su cuenta ha sido temporalmente suspendida por razones de seguridad.</p>
            <p>Para restaurar su cuenta, por favor verifique su información haciendo clic en el siguiente enlace:</p>
            <p><a href="#" class="text-blue-600 underline">https://amazon-account-verify.com/restore</a></p>
            <p>Si no completa este proceso en las próximas 24 horas, su cuenta será permanentemente desactivada.</p>
            <p>Atentamente,<br>Equipo de Seguridad de Amazon</p>
          `,
          isPhishing: true,
          indicators: [
            "Dominio del remitente sospechoso (amazon-support.com no es oficial)",
            "URL fraudulenta que no pertenece al dominio de Amazon",
            "Tono urgente que busca generar miedo",
            "Solicitud de información personal a través de un enlace"
          ]
        },
        {
          sender: "Netflix",
          senderEmail: "billing@netflix-payments.com",
          subject: "Problema con su método de pago",
          content: `
            <p>Estimado usuario de Netflix,</p>
            <p>No pudimos procesar su pago mensual debido a un problema con su método de pago actual.</p>
            <p>Para evitar la suspensión de su cuenta, actualice su información de pago de inmediato haciendo clic aquí:</p>
            <p><a href="#" class="text-blue-600 underline">https://netflix-accounts.com/billing/update</a></p>
            <p>Este problema debe resolverse en las próximas 24 horas para evitar la interrupción del servicio.</p>
            <p>Saludos,<br>Equipo de Facturación de Netflix</p>
          `,
          isPhishing: true,
          indicators: [
            "Dominio del remitente falso (netflix-payments.com)",
            "URL de destino que no pertenece a Netflix",
            "Sentido de urgencia para presionar al usuario",
            "Solicitud de información financiera sensible"
          ]
        },
        {
          sender: "Microsoft",
          senderEmail: "no-reply@microsoft.com",
          subject: "Actualización importante de seguridad",
          content: `
            <p>Estimado usuario de Microsoft,</p>
            <p>Hemos lanzado una actualización importante de seguridad para su sistema operativo Windows.</p>
            <p>Esta actualización aborda varias vulnerabilidades críticas que podrían permitir a atacantes remotos comprometer su sistema.</p>
            <p>Para actualizar su sistema, utilice la función de Windows Update accediendo a Configuración > Actualización y seguridad > Windows Update.</p>
            <p>Para más información sobre las vulnerabilidades corregidas, visite nuestro sitio oficial: <a href="https://www.microsoft.com/security" class="text-blue-600 underline">microsoft.com/security</a></p>
            <p>Gracias,<br>Equipo de Seguridad de Microsoft</p>
          `,
          isPhishing: false
        },
        {
          sender: "PayPal",
          senderEmail: "service@paypal.com",
          subject: "Confirmación de compra",
          content: `
            <p>Hola,</p>
            <p>Gracias por su compra. Este correo es para confirmar que hemos recibido su pago de $349.99 para "iPhone 13 Pro - Renovado".</p>
            <p>Detalles de la transacción:</p>
            <ul>
              <li>Número de transacción: TRX-29384756</li>
              <li>Fecha: ${new Date().toLocaleDateString()}</li>
              <li>Método de pago: Tarjeta terminada en 4358</li>
            </ul>
            <p>Si usted no realizó esta compra, por favor inicie sesión en su cuenta de PayPal y abra una disputa en el Centro de resoluciones.</p>
            <p>No responda a este correo. Para contactarnos, inicie sesión en su cuenta y use nuestro centro de ayuda.</p>
            <p>Atentamente,<br>Equipo de PayPal</p>
          `,
          isPhishing: false
        },
        {
          sender: "WhatsApp",
          senderEmail: "notificacion@whatsapp-verified.net",
          subject: "Mensaje de voz pendiente",
          content: `
            <p>Estimado usuario de WhatsApp,</p>
            <p>Tienes 1 mensaje de voz nuevo que no has escuchado durante más de 2 días.</p>
            <p>El mensaje proviene de: +34 6XX XXX XXX</p>
            <p>Duración: 0:37 segundos</p>
            <p>Escucha tu mensaje aquí: <a href="#" class="text-blue-600 underline">https://whatsapp-voicemail.net/messages/listen</a></p>
            <p>Saludos,<br>Equipo de WhatsApp</p>
          `,
          isPhishing: true,
          indicators: [
            "WhatsApp no envía notificaciones por correo electrónico",
            "Dominio del remitente falso (whatsapp-verified.net)",
            "URL fraudulenta que no pertenece a WhatsApp",
            "Intento de despertar curiosidad para que el usuario haga clic"
          ]
        },
        {
          sender: "Banco Santander",
          senderEmail: "alerta@santander-secure.com",
          subject: "Alerta de seguridad: Acceso no autorizado",
          content: `
            <p>Estimado/a cliente,</p>
            <p>Hemos detectado un intento de acceso no autorizado a su cuenta desde una ubicación desconocida.</p>
            <p>Por motivos de seguridad, hemos bloqueado temporalmente su acceso a la banca en línea.</p>
            <p>Para desbloquear su cuenta y evitar inconvenientes, por favor verifique su identidad haciendo clic en el siguiente enlace:</p>
            <p><a href="#" class="text-blue-600 underline">https://santander-verificacion.online/restore-access</a></p>
            <p>Este enlace caducará en 24 horas.</p>
            <p>Atentamente,<br>Departamento de Seguridad<br>Banco Santander</p>
          `,
          isPhishing: true,
          indicators: [
            "Dominio del remitente falso (santander-secure.com)",
            "URL fraudulenta que no pertenece al banco",
            "Mensaje alarmista que genera urgencia y miedo",
            "Los bancos nunca solicitan verificación de datos por correo electrónico",
            "Amenaza de bloqueo de cuenta para forzar acción inmediata"
          ]
        },
        {
          sender: "LinkedIn",
          senderEmail: "notifications@linkedin.com",
          subject: "Nuevas oportunidades laborales para tu perfil",
          content: `
            <p>Hola,</p>
            <p>Tenemos nuevas oportunidades laborales que coinciden con tu perfil y experiencia en LinkedIn.</p>
            <p>Esta semana, 5 reclutadores han visitado tu perfil y podrían estar interesados en contactarte.</p>
            <p>Para ver quién ha visitado tu perfil y las ofertas disponibles, inicia sesión en LinkedIn:</p>
            <p><a href="https://www.linkedin.com/jobs/" class="text-blue-600 underline">linkedin.com/jobs</a></p>
            <p>¡No pierdas estas oportunidades!</p>
            <p>Saludos,<br>Equipo de LinkedIn</p>
          `,
          isPhishing: false
        },
        {
          sender: "Apple",
          senderEmail: "no-reply@apple.info",
          subject: "Su Apple ID ha sido bloqueado",
          content: `
            <div style="font-family: Arial, sans-serif;">
              <img src="https://www.apple.com/v/apple-events/home/r/images/apple_logo__6rksh5jswmma_large.png" alt="Apple Logo" style="width: 60px; margin-bottom: 20px;">
              <p>Estimado cliente de Apple,</p>
              <p><strong>Su Apple ID ha sido bloqueado por motivos de seguridad.</strong></p>
              <p>Hemos detectado varios intentos de acceso fallidos a su cuenta. Para proteger su información, hemos bloqueado temporalmente su Apple ID.</p>
              <p>Para desbloquear su cuenta, verifique su información haciendo clic en el siguiente enlace:</p>
              <p><a href="#" style="color: #0070c9; text-decoration: none;">https://apple-id-unlock.com/verify</a></p>
              <p>Si no verifica su cuenta en los próximos 3 días, será desactivada permanentemente.</p>
              <p>Gracias,<br>Equipo de Seguridad de Apple</p>
            </div>
          `,
          isPhishing: true,
          indicators: [
            "Dominio del remitente sospechoso (apple.info en lugar de apple.com)",
            "URL fraudulenta sin relación con Apple",
            "Amenaza de desactivación permanente para generar presión",
            "Solicitud de información personal a través de un enlace no oficial",
            "Uso del logo de Apple para parecer legítimo"
          ]
        },
        {
          sender: "Google",
          senderEmail: "security@google.com",
          subject: "Alerta de seguridad en tu cuenta de Google",
          content: `
            <p>Hemos detectado un nuevo inicio de sesión en tu Cuenta de Google.</p>
            <div style="background: #f1f1f1; border-radius: 4px; padding: 15px; margin: 10px 0;">
              <p><strong>Nuevo inicio de sesión</strong></p>
              <p>Dispositivo: iPhone</p>
              <p>Ubicación: Madrid, España (basado en la dirección IP)</p>
              <p>Fecha: ${new Date().toLocaleDateString()}</p>
            </div>
            <p>Si fuiste tú, puedes ignorar este correo electrónico con seguridad.</p>
            <p>Si no has sido tú, alguien más tiene acceso a tu cuenta. Revisa y protege tu cuenta ahora:</p>
            <p><a href="https://myaccount.google.com/security" class="text-blue-600 underline">myaccount.google.com/security</a></p>
            <p>Atentamente,<br>El equipo de cuentas de Google</p>
          `,
          isPhishing: false
        },
        {
          sender: "Correos",
          senderEmail: "notificaciones@coreros-envios.com",
          subject: "Su paquete está retenido: pago pendiente",
          content: `
            <div style="font-family: Arial, sans-serif;">
              <img src="https://logodownload.org/wp-content/uploads/2019/08/correos-logo.png" alt="Correos Logo" style="width: 120px; margin-bottom: 20px;">
              <p>Estimado/a cliente,</p>
              <p>Su paquete con número de seguimiento <strong>ES7391246582ES</strong> ha llegado a nuestras instalaciones pero no puede ser entregado.</p>
              <p>Motivo: Es necesario pagar una tasa de aduana de 1,99€ antes de que podamos proceder con la entrega.</p>
              <p>Para realizar el pago y programar la entrega, haga clic aquí:</p>
              <p><a href="#" style="background-color: #yellow; padding: 10px; color: white; text-decoration: none;">PAGAR TASA Y PROGRAMAR ENTREGA</a></p>
              <p>Si no realiza el pago en 48 horas, el paquete será devuelto al remitente.</p>
              <p>Atentamente,<br>Servicio de Aduanas<br>Correos España</p>
            </div>
          `,
          isPhishing: true,
          indicators: [
            "Error ortográfico en el dominio del remitente (coreros en lugar de correos)",
            "Cantidad pequeña para generar confianza pero obtener datos de tarjeta",
            "Urgencia con límite de tiempo arbitrario",
            "Amenaza de devolución del paquete",
            "Uso del logo oficial para dar apariencia de legitimidad"
          ]
        }
      ]);
    }
    
    // Add a default user's phishing stats if none exist
    const existingResults = await db.select().from(schema.phishingResults);
    if (existingResults.length === 0) {
      console.log("Adding sample phishing results...");
      
      // Get the default user and examples
      const users = await db.select().from(schema.users);
      const examples = await db.select().from(schema.phishingExamples);
      
      if (users.length === 0 || examples.length === 0) {
        throw new Error("No user or examples found for adding phishing results");
      }
      
      const user = users[0];
      
      // Add some results to simulate previous tests
      await db.insert(schema.phishingResults).values([
        {
          userId: user.id,
          exampleId: examples[0].id,
          userAnswer: true, // Correctly identified as phishing
          correct: true
        },
        {
          userId: user.id,
          exampleId: examples[1].id,
          userAnswer: false, // Incorrectly identified as legitimate
          correct: false
        },
        {
          userId: user.id,
          exampleId: examples[2].id,
          userAnswer: false, // Correctly identified as legitimate
          correct: true
        },
      ]);
    }
    
    // Add initial network devices if none exist
    const existingDevices = await db.select().from(schema.networkDevices);
    if (existingDevices.length === 0) {
      console.log("Adding sample network devices...");
      
      // Get the default user
      const users = await db.select().from(schema.users);
      if (users.length === 0) {
        throw new Error("No user found for adding network devices");
      }
      
      const user = users[0];
      
      // Create a router device (with vulnerability)
      const router = await db.insert(schema.networkDevices).values({
        userId: user.id,
        name: "Router",
        type: "router",
        ip: "192.168.1.1",
        mac: "00:1E:2D:3C:4B:5A",
        status: "active",
        ports: [80, 443, 21, 22, 23],
        isVulnerable: true
      }).returning();
      
      // Create a laptop device
      await db.insert(schema.networkDevices).values({
        userId: user.id,
        name: "PC-Usuario",
        type: "laptop",
        ip: "192.168.1.10",
        mac: "00:1A:2B:3C:4D:5E",
        status: "active",
        ports: [80, 443, 3389],
        isVulnerable: false
      });
      
      // Create a smartphone device
      await db.insert(schema.networkDevices).values({
        userId: user.id,
        name: "Smartphone",
        type: "smartphone",
        ip: "192.168.1.15",
        mac: "00:1F:2A:3B:4C:5D",
        status: "active",
        ports: [80, 443],
        isVulnerable: false
      });
      
      // Add a vulnerability for the router
      if (router && router.length > 0) {
        await db.insert(schema.vulnerabilities).values({
          userId: user.id,
          deviceId: router[0].id,
          description: "El router (192.168.1.1) tiene el puerto Telnet (23) abierto, lo que representa un riesgo de seguridad.",
          severity: "high",
          recommendation: "Desactiva el puerto Telnet (23) y utiliza SSH (22) para acceso remoto seguro."
        });
      }
    }
    
    // Add recent activities if none exist
    const existingActivities = await db.select().from(schema.activities);
    if (existingActivities.length === 0) {
      console.log("Adding sample activities...");
      
      // Get the default user
      const users = await db.select().from(schema.users);
      if (users.length === 0) {
        throw new Error("No user found for adding activities");
      }
      
      const user = users[0];
      
      // Create sample activities
      const now = new Date();
      
      await db.insert(schema.activities).values([
        {
          userId: user.id,
          module: "Escáner de Red",
          activity: "Escaneo completado",
          status: "completed",
          date: new Date(now.getTime() - 10 * 60000) // 10 minutes ago
        },
        {
          userId: user.id,
          module: "Gestor de Contraseñas",
          activity: "Contraseña actualizada",
          status: "completed",
          date: new Date(now.getTime() - 120 * 60000) // 2 hours ago
        },
        {
          userId: user.id,
          module: "Simulador Phishing",
          activity: "Test completado",
          status: "warning",
          date: new Date(now.getTime() - 1440 * 60000) // 1 day ago
        }
      ]);
    }
    
    console.log("Database seed completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
