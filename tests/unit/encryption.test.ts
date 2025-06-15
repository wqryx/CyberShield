import { describe, it, expect } from 'vitest';
import { 
  encryptData, 
  decryptData, 
  generatePassword, 
  getPasswordStrength 
} from '@/lib/encryption';

describe('Funciones de encriptación', () => {
  it('debería encriptar y desencriptar datos correctamente', () => {
    const textoOriginal = 'Contraseña secreta';
    const passphrase = 'clave-maestra';
    
    const textoEncriptado = encryptData(textoOriginal, passphrase);
    expect(textoEncriptado).not.toBe(textoOriginal);
    
    const textoDesencriptado = decryptData(textoEncriptado, passphrase);
    expect(textoDesencriptado).toBe(textoOriginal);
  });
  
  it('debería generar contraseñas seguras con la longitud especificada', () => {
    const length = 12;
    const password = generatePassword(length, {
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true
    });
    
    expect(password.length).toBe(length);
    expect(password).toMatch(/[A-Z]/); // Debe contener mayúsculas
    expect(password).toMatch(/[a-z]/); // Debe contener minúsculas
    expect(password).toMatch(/[0-9]/); // Debe contener números
    expect(password).toMatch(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/); // Debe contener símbolos
  });
  
  it('debería evaluar correctamente la fortaleza de una contraseña', () => {
    const contraseñaDebil = '12345';
    const resultadoDebil = getPasswordStrength(contraseñaDebil);
    expect(resultadoDebil.strength).toBeLessThan(40);
    expect(resultadoDebil.label).toBe('Débil');
    
    const contraseñaMedia = 'Password123';
    const resultadoMedio = getPasswordStrength(contraseñaMedia);
    expect(resultadoMedio.strength).toBeGreaterThan(40);
    expect(resultadoMedio.strength).toBeLessThan(70);
    
    const contraseñaFuerte = 'P@ssw0rd!Compl3j#2023';
    const resultadoFuerte = getPasswordStrength(contraseñaFuerte);
    expect(resultadoFuerte.strength).toBeGreaterThan(70);
    expect(resultadoFuerte.label).toBe('Fuerte');
  });
});