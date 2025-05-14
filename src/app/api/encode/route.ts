// app/api/encode/route.js
import { hideMessage } from '@/server/steganography';
import { NextResponse } from 'next/server';

/**
 * API handler para ocultar mensajes en imágenes usando esteganografía
 * Recibe un FormData con los campos 'image' y 'message'
 * Devuelve la imagen modificada como stream
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
    
    // Extraer la imagen y el mensaje
    const imageFile = formData.get('image');
    const message = formData.get('message');
    
    // Validar que se hayan enviado ambos campos
    if (!imageFile || !message) {
      return NextResponse.json(
        { error: 'Se requieren los campos "image" y "message"' },
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
    
    // Ocultar el mensaje en la imagen
    const modifiedImageBuffer = await hideMessage(
      imageBuffer,
      message,
      encrypted,
      encryptionKey
    );
    
    // Construir la respuesta como stream
    const headers = new Headers();
    headers.set('Content-Type', 'image/png');
    headers.set('Content-Disposition', 'attachment; filename="encoded_image.png"');
    
    // Devolver la imagen modificada como stream
    return new NextResponse(modifiedImageBuffer, {
      status: 200,
      headers
    });
    
  } catch (error) {
    console.error('Error en el endpoint de esteganografía:', error);
    
    return NextResponse.json(
      { error: error.message || 'Error al procesar la imagen' },
      { status: 500 }
    );
  }
}
