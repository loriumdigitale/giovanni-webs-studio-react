import { useEffect } from "react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { getCaseStudyById } from "../../../data/projects/caseStudiesIndex.js";
import { Technology } from "../../ui/Technology/Technology.jsx";
import { CaseStudyModal } from "../CaseStudy/CaseStudyModal.jsx";
import { useAnimatedUnmount } from "../../../hooks/useAnimatedUnmount.js";
import { AnimatedMotion } from "../../ui/AnimatedMotion/AnimatedMotion.jsx";

export function PreviewModal({ project, isOpen, onClose }) {
  const matchingCaseStudy = getCaseStudyById(project.id);
  const [isCaseStudyModal, setIsCaseStudyModal] = useState(false);
  const { shouldRender, isClosing } = useAnimatedUnmount(isOpen);

  useEffect(() => {
    if (!shouldRender) return undefined;

    document.body.style.overflow = "hidden";

    function handleKeyDown(e) {
      if (isOpen && e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, shouldRender]);

  if (!shouldRender) return null;

  return createPortal(
    <>
      <AnimatedMotion
        as="dialog"
        open
        className="preview-modal"
        isClosing={isClosing}
      >
        <div className="preview-modal__container">
          <header className="preview-modal__header">
            <button
              type="button"
              className="preview-modal__close"
              onClick={onClose}
              aria-label="Cerrar vista previa"
            >
              <span>Cerrar</span>
              <svg
                className="preview-modal__close-icon"
                viewBox="0 0 16 16"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M3 3l10 10M13 3L3 13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </header>

          <div className="preview-modal__content">
            <div className="preview-modal__heading">
              <span className="preview-modal__type">{project.type}</span>
              <h2 className="preview-modal__title">{project.name}</h2>
            </div>

            <div className="preview-modal__media">
              <img
                src={project.image}
                alt={project.name}
                className="preview-modal__img"
              />
            </div>

            <div className="preview-modal__main">
              <p className="preview-modal__description">
                {project.description}
              </p>

              <div className="preview-modal__d-s-container">
                <div className="preview-modal__duration">
                  <h3 className="preview-modal__duration-title">Duración</h3>
                  <p className="preview-modal__duration-text">
                    {project.duration}
                  </p>
                </div>

                <div className="preview-modal__scope">
                  <h3 className="preview-modal__scope-title">Alcance</h3>
                  <p className="preview-modal__scope-text">{project.scope}</p>
                </div>
              </div>
            </div>

            <div className="preview-modal__aside">
              {project.technologies && (
                <div className="preview-modal__technologies-container">
                  <h3 className="preview-modal__technologies-title">
                    Tecnologías y herramientas
                  </h3>
                  <div className="preview-modal__technologies">
                    {project.technologies.map((tech) => (
                      <Technology key={tech} technology={tech} />
                    ))}
                  </div>
                </div>
              )}

              <div className="preview-modal__actions">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="preview-modal__btn preview-modal__btn--primary"
                >
                  <span>Ver página</span>
                  <svg
                    className="preview-modal__btn-icon"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M4.5 11.5l7-7M5.5 4.5h6v6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>

                <button
                  onClick={() => setIsCaseStudyModal(true)}
                  type="button"
                  className="preview-modal__btn preview-modal__btn--secondary"
                >
                  <span>Ver caso de estudio</span>
                  <svg
                    className="preview-modal__btn-icon"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </AnimatedMotion>
      <CaseStudyModal
        caseStudy={matchingCaseStudy}
        isOpen={isCaseStudyModal}
        onClose={() => setIsCaseStudyModal(false)}
      />
    </>,
    document.body,
  );
}
