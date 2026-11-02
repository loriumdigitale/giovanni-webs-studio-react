import WindowIcon from "bootstrap-icons/icons/window.svg?react";
import CodeSlashIcon from "bootstrap-icons/icons/code-slash.svg?react";
import SlidersIcon from "bootstrap-icons/icons/sliders.svg?react";

const services = [
  {
    title: "Sitios a medida",
    description:
      "Diseño y desarrollo una web que se adapte a tu idea y a su contenido.",
    icon: WindowIcon,
  },
  {
    title: "Desarrollo frontend",
    description:
      "Transformo diseños en interfaces claras, adaptables y fáciles de usar.",
    icon: CodeSlashIcon,
  },
  {
    title: "Desarrollo Backend",
    description:
      "Desarrollo la lógica y las funcionalidades que permiten que una aplicación funcione, conectando APIs, bases de datos y servicios externos.",
    icon: SlidersIcon,
  },
];

export function Services() {
  return (
    <section className="services" aria-labelledby="services-title">
      <div className="services__intro">
        <span className="services__badge">01&nbsp; · &nbsp;LO QUE HAGO</span>
        <h2 id="services-title" className="services__title">
          De la idea al sitio.
        </h2>
        <p>Me ocupo de cada detalle para que tu web se sienta propia.</p>
      </div>
      <div className="services__features">
        {services.map(({ title, description, icon: Icon }, index) => (
          <article
            className={`services__feature services__feature--${index + 1}`}
            key={title}
          >
            <Icon className="services__feature-icon" aria-hidden="true" />
            <span className="services__feature-number">0{index + 1}</span>
            <h3 className="services__feature-title">{title}</h3>
            <p className="services__feature-description">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
