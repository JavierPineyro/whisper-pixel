"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Switch } from "~/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Lock, AlertCircle } from "lucide-react";
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

export function EncodeFormFilepond() {
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedBlobUrl, setProcessedBlobUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [encryptionType, setEncryptionType] = useState("basic");
  const [encryptionLevel, setEncryptionLevel] = useState("medium");

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
      toast.warning("Por favor, selecciona una imagen para subir.");
      return;
    }
    revokeObjectUrls([processedBlobUrl]);
    setProcessedBlobUrl(null);
    setIsModalOpen(true);
    setIsProcessing(true);
    toast.info("Procesando imagen...");
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const signal = controller.signal;
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("message", message);
    formData.append("encrypted", encryptionType === "encrypted" ? "true" : "false");
    if (encryptionType === "encrypted") {
      console.log("encryptionLevel:", encryptionLevel);
    }
    try {
      const response = await fetch("/api/encode", {
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
      const imageBlob = await response.blob();
      if (signal.aborted) {
        console.log("Petición abortada mientras se leía el cuerpo.");
        return;
      }
      const blobUrl = URL.createObjectURL(imageBlob);
      setProcessedBlobUrl(blobUrl);
      toast.success("Imagen procesada exitosamente!");
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
      revokeObjectUrls([processedBlobUrl]);
      setProcessedBlobUrl(null);
      setMessage("");
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
      <div className="space-y-2">
        <Label htmlFor="message">Mensaje Secreto</Label>
        <Textarea
          id="message"
          placeholder="Escribe tu mensaje secreto aquí..."
          className="min-h-[100px]"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Método de Ocultamiento</Label>
        <RadioGroup value={encryptionType} onValueChange={setEncryptionType} className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="basic" id="basic" />
            <Label htmlFor="basic" className="cursor-pointer">
              Básico
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="encrypted" id="encrypted" />
            <Label htmlFor="encrypted" className="cursor-pointer">
              Encriptado
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch id="password-protection" disabled />
            <Label htmlFor="password-protection" className="text-muted-foreground">
              Protección con Contraseña
            </Label>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Esta función estará disponible próximamente</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {encryptionType === "encrypted" && (
          <div className="space-y-2">
            <Label htmlFor="encryption-level">Nivel de Encriptación</Label>
            <Select value={encryptionLevel} onValueChange={setEncryptionLevel}>
              <SelectTrigger id="encryption-level">
                <SelectValue placeholder="Selecciona un nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Bajo</SelectItem>
                <SelectItem value="medium">Medio</SelectItem>
                <SelectItem value="high">Alto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <Alert variant="default" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
        <Lock className="h-4 w-4" />
        <AlertTitle className="font-semibold">Seguridad</AlertTitle>
        <AlertDescription className="text-purple-500/80">
          Tu mensaje será ocultado de forma segura en la imagen. Solo quien conozca que existe un mensaje oculto podrá extraerlo.
        </AlertDescription>
      </Alert>
      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
        Ocultar Mensaje
      </Button>
      <AlertDialog open={isModalOpen} onOpenChange={handleModalClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ocultando mensaje</AlertDialogTitle>
            <AlertDialogDescription>
              {currentImagePreviewUrlForModal && (
                <img
                  src={currentImagePreviewUrlForModal}
                  alt="Uploaded Preview"
                  className={`mb-4 h-auto aspect-square max-w-full object-contain ${isProcessing ? "blur-md" : "blur-none"}`}
                />
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
              <span>
                <Button ref={glitch.ref} asChild>
                  <a
                    href={processedBlobUrl}
                    download={
                      imageFile?.name
                        ? `processed_${imageFile.name}`
                        : "processed_image.png"
                    }
                  >
                    Descargar Imagen
                  </a>
                </Button>
              </span>
            ) : (
              <Button onClick={() => handleModalClose(false)}>Cerrar</Button>
            )}
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
