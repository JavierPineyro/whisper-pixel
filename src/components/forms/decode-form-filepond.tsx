"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Eye, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import { toast } from "sonner";
import { useGlitch } from "react-powerglitch";
import { customTypeDetector, glitchOptions } from "~/lib/utils";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
);

export function DecodeFormFilepond() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedMessage, setProcessedMessage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const glitch = useGlitch(glitchOptions);
  const revokeObjectUrls = (urls: (string | null | undefined)[]) => {
    urls.forEach((url) => {
      if (url && url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });
  };

  useEffect(() => {
    return () => {
      if (isProcessing && abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isProcessing]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilePondUpdate = (files: any[]) => {
    if (files.length > 0) {
      setImageFile(files[0].file as File);
    } else {
      setImageFile(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!imageFile) {
      toast.warning("Por favor, selecciona una imagen para subir.");
      return;
    }
    setProcessedMessage(null);
    setIsModalOpen(true);
    setIsProcessing(true);
    toast.info("Procesando imagen...");
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const signal = controller.signal;
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await fetch("/api/decode", {
        method: "POST",
        body: formData,
        signal: signal,
      });

      if (signal.aborted) {
        console.log("Petición abortada antes de la respuesta.");
        return;
      }

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({ error: "Error desconocido" }))) as { error: string };
        console.error("Error en la respuesta del servidor:", errorData);
        toast.error(errorData.error ?? "Error en la respuesta del servidor");
        return;
      }

      const data = await response.json();
      if (signal.aborted) {
        console.log("Petición abortada mientras se leía el cuerpo.");
        return;
      }

      setProcessedMessage(data.message);
      toast.success("¡Mensaje revelado exitosamente!");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("La petición fetch fue abortada.");
        toast.info("Procesamiento cancelado.");
      } else {
        console.error("Error al enviar el formulario:", error);
        toast.error(
          `Error al procesar la imagen: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    } finally {
      setIsProcessing(false);
      abortControllerRef.current = null;
    }
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      if (isProcessing && abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setProcessedMessage(null);
      setImageFile(null);
      setIsModalOpen(false);
    } else {
      setIsModalOpen(true);
    }
  };

  const currentImagePreviewUrlForModal = imageFile
    ? URL.createObjectURL(imageFile)
    : null;

  useEffect(() => {
    return () => {
      revokeObjectUrls([currentImagePreviewUrlForModal]);
    };
  }, [currentImagePreviewUrlForModal]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="image">Imagen</Label>
        <FilePond
          files={imageFile ? [imageFile] : []}
          onupdatefiles={handleFilePondUpdate}
          allowMultiple={false}
          maxFiles={1}
          name="image"
          labelIdle='Arrastra y suelta tu imagen o <span class="filepond--label-action">Examina</span>'
          server={null}
          acceptedFileTypes={["image/png", "image/jpeg", "image/jpg", "image/gif"]}
          fileValidateTypeDetectType={customTypeDetector}
        />
      </div>
      <Alert variant="default" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
        <Eye className="h-4 w-4" />
        <AlertTitle className="font-semibold">Privacidad</AlertTitle>
        <AlertDescription className="text-blue-500/80">
          La imagen se procesará para extraer el mensaje oculto. No se almacena ninguna información.
        </AlertDescription>
      </Alert>
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        Revelar Mensaje
      </Button>
      <AlertDialog open={isModalOpen} onOpenChange={handleModalClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revelando mensaje</AlertDialogTitle>
            <AlertDialogDescription>
              {currentImagePreviewUrlForModal && (
                <img
                  src={currentImagePreviewUrlForModal}
                  alt="Uploaded Preview"
                  className={`mb-4 h-auto aspect-square max-w-full object-contain ${isProcessing ? "blur-md" : "blur-none"}`}
                />
              )}
              {isProcessing ? (
                <span>Revelando mensaje, por favor espera...</span>
              ) : processedMessage ? (
                <div>
                  <p className="font-semibold">Mensaje Secreto:</p>
                  <p className="mt-2 p-4 bg-gray-100 rounded-md text-gray-800">{processedMessage}</p>
                </div>
              ) : (
                <span>Procesamiento fallido o cancelado.</span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              className="bg-secondary hover:bg-secondary/90 transition-colors"
              onClick={() => handleModalClose(false)}
            >
              Cerrar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
