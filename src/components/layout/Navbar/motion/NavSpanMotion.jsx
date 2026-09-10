import { motion, useReducedMotion } from "motion/react";

const textTransition = {
  duration: 7.5,
  ease: "easeInOut",
  repeat: Infinity,
  repeatType: "loop",
};

const textKeyframeTimes = [0, 0.12, 0.27, 0.67, 0.79, 1];
const categoryExit = "100%";
const countryExit = "-100%";

export function NavSpanMotion() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="nav__span" aria-label="Identidad del estudio">
      <span className="nav__span-motion-text nav__span-motion-text--category">
        <motion.p
          className="nav__span-category"
          initial={{ x: categoryExit }}
          animate={
            shouldReduceMotion
              ? { x: 0 }
              : {
                  x: [categoryExit, categoryExit, 0, 0, categoryExit, categoryExit],
                }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { ...textTransition, times: textKeyframeTimes }
          }
          style={{ transformOrigin: "right center" }}
        >
          LABORATORIUM
        </motion.p>
      </span>

      <span className="nav__separator" aria-hidden="true" />

      <span className="nav__span-motion-text nav__span-motion-text--country">
        <motion.p
          className="nav__span-country"
          initial={{ x: countryExit }}
          animate={
            shouldReduceMotion
              ? { x: 0 }
              : {
                  x: [countryExit, countryExit, 0, 0, countryExit, countryExit],
                }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { ...textTransition, times: textKeyframeTimes }
          }
          style={{ transformOrigin: "left center" }}
        >
          ARGENTINA
        </motion.p>
      </span>
    </div>
  );
}
