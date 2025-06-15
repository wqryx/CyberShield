import { describe, it, expect } from 'vitest';
import {
  getDeviceIcon,
  getPortRiskLevel,
  getPortServiceName,
} from '@/lib/utils';

describe('Utilidades de red', () => {
  describe('getDeviceIcon', () => {
    it('debería devolver iconos adecuados para cada tipo de dispositivo', () => {
      expect(getDeviceIcon('router')).toContain('router');
      expect(getDeviceIcon('laptop')).toContain('laptop');
      expect(getDeviceIcon('desktop')).toContain('monitor');
      expect(getDeviceIcon('smartphone')).toContain('smartphone');
      expect(getDeviceIcon('printer')).toContain('printer');
      expect(getDeviceIcon('camera')).toContain('camera');
      expect(getDeviceIcon('tv')).toContain('tv');
      
      // Para un tipo desconocido
      expect(getDeviceIcon('unknown')).toContain('device');
    });
  });

  describe('getPortRiskLevel', () => {
    it('debería identificar correctamente puertos de alto riesgo', () => {
      expect(getPortRiskLevel(23)).toBe('danger'); // Telnet
      expect(getPortRiskLevel(21)).toBe('danger'); // FTP
      expect(getPortRiskLevel(3389)).toBe('danger'); // RDP
    });

    it('debería identificar correctamente puertos de riesgo medio', () => {
      expect(getPortRiskLevel(22)).toBe('warning'); // SSH
      expect(getPortRiskLevel(139)).toBe('warning'); // NetBIOS
      expect(getPortRiskLevel(445)).toBe('warning'); // SMB
    });

    it('debería identificar correctamente puertos de bajo riesgo', () => {
      expect(getPortRiskLevel(80)).toBe('safe'); // HTTP
      expect(getPortRiskLevel(443)).toBe('safe'); // HTTPS
      expect(getPortRiskLevel(53)).toBe('safe'); // DNS
    });
  });

  describe('getPortServiceName', () => {
    it('debería devolver nombres de servicios correctos para puertos conocidos', () => {
      expect(getPortServiceName(80)).toBe('HTTP');
      expect(getPortServiceName(443)).toBe('HTTPS');
      expect(getPortServiceName(22)).toBe('SSH');
      expect(getPortServiceName(21)).toBe('FTP');
      expect(getPortServiceName(23)).toBe('Telnet');
      expect(getPortServiceName(25)).toBe('SMTP');
      expect(getPortServiceName(53)).toBe('DNS');
      expect(getPortServiceName(3306)).toBe('MySQL');
      expect(getPortServiceName(5432)).toBe('PostgreSQL');
      expect(getPortServiceName(8080)).toBe('HTTP Alternativo');
      
      // Para un puerto desconocido
      expect(getPortServiceName(12345)).toBe('Desconocido');
    });
  });
});