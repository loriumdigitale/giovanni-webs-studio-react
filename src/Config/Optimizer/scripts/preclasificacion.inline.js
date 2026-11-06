/**
 * Optimizer · scripts/preclasificacion.inline.js  (EL CEREBRO)
 *
 * Script de ejecución inmediata. Va INLINE en el <head> de index.html, antes de
 * cualquier hoja de estilos o módulo.
 *
 * ESTADO: conectado. index.html contiene una copia de este archivo (sin este
 * comentario). Si se modifica acá, hay que actualizar también ese <script>.
 *
 * Qué hace, de forma síncrona y antes del primer render:
 *   1. REGLA DE ORO: si prefers-reduced-motion está activo → .perf-low
 *      (sin probar hardware).
 *   2. Si no, consulta WebGL (MAX_TEXTURE_SIZE) y navigator.hardwareConcurrency.
 *   3. Aplica .perf-low | .perf-medium | .perf-high en <html>.
 *   4. Si el usuario cambia prefers-reduced-motion en caliente, reclasifica.
 *
 * IMPORTANTE:
 *  - Es standalone (no puede importar nada) y por eso usa sintaxis ES5.
 *  - Los umbrales deben mantenerse sincronizados con utils/perfil.js (UMBRALES).
 *  - Ante cualquier error aplica .perf-medium: nunca rompe la carga de la página.
 */
(function () {
  var root = document.documentElement;
  var CLASES = ["perf-low", "perf-medium", "perf-high"];
  var QUERY = "(prefers-reduced-motion: reduce)";

  // Umbrales (sincronizar con utils/perfil.js)
  var TEXTURA_MEDIUM = 4096;
  var TEXTURA_HIGH = 8192;
  var NUCLEOS_MEDIUM = 4;
  var NUCLEOS_HIGH = 6;
  var NUCLEOS_ASUMIDOS = 4;

  var hardware = null;

  function aplicar(perfil, motivo) {
    for (var i = 0; i < CLASES.length; i++) {
      root.classList.remove(CLASES[i]);
    }
    root.classList.add("perf-" + perfil);
    root.setAttribute("data-perf-motivo", motivo);
  }

  function maxTextura() {
    try {
      var canvas = document.createElement("canvas");
      var gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

      if (!gl) return 0;

      var tamano = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0;
      var ext = gl.getExtension("WEBGL_lose_context");
      if (ext) ext.loseContext();

      return tamano;
    } catch (e) {
      return 0;
    }
  }

  function clasificarHardware() {
    if (hardware) return hardware;

    var nucleos = navigator.hardwareConcurrency || NUCLEOS_ASUMIDOS;
    var textura = maxTextura();

    if (!textura) {
      hardware = { perfil: "low", motivo: "sin-webgl" };
    } else if (nucleos < NUCLEOS_MEDIUM || textura < TEXTURA_MEDIUM) {
      hardware = { perfil: "low", motivo: "hardware" };
    } else if (nucleos >= NUCLEOS_HIGH && textura >= TEXTURA_HIGH) {
      hardware = { perfil: "high", motivo: "hardware" };
    } else {
      hardware = { perfil: "medium", motivo: "hardware" };
    }

    return hardware;
  }

  function clasificar(mq) {
    // REGLA DE ORO: movimiento reducido fuerza LOW antes de tocar el hardware
    if (mq && mq.matches) {
      return { perfil: "low", motivo: "reduced-motion" };
    }
    return clasificarHardware();
  }

  try {
    var mq = window.matchMedia ? window.matchMedia(QUERY) : null;
    var resultado = clasificar(mq);
    aplicar(resultado.perfil, resultado.motivo);

    if (mq) {
      var alCambiar = function () {
        var nuevo = clasificar(mq);
        aplicar(nuevo.perfil, nuevo.motivo);
      };

      if (mq.addEventListener) {
        mq.addEventListener("change", alCambiar);
      } else if (mq.addListener) {
        mq.addListener(alCambiar);
      }
    }
  } catch (e) {
    aplicar("medium", "error");
  }
})();
