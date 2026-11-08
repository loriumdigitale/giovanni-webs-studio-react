import { useEffect } from "react";
import { useAnimatedUnmount } from "../../../hooks/useAnimatedUnmount.js";
import { AnimatedMotion } from "../../ui/AnimatedMotion/AnimatedMotion.jsx";

export function CaseStudyModal({ caseStudy, isOpen, onClose }) {
  const { shouldRender, isClosing } = useAnimatedUnmount(isOpen);

  useEffect(() => {
    if (!shouldRender) return undefined;

    function handleKeyDown(e) {
      if (isOpen && e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, shouldRender]);

  if (!shouldRender || !caseStudy) return null;

  return (
    <AnimatedMotion as="dialog" open className="case-study" isClosing={isClosing}>
      <div className="case-study__container container-wrapper">
        <div className="case-study__topbar">
          <button type="button" className="case-study__close" onClick={onClose}>
            <svg
              className="case-study__arrow"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              aria-hidden="true"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth={0} />
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <g id="SVGRepo_iconCarrier">
                <polygon points="513,216.6 158.5,216.6 316.1,59.1 197.9,59.1 1,256 197.9,452.9 316.1,452.9 158.5,295.4 513,295.4" />
              </g>
            </svg>
            Volver al inicio
          </button>
        </div>

        <header className="case-study__heading">
          <h2 className="case-study__title">{caseStudy.title}</h2>
          <p className="case-study__subtitle">{caseStudy.subtitle}</p>
        </header>

        <div className="case-study__content">
          <div className="case-study__content-item">
            <strong className="case-study__content-title">Objetivo</strong>
            <p className="case-study__content-objective">
              {caseStudy.objective}
            </p>
          </div>
          <div className="case-study__content-item">
            <strong className="case-study__content-title">Problema</strong>
            <p className="case-study__content-problem">{caseStudy.problem}</p>
          </div>
          <div className="case-study__content-item">
            <strong className="case-study__content-title">Solución</strong>
            <p className="case-study__content-solution">{caseStudy.solution}</p>
          </div>
          <div className="case-study__content-item">
            <strong className="case-study__content-title">
              Aspectos destacados
            </strong>
            <div className="case-study__highlights-heading">
              <h3>Elementos del proyecto</h3>
              <svg
                className="case-study__highlights-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m12 3 9 5-9 5-9-5 9-5Z" />
                <path d="m3 12 9 5 9-5" />
                <path d="m3 16 9 5 9-5" />
              </svg>
            </div>
            <ul className="case-study__content-highlights">
              {caseStudy.highlights?.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>
          <div className="case-study__content-item">
            <strong className="case-study__content-title">Resultados</strong>
            <p className="case-study__content-results">{caseStudy.results}</p>
          </div>
        </div>
      </div>
    </AnimatedMotion>
  );
}
