import { useMemo } from "react";
import { usePreClasificacion } from "../hooks/usePreClasificacion.js";
import { RendimientoCtx } from "../hooks/useRendimiento.js";
import { PERFIL } from "../utils/perfil.js";

/**
 * Provee el perfil (LOW, MEDIUM, HIGH) a toda la app.
 * Para consumirlo: const { perfil, isHigh } = useRendimiento();
 */
export function RendimientoProvider({ children }) {
  const perfil = usePreClasificacion();

  const value = useMemo(
    () => ({
      perfil,
      isLow: perfil === PERFIL.LOW,
      isMedium: perfil === PERFIL.MEDIUM,
      isHigh: perfil === PERFIL.HIGH,
    }),
    [perfil],
  );

  return <RendimientoCtx value={value}>{children}</RendimientoCtx>;
}
