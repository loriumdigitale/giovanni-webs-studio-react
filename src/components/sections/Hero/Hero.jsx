export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__content">
        <p className="hero__eyebrow">
          <span aria-hidden="true" /> DESARROLLO WEB INDEPENDIENTE
        </p>
        <h1 id="hero-title" className="hero__title" data-crosshair-target>
          Las tecnologías cambian.{" "}
          <span>El producto y la filosofía permanecen.</span>
        </h1>
        <p className="hero__lead">
          Una forma de pensar el producto, el diseño y el desarrollo web.
        </p>
        <div className="hero__actions">
          <a className="hero__button" href="#proyectos">
            Ver mis proyectos <span aria-hidden="true">↗</span>
          </a>
          <a className="hero__contact-link" href="#consulta">
            Hablemos de tu idea
          </a>
        </div>
      </div>
      <div
        className="hero__visual"
        aria-label="Idea, diseño y código"
        role="img"
      >
        <span className="hero__visual-label">IDEA → DISEÑO → CÓDIGO</span>
        <div className="hero__orbit" aria-hidden="true" />
        <div className="hero__code-card" aria-hidden="true">
          <span className="hero__dots">● ● ●</span>
          <code>
            &lt;main&gt;
            <br />
            &nbsp; &lt;h1&gt; Fabricio Giovanni Vedia Vega &lt;/h1&gt;
            <br />
            &nbsp; &lt;p&gt; Made in Argentina &lt;/p&gt;
            <br />
            &lt;/main&gt;
          </code>
        </div>
        <span className="hero__code-mark" aria-hidden="true">
          &lt;/&gt;
        </span>
        <span className="hero__visual-caption">
          UN ESPACIO PROPIO EN LA WEB.
        </span>
      </div>
    </section>
  );
}
