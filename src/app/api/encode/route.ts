import { type NextRequest, NextResponse } from 'next/server';
import { hideMessage } from '~/server/steganography';

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
    const message = formData.get('message') as string | null;
    
    if (!imageFile || !message) {
      return NextResponse.json(
        { error: 'Se requieren los campos "image" y "message"' },
        { status: 400 }
      );
    }
    
    if (!imageFile.type || !imageFile.type.startsWith('image/png')) {
      return NextResponse.json(
        { error: 'Solo se admiten imágenes PNG' },
        { status: 400 }
      );
    }
    
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    
    const encrypted = formData.get('encrypted') === 'true';
    const encryptionKey = encrypted ? process.env.STEGANOGRAPHY_KEY : null;
    
    const modifiedImageBuffer = await hideMessage(
      imageBuffer,
      message,
      encrypted,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      encryptionKey || null
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
      { error: error instanceof Error ? error.message : 'Error al procesar la imagen' },
      { status: 500 }
    );
  }
}