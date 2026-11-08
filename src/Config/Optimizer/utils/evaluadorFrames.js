/**
 * Optimizer · utils/evaluadorFrames.js
 *
 * Detecta TIRÓN real (jank sostenido), no simples fps bajos pero estables.
 * Sin dependencias de React: lo usan useAdaptivePerformance (un componente) y
 * monitorRendimiento (toda la página).
 *
 * Criterios por ventana de medición:
 *  - Se descartan deltas > DELTA_DESCARTE_MS (GC, pestaña en segundo plano,
 *    scroll bloqueado por otra tarea): no representan el costo estable.
 *  - Se normaliza contra la mediana de la ventana (refresco real del panel o
 *    tope por ahorro de batería). Un dispositivo estable a 30 fps NO es tirón.
 *  - Frame con tirón: delta > max(FACTOR_TIRON × mediana, TIRON_MINIMO_MS).
 *  - Ventana mala: proporción de tirones ≥ PROPORCION_TIRONES, o mediana tan
 *    alta que ya es inutilizable (< ~15 fps).
 *  - Hay que encadenar VENTANAS_MALAS_REQUERIDAS ventanas malas seguidas.
 */

export const VENTANA_MS = 2000;
export const FRAMES_MINIMOS = 30;
export const DELTA_DESCARTE_MS = 250;
export const FACTOR_TIRON = 2.5;
export const TIRON_MINIMO_MS = 40;
export const PROPORCION_TIRONES = 0.15;
export const MEDIANA_INUTILIZABLE_MS = 66;
export const VENTANAS_MALAS_REQUERIDAS = 3;

function mediana(valores) {
  const orden = [...valores].sort((a, b) => a - b);
  return orden[Math.floor(orden.length / 2)];
}

/** Evalúa una ventana de deltas ya filtrados. */
export function ventanaEsMala(deltas) {
  const base = mediana(deltas);
  const umbral = Math.max(FACTOR_TIRON * base, TIRON_MINIMO_MS);
  const tirones = deltas.filter((delta) => delta > umbral).length;

  return (
    base >= MEDIANA_INUTILIZABLE_MS ||
    tirones / deltas.length >= PROPORCION_TIRONES
  );
}

/**
 * @param {{ onTiron: () => void }} opciones
 * @returns {{ registrar: (timestamp: number | null) => void, reiniciar: () => void }}
 */
export function crearEvaluadorFrames({ onTiron }) {
  let anterior = null;
  let inicio = 0;
  let deltas = [];
  let ventanasMalas = 0;

  function reiniciarVentana() {
    anterior = null;
    deltas = [];
  }

  function reiniciar() {
    reiniciarVentana();
    ventanasMalas = 0;
  }

  function registrar(timestamp) {
    // null = fuera de viewport, pestaña oculta, intro o inactividad.
    if (timestamp === null) {
      reiniciar();
      return;
    }

    if (anterior === null) {
      anterior = timestamp;
      inicio = timestamp;
      return;
    }

    const delta = timestamp - anterior;
    anterior = timestamp;

    if (delta <= 0) return;

    if (delta > DELTA_DESCARTE_MS) {
      // Interrupción ajena: se descarta la ventana en curso, no la racha.
      reiniciarVentana();
      anterior = timestamp;
      inicio = timestamp;
      return;
    }

    deltas.push(delta);

    if (timestamp - inicio < VENTANA_MS || deltas.length < FRAMES_MINIMOS) {
      return;
    }

    ventanasMalas = ventanaEsMala(deltas) ? ventanasMalas + 1 : 0;
    reiniciarVentana();
    anterior = timestamp;
    inicio = timestamp;

    if (ventanasMalas >= VENTANAS_MALAS_REQUERIDAS) {
      ventanasMalas = 0;
      onTiron();
    }
  }

  return { registrar, reiniciar };
}

/** Resuelve cuando la página terminó de cargar y pasó un margen de calma. */
export function esperarCalmaInicial(margenMs = 1500) {
  return new Promise((resolver) => {
    const pasarMargen = () => setTimeout(resolver, margenMs);

    if (document.readyState === "complete") pasarMargen();
    else window.addEventListener("load", pasarMargen, { once: true });
  });
}
