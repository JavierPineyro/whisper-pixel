import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

type MutationStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseApiMutationResult<T> {
  mutate: (body: FormData) => Promise<void>;
  status: MutationStatus;
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

export function useApiMutation<T>(url: string): UseApiMutationResult<T> {
  const [status, setStatus] = useState<MutationStatus>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Limpieza por si el componente se desmonta durante la petición
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const mutate = useCallback(async (body: FormData) => {
    abortControllerRef.current = new AbortController();
    setStatus('loading');
    setData(null);
    setError(null);
    toast.info("Procesando...");

    try {
      const response = await fetch(url, {
        method: 'POST',
        body,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
        throw new Error(errorData.error ?? 'Error en la respuesta del servidor');
      }

      // Maneja diferentes tipos de respuesta (JSON o Blob)
      const responseData = url.includes('/encode') 
        ? await response.blob() 
        : await response.json();

      setData(responseData as T);
      setStatus('success');
      toast.success("Procesamiento completado!");

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setStatus('idle'); // O 'error' si prefieres
        toast.info("Procesamiento cancelado.");
        return;
      }
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setStatus('error');
      toast.error(`Error: ${errorMessage}`);
    } finally {
        abortControllerRef.current = null;
    }
  }, [url]);

  return { mutate, status, data, error, isLoading: status === 'loading' };
}