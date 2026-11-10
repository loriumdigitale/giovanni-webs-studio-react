import { FieldIcon } from "../FieldIcon/FieldIcon.jsx";

export function NameInput({ value, onChange }) {
  return (
    <div className="contact-form__section contact-form__section--name">
      <label className="contact-form__label" htmlFor="name">
        ¿Cómo te gustaría que te llame?
        <span className="contact-form__required">*</span>
      </label>
      <div className="contact-form__field">
        <FieldIcon name="user" className="contact-form__field-icon" />
        <input
          id="name"
          type="text"
          required
          autoComplete="name"
          className="contact-form__input"
          placeholder="Tu nombre"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
