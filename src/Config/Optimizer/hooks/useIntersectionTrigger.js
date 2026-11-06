import { useEffect, useRef, useState } from "react";
import { CLASE_ACTIVACION, MARGEN_INFERIOR } from "../utils/perfil.js";

/** Acota el margen al rango permitido (200px – 400px). */
function acotarMargen(valor) {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) return MARGEN_INFERIOR.DEFAULT;

  return Math.min(MARGEN_INFERIOR.MAX, Math.max(MARGEN_INFERIOR.MIN, numero));
}

/**
 * Sensor de proximidad (EL DISPARADOR).
 *
 * Observa el elemento con un rootMargin inferior de 200–400px y le inyecta la
 * clase `.is-triggered` ANTES de que entre al viewport, para que el efecto (o la
 * carga pesada) ya esté listo cuando el usuario llegue.
 *
 * Uso:
 *   const { ref, isTriggered } = useIntersectionTrigger({ margenInferior: 300 });
 *   return <section ref={ref} className="perf-reveal">...</section>;
 *
 * Opciones:
 *  - margenInferior: px por debajo del viewport (se acota a 200–400, def. 300).
 *  - threshold: umbral del observer (def. 0).
 *  - once: si es true (def.) dispara una sola vez y deja de observar.
 *  - claseActivacion: clase a inyectar (def. "is-triggered").
 *
 * Notas:
 *  - La clase se agrega directo al DOM (sin re-render) y además se expone
 *    `isTriggered` para quien necesite montar contenido pesado de forma condicional.
 *  - Si cambia el `className` del elemento desde React, React reemplaza el
 *    atributo completo; mantener el className estable en elementos observados.
 *  - Sin IntersectionObserver el elemento se activa de inmediato.
 */
export function useIntersectionTrigger({
  margenInferior = MARGEN_INFERIOR.DEFAULT,
  threshold = 0,
  once = true,
  claseActivacion = CLASE_ACTIVACION,
} = {}) {
  const ref = useRef(null);
  const soportado = typeof IntersectionObserver !== "undefined";
  const [isTriggered, setIsTriggered] = useState(!soportado);

  const margen = acotarMargen(margenInferior);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return undefined;

    if (!soportado) {
      elemento.classList.add(claseActivacion);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) {
            elemento.classList.add(claseActivacion);
            setIsTriggered(true);

            if (once) observer.disconnect();
          } else if (!once) {
            elemento.classList.remove(claseActivacion);
            setIsTriggered(false);
          }
        }
      },
      {
        root: null,
        rootMargin: `0px 0px ${margen}px 0px`,
        threshold,
      },
    );

    observer.observe(elemento);

    return () => observer.disconnect();
  }, [soportado, margen, threshold, once, claseActivacion]);

  return { ref, isTriggered };
}
