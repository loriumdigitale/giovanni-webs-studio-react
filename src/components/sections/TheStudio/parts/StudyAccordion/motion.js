export const accordionContentVariants = {
  initial: { height: 0, opacity: 0, y: -8 },
  animate: { height: "auto", opacity: 1, y: 0 },
  exit: { height: 0, opacity: 0, y: -8 },
};

export const accordionContentTransition = {
  duration: 0.3,
  ease: "easeOut",
};
