import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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