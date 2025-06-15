import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
      return new Intl.DateTimeFormat('es', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj);
    }
    return '';
  } catch {
    return '';
  }
}

export function getPasswordStrength(password: string): { strength: number; label: string } {
  if (!password) return { strength: 0, label: "Sin contraseña" };
  
  let score = 0;
  
  // Longitud (max 30 puntos)
  score += Math.min(password.length * 2, 30);
  
  // Variedad de caracteres (max 70 puntos)
  if (/[A-Z]/.test(password)) score += 15;
  if (/[a-z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 20;
  
  // Complejidad adicional
  const uniqueChars = new Set(password).size;
  score += Math.min(uniqueChars * 1.5, 10);
  
  // Penalización por patrones comunes
  if (/^[A-Za-z]+\d+$/.test(password)) score -= 10; // Letras seguidas por números
  if (/123|abc|qwerty|password|contraseña/i.test(password)) score -= 15;
  
  // Límites
  score = Math.max(0, Math.min(score, 100));
  
  // Determinar etiqueta
  let label = "Débil";
  if (score >= 80) label = "Muy fuerte";
  else if (score >= 60) label = "Fuerte";
  else if (score >= 40) label = "Media";
  else if (score >= 20) label = "Débil";
  else label = "Muy débil";
  
  return { strength: score, label };
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function getDeviceIcon(deviceType: string): string {
  switch (deviceType.toLowerCase()) {
    case 'router':
      return 'wifi';
    case 'smartphone':
    case 'phone':
    case 'mobile':
      return 'mobile';
    case 'laptop':
      return 'laptop';
    case 'desktop':
    case 'pc':
      return 'desktop';
    case 'tablet':
      return 'tablet';
    case 'tv':
    case 'smart tv':
      return 'tv';
    case 'printer':
      return 'printer';
    case 'camera':
      return 'camera';
    case 'server':
      return 'server';
    default:
      return 'device-desktop';
  }
}

export function getPortRiskLevel(port: number): "safe" | "warning" | "danger" {
  // Common safe ports
  const safePorts = [80, 443, 143, 993, 995, 110, 5000, 8000, 8080, 5432];
  // Ports that need caution
  const warningPorts = [22, 25, 587, 465, 3306, 1433];
  // Dangerous ports
  const dangerPorts = [21, 23, 3389, 445, 139, 135, 1434, 69, 161, 162, 514, 53];

  if (safePorts.includes(port)) return "safe";
  if (warningPorts.includes(port)) return "warning";
  if (dangerPorts.includes(port)) return "danger";
  
  // Default to warning for unknown ports
  return "warning";
}

export function getPortServiceName(port: number): string {
  const portMap: Record<number, string> = {
    21: "FTP",
    22: "SSH",
    23: "Telnet",
    25: "SMTP",
    53: "DNS",
    80: "HTTP",
    110: "POP3",
    143: "IMAP",
    443: "HTTPS",
    445: "SMB",
    465: "SMTPS",
    587: "SMTP",
    993: "IMAPS",
    995: "POP3S",
    3306: "MySQL",
    3389: "RDP",
    5000: "App",
    5432: "PostgreSQL",
    8000: "Alt HTTP",
    8080: "Alt HTTP"
  };
  
  return portMap[port] || `Port ${port}`;
}
