import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { hideMessage, extractMessage } from '../steganography';
import {promises as fs} from 'fs';
import path from 'path';

describe('Steganography', () => {
  const imageDir = path.join(__dirname, 'images');
  const outputDir = path.join(__dirname, 'output');
  const encryptionKey = 'a-secret-key-for-testing'; // Clave para los tests

  beforeAll(async () => {
    await fs.mkdir(outputDir, { recursive: true });
  });

  afterAll(async () => {
    await fs.rm(outputDir, { recursive: true, force: true });
  });

  const runSteganographyTest = async (imageName: string, message: string, encrypt: boolean) => {
    const imagePath = path.join(imageDir, imageName);
    const outputPath = path.join(outputDir, `stego_${imageName}`);
    
    try {
      await fs.access(imagePath);
    } catch (error) {
      console.warn(`Skipping test for ${imageName}: image not found`);
      return;
    }

    const imageBuffer = await fs.readFile(imagePath);

    // Ocultar el mensaje
    const stegoImageBuffer = await hideMessage(imageBuffer, message, encrypt, encrypt ? encryptionKey : null);
    await fs.writeFile(outputPath, stegoImageBuffer);

    // Extraer el mensaje
    const revealedMessage = await extractMessage(stegoImageBuffer, encrypt, encrypt ? encryptionKey : null);

    expect(revealedMessage).toBe(message);
  };

  describe('PNG', () => {
    const pngImage = 'test.png';
    const message = 'This is a secret message for PNG.';

    it('should hide and reveal a message without encryption', async () => {
      await runSteganographyTest(pngImage, message, false);
    });

    it('should hide and reveal a message with encryption', async () => {
      await runSteganographyTest(pngImage, message, true);
    });

    it('should throw an error when trying to extract an encrypted message without providing the key', async () => {
      const imagePath = path.join(imageDir, pngImage);
      const outputPath = path.join(outputDir, `stego_encrypted_${pngImage}`);
      
      try {
        await fs.access(imagePath);
      } catch (error) {
        console.warn(`Skipping test for ${pngImage}: image not found`);
        return;
      }

      const imageBuffer = await fs.readFile(imagePath);

      // 1. Hide message WITH encryption
      const stegoImageBuffer = await hideMessage(imageBuffer, message, true, encryptionKey);
      await fs.writeFile(outputPath, stegoImageBuffer);

      // 2. Try to extract WITHOUT the key and expect it to fail
      await expect(extractMessage(stegoImageBuffer, false, null)).rejects.toThrow(
        'El mensaje está encriptado. Debe proporcionar el parámetro encrypted=true y una clave de desencriptación'
      );
    });

    it('should throw an error if the message is too large for the image', async () => {
      const smallImageName = 'small_test.png';
      const imagePath = path.join(imageDir, smallImageName);
      const longMessage = 'a'.repeat(10000); // Un mensaje muy largo

      try {
        await fs.access(imagePath);
      } catch (error) {
        console.warn(`Skipping test for ${smallImageName}: image not found`);
        return;
      }

      const imageBuffer = await fs.readFile(imagePath);

      await expect(hideMessage(imageBuffer, longMessage, false)).rejects.toThrow(
        'La imagen es demasiado pequeña para ocultar el mensaje'
      );
    });
  });
});

// Future Test Cases to Consider:
//
// 1.  **Wrong Decryption Key:**
//     - Test that `extractMessage` throws a specific error (or returns garbled data, depending on the desired behavior of `decryptText`)
//       if a message is hidden with one key and an attempt is made to extract it with a different key.
//
// 2.  **Edge Case Messages:**
//     - Test with an empty string as a message.
//     - Test with messages containing special characters, unicode, and emojis to ensure proper encoding/decoding.
//
// 3.  **Image Format Variations:**
//     - Test with PNG images that have an alpha channel vs. those that do not.
//     - If other formats are supported in the future (like JPEG), add tests for them, expecting them to fail gracefully
//       or be handled if the logic is expanded.
//
// 4.  **Corrupted Data:**
//     - Test how the `extractMessage` function behaves if the steganographic data in the image is partially corrupted
//       (e.g., the end marker is missing or the length header is invalid).
  });
  
});