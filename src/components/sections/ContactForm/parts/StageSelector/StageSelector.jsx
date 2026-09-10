import { stages } from "../../../../../data/stage.js";

export function StageSelector({ selectedStage, onSelect, required = false }) {
  return (
    <div className="contact-form__section contact-form__section--stage">
      <p className="contact-form__label">
        ¿En qué etapa está tu proyecto?
        {required && <span className="contact-form__required">*</span>}
      </p>

      <div
        className="contact-form__options contact-form__options--stages"
        role="group"
        aria-label="Etapa del proyecto"
        aria-required={required}
      >
        {stages.map((item) => (
          <button
            key={item.stage}
            type="button"
            className={`contact-form__option ${
              selectedStage === item.stage
                ? "contact-form__option--selected"
                : ""
            }`}
            onClick={() => onSelect(item.stage)}
          >
            {typeof item.icon === "function" && (
              <item.icon
                className="contact-form__option-icon"
                aria-hidden="true"
              />
            )}
            {item.stage}
          </button>
        ))}
      </div>
    </div>
  );
}
