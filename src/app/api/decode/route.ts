import { type NextRequest, NextResponse } from 'next/server';
import { extractMessage } from '~/server/steganography';

export async function POST(request: NextRequest) {
  try {
    if (!request.headers.get('content-type')?.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Se requiere FormData' },
        { status: 400 }
      );
    }

    const formData = await request.formData();

    const imageFile = formData.get('image') as File | null;

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
    const encryptionKey = encrypted ? process.env.STEGANOGRAPHY_KEY : null;

    const extractedMessage = await extractMessage(imageBuffer, encrypted, encryptionKey);

    return NextResponse.json(
      { 
        success: true, 
        message : extractedMessage
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en el endpoint de esteganografía:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al procesar la imagen' },
      { status: 500 }
    );
  }
}
