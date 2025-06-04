export interface CustomTypeDetectorSource {
    name?: string;
    slice?: (start?: number, end?: number) => Blob;
  }

export type CustomTypeDetector = (
    source: CustomTypeDetectorSource,
    type: string,
  ) => Promise<string>;

  export type DecodeResponse = {
    success: boolean;
    message: string;
  }