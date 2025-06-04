"use client";

import { useState, type FormEvent, useRef, useEffect } from "react";
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
import { Search, FileText } from "lucide-react";

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { customTypeDetector } from "~/lib/utils";
import { toast } from "sonner";
import type { DecodeResponse } from "~/lib/types";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
);

export function BasicDecodeFormFilepond() {
  const [revealedMessage, setRevealedMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const abortController = abortControllerRef.current;
    return () => {
      if (isProcessing && abortController) {
        abortController.abort();
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

  const handleModalClose = (open: boolean) => {
    if (!open) {
      console.log("Modal cerrando, intentando resetear formulario...");
      if (isProcessing && abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setRevealedMessage("");
      setImageFile(null);
      setIsModalOpen(false);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!imageFile) {
      toast.warning("Por favor, selecciona una imagen para subir.");
      return;
    }
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
        const errorBody = await response
          .text()
          .catch(() => "Error desconocido");
        console.error("Error en la respuesta del servidor:", errorBody);
        toast.error(`Error en la respuesta del servidor`);
      }

      if (signal.aborted) {
        console.log("Petición abortada mientras se leía el cuerpo.");
        return;
      }

      const data = (await response.json()) as DecodeResponse;
      if (!data.success) {
        throw new Error(data.message || "Error al procesar la imagen");
      }

      setRevealedMessage(data.message);
      setIsModalOpen(true);

      toast.success("Imagen procesada exitosamente!");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("La petición fetch fue abortada.");
        toast.error("Procesamiento cancelado.");
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

  return (
    <div className="">
      <Label htmlFor="decode-image-upload">Imagen con Mensaje Oculto</Label>
      <div className="flex w-full items-center justify-center">
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
              acceptedFileTypes={["image/png"]}
              fileValidateTypeDetectType={customTypeDetector}
            />
          </div>
          <Button
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700"
            type="submit"
            disabled={!imageFile || isProcessing}
          >
            {isProcessing ? "Descifrando..." : "Revelar mensaje"}
          </Button>
        </form>

        <AlertDialog open={isModalOpen} onOpenChange={handleModalClose}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Descifrando mensaje</AlertDialogTitle>
              <AlertDialogDescription>
                {isProcessing ? (
                  <span>Revelando el mensaje oculto, por favor espera...</span>
                ) : revealedMessage ? (
                  <span>Procesamiento completado!</span>
                ) : (
                  <span>Procesamiento fallido o cancelado.</span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div>{revealedMessage && <span>{revealedMessage}</span>}</div>

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
      </div>
    </div>
  );
}
