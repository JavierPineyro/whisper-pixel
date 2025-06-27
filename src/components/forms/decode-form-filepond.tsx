"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { FileText } from "lucide-react";
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
import { customTypeDetector } from "~/lib/utils";
import { toast } from "sonner";
import type { DecodeResponse } from "~/lib/types";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
);

export function DecodeFormFilepond() {
  const [revealedMessage, setRevealedMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [encrypted, setEncrypted] = useState("false");

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
      if (isProcessing && abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setRevealedMessage("");
      setImageFile(null);
      setIsModalOpen(false);
      setPassword("");
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
    if (password) {
      console.log("password:", password);
    }
    setIsModalOpen(true);
    setIsProcessing(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const signal = controller.signal;
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("encrypted", encrypted);
    try {
      const response = await fetch("/api/decode", {
        method: "POST",
        body: formData,
        signal: signal,
      });
      if (signal.aborted) {
        return;
      }
      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({ error: "Error desconocido" }))) as { error: string };
        toast.error(errorData.error ?? "Error en la respuesta del servidor");
        return;
      }
      if (signal.aborted) {
        return;
      }
      const data = await response.json() as DecodeResponse;
      if (!data.success) {
        throw new Error(data.message ?? "Error al procesar la imagen");
      }
      setRevealedMessage(data.message);
      setIsModalOpen(true);
      toast.success("Imagen procesada exitosamente!");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        toast.error("Procesamiento cancelado.");
      } else {
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
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <div className="space-y-2">
        <Label htmlFor="decode-image-upload">Imagen con Mensaje Oculto</Label>
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
        <Label>Método de Ocultamiento</Label>
        <RadioGroup value={encrypted} onValueChange={setEncrypted} className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="basic" />
            <Label htmlFor="basic" className="cursor-pointer">
              Básico
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="encrypted" />
            <Label htmlFor="encrypted" className="cursor-pointer">
              Encriptado
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña (opcional)</Label>
        <Input
          id="password"
          type="password"
          placeholder="Ingresa la contraseña si el mensaje está protegido"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Solo necesario si el mensaje fue ocultado con protección de contraseña
        </p>
      </div>
      {revealedMessage && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Mensaje Revelado
          </Label>
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <p className="text-sm">{revealedMessage}</p>
          </div>
        </div>
      )}
      <Button
        className="w-full bg-purple-600 hover:bg-purple-700"
        type="submit"
        disabled={!imageFile || isProcessing}
      >
        {isProcessing ? "Descifrando..." : "Revelar Mensaje"}
      </Button>
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
    </form>
  );
}
