// crypto-utils.ts
import crypto from 'crypto';

/**
 * Algoritmo de encriptación a utilizar
 * AES-256-GCM proporciona autenticación además de confidencialidad
 */
const ALGORITHM: string = 'aes-256-gcm';
const IV_LENGTH: number = 16; // Longitud del vector de inicialización para AES
const AUTH_TAG_LENGTH: number = 16; // Longitud del tag de autenticación para GCM

/**
 * Encripta un mensaje utilizando AES-256-GCM
 * @param {string} text - Texto a encriptar
 * @param {string} key - Clave de encriptación
 * @returns {string} - Texto encriptado en formato base64
 */
export function encryptText(text: string, key: string): string {
  try {
    // Asegurar que la clave tenga la longitud correcta (32 bytes para AES-256)
    const hash = crypto.createHash('sha256');
    hash.update(key);
    const keyBuffer: Buffer = hash.digest();
    
    // Generar vector de inicialización aleatorio
    const iv: Buffer = crypto.randomBytes(IV_LENGTH);
    
    // Crear cifrador
    const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);
    
    // Encriptar el texto
    let encrypted: string = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    // Obtener el tag de autenticación
    const authTag: Buffer = cipher.getAuthTag();
    
    // Combinar IV, encrypted data y authTag
    const result: Buffer = Buffer.concat([
      iv,
      Buffer.from(encrypted, 'base64'),
      authTag
    ]);
    
    // Devolver como base64 para facilitar su manejo
    return result.toString('base64');
  } catch (error) {
    console.error('Error al encriptar:', error);
    throw new Error('Error al encriptar el mensaje');
  }
}

/**
 * Desencripta un mensaje encriptado con AES-256-GCM
 * @param {string} encryptedBase64 - Texto encriptado en formato base64
 * @param {string} key - Clave de encriptación
 * @returns {string} - Texto desencriptado
 */
export function decryptText(encryptedBase64: string, key: string): string {
  try {
    // Convertir el texto encriptado de base64 a Buffer
    const encryptedBuffer: Buffer = Buffer.from(encryptedBase64, 'base64');
    
    // Asegurar que la clave tenga la longitud correcta (32 bytes para AES-256)
    const hash = crypto.createHash('sha256');
    hash.update(key);
    const keyBuffer: Buffer = hash.digest();
    
    // Extraer IV, datos encriptados y authTag
    const iv: Buffer = encryptedBuffer.slice(0, IV_LENGTH);
    const authTag: Buffer = encryptedBuffer.slice(encryptedBuffer.length - AUTH_TAG_LENGTH);
    const encryptedText: Buffer = encryptedBuffer.slice(
      IV_LENGTH, 
      encryptedBuffer.length - AUTH_TAG_LENGTH
    );
    
    // Crear descifrador
    const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
    decipher.setAuthTag(authTag);
    
    // Desencriptar el texto
    let decrypted: string = decipher.update(encryptedText, undefined, 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Error al desencriptar:', error);
    throw new Error('Error al desencriptar el mensaje. Posiblemente la clave sea incorrecta o el texto esté corrupto.');
  }
}
