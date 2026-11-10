import { useState } from "react";
import { StudyAccordionItem } from "../StudyAccordion/StudyAccordionItem.jsx";
import "./studyPanel.css";

export function StudyPanel({ group, state }) {
  const [openSectionId, setOpenSectionId] = useState(null);
  const isActive = state === "is-active";

  const toggleSection = (sectionId) => {
    setOpenSectionId((current) => (current === sectionId ? null : sectionId));
  };

  return (
    <article
      className={`the-studio__panel ${state}`}
      aria-hidden={!isActive}
      inert={isActive ? undefined : ""}
    >
      <h3 className="the-studio__panel-title">{group.label}</h3>

      <div className="the-studio__accordion">
        {group.sections.map((section) => (
          <StudyAccordionItem
            key={section.id}
            id={section.id}
            title={section.title}
            isOpen={openSectionId === section.id}
            onToggle={() => toggleSection(section.id)}
          >
            {section.content}
          </StudyAccordionItem>
        ))}
      </div>
    </article>
  );
}
