/**
 * Optimizer · utils/perfil.js
 *
 * Lógica central de clasificación de rendimiento (sin dependencias de React).
 * La usan el hook usePreClasificacion, el Provider y cualquier script pesado.
 *
 * Perfiles: LOW | MEDIUM | HIGH → se reflejan como clase en <html>:
 *   .perf-low  .perf-medium  .perf-high
 *
 * ---------------------------------------------------------------------------
 * ESTÁNDAR "INTERRUPTOR DE BLOQUES" (para scripts pesados)
 * ---------------------------------------------------------------------------
 * Todo script pesado (partículas, carruseles avanzados, mapas, etc.) debe leer
 * el perfil ANTES de instanciarse y desviar el flujo según el entorno:
 *
 *   import { ejecutarSegunPerfil } from "../Config/Optimizer/utils/perfil.js";
 *
 *   ejecutarSegunPerfil({
 *     high: () => import("./particulasWebGL.js").then((m) => m.iniciar(el)),
 *     medium: () => import("./particulasCanvas.js").then((m) => m.iniciar(el)),
 *     low: () => mostrarImagenEstatica(el),
 *   });
 *
 * Reglas:
 *  - Las variantes pueden ser funciones (se ejecutan) o valores (se devuelven).
 *  - Si falta una variante se degrada: high → medium → low. Si falta `low`,
 *    en gama baja no se ejecuta nada.
 *  - Usar import() dinámico en high/medium para que el código pesado no se
 *    descargue en gama baja.
 */

export const PERFIL = Object.freeze({
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
});

export const CLASE_PERFIL_PREFIJO = "perf-";

export const CLASES_PERFIL = Object.freeze(
  Object.values(PERFIL).map((perfil) => `${CLASE_PERFIL_PREFIJO}${perfil}`),
);

/** Clase que inyecta el sensor de proximidad (useIntersectionTrigger). */
export const CLASE_ACTIVACION = "is-triggered";

/** Margen inferior (px) del IntersectionObserver. Se acota entre MIN y MAX. */
export const MARGEN_INFERIOR = Object.freeze({
  MIN: 200,
  DEFAULT: 300,
  MAX: 400,
});

/**
 * Umbrales de clasificación.
 * IMPORTANTE: mantener sincronizados con scripts/preclasificacion.inline.js
 */
export const UMBRALES = Object.freeze({
  TEXTURA_MEDIUM: 4096,
  TEXTURA_HIGH: 8192,
  NUCLEOS_MEDIUM: 4,
  NUCLEOS_HIGH: 6,
  // hardwareConcurrency no está disponible en todos los navegadores
  NUCLEOS_ASUMIDOS: 4,
});

const QUERY_REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/* -------------------------------------------------------------------------- */
/* Detección                                                                   */
/* -------------------------------------------------------------------------- */

/** Consulta WebGL y libera el contexto. Nunca lanza error. */
export function detectarWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (!gl) return { disponible: false, maxTextureSize: 0 };

    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0;
    gl.getExtension("WEBGL_lose_context")?.loseContext();

    return { disponible: true, maxTextureSize };
  } catch {
    return { disponible: false, maxTextureSize: 0 };
  }
}

/** Filtro de accesibilidad: movimiento reducido / ahorro del sistema. */
export function prefiereMovimientoReducido() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia(QUERY_REDUCED_MOTION).matches
  );
}

let hardwareCache = null;

/** Dispositivo con puntero táctil principal (sin hover, GPU móvil). */
export function esDispositivoTactil() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches
  );
}

