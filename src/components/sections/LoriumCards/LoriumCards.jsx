import "./loriumCards.css";
import BoxesIcon from "bootstrap-icons/icons/boxes.svg?react";
import ControllerIcon from "bootstrap-icons/icons/controller.svg?react";
import SlidersIcon from "bootstrap-icons/icons/sliders.svg?react";

const areas = [
  { name: "LORIUM GROUPS", icon: BoxesIcon, tone: "groups" },
  { name: "LORIUM GAMES", icon: ControllerIcon, tone: "games" },
  { name: "LORIUM SERVICES", icon: SlidersIcon, tone: "services" },
];

export function LoriumCards() {
  return (
    <section className="lorium-cards" aria-label="Áreas de Lorium">
      {areas.map(({ name, icon: Icon, tone }) => (
        <button
          className={`lorium-card lorium-card--${tone}`}
          key={name}
          type="button"
          disabled
          aria-label={name}
          data-crosshair-target
        >
          <Icon className="lorium-card__icon" aria-hidden="true" />
          <span className="lorium-card__title">{name}</span>
          <span className="lorium-card__badge" aria-hidden="true">
            Próximamente
          </span>
        </button>
      ))}
    </section>
  );
}
