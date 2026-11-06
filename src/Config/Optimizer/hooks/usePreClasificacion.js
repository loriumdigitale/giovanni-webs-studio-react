import { useSyncExternalStore } from "react";
import {
  PERFIL,
  asegurarPerfil,
  suscribirPerfil,
} from "../utils/perfil.js";

/**
 * Enlace de React con la pre-clasificación.
 *
 * La lógica (WebGL, núcleos, prefers-reduced-motion) vive en utils/perfil.js
 * para que también la puedan usar scripts que no son React. La fuente de verdad
 * es la clase que hay en <html>:
 *  - Si el script inline ya la aplicó, el hook solo la lee.
 *  - Si no, clasifica y la aplica (idempotente).
 *  - Se mantiene sincronizado si la clase cambia (p. ej. reduced-motion en caliente).
 *
 * @returns {"low" | "medium" | "high"}
 */
export function usePreClasificacion() {
  return useSyncExternalStore(
    suscribirPerfil,
    asegurarPerfil,
    () => PERFIL.MEDIUM,
  );
}