/** Clasifica por hardware (WebGL + núcleos). El resultado se cachea. */
export function clasificarPorHardware() {
  if (hardwareCache) return hardwareCache;

  const nucleos = navigator.hardwareConcurrency || UMBRALES.NUCLEOS_ASUMIDOS;
  const { disponible, maxTextureSize } = detectarWebGL();

  let resultado;

  if (!disponible || maxTextureSize === 0) {
    resultado = { perfil: PERFIL.LOW, motivo: "sin-webgl" };
  } else if (
    nucleos < UMBRALES.NUCLEOS_MEDIUM ||
    maxTextureSize < UMBRALES.TEXTURA_MEDIUM
  ) {
    // Hardware modesto: nunca se veta, solo arranca más conservador.
    resultado = { perfil: PERFIL.MEDIUM, motivo: "hardware" };
  } else {
    // Optimista: la degradación real la decide la medición de tirón
    // (useAdaptivePerformance) en cada animación compleja.
    resultado = { perfil: PERFIL.HIGH, motivo: "hardware" };
  }

  hardwareCache = Object.freeze(resultado);
  return hardwareCache;
}

/**
 * Clasificación completa.
 * REGLA DE ORO: prefers-reduced-motion fuerza LOW y se evalúa primero,
 * saltándose cualquier prueba de hardware.
 */
export function clasificarRendimiento() {
  if (prefiereMovimientoReducido()) {
    return { perfil: PERFIL.LOW, motivo: "reduced-motion" };
  }

  return clasificarPorHardware();
}

/* -------------------------------------------------------------------------- */
/* Clase global en <html>                                                      */
/* -------------------------------------------------------------------------- */

export function aplicarPerfil(
  perfil,
  motivo = "manual",
  root = document.documentElement,
) {
  const clase = `${CLASE_PERFIL_PREFIJO}${perfil}`;

  if (root.classList.contains(clase) && root.dataset.perfMotivo === motivo) {
    return;
  }

  root.classList.remove(...CLASES_PERFIL);
  root.classList.add(clase);
  root.dataset.perfMotivo = motivo;
}

/** Lee el perfil de <html>. Si hay más de una clase, gana la más conservadora. */
export function leerPerfil(root = document.documentElement) {
  const orden = [PERFIL.LOW, PERFIL.MEDIUM, PERFIL.HIGH];

  return (
    orden.find((perfil) =>
      root.classList.contains(`${CLASE_PERFIL_PREFIJO}${perfil}`),
    ) ?? null
  );
}

/**
 * Devuelve el perfil actual. Si el script inline ya corrió solo lo lee;
 * si no, clasifica y aplica la clase (idempotente).
 */
export function asegurarPerfil() {
  const existente = leerPerfil();
  if (existente) return existente;

  const { perfil, motivo } = clasificarRendimiento();
  aplicarPerfil(perfil, motivo);
  return perfil;
}

/**
 * Suscripción compatible con useSyncExternalStore.
 * - Avisa cuando cambia la clase de <html>.
 * - Reclasifica si el usuario cambia prefers-reduced-motion en caliente.
 */
export function suscribirPerfil(callback) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  const mq =
    typeof window.matchMedia === "function"
      ? window.matchMedia(QUERY_REDUCED_MOTION)
      : null;

  const alCambiarPreferencia = () => {
    const { perfil, motivo } = clasificarRendimiento();
    aplicarPerfil(perfil, motivo);
  };

  mq?.addEventListener("change", alCambiarPreferencia);

  return () => {
    observer.disconnect();
    mq?.removeEventListener("change", alCambiarPreferencia);
  };
}

/* -------------------------------------------------------------------------- */
/* Interruptor de bloques                                                      */
/* -------------------------------------------------------------------------- */

export function esGamaBaja() {
  return asegurarPerfil() === PERFIL.LOW;
}

/** Elige una variante degradando: high → medium → low. */
export function elegirVariante(perfil, variantes = {}) {
  const { high, medium, low } = variantes;

  if (perfil === PERFIL.HIGH) return high ?? medium ?? low;
  if (perfil === PERFIL.MEDIUM) return medium ?? low;
  return low;
}

/** Lee el perfil del <html> y ejecuta (o devuelve) la variante que corresponda. */
export function ejecutarSegunPerfil(variantes) {
  const variante = elegirVariante(asegurarPerfil(), variantes);
  return typeof variante === "function" ? variante() : variante;
}
