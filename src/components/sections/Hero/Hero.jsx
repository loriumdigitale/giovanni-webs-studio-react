import { useEffect, useRef, useState } from "react";

export function Hero({ isIntroComplete }) {
  const contentRef = useRef(null);
  const visualRef = useRef(null);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isVisualVisible, setIsVisualVisible] = useState(false);

  useEffect(() => {
    if (!isIntroComplete) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === contentRef.current) {
            setIsContentVisible(entry.isIntersecting);
          } else if (entry.target === visualRef.current) {
            setIsVisualVisible(entry.isIntersecting);
          }
        });
      },
      { threshold: 0.2 },
    );

    if (contentRef.current) observer.observe(contentRef.current);
    if (visualRef.current) observer.observe(visualRef.current);

    return () => observer.disconnect();
  }, [isIntroComplete]);

  return (
    <section
      className={`hero${isContentVisible ? " hero--animate" : ""}`}
      aria-labelledby="hero-title"
    >
      <div ref={contentRef} className="hero__content">
        <p className="hero__eyebrow">
          <span className="hero__eyebrow-dot" aria-hidden="true" />
          <span className="hero__eyebrow-text">
            TE DOY LA BIENVENIDA A LORIUM, EXPLORÁ LIBREMENTE
          </span>
        </p>
        <h1 id="hero-title" className="hero__title">
          <span className="hero__title-main">Las tecnologías cambian.</span>{" "}
          <span className="hero__title-sub">
            El producto y la filosofía permanecen.
          </span>
        </h1>
        <p className="hero__lead">
          Desarrollo web pensado para darle forma y funcionalidad a tu proyecto.
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
        ref={visualRef}
        className={`hero__visual${isVisualVisible ? " hero__visual--animate" : ""}`}
        aria-label="Idea, diseño y código"
        role="img"
      >
        <span className="hero__visual-label">
          <span className="hero__visual-step hero__visual-step--1">
            IDEA →&nbsp;
          </span>
          <span className="hero__visual-step hero__visual-step--2">
            DISEÑO →&nbsp;
          </span>
          <span className="hero__visual-step hero__visual-step--3">CÓDIGO</span>
        </span>
        <svg
          className="hero__orbit"
          viewBox="0 0 260 220"
          fill="none"
          aria-hidden="true"
        >
          <path
            className="hero__orbit-ring hero__orbit-ring--1"
            pathLength="1"
            d="M 122 25 C 185 20, 224 55, 225 108 C 226 164, 182 195, 128 195 C 72 195, 35 162, 35 112 C 35 58, 65 30, 122 25 Z"
          />
          <path
            className="hero__orbit-ring hero__orbit-ring--2"
            pathLength="1"
            d="M 121 18 C 191 12, 232 50, 233 108 C 234 170, 187 202, 128 202 C 66 202, 27 166, 27 112 C 27 52, 59 23, 121 18 Z"
          />
          <path
            className="hero__orbit-ring hero__orbit-ring--3"
            pathLength="1"
            d="M 120 11 C 197 4, 240 45, 241 108 C 242 176, 192 209, 128 209 C 60 209, 19 170, 19 112 C 19 46, 53 16, 120 11 Z"
          />
        </svg>
        <div className="hero__code-card" aria-hidden="true">
          <span className="hero__dots">
            <span className="hero__dot hero__dot--1">●</span>{" "}
            <span className="hero__dot hero__dot--2">●</span>{" "}
            <span className="hero__dot hero__dot--3">●</span>
          </span>
          <div className="hero__code-editor">
            <code className="hero__code-sizer">
              &lt;main&gt;
              <br />
              &nbsp; &lt;h1&gt; Fabricio Giovanni Vedia Vega &lt;/h1&gt;
              <br />
              &nbsp; &lt;p&gt; Made in Argentina &lt;/p&gt;
              <br />
              &lt;/main&gt;
            </code>

            <span className="hero__vsc-ripple" />
            <svg
              className="hero__vsc-cursor"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M3 1.5L13.5 8.2L8.3 9.3L6.2 14.2L3 1.5Z"
                fill="var(--color-secondary)"
                stroke="#fff"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>

            <code className="hero__code-live">
              <span className="hero__vsc-line hero__vsc-line--1">
                <span className="hero__vsc-typing hero__vsc-tag-main">&lt;main&gt;</span>
              </span>
              <span className="hero__vsc-line hero__vsc-line--2">
                <span className="hero__vsc-indent">&nbsp; </span>
                <span className="hero__vsc-typing hero__vsc-tag-h1">&lt;h1&gt;&nbsp;</span>
                <span className="hero__vsc-typing hero__typing--name">Fabricio Giovanni Vedia Vega</span>
                <span className="hero__vsc-typing hero__vsc-close-h1">&nbsp;&lt;/h1&gt;</span>
              </span>
              <span className="hero__vsc-line hero__vsc-line--3">
                <span className="hero__vsc-indent">&nbsp; </span>
                <span className="hero__vsc-typing hero__vsc-tag-p">&lt;p&gt;&nbsp;</span>
                <span className="hero__vsc-typing hero__typing--location">Made in Argentina</span>
                <span className="hero__vsc-typing hero__vsc-close-p">&nbsp;&lt;/p&gt;</span>
              </span>
              <span className="hero__vsc-line hero__vsc-line--4">
                <span className="hero__vsc-typing hero__vsc-close-main">&lt;/main&gt;</span>
              </span>
            </code>
          </div>
        </div>
        <span className="hero__code-mark" aria-hidden="true">
          <span className="hero__code-mark-text">&lt;/&gt;</span>
        </span>
        <span className="hero__visual-caption">
          UN ESPACIO PROPIO EN LA WEB.
        </span>
      </div>
    </section>
  );
}
