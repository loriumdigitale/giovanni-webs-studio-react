import { useState } from "react";
import meImage from "../../assets/img/me.webp";
import { LoriumLogo } from "../../assets/logos/LoriumLogo.jsx";
import { aboutMeItems } from "../../data/aboutMe.js";

export function AboutMe() {
  const [openId, setOpenId] = useState(aboutMeItems[0].id);

  return (
    <div className="about-me__main container-wrapper">
      <h1 className="about-me__page-title">
        Conocé al <span className="about-me__title-accent">Founder &amp; CEO</span>{" "}
        de Lorium Studio
      </h1>

      <div className="about-me__wrapper">
        <div className="about-me__accordion">
          {aboutMeItems.map(({ id, title, paragraphs }) => {
            const isOpen = openId === id;

            return (
              <article
                key={id}
                className={`about-me__item ${isOpen ? "is-open" : ""}`}
                onClick={() => {
                  // No alternar si el usuario está seleccionando texto
                  if (window.getSelection()?.toString()) return;
                  setOpenId(isOpen ? null : id);
                }}
              >
                <h2 className="about-me__item-heading">
                  <button
                    type="button"
                    className="about-me__trigger"
                    aria-expanded={isOpen}
                    aria-controls={`about-me-panel-${id}`}
                    id={`about-me-trigger-${id}`}
                  >
                    <span className="about-me__title">{title}</span>
                    <svg
                      className="about-me__chevron"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </h2>

                <div className="about-me__preview-wrap" aria-hidden={isOpen}>
                  <div className="about-me__preview-inner">
                    <p className="about-me__preview">{paragraphs[0]}</p>
                  </div>
                </div>

                <div
                  className="about-me__panel"
                  id={`about-me-panel-${id}`}
                  role="region"
                  aria-labelledby={`about-me-trigger-${id}`}
                >
                  <div className="about-me__panel-inner">
                    {paragraphs.map((text) => (
                      <p key={text} className="about-me__text">
                        {text}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <figure className="about-me__figure">
          <LoriumLogo
            className="about-me__bg-logo"
            title=""
            color="#b08ce8"
          />
          <img
            className="about-me__image"
            src={meImage}
            alt="Fotografía de Giovanni"
          />
        </figure>
      </div>
    </div>
  );
}
