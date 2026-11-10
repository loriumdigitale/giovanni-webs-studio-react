const MAX_CHARACTERS = 500;

export function ProjectDetails({ value, onChange }) {
  return (
    <div className="contact-form__section contact-form__section--details">
      <label className="contact-form__label" htmlFor="project-details">
        Tu idea o requerimientos clave
        <span className="contact-form__required">*</span>
      </label>
      <textarea
        id="project-details"
        className="contact-form__textarea"
        placeholder="Contame el rubro, si ya tenés logo o fotos, o enlaces de referencia que te gusten..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={MAX_CHARACTERS}
      />
      <p className="contact-form__char-count">
        {value.length}/{MAX_CHARACTERS}
      </p>
    </div>
  );
}
