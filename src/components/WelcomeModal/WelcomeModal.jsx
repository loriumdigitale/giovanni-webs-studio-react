import { useEffect, useRef, useState } from "react";
import { useAnimatedUnmount } from "../../hooks/useAnimatedUnmount.js";
import { AnimatedMotion } from "../ui/AnimatedMotion/AnimatedMotion.jsx";

const MOBILE_BREAKPOINT = "(max-width: 767px)";

export function WelcomeModal({ isOpen, onClose }) {
  const [isMobile, setIsMobile] = useState(() =>
    window.matchMedia(MOBILE_BREAKPOINT).matches,
  );
  const dialogRef = useRef(null);
  const { shouldRender, isClosing } = useAnimatedUnmount(isOpen);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT);
    const updateViewport = (event) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (!shouldRender) return undefined;

    const dialog = dialogRef.current;
    if (!dialog) return;

    // Abrimos el <dialog> de forma nativa y modal (bloquea el foco fuera de él)
    dialog.showModal();

    // Bloqueamos el scroll del body mientras la modal está abierta
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Restauramos el scroll al desmontar el componente
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  const handleCancel = (event) => {
    event.preventDefault();
    onClose();
  };

  return (
    <AnimatedMotion
      as="dialog"
      ref={dialogRef}
      className={`welcome-modal${isClosing ? " modal--closing" : ""}`}
      isClosing={isClosing}
      aria-labelledby="welcome-modal-title"
      aria-describedby="welcome-modal-description"
      onCancel={handleCancel}
    >
      <video
        className="welcome-modal__video"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={onClose}
        onError={onClose}
        aria-label="Introducción audiovisual de Lorium"
      >
        <source
          src={
            isMobile
              ? "/intro/lorium_intro_mobile.webm"
              : "/intro/lorium_intro_desktop.webm"
          }
          type="video/webm"
        />
      </video>
    </AnimatedMotion>
  );
}
