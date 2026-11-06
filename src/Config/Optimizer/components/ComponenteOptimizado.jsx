import { useIntersectionTrigger } from "../hooks/useIntersectionTrigger.js";
import { useRendimiento } from "../hooks/useRendimiento.js";
import { elegirVariante } from "../utils/perfil.js";

/**
 * Wrapper para renderizado condicional por rendimiento.
 *
 * Elige qué renderizar según el perfil y, por defecto, no monta nada hasta que
 * el sensor de proximidad lo activa (200–400px antes de entrar al viewport).
 *
 * Props:
 *  - high / medium / low: contenido por perfil. Si falta se degrada
 *    high → medium → low, y si no hay ninguno se usa `children`.
 *  - children: contenido por defecto.
 *  - fallback: qué mostrar mientras el sensor no se activó (def. null).
 *  - esperarTrigger: si es false monta de inmediato (def. true).
 *  - margenInferior: px del sensor (200–400, def. 300).
 *  - as: etiqueta del wrapper (def. "div").
 *
 * Ejemplo:
 *   <ComponenteOptimizado
 *     className="perf-reveal"
 *     high={<ParticulasWebGL />}
 *     medium={<ParticulasCanvas />}
 *     low={<ImagenEstatica />}
 *     fallback={<ImagenEstatica />}
 *   />
 */
export function ComponenteOptimizado({
  as: Etiqueta = "div",
  className = "",
  children = null,
  high,
  medium,
  low,
  fallback = null,
  esperarTrigger = true,
  margenInferior,
  ...rest
}) {
  const { perfil } = useRendimiento();
  const { ref, isTriggered } = useIntersectionTrigger({ margenInferior });

  const contenido = elegirVariante(perfil, { high, medium, low }) ?? children;
  const listo = !esperarTrigger || isTriggered;

  return (
    <Etiqueta
      ref={ref}
      className={`componente-optimizado ${className}`.trim()}
      data-perfil={perfil}
      {...rest}
    >
      {listo ? contenido : fallback}
    </Etiqueta>
  );
}
