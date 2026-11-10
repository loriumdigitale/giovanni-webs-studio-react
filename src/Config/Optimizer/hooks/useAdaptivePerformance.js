import { useCallback, useEffect, useRef, useState } from "react";
import {
  crearEvaluadorFrames,
  esperarCalmaInicial,
} from "../utils/evaluadorFrames.js";

const NIVEL_MAXIMO = 2;
const CLAVE_ALMACENAMIENTO = "gws-perf-nivel";
const CADUCIDAD_MS = 7 * 24 * 60 * 60 * 1000;

function leerNivelGuardado(clave) {
  try {
    const guardado = JSON.parse(localStorage.getItem(clave));
    if (!guardado || Date.now() - guardado.t > CADUCIDAD_MS) return 0;
    return Math.min(NIVEL_MAXIMO, Math.max(0, Number(guardado.nivel) || 0));
  } catch {
    return 0;
  }
}

function guardarNivel(clave, nivel) {
  try {
    localStorage.setItem(clave, JSON.stringify({ nivel, t: Date.now() }));
  } catch {
    // Almacenamiento no disponible: se vuelve a medir en la próxima visita.
  }
}

/**
 * Mide el ritmo de frames de una animación compleja y degrada por escalones
 * solo si hay tirón sostenido (ver utils/evaluadorFrames.js).
 *
 * Niveles: 0 = calidad completa, 1 = reducida, 2 = mínima/estática.
 * Cada escalón exige volver a demostrar tirón sostenido. El nivel alcanzado se
 * recuerda 7 días (por `clave`) para no repetir el tirón en la próxima visita.
 *
 * - No mide durante la carga inicial de la página.
 * - Un dispositivo estable a baja tasa de frames no se considera tirón.
 * - Es monotónico durante el montaje para evitar oscilaciones.
 *
 * @param {{ enabled?: boolean, clave?: string }} options
 * @returns {{ nivel: number, degradado: boolean, registrarFrame: (timestamp: number | null) => void }}
 */
export function useAdaptivePerformance({
  enabled = false,
  clave = CLAVE_ALMACENAMIENTO,
} = {}) {
  const [nivel, setNivel] = useState(() => leerNivelGuardado(clave));
  const nivelRef = useRef(nivel);
  const listoRef = useRef(false);
  const evaluadorRef = useRef(null);

  useEffect(() => {
    let vivo = true;
    listoRef.current = false;
    evaluadorRef.current = crearEvaluadorFrames({
      onTiron: () => {
        if (nivelRef.current >= NIVEL_MAXIMO) return;
        nivelRef.current += 1;
        guardarNivel(clave, nivelRef.current);
        setNivel(nivelRef.current);
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
  }, [enabled, clave]);

  const registrarFrame = useCallback(
    (timestamp) => {
      if (!enabled || !listoRef.current) return;
      if (nivelRef.current >= NIVEL_MAXIMO) return;

      evaluadorRef.current?.registrar(timestamp);
    },
    [enabled],
  );

  return { nivel, degradado: nivel > 0, registrarFrame };
}
