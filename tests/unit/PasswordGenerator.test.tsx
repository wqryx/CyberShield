import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PasswordGenerator } from '@/components/password-manager/PasswordGenerator';

// Mock de la función de generación de contraseñas
vi.mock('@/lib/encryption', () => ({
  generatePassword: vi.fn((length, options) => {
    // Simulación simple para pruebas
    const chars = [];
    if (options.includeUppercase) chars.push('A');
    if (options.includeLowercase) chars.push('a');
    if (options.includeNumbers) chars.push('1');
    if (options.includeSymbols) chars.push('#');
    
    return Array(length).fill(0).map(() => 
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  }),
  getPasswordStrength: vi.fn((password) => {
    const strength = password.length * 8;
    return {
      strength,
      label: strength < 40 ? 'Débil' : strength < 70 ? 'Media' : 'Fuerte'
    };
  })
}));

describe('PasswordGenerator', () => {
  it('debería renderizar el generador de contraseñas correctamente', () => {
    render(<PasswordGenerator />);
    
    // Verificar que se muestra el título
    expect(screen.getByText('Generador de Contraseñas')).toBeInTheDocument();
    
    // Verificar que hay un control deslizante para la longitud
    expect(screen.getByText('Longitud:')).toBeInTheDocument();
    
    // Verificar que existen las opciones de configuración
    expect(screen.getByText('Mayúsculas')).toBeInTheDocument();
    expect(screen.getByText('Minúsculas')).toBeInTheDocument();
    expect(screen.getByText('Números')).toBeInTheDocument();
    expect(screen.getByText('Símbolos')).toBeInTheDocument();
    
    // Verificar que existe el botón de generar
    expect(screen.getByText('Generar Contraseña')).toBeInTheDocument();
  });

  it('debería generar una contraseña al hacer clic en el botón', () => {
    render(<PasswordGenerator />);
    
    // Hacer clic en el botón de generar
    fireEvent.click(screen.getByText('Generar Contraseña'));
    
    // Verificar que se muestra una contraseña generada
    const passwordField = screen.getByTestId('password-output');
    expect(passwordField).not.toHaveTextContent('');
  });

  it('debería permitir copiar la contraseña generada', () => {
    // Mock del API Clipboard
    const clipboardWriteTextMock = vi.fn();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: clipboardWriteTextMock },
      configurable: true
    });
    
    render(<PasswordGenerator />);
    
    // Generar una contraseña
    fireEvent.click(screen.getByText('Generar Contraseña'));
    
    // Hacer clic en el botón de copiar
    fireEvent.click(screen.getByTestId('copy-button'));
    
    // Verificar que se intentó copiar al portapapeles
    expect(clipboardWriteTextMock).toHaveBeenCalled();
  });

  it('debería actualizar la contraseña al cambiar la configuración', () => {
    render(<PasswordGenerator />);
    
    // Cambiar la longitud de la contraseña
    const lengthInput = screen.getByTestId('length-input');
    fireEvent.change(lengthInput, { target: { value: '16' } });
    
    // Desactivar algunas opciones
    const upperCaseCheckbox = screen.getByTestId('uppercase-checkbox');
    fireEvent.click(upperCaseCheckbox);
    
    // Generar una contraseña
    fireEvent.click(screen.getByText('Generar Contraseña'));
    
    // Verificar que se generó una contraseña
    const passwordField = screen.getByTestId('password-output');
    expect(passwordField).not.toHaveTextContent('');
  });
});