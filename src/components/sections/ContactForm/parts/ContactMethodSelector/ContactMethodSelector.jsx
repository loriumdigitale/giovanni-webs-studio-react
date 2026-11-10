import { useId } from "react";
import { SelectField } from "../SelectField/SelectField.jsx";
import { FieldIcon } from "../FieldIcon/FieldIcon.jsx";
import { contactMethods } from "../../../../../data/contactForm.js";

const methodOptions = contactMethods.map((item) => ({
  value: item.id,
  label: item.label,
}));

export function ContactMethodSelector({
  selectedMethod,
  contactValue,
  onSelectMethod,
  onContactChange,
}) {
  const inputId = useId();
  const method = contactMethods.find((item) => item.id === selectedMethod);

  return (
    <>
      <SelectField
        label="¿Por dónde preferís que te responda?"
        icon="chat"
        options={methodOptions}
        value={selectedMethod}
        onChange={onSelectMethod}
        required
      />

      <div className="contact-form__section">
        <label className="contact-form__label" htmlFor={inputId}>
          {method.inputLabel}
          <span className="contact-form__required">*</span>
        </label>
        <div className="contact-form__field">
          <FieldIcon
            name={method.icon}
            className="contact-form__field-icon"
          />
          <input
            id={inputId}
            type={method.inputType}
            required
            autoComplete={method.autoComplete}
            className="contact-form__input"
            placeholder={method.placeholder}
            value={contactValue}
            onChange={(event) => onContactChange(event.target.value)}
          />
        </div>
      </div>
    </>
  );
}
