import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { CustomTypeDetector } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

  export const customTypeDetector: CustomTypeDetector = (source, type) => {
    return new Promise<string>((resolve, reject) => {
      // 'source' es el objeto File o Blob
      // 'type' es el tipo detectado por el navegador (puede ser vacío o incorrecto)

      if (source.name) {
        const fileName = source.name.toLowerCase();
        if (fileName.endsWith(".png")) {
          resolve("image/png"); // Si termina en .png, asumimos que es image/png
        } else {
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          reject("Archivo no es PNG");
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        reject("No se pudo determinar el tipo de archivo");
      }
    });
  };

export const glitchOptions = {
    playMode: "always",
    optimizeSeo: true,
    createContainers: true,
    hideOverflow: false,
    timing: {
      duration: 2000,
    },
    glitchTimeSpan: {
      start: 0.5,
      end: 0.7,
    },
    shake: {
      velocity: 27,
      amplitudeX: 0.05,
      amplitudeY: 0.03,
    },
    slice: {
      count: 9,
      velocity: 37,
      minHeight: 0.02,
      maxHeight: 0.15,
      hueRotate: true,
    },
    pulse: false,
  } as const