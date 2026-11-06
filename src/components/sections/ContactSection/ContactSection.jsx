import "./contactSection.css";

const contactEmail = "lorium.digitale@gmail.com";

export function ContactSection() {
  return (
    <section className="contact-section" aria-labelledby="contact-section-title">
      <div className="contact-section__copy">
        <p className="contact-section__eyebrow">03&nbsp; · &nbsp;CONTACTO</p>
        <h2 id="contact-section-title" className="contact-section__title">
          ¿Tenés un proyecto en mente?
        </h2>
        <p className="contact-section__description">
          Hablemos sobre su desarrollo. Te respondo personalmente.
        </p>
      </div>
      <div className="contact-section__action">
        <a className="contact-section__email" href={`mailto:${contactEmail}`}>
          <span>{contactEmail}</span>
          <span className="contact-section__arrow" aria-hidden="true">↗</span>
        </a>
        <p className="contact-section__note">CORREO DE LORIUM</p>
      </div>
    </section>
  );
}
