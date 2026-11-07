import { useCallback, useEffect, useRef, useState } from "react";

const VENTANA_MEDICION_MS = 2000;
const FPS_MINIMO = 42;
const FRAME_TARDIO_MS = 33;
const PROPORCION_TARDIOS_MAXIMA = 0.25;
const VENTANAS_LENTAS_REQUERIDAS = 3;

/**
 * Mide el ritmo de frames de una animación y degrada una sola vez si el bajo
 * rendimiento persiste. El consumidor informa el timestamp recibido por RAF;
 * no se instala un segundo bucle ni se actualiza React en cada frame.
 *
 * La degradación exige seis segundos de rendimiento bajo en el efecto estable,
 * y es monotónica durante el montaje para evitar oscilaciones de calidad.
 *
 * @param {{ enabled?: boolean }} options
 * @returns {{ degradado: boolean, registrarFrame: (timestamp: number | null) => void }}
 */
export function useAdaptivePerformance({ enabled = false } = {}) {
  const [degradado, setDegradado] = useState(false);
  const degradadoRef = useRef(false);
  const muestraRef = useRef(null);
  const ventanasLentasRef = useRef(0);

  useEffect(() => {
    muestraRef.current = null;
    ventanasLentasRef.current = 0;
  }, [enabled]);

  const registrarFrame = useCallback(
    (timestamp) => {
      if (!enabled || degradadoRef.current) return;

      if (timestamp === null) {
        // LaserFlow envía null al salir del viewport o al ocultar la pestaña.
        muestraRef.current = null;
        ventanasLentasRef.current = 0;
        return;
      }

      let muestra = muestraRef.current;
      if (!muestra) {
        muestraRef.current = {
          inicio: timestamp,
          anterior: timestamp,
          frames: 0,
          framesTardios: 0,
        };
        return;
      }

      const delta = timestamp - muestra.anterior;
      if (delta <= 0) {
        muestraRef.current = {
          inicio: timestamp,
          anterior: timestamp,
          frames: 0,
          framesTardios: 0,
        };
        return;
      }

      muestra.anterior = timestamp;
      muestra.frames += 1;
      if (delta > FRAME_TARDIO_MS) muestra.framesTardios += 1;

      const transcurrido = timestamp - muestra.inicio;
      if (transcurrido < VENTANA_MEDICION_MS || muestra.frames < 20) return;

      const fps = (muestra.frames * 1000) / transcurrido;
      const proporcionTardios = muestra.framesTardios / muestra.frames;
      const rendimientoBajo =
        fps < FPS_MINIMO || proporcionTardios >= PROPORCION_TARDIOS_MAXIMA;

      ventanasLentasRef.current = rendimientoBajo
        ? ventanasLentasRef.current + 1
        : 0;

      if (ventanasLentasRef.current >= VENTANAS_LENTAS_REQUERIDAS) {
        degradadoRef.current = true;
        setDegradado(true);
        return;
      }

      muestraRef.current = {
        inicio: timestamp,
        anterior: timestamp,
        frames: 0,
        framesTardios: 0,
      };
    },
    [enabled],
  );

  return { degradado, registrarFrame };
}
