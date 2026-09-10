import { useEffect, useRef } from "react";
import loriumLargeLogo from "../../assets/logos/LoriumIcon-grdient-large-white-v1.svg";
import { useAnimatedUnmount } from "../../hooks/useAnimatedUnmount.js";
import { AnimatedMotion } from "../ui/AnimatedMotion/AnimatedMotion.jsx";

export function WelcomeModal({ isOpen, onClose }) {
  const dialogRef = useRef(null);
  const { shouldRender, isClosing } = useAnimatedUnmount(isOpen);

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
      <div className="welcome-modal__content">
        <img
          src={loriumLargeLogo}
          alt="Lorium"
          className="welcome-modal__logo"
          aria-hidden="true"
        />
        <p className="welcome-modal__subtitle">[ LABORATORIUM DIGITALE ]</p>

        <h1 id="welcome-modal-title" className="welcome-modal__title">
          Diseño y construyo productos digitales
        </h1>

        <p
          id="welcome-modal-description"
          className="welcome-modal__description"
        >
          únicos, profesionales y cuidadosamente elaborados.
        </p>

        <button
          type="button"
          className="welcome-modal__cta"
          onClick={onClose}
        >
          Explorar Lorium →
        </button>
      </div>
    </AnimatedMotion>
  );
}
