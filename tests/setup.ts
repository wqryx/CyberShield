import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// Extiende los matchers de Vitest
expect.extend(matchers);

// Limpia después de cada prueba
afterEach(() => {
  cleanup();
});