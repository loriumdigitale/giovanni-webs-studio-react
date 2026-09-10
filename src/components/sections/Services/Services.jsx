import { services } from "../../../data/services.js";

export function Services() {
  return (
    <section className="services">
      <span className="services__badge"> Servicios </span>

      <h2 className="services__title">Enterate de los servicios de Lorium</h2>

      <div className="services__container">
        {services.map((service) => (
          <article className="services__card" key={service.service}>
            {typeof service.icon === "function" && (
              <service.icon
                className="services__card-icon"
                aria-hidden="true"
              />
            )}

            <h3 className="services__card-title">{service.service}</h3>

            <p className="services__card-subtitle">¿Qué ofrece?</p>

            <ul className="services__card-list">
              {service.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}

        {/* Card estática, mismo estilo, no viene del .map() */}
        <article className="services__card services__card--soon">
          <p className="services__card-soon-text">Más servicios próximamente</p>
        </article>
      </div>
    </section>
  );
}
