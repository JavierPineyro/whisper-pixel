"use client";

import { useState, type FormEvent, useRef, useEffect } from 'react';
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";  
import { Textarea } from "~/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

import { toast } from 'sonner';
import { useGlitch } from 'react-powerglitch'

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export function BasicEncodeFormFilepond() {

  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  // State para la URL creada del Blob de la imagen procesada
  const [processedBlobUrl, setProcessedBlobUrl] = useState<string | null>(null);
    // imageFile ahora se obtendrá de FilePond
  const [imageFile, setImageFile] = useState<File | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const glitch = useGlitch({
  "playMode": "always",
  "optimizeSeo": true,
  "createContainers": true,
  "hideOverflow": false,
  "timing": {
    "duration": 2000
  },
  "glitchTimeSpan": {
    "start": 0.5,
    "end": 0.7
  },
  "shake": {
    "velocity": 27,
    "amplitudeX": 0.05,
    "amplitudeY": 0.03
  },
  "slice": {
    "count": 9,
    "velocity": 37,
    "minHeight": 0.02,
    "maxHeight": 0.15,
    "hueRotate": true
  },
  "pulse": false
});
  // Función de limpieza para las Object URLs (previsualizaciones y blobs procesados)
  const revokeObjectUrls = (urls: (string | null | undefined)[]) => {
      urls.forEach(url => {
          if (url && url.startsWith('blob:')) { // Solo revocar URLs de blob creadas por nosotros
              URL.revokeObjectURL(url);
          }
      });
  };

  useEffect(() => {
    return () => {
      if (isProcessing && abortControllerRef.current) {
          abortControllerRef.current.abort();
      }
      revokeObjectUrls([processedBlobUrl]);
    };
  }, [isProcessing, processedBlobUrl]);


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilePondUpdate = (files: any[]) => {
      if (files.length > 0) {
          setImageFile(files[0].file as File);
      } else {
          setImageFile(null);
          revokeObjectUrls([processedBlobUrl]);
          setProcessedBlobUrl(null);
      }
  };


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!imageFile) {
      toast.warning('Por favor, selecciona una imagen para subir.');
      return;
    }

    revokeObjectUrls([processedBlobUrl]);
    setProcessedBlobUrl(null); 

    setIsModalOpen(true);
    setIsProcessing(true);
    toast.info('Procesando imagen...'); 

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const signal = controller.signal;

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('message', message);

    try {
      const response = await fetch('/api/encode', {
        method: 'POST',
        body: formData,
        signal: signal,
      });

      if (signal.aborted) {
        console.log("Petición abortada antes de la respuesta.");
        return;
      }

      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'Error desconocido');
        console.error('Error en la respuesta del servidor:', errorBody);
        toast.error(`Error en la respuesta del servidor`);
      }

      const imageBlob = await response.blob();

       if (signal.aborted) {
        console.log("Petición abortada mientras se leía el cuerpo.");
        return; 
      }

      const blobUrl = URL.createObjectURL(imageBlob);
      setProcessedBlobUrl(blobUrl);
      toast.success('Imagen procesada exitosamente!');

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('La petición fetch fue abortada.');
        toast.info('Procesamiento cancelado.'); 
      } else {
        console.error('Error al enviar el formulario:', error);
        toast.error(`Error al procesar la imagen: ${error instanceof Error ? error.message : String(error)}`);
      }
    } finally {
      setIsProcessing(false);
      abortControllerRef.current = null;
    }
  };

  const handleModalClose = (open: boolean) => {
    console.log('handleModalClose llamado, open:', open); 
    if (!open) { 
   console.log('Modal cerrando, intentando resetear formulario...');
      if (isProcessing && abortControllerRef.current) {
          abortControllerRef.current.abort();
      }
      revokeObjectUrls([processedBlobUrl]);
      setProcessedBlobUrl(null);
	setMessage("")
	setImageFile(null)
      setIsModalOpen(false);
    } else { 
        setIsModalOpen(true);
    }
  };

  const currentImagePreviewUrlForModal = imageFile ? URL.createObjectURL(imageFile) : null;

  useEffect(() => {
    return () => {
      revokeObjectUrls([currentImagePreviewUrlForModal]);
    };
  }, [currentImagePreviewUrlForModal]);


  return (
    <div className="">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="image">Imagen</Label>
           <FilePond
                files={imageFile ? [imageFile] : []} 
                onupdatefiles={handleFilePondUpdate}
                allowMultiple={false} 
                maxFiles={1}
                name="image" 
                labelIdle='Arrastra y suelta tu imagen o <span class="filepond--label-action">Examina</span>'
                server={null}
                acceptedFileTypes={['image/png']}
            />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="message">Mensaje secreto</Label>
          <Textarea id="message" value={message} required onChange={(e) => setMessage(e.target.value)} rows={3} />
        </div>
        
        <Button className="w-full bg-purple-600 hover:bg-purple-700 mt-4" type="submit" 
            disabled={!imageFile || isProcessing}>
          {isProcessing ? 'Encriptando...' : 'Ocultar mensaje'}
        </Button>
      </form>
      
      <AlertDialog open={isModalOpen} onOpenChange={handleModalClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ocultando mensaje</AlertDialogTitle>
            <AlertDialogDescription as="div">
            
              {currentImagePreviewUrlForModal && (
		// eslint-disable-next-line @next/next/no-img-element
                <img src={currentImagePreviewUrlForModal} alt="Uploaded Preview" className={`max-w-full h-auto object-contain mb-4 ${isProcessing?'blur-md':'blur-none'}`} />
	      )}
        
              {isProcessing ? (
                <span>Encriptando imagen, por favor espera...</span>
              ) : processedBlobUrl ? (
                 <span>Procesamiento completado!</span>
              ) : (
                 <span>Procesamiento fallido o cancelado.</span>
              )}

            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>

            {isProcessing ? (
              <Button disabled>Procesando...</Button>
            ) : processedBlobUrl ? (
              <span><Button ref={glitch.ref}  asChild>
                <a
                  href={processedBlobUrl}
                  download={imageFile?.name ? `processed_${imageFile.name}` : 'processed_image.png'}
                >
                  Descargar Imagen
                </a>
              </Button></span>
            ): (<Button onClick={()=>handleModalClose(false)}>Cerrar</Button>)}
		<Button className="bg-secondary transition-colors  hover:bg-secondary/90" onClick={()=>handleModalClose(false)}>Cerrar</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

