// steganography-utils.ts
import sharp from 'sharp';
import { encryptText, decryptText } from './crypto-utils';

const END_MARKER: string = "#>fin<#";

/**
 * Oculta un mensaje en una imagen usando el método LSB
 * @param {Buffer} imageBuffer - Buffer de la imagen original
 * @param {string} message - Mensaje a ocultar
 * @param {boolean} encrypted - Si el mensaje debe ser encriptado
 * @param {string|null} encryptionKey - Clave para encriptar (opcional)
 * @returns {Promise<Buffer>} - Buffer de la imagen con el mensaje oculto
 */
export async function hideMessage(
  imageBuffer: Buffer, 
  message: string, 
  encrypted: boolean = false, 
  encryptionKey: string | null = null
): Promise<Buffer> {
  try {
    // Analizar información de la imagen
    const metadata = await sharp(imageBuffer).metadata();
    const { width, height, channels } = metadata;
    
    if (!width || !height || !channels) {
      throw new Error('No se pudieron obtener los metadatos de la imagen');
    }
    
    // Verificar que sea una imagen PNG
    if (metadata.format !== 'png') {
      throw new Error('Solo se admiten imágenes PNG');
    }
    
    // Encriptar el mensaje si es necesario
    let finalMessage: string = message;
    if (encrypted && encryptionKey) {
      // Usar la función de encriptación real
      finalMessage = encryptText(message, encryptionKey);
      // Añadir prefijo para indicar que está encriptado
      finalMessage = `encrypted:${finalMessage}`;
    }
    
    // Preparar el mensaje con marcador final
    const fullMessage: string = finalMessage + END_MARKER;
    const messageLength: number = fullMessage.length;
    
    // Crear cabecera de 16 bits (2 bytes) para la longitud
    const header = new Uint16Array(1);
    header[0] = messageLength;
    const headerBytes = new Uint8Array(header.buffer);
    
    // Convertir mensaje a bytes
    const textEncoder = new TextEncoder();
    const messageBytes = textEncoder.encode(fullMessage);
    
    // Combinar cabecera y mensaje
    const dataToHide = new Uint8Array(headerBytes.length + messageBytes.length);
    dataToHide.set(headerBytes, 0);
    dataToHide.set(messageBytes, headerBytes.length);
    
    // Verificar si hay suficiente espacio en la imagen
    // Cada byte del mensaje necesita 8 píxeles (1 bit por componente de color)
    const availablePixels = width * height;
    const requiredPixels = Math.ceil(dataToHide.length * 8 / 3); // Solo usamos R,G,B (no Alpha)
    
    if (requiredPixels > availablePixels) {
      throw new Error('La imagen es demasiado pequeña para ocultar el mensaje');
    }
    
    // Extraer los datos de píxeles raw
    const { data: pixelData } = await sharp(imageBuffer)
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    // Ocultar los datos en los bits menos significativos
    let bitIndex = 0;
    
    for (let i = 0; i < dataToHide.length; i++) {
      const byte = dataToHide[i];
      
      // Procesar cada bit del byte
      for (let j = 0; j < 8; j++) {
        const bit = (byte >> j) & 1;
        
        // Calcular la posición en el array de píxeles
        // Solo modificamos los canales R, G, B (no Alpha)
        const pixelPos = Math.floor(bitIndex / 3) * channels + (bitIndex % 3);
        
        // Asegurarse de no modificar el canal Alpha si existe
        if (pixelPos < pixelData.length && (pixelPos % channels) < 3) {
          // Modificar el bit menos significativo
          pixelData[pixelPos] = (pixelData[pixelPos] & 0xFE) | bit;
          bitIndex++;
        }
      }
    }
    
    // Reconstruir la imagen con los datos modificados
    const modifiedImage = await sharp(pixelData, {
      raw: {
        width,
        height,
        channels
      }
    })
    .png()
    .toBuffer();
    
    return modifiedImage;
  } catch (error) {
    console.error('Error al ocultar mensaje:', error);
    throw error;
  }
}

