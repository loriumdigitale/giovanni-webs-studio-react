import { AnimatePresence, motion } from "motion/react";
import {
  accordionContentTransition,
  accordionContentVariants,
} from "./motion.js";

export function StudySection({ id, title, children, isOpen, onToggle }) {
  const contentId = `${id}-content`;

  return (
    <div className={`the-study__section ${isOpen ? "is-open" : ""}`}>
      <button
        className="the-study__section-button"
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <span>{title}</span>
        <span className="the-study__section-indicator" aria-hidden="true">
          {isOpen ? "-" : "+"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="the-study__section-content"
            id={contentId}
            variants={accordionContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={accordionContentTransition}
          >
            <p className="the-study__section-text">{children}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}