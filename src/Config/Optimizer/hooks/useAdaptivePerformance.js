import { useCallback, useEffect, useRef, useState } from "react";
import {
  crearEvaluadorFrames,
  esperarCalmaInicial,
} from "../utils/evaluadorFrames.js";

/**
 * Mide el ritmo de frames de una animación y degrada una sola vez si hay tirón
 * sostenido (ver utils/evaluadorFrames.js). El consumidor informa el timestamp
 * recibido por RAF; no se instala un segundo bucle ni se actualiza React en
 * cada frame.
 *
 * - No mide durante la carga inicial de la página.
 * - Un dispositivo estable a baja tasa de frames no se considera tirón.
 * - La degradación es monotónica durante el montaje para evitar oscilaciones.
 *
 * @param {{ enabled?: boolean }} options
 * @returns {{ degradado: boolean, registrarFrame: (timestamp: number | null) => void }}
 */
export function useAdaptivePerformance({ enabled = false } = {}) {
  const [degradado, setDegradado] = useState(false);
  const degradadoRef = useRef(false);
  const listoRef = useRef(false);
  const evaluadorRef = useRef(null);

  useEffect(() => {
    let vivo = true;
    listoRef.current = false;
    evaluadorRef.current = crearEvaluadorFrames({
      onTiron: () => {
        degradadoRef.current = true;
        setDegradado(true);
      },
    });

    if (enabled) {
      esperarCalmaInicial().then(() => {
        if (vivo) listoRef.current = true;
      });
    }

    return () => {
      vivo = false;
      listoRef.current = false;
    };
  }, [enabled]);

  const registrarFrame = useCallback(
    (timestamp) => {
      if (!enabled || degradadoRef.current) return;
      if (!listoRef.current) return;

      evaluadorRef.current?.registrar(timestamp);
    },
    [enabled],
  );

  return { degradado, registrarFrame };
}