/**
 * Extrae un mensaje oculto de una imagen
 * @param {Buffer} imageBuffer - Buffer de la imagen con mensaje oculto
 * @param {boolean} encrypted - Si el mensaje está encriptado
 * @param {string|null} encryptionKey - Clave para desencriptar (opcional)
 * @returns {Promise<string>} - Mensaje extraído
 */
export async function extractMessage(
  imageBuffer: Buffer, 
  encrypted: boolean = false, 
  encryptionKey: string | null = null
): Promise<string> {
  try {
    // Analizar información de la imagen
    const metadata = await sharp(imageBuffer).metadata();
    const { width, height, channels } = metadata;
    
    if (!width || !height || !channels) {
      throw new Error('No se pudieron obtener los metadatos de la imagen');
    }
    
    // Verificar que sea una imagen PNG
    if (metadata.format !== 'png') {
      throw new Error('Solo se admiten imágenes PNG');
    }
    
    // Extraer los datos de píxeles raw
    const { data: pixelData } = await sharp(imageBuffer)
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Primero extraer los 2 bytes del encabezado (16 bits)
    const headerBytes = new Uint8Array(2);
    
    // Extraer cada bit de los 2 bytes del encabezado
    let bitIndex = 0;
    for (let i = 0; i < 2; i++) {
      let byte = 0;
      for (let j = 0; j < 8; j++) {
        // Calcular la posición en el array de píxeles
        const pixelPos = Math.floor(bitIndex / 3) * channels + (bitIndex % 3);
        
        // Asegurarse de solo leer de los canales R,G,B (no Alpha)
        if (pixelPos < pixelData.length && (pixelPos % channels) < 3) {
          // Extraer el bit menos significativo
          const bit = pixelData[pixelPos] & 1;
          byte |= (bit << j);
          bitIndex++;
        }
      }
      headerBytes[i] = byte;
    }
    
    // Convertir los bytes del encabezado a longitud del mensaje
    const headerView = new DataView(headerBytes.buffer);
    const messageLength = headerView.getUint16(0, true);
    
    // Verificar que la longitud sea razonable
    if (messageLength <= 0 || messageLength > 10000) {
      throw new Error('No se detectó un mensaje válido en la imagen');
    }
    
    // Extraer el mensaje basado en la longitud
    const messageBytes = new Uint8Array(messageLength);
    
    for (let i = 0; i < messageLength; i++) {
      let byte = 0;
      for (let j = 0; j < 8; j++) {
        // Calcular la posición en el array de píxeles
        const pixelPos = Math.floor(bitIndex / 3) * channels + (bitIndex % 3);
        
        // Asegurarse de solo leer de los canales R,G,B (no Alpha)
        if (pixelPos < pixelData.length && (pixelPos % channels) < 3) {
          // Extraer el bit menos significativo
          const bit = pixelData[pixelPos] & 1;
          byte |= (bit << j);
          bitIndex++;
        }
      }
      messageBytes[i] = byte;
    }
    
    // Decodificar los bytes a texto
    const textDecoder = new TextDecoder();
    const extractedText = textDecoder.decode(messageBytes);
    
    // Verificar el marcador final
    if (!extractedText.endsWith(END_MARKER)) {
      throw new Error('El mensaje extraído no tiene el formato correcto');
    }
    
    // Eliminar el marcador final
    let actualMessage = extractedText.slice(0, -END_MARKER.length);
    
    // Desencriptar si es necesario
    if (encrypted && encryptionKey && actualMessage.startsWith('encrypted:')) {
      // Quitar el prefijo 'encrypted:'
      const encryptedText = actualMessage.substring(10);
      // Usar la función de desencriptación real
      actualMessage = decryptText(encryptedText, encryptionKey);
    }
    
    return actualMessage;
  } catch (error) {
    console.error('Error al extraer mensaje:', error);
    throw error instanceof Error ? error : new Error('Error desconocido');
  }
}
