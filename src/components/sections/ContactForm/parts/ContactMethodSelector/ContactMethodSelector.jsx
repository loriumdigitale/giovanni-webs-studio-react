import { socials } from "../../../../../data/socials.js";

export function ContactMethodSelector({
  selectedMethod,
  contactChoice,
  customContact,
  onSelectMethod,
  onSelectChoice,
  onCustomChange,
}) {
  const selectedSocial = socials.find((item) => item.social === selectedMethod);

  return (
    <div className="contact-form__section contact-form__section--contact-method">
      <p className="contact-form__label">
        ¿Por dónde preferís que te contacte?
        <span className="contact-form__required">*</span>
      </p>

      <div className="contact-form__options contact-form__options--socials">
        {socials.map((item) => (
          <button
            key={item.social}
            type="button"
            className={`contact-form__option ${
              selectedMethod === item.social
                ? "contact-form__option--selected"
                : ""
            }`}
            onClick={() => onSelectMethod(item.social)}
          >
            {typeof item.icon === "function" && (
              <item.icon
                className="contact-form__option-icon"
                aria-hidden="true"
              />
            )}
            {item.social}
          </button>
        ))}
      </div>

      {selectedSocial && (
        <div className="contact-form__contact-choice">
          <button
            type="button"
            className={`contact-form__choice-option ${
              contactChoice === "default"
                ? "contact-form__choice-option--selected"
                : ""
            }`}
            onClick={() => onSelectChoice("default")}
          >
            Usar este {selectedSocial.contactLabel}
          </button>
          <button
            type="button"
            className={`contact-form__choice-option ${
              contactChoice === "custom"
                ? "contact-form__choice-option--selected"
                : ""
            }`}
            onClick={() => onSelectChoice("custom")}
          >
            Otro {selectedSocial.contactLabel}
          </button>
        </div>
      )}

      {contactChoice === "custom" && selectedSocial && (
        <input
          type="email"
          required
          className="contact-form__input"
          placeholder={`Tu ${selectedSocial.contactLabel}`}
          value={customContact}
          onChange={(e) => onCustomChange(e.target.value)}
        />
      )}
    </div>
  );
}
