import { useMemo } from "react";
import "./loriumCards.css";
import BoxesIcon from "bootstrap-icons/icons/boxes.svg?react";
import ControllerIcon from "bootstrap-icons/icons/controller.svg?react";
import SlidersIcon from "bootstrap-icons/icons/sliders.svg?react";
import { LaserFlow } from "../../ui/LaserFlow/LaserFlow.jsx";
import { ComponenteOptimizado } from "../../../Config/Optimizer/components/ComponenteOptimizado.jsx";
import { useRendimiento } from "../../../Config/Optimizer/hooks/useRendimiento.js";
import { useAdaptivePerformance } from "../../../Config/Optimizer/hooks/useAdaptivePerformance.js";
import {
  esDispositivoTactil,
  prefiereMovimientoReducido,
} from "../../../Config/Optimizer/utils/perfil.js";

const LORIUM_LASER_SETTINGS = {
  beamPosition: 0.5, // Centro horizontal de la tarjeta.
  beamPositionReference: "container",
  surfaceLevel: 1,
  color: "#6000fc", // Color principal del laser; los brillos y tonos secundarios se derivan de este.
  intensity: 3, // Intensidad o luminosidad general del efecto.
  beamWidth: 1.8, // Ancho del nucleo del haz vertical.
  flare: 2, // Tamano e intensidad de los destellos y el resplandor alrededor del haz.
  spread: 9, // Que tanto se extiende lateralmente la luz sobre la superficie.
  spill: 1, // Intensidad de la luz que se derrama desde el haz hacia la superficie.
  fog: 0.2, // Cantidad de neblina o halo atmosferico.
  dust: 5, // Cantidad/intensidad de particulas suspendidas.
  streaks: 2, // Cantidad/intensidad de rayas o trazos luminosos.
  dots: 1, // Cantidad/intensidad de puntos luminosos.
  pulse: 1, // Intensidad de la variacion pulsante del brillo.
  speed: 0.7, // Velocidad de la animacion.
  mouseInteraction: true, // Permite que el movimiento del puntero influya en el efecto.
  theme: "dark", // Tema de color del efecto: "dark" u "light".
};

// Calidad del láser según el perfil de rendimiento (Config/Optimizer).
const LASER_POR_PERFIL = {
  // Gama alta: calidad completa (DPR nativo hasta 2, entrada y reacción al mouse).
  high: {},
  // Gama media: baja resolución e interacción, pero conserva el brillo de las props base.
  medium: {
    dpr: 1,
    intro: false,
    mouseInteraction: false,
  },
  // Gama baja o movimiento reducido: un solo frame estático, sin entrada ni animación.
  low: {
    dpr: 1,
    intro: false,
    paused: true,
    mouseInteraction: false,
  },
};

// En táctiles se conserva DPR 1 en high y se baja a 0,75 solo tras estrés sostenido.
const LASER_TACTIL = {
  dpr: 1,
  mouseInteraction: false,
};
const DPR_MEDIO_TACTIL = 0.75;

const areas = [
  { name: "LORIUM GROUPS", icon: BoxesIcon, tone: "groups" },
  { name: "LORIUM GAMES", icon: ControllerIcon, tone: "games" },
  { name: "LORIUM SERVICES", icon: SlidersIcon, tone: "services" },
];

export function LoriumCards() {
  const { perfil } = useRendimiento();
  const movimientoReducido = prefiereMovimientoReducido();
  const { degradado: laserDegradado, registrarFrame } = useAdaptivePerformance({
    enabled: !movimientoReducido,
  });
  // La clasificación por hardware es conservadora: LaserFlow conserva su
  // calidad completa y solo baja por medición real, salvo movimiento reducido.
  const perfilLaser = movimientoReducido
    ? "low"
    : laserDegradado
      ? "medium"
      : "high";
  const esTactil = esDispositivoTactil();

  const ajustesLaser = useMemo(
    () => ({
      ...LORIUM_LASER_SETTINGS,
      ...LASER_POR_PERFIL[perfilLaser],
      ...(esTactil ? LASER_TACTIL : {}),
      ...(esTactil && perfilLaser === "medium"
        ? { dpr: DPR_MEDIO_TACTIL }
        : {}),
    }),
    [esTactil, perfilLaser],
  );

  return (
    <section className="lorium-cards" aria-labelledby="lorium-cards-title">
      <header className="lorium-cards__intro">
        {/* Se monta recién cuando el sensor de proximidad lo activa (300px antes de entrar al viewport) */}
        <ComponenteOptimizado
          className="lorium-cards__laser-flow"
          aria-hidden="true"
          data-perfil-laser={perfilLaser}
          data-perfil-clasificado={perfil}
        >
          <LaserFlow
            {...ajustesLaser}
            onAnimationFrame={
              perfilLaser === "high" ? registrarFrame : undefined
            }
          />
        </ComponenteOptimizado>
        <div className="lorium-cards__copy">
          <span className="lorium-cards__eyebrow">
            PROPUESTAS PROPIAS DE LORIUM
          </span>
          <h2 id="lorium-cards-title" className="lorium-cards__title">
            Mi fuerte es el desarrollo web.
          </h2>
          <p className="lorium-cards__description">
            Sin embargo, Lorium nace de una idea más amplia: si podés
            imaginarlo, podés programarlo.
          </p>
          <a
            className="lorium-cards__link"
            href="#lorium-areas"
          >
            Explorá lo que Lorium tiene para ofrecer.
            <span aria-hidden="true">↘</span>
          </a>
        </div>
        <div className="lorium-cards__map" aria-hidden="true">
          <svg
            className="lorium-cards__map-lines"
            viewBox="0 0 220 180"
            focusable="false"
          >
            <path d="M110 72V27M86 104 34 153M134 104l61 49" />
          </svg>
          <span className="lorium-cards__map-core">LORIUM</span>
          <span className="lorium-cards__map-node lorium-cards__map-node--groups">
            GROUPS
          </span>
          <span className="lorium-cards__map-node lorium-cards__map-node--services">
            SERVICES
          </span>
          <span className="lorium-cards__map-node lorium-cards__map-node--games">
            GAMES
          </span>
        </div>
      </header>
      <div className="lorium-cards__grid" id="lorium-areas">
        {areas.map(({ name, icon: Icon, tone }) => (
          <button
            className={`lorium-card lorium-card--${tone}`}
            key={name}
            type="button"
            disabled
            aria-label={name}
          >
            <Icon className="lorium-card__icon" aria-hidden="true" />
            <span className="lorium-card__title">{name}</span>
            <span className="lorium-card__badge" aria-hidden="true">
              Próximamente
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
