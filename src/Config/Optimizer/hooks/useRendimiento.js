import { createContext, useContext } from "react";
import { PERFIL } from "../utils/perfil.js";

/**
 * Contexto del perfil de rendimiento.
 * Vive en un .js (y no en el .jsx del Provider) para respetar la regla
 * react-refresh/only-export-components del proyecto.
 *
 * El valor por defecto (MEDIUM) permite usar los componentes aunque todavía
 * no exista un <RendimientoProvider>.
 */
export const RendimientoCtx = createContext({
  perfil: PERFIL.MEDIUM,
  isLow: false,
  isMedium: true,
  isHigh: false,
});

/** @returns {{ perfil: "low"|"medium"|"high", isLow: boolean, isMedium: boolean, isHigh: boolean }} */
export function useRendimiento() {
  return useContext(RendimientoCtx);
}
