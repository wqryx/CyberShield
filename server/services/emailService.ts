import { MailService } from '@sendgrid/mail';
import type { MailDataRequired } from '@sendgrid/mail';

// Verificar que la API key esté configurada
const apiKey = process.env.SENDGRID_API_KEY || '';
const isApiKeyConfigured = !!apiKey;

const mailService = new MailService();
mailService.setApiKey(apiKey);

// Función para enviar correos electrónicos
export async function sendEmail(options: {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}): Promise<boolean> {
  if (!isApiKeyConfigured) {
    console.warn(`No se pudo enviar el correo a ${options.to} porque la API key de SendGrid no está configurada`);
    return false;
  }

  try {
    const msg: MailDataRequired = {
      to: options.to,
      from: options.from,
      subject: options.subject,
      text: options.text || '',
      html: options.html || ''
    };

    await mailService.send(msg);
    console.log(`Correo enviado exitosamente a ${options.to}`);
    return true;
  } catch (error: any) {
    // Mensajes de error más específicos
    if (error.code === 403) {
      console.error('Error de autenticación con SendGrid (403 Forbidden): El remitente no está verificado o la API key no tiene permisos suficientes');
      console.error('Por favor verifique el email del remitente en el panel de SendGrid: Settings -> Sender Authentication -> Single Sender Verification');
    } else if (error.code === 401) {
      console.error('Error de autenticación con SendGrid (401 Unauthorized): API key inválida o expirada');
    } else {
      console.error('Error al enviar correo:', error);
    }
    return false;
  }
}

// Función para enviar correo de bienvenida
export async function sendWelcomeEmail(username: string, email: string): Promise<boolean> {
  // Utilizamos el email verificado proporcionado en las variables de entorno
  const fromEmail = process.env.SENDGRID_VERIFIED_EMAIL || ''; // Email verificado en SendGrid
  const currentYear = new Date().getFullYear();

  return sendEmail({
    to: email,
    from: fromEmail,
    subject: '¡Bienvenido a CyberShield!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #0f172a;">¡Bienvenido a CyberShield!</h1>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p>Hola <strong>${username}</strong>,</p>
          <p>¡Gracias por registrarte en CyberShield! Tu plataforma de seguridad digital personal.</p>
          <p>Con CyberShield podrás:</p>
          <ul>
            <li>Gestionar tus contraseñas de forma segura</li>
            <li>Aprender a detectar intentos de phishing</li>
            <li>Escanear y proteger tu red local</li>
          </ul>
        </div>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <p style="margin: 0;">¿Necesitas ayuda para comenzar? Explora nuestra plataforma y descubre todas sus funcionalidades.</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 12px;">
          <p>© ${currentYear} CyberShield. Todos los derechos reservados.</p>
          <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
        </div>
      </div>
    `,
    text: `¡Bienvenido a CyberShield!
    
Hola ${username},

¡Gracias por registrarte en CyberShield! Tu plataforma de seguridad digital personal.

Con CyberShield podrás:
- Gestionar tus contraseñas de forma segura
- Aprender a detectar intentos de phishing
- Escanear y proteger tu red local

¿Necesitas ayuda para comenzar? Explora nuestra plataforma y descubre todas sus funcionalidades.

© ${currentYear} CyberShield. Todos los derechos reservados.
Este es un correo automático, por favor no respondas a este mensaje.`
  });
}