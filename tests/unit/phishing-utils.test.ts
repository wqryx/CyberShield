import { describe, it, expect, vi } from 'vitest';

// Función para analizar direcciones de correo electrónico sospechosas
function analizarDireccionEmail(email: string): { esSospechoso: boolean; razon?: string } {
  // Verificar dominios sospechosos
  const dominiosSospechosos = [
    'googgle.com', 'amaz0n.com', 'paypa1.com', 'facebok.com', 
    'micros0ft.com', 'banc0santander.com', 'appleid-secure.com'
  ];
  
  const dominio = email.split('@')[1]?.toLowerCase();
  
  if (!dominio) {
    return { esSospechoso: true, razon: 'Formato de email inválido' };
  }
  
  // Comprobar si es un dominio sospechoso conocido
  if (dominiosSospechosos.includes(dominio)) {
    return { 
      esSospechoso: true, 
      razon: `Dominio ${dominio} es una imitación de un servicio legítimo` 
    };
  }
  
  // Comprobar si tiene caracteres que parecen legítimos pero no lo son
  if (dominio.includes('0') || dominio.includes('1')) {
    return { 
      esSospechoso: true, 
      razon: 'Contiene caracteres numéricos que imitan letras' 
    };
  }
  
  // Verificar dominio muy similar a uno legítimo
  const dominiosLegitimos = ['google.com', 'amazon.com', 'paypal.com', 'facebook.com', 'microsoft.com'];
  for (const legitimo of dominiosLegitimos) {
    // Calcular distancia de Levenshtein simplificada
    if (dominio !== legitimo && esSimilar(dominio, legitimo)) {
      return { 
        esSospechoso: true, 
        razon: `Dominio similar a ${legitimo}` 
      };
    }
  }
  
  return { esSospechoso: false };
}

// Función simple para verificar si dos cadenas son similares (distancia de edición)
function esSimilar(str1: string, str2: string): boolean {
  if (Math.abs(str1.length - str2.length) > 3) return false;
  
  let diferencias = 0;
  const maxDiferencias = Math.ceil(str1.length * 0.3); // 30% de tolerancia
  
  // Verificación simplificada (en producción usaríamos un algoritmo real de distancia de edición)
  for (let i = 0; i < Math.min(str1.length, str2.length); i++) {
    if (str1[i] !== str2[i]) {
      diferencias++;
      if (diferencias > maxDiferencias) return false;
    }
  }
  
  return diferencias > 0 && diferencias <= maxDiferencias;
}

// Función para analizar URLs sospechosas
function analizarUrl(url: string): { esSospechoso: boolean; razon?: string } {
  try {
    const urlObj = new URL(url);
    const dominio = urlObj.hostname.toLowerCase();
    
    // Verificar protocolo
    if (urlObj.protocol !== 'https:') {
      return { 
        esSospechoso: true, 
        razon: 'No utiliza HTTPS (conexión no segura)' 
      };
    }
    
    // Dominios sospechosos conocidos
    const dominiosSospechosos = [
      'secure-banking-login.com', 'account-verify.net', 'signin-secure.com',
      'verify-account-now.com', 'customer-portal-secure.com'
    ];
    
    if (dominiosSospechosos.some(d => dominio.includes(d))) {
      return { 
        esSospechoso: true, 
        razon: 'Dominio sospechoso conocido' 
      };
    }
    
    // Verificar subdominios que intentan parecer legítimos
    const marcasConocidas = ['paypal', 'amazon', 'apple', 'microsoft', 'google', 'facebook', 'netflix'];
    for (const marca of marcasConocidas) {
      if (dominio.includes(marca) && !dominio.endsWith(`.${marca}.com`)) {
        return { 
          esSospechoso: true, 
          razon: `Intenta suplantar a ${marca}` 
        };
      }
    }
    
    // Verificar parámetros de redirección sospechosos
    const parametrosSospechosos = ['redirect', 'url', 'link', 'goto', 'return'];
    for (const param of parametrosSospechosos) {
      if (urlObj.searchParams.has(param)) {
        const valorRedireccion = urlObj.searchParams.get(param) || '';
        if (valorRedireccion.includes('http')) {
          return { 
            esSospechoso: true, 
            razon: 'Contiene redirección a otro sitio' 
          };
        }
      }
    }
    
    return { esSospechoso: false };
  } catch (error) {
    return { esSospechoso: true, razon: 'URL mal formada' };
  }
}

// Pruebas
describe('Utilidades de detección de phishing', () => {
  describe('analizarDireccionEmail', () => {
    it('debería detectar dominios de phishing conocidos', () => {
      const resultado = analizarDireccionEmail('soporte@paypa1.com');
      expect(resultado.esSospechoso).toBe(true);
      expect(resultado.razon).toContain('imitación');
    });
    
    it('debería detectar emails con caracteres numéricos que imitan letras', () => {
      const resultado = analizarDireccionEmail('secure@micros0ft.com');
      expect(resultado.esSospechoso).toBe(true);
      expect(resultado.razon).toContain('caracteres numéricos');
    });
    
    it('debería detectar dominios similares a legítimos', () => {
      const resultado = analizarDireccionEmail('soporte@googgle.com');
      expect(resultado.esSospechoso).toBe(true);
    });
    
    it('debería aceptar direcciones de correo legítimas', () => {
      const resultado = analizarDireccionEmail('usuario@gmail.com');
      expect(resultado.esSospechoso).toBe(false);
    });
  });
  
  describe('analizarUrl', () => {
    it('debería detectar URLs sin HTTPS', () => {
      const resultado = analizarUrl('http://secure-banking.com/login');
      expect(resultado.esSospechoso).toBe(true);
      expect(resultado.razon).toContain('HTTPS');
    });
    
    it('debería detectar dominios sospechosos conocidos', () => {
      const resultado = analizarUrl('https://account-verify.net/secure-login');
      expect(resultado.esSospechoso).toBe(true);
      expect(resultado.razon).toContain('sospechoso conocido');
    });
    
    it('debería detectar suplantación de marcas conocidas', () => {
      const resultado = analizarUrl('https://paypal-secure-account.com/login');
      expect(resultado.esSospechoso).toBe(true);
      expect(resultado.razon).toContain('suplantar');
    });
    
    it('debería detectar redirecciones sospechosas', () => {
      const resultado = analizarUrl('https://example.com/login?redirect=https://malicious.com');
      expect(resultado.esSospechoso).toBe(true);
      expect(resultado.razon).toContain('redirección');
    });
    
    it('debería aceptar URLs legítimas', () => {
      const resultado = analizarUrl('https://www.microsoft.com/es-es/account/login');
      expect(resultado.esSospechoso).toBe(false);
    });
  });
});