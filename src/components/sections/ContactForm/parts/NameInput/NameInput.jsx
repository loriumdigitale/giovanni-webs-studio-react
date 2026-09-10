export function NameInput({ value, onChange }) {
  return (
    <div className="contact-form__section contact-form__section--name">
      <label className="contact-form__label" htmlFor="name">
        ¿Cómo te gustaría que te llame?
        <span className="contact-form__required">*</span>
      </label>
      <input
        id="name"
        type="text"
        required
        className="contact-form__input"
        placeholder="Tu nombre"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}