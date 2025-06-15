import CryptoJS from 'crypto-js';

/**
 * Encrypt sensitive data using AES encryption
 * 
 * @param data - The data to encrypt
 * @param passphrase - The encryption passphrase
 * @returns The encrypted data as a string
 */
export function encryptData(data: string, passphrase: string): string {
  if (!data || !passphrase) {
    throw new Error('Data and passphrase are required for encryption');
  }
  
  try {
    return CryptoJS.AES.encrypt(data, passphrase).toString();
  } catch (error) {
    console.error('Error encrypting data:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt previously encrypted data
 * 
 * @param encryptedData - The encrypted data string
 * @param passphrase - The encryption passphrase
 * @returns The decrypted data
 */
export function decryptData(encryptedData: string, passphrase: string): string {
  if (!encryptedData || !passphrase) {
    throw new Error('Encrypted data and passphrase are required for decryption');
  }
  
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, passphrase);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Generate a secure encryption key
 * 
 * @returns A random secure key
 */
export function generateEncryptionKey(): string {
  return CryptoJS.lib.WordArray.random(16).toString();
}

/**
 * Generate a secure random password
 * 
 * @param length - The length of the password
 * @param options - Configuration options for password generation
 * @returns A randomly generated password
 */
export function generatePassword(
  length: number = 16,
  options: {
    includeUppercase?: boolean;
    includeLowercase?: boolean;
    includeNumbers?: boolean;
    includeSymbols?: boolean;
  } = {
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  }
): string {
  if (length < 8) {
    length = 8; // Enforce minimum length for security
  }
  
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  let allowedChars = '';
  if (options.includeUppercase) allowedChars += uppercaseChars;
  if (options.includeLowercase) allowedChars += lowercaseChars;
  if (options.includeNumbers) allowedChars += numberChars;
  if (options.includeSymbols) allowedChars += symbolChars;
  
  // Fallback if no character sets were selected
  if (!allowedChars) {
    allowedChars = lowercaseChars + numberChars;
  }
  
  let password = '';
  const randomArray = CryptoJS.lib.WordArray.random(length * 2);
  const randomString = randomArray.toString();
  
  for (let i = 0; i < length; i++) {
    const randomIndex = (
      randomString.charCodeAt(i) + randomString.charCodeAt(i + length)
    ) % allowedChars.length;
    password += allowedChars.charAt(randomIndex);
  }
  
  return password;
}

/**
 * Hash a password using SHA-256
 * 
 * @param password - The password to hash
 * @returns The hashed password
 */
export function hashPassword(password: string): string {
  return CryptoJS.SHA256(password).toString();
}
