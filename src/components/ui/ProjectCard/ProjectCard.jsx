import Eye from "../../../assets/icons/projects/eye.svg?react";
import { useState } from "react";
import { PreviewModal } from "../../sections/PreviewModal/PreviewModal";

export function ProjectCard({ project }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <article className="project-card">
        <div className="project-card__media">
          <img
            src={project.image}
            alt={project.name}
            className="project-card__img"
          />
          <span className="project-card__type">{project.type}</span>
        </div>

        <div className="project-card__info">
          <div className="project-card__header">
            <h3 className="project-card__title">{project.name}</h3>

            <button
              type="button"
              className="project-card__preview-btn"
              aria-label={`Vista previa de ${project.name}`}
              onClick={() => {
                console.log("click detectado");
                setIsPreviewOpen(true);
              }}
            >
              <Eye className="project-card__preview-icon" />
              <span>Vista previa</span>
            </button>
          </div>

          <p className="project-card__description">
            {project.shortDescription}
          </p>
        </div>
      </article>
      <PreviewModal
        project={project}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
}
