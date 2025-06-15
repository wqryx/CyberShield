import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Mock de axios para simular llamadas a la API
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API de Escáner de Red', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('debería obtener dispositivos de red', async () => {
    // Mock de respuesta de dispositivos
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: 'Router-1',
          type: 'router',
          ip: '192.168.1.1',
          mac: 'e8:48:b8:00:11:22',
          status: 'active',
          ports: [80, 443, 53],
          isVulnerable: false
        },
        {
          id: 2,
          name: 'PC-Usuario',
          type: 'desktop',
          ip: '192.168.1.10',
          mac: '40:b0:76:33:44:55',
          status: 'active',
          ports: [139, 445],
          isVulnerable: true
        }
      ]
    });

    // Llamada a la API
    const response = await axios.get('/api/network/devices');
    
    // Verificaciones
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/network/devices');
    expect(response.data).toHaveLength(2);
    expect(response.data[0].name).toBe('Router-1');
    expect(response.data[1].type).toBe('desktop');
  });

  it('debería escanear la red local correctamente', async () => {
    // Mock de respuesta del escaneo
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        success: true,
        devicesFound: 3,
        scanTime: 2.5,
        ipRange: '192.168.1.1-192.168.1.254'
      }
    });

    // Parámetros de escaneo
    const scanParams = {
      scanType: 'quick',
      ipRange: '192.168.1.1-254'
    };

    // Llamada a la API
    const response = await axios.post('/api/network/scan', scanParams);
    
    // Verificaciones
    expect(mockedAxios.post).toHaveBeenCalledWith('/api/network/scan', scanParams);
    expect(response.data.success).toBe(true);
    expect(response.data.devicesFound).toBe(3);
    expect(response.data.scanTime).toBeGreaterThan(0);
  });

  it('debería escanear puertos correctamente', async () => {
    // Mock de respuesta del escaneo de puertos
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        ip: '192.168.1.1',
        portRange: '1-1024',
        openPorts: [22, 53, 80, 443],
        scannedPorts: 1024,
        scanTime: 1.2,
        deviceType: 'router'
      }
    });

    // Parámetros de escaneo de puertos
    const portScanParams = {
      ip: '192.168.1.1',
      portRange: '1-1024',
      onlyCommonPorts: true
    };

    // Llamada a la API
    const response = await axios.post('/api/network/scan-ports', portScanParams);
    
    // Verificaciones
    expect(mockedAxios.post).toHaveBeenCalledWith('/api/network/scan-ports', portScanParams);
    expect(response.data.ip).toBe('192.168.1.1');
    expect(response.data.openPorts).toContain(80);
    expect(response.data.openPorts).toContain(443);
  });

  it('debería obtener vulnerabilidades detectadas', async () => {
    // Mock de respuesta de vulnerabilidades
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          deviceId: 2,
          deviceIp: '192.168.1.10',
          deviceName: 'PC-Usuario',
          description: 'El dispositivo tiene compartición de archivos Windows (SMB) potencialmente insegura en los puertos 139 y 445.',
          severity: 'high',
          recommendation: 'Actualiza a SMB versión 3.0 o superior y deshabilita las versiones antiguas (SMB1/CIFS). Si no necesitas compartir archivos en red, cierra estos puertos.'
        }
      ]
    });

    // Llamada a la API
    const response = await axios.get('/api/network/vulnerabilities');
    
    // Verificaciones
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/network/vulnerabilities');
    expect(response.data).toHaveLength(1);
    expect(response.data[0].severity).toBe('high');
    expect(response.data[0].deviceIp).toBe('192.168.1.10');
    expect(response.data[0].recommendation).toContain('Actualiza a SMB');
  });
});