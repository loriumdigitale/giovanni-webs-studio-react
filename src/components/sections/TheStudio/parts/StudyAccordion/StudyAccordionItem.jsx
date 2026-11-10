import { AnimatePresence, motion } from "motion/react";
import "./studyAccordion.css";
import {
  accordionContentTransition,
  accordionContentVariants,
} from "./motion.js";

export function StudyAccordionItem({ id, title, children, isOpen, onToggle }) {
  const contentId = `the-studio-${id}-content`;

  return (
    <div className={`the-studio__accordion-item ${isOpen ? "is-open" : ""}`}>
      <button
        className="the-studio__accordion-button"
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <span>{title}</span>
        <span className="the-studio__accordion-indicator" aria-hidden="true">
          {isOpen ? "-" : "+"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="the-studio__accordion-content"
            id={contentId}
            variants={accordionContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={accordionContentTransition}
          >
            <p className="the-studio__accordion-text">{children}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
