export function SubmitButton({ disabled }) {
  return (
    <>
      <button type="submit" className="contact-form__submit" disabled={disabled}>
        Enviar consulta al estudio →
      </button>
      <p className="contact-form__note">
        Respuesta directa sin intermediarios ni compromisos
      </p>
    </>
  );
}
