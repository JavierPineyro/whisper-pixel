// app/api/decode/route.js
import { extractMessage } from '@/server/steganography';
import { NextResponse } from 'next/server';

/**
 * API handler para extraer mensajes ocultos en imágenes usando esteganografía
 * Recibe un FormData con el campo 'image' y opcionalmente 'encrypted'
 * Devuelve el mensaje extraído en formato JSON
 */
export async function POST(request) {
  try {
    // Verificar que el request sea FormData
    if (!request.headers.get('content-type')?.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Se requiere FormData' },
        { status: 400 }
      );
    }

    // Obtener FormData del request
    const formData = await request.formData();
    
    // Extraer la imagen
    const imageFile = formData.get('image');
    
    // Validar que se haya enviado la imagen
    if (!imageFile) {
      return NextResponse.json(
        { error: 'Se requiere el campo "image"' },
        { status: 400 }
      );
    }
    
    // Validar que el archivo sea una imagen PNG
    if (!imageFile.type || !imageFile.type.startsWith('image/png')) {
      return NextResponse.json(
        { error: 'Solo se admiten imágenes PNG' },
        { status: 400 }
      );
    }
    
    // Convertir imagen a ArrayBuffer
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    
    // Obtener parámetros de encriptación
    const encrypted = formData.get('encrypted') === 'true';
    // Usar la clave de encriptación desde variables de entorno
    const encryptionKey = encrypted ? process.env.STEGANOGRAPHY_KEY : null;
    
    // Extraer el mensaje de la imagen
    const extractedMessage = await extractMessage(
      imageBuffer,
      encrypted,
      encryptionKey
    );
    
    // Devolver el mensaje extraído
    return NextResponse.json({
      success: true,
      message: extractedMessage
    });
    
  } catch (error) {
    console.error('Error al extraer mensaje:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Error al procesar la imagen' 
      },
      { status: 500 }
    );
  }
}
